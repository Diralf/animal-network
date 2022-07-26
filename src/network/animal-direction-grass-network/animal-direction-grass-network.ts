import * as tf from '@tensorflow/tfjs-node';
import * as fs from 'fs';
import { DirectionBrainCommand, BrainCommandsOther } from '../../domain/property/direction-brain/direction-brain-property';
import { DirectionMovementValue } from '../../domain/property/direction-movement/direction-movement-property';
import { DirectionSightProperty } from '../../domain/property/direction-sight/direction-sight-property';
import { DirectionTurn } from '../../domain/property/direction/direction-property';
import { NumberProperty } from '../../domain/property/number/number-property';
import { memo } from '../../domain/property/utils/memo';
import { visualEntitiesAsString } from '../../domain/property/utils/visual-entities-as-string';

export interface AnimalGrassNetworkPredictInput {
    sight: DirectionSightProperty;
    size: NumberProperty;
    taste: NumberProperty;
    energy: NumberProperty;
}

interface LifeFrame {
    sight: number[][][];
    inner: number[];
    output: number[];
    taste: number;
    energy: number;
}

export interface AnimalGrassNetworkFitInput {
    lifeFrames: LifeFrame[];
    previousRecord: number;
}

interface StorageModel {
    previousRecord: number;
    generation: number;
    recordSum: number;
    model: tf.LayersModel;
}

const NUM_OUTPUT_CLASSES = 10;

export class AnimalDirectionGrassNetwork {
    private model: tf.LayersModel;
    private lifeFrames: LifeFrame[] = [];
    private previousRecord;
    private inputShape = [8, 8, 1];
    private commands: DirectionBrainCommand[] = [
        DirectionTurn.TURN_LEFT,
        DirectionTurn.TURN_RIGHT,
        DirectionMovementValue.FORWARD,
        DirectionMovementValue.BACK,
        BrainCommandsOther.STAND,
    ];
    private generation = 0;
    private recordSum = 0;

    private memoPredict = memo((normalizedSight: number[][][], innerParams: number[]) => {
        return this.predictByNetwork(normalizedSight, innerParams);
    });

    constructor({ model, previousRecord, generation, recordSum }: Partial<StorageModel> = {}) {
        this.model = model ?? this.createModel();
        this.previousRecord = previousRecord ?? 0;
        this.generation = generation ?? 0;
        this.recordSum = recordSum ?? 0;
    }

    async copyByFile(save = true): Promise<AnimalDirectionGrassNetwork> {
        if (save) {
            await this.saveToFile();
        }
        const { model, previousRecord, recordSum, generation } = await this.loadFromFile();
        const record = Math.max(previousRecord, this.lifeFrames.length);
        return new AnimalDirectionGrassNetwork({ model, previousRecord: record, generation, recordSum });
    }

    dispose() {
        try {
            this.model.dispose();
        } catch (e) {
            console.error(e);
        }
    }

    public predict({ sight, size, taste, energy }: AnimalGrassNetworkPredictInput): DirectionBrainCommand {
        return tf.tidy(() => {
            const normalizedSight = this.getNormalizedSight(sight.current);
            const inner = [
                size.current / 100,
                taste.current,
                energy.current / 100,
                ...new Array(7).fill(0),
            ];

            const { command, output } = this.memoPredict.call(normalizedSight, inner);

            this.lifeFrames.push({
                sight: normalizedSight,
                inner,
                output,
                taste: taste.current,
                energy: energy.current,
            });

            return command;
        });
    }

    private predictByNetwork(normalizedSight: number[][][], innerParams: number[]): { output: number[]; command: DirectionBrainCommand } {
        const xs = tf.tensor4d([normalizedSight]);
        const os = tf.tensor2d([innerParams]);
        const ys: tf.Tensor<tf.Rank> = this.model.predict([xs, os]) as tf.Tensor<tf.Rank>;
        const outputs: Int32Array = ys.dataSync() as Int32Array;

        const {
            command,
            index,
        } = this.getMaxCommand(outputs);
        const output = new Array(NUM_OUTPUT_CLASSES).fill(0);
        output[index] = 1;
        return {
            command,
            output,
        };
    }

    private getNormalizedSight(sight: number[][]): number[][][] {
        const normalized: number[][][] = [];
        const shape = [this.inputShape[0], this.inputShape[1]];

        for (let i = 0; i < shape[0]; i++) {
            normalized[i] = [];
            for (let j = 0; j < shape[1]; j++) {
                const cell = sight[i] && sight[i][j];
                normalized[i][j] = [(cell && cell / 10) ?? 0];
            }
        }

        return normalized;
    }

    private getMaxCommand(outputs: Int32Array): { command: DirectionBrainCommand, index: number } {
        let max = outputs[0];
        let maxIndex = 0;
        outputs.forEach((value, index) => {
            if (value > max) {
                max = value;
                maxIndex = index;
            }
        });

        return { command: this.commands[maxIndex] ?? BrainCommandsOther.STAND, index: maxIndex };
    }

    private createModel(): tf.LayersModel {
        const sightInput = tf.input({ shape: this.inputShape });
        const sightConv1 = tf.layers.conv2d({
            kernelSize: 5,
            filters: 8,
            activation: 'relu',
            kernelInitializer: 'varianceScaling',
        }).apply(sightInput);
        // const sightMaxPool1 = tf.layers.maxPooling2d({}).apply(sightConv1);
        const sightConv2 = tf.layers.conv2d({
            kernelSize: 5,
            filters: 16,
            activation: 'relu',
            kernelInitializer: 'varianceScaling',
            padding: 'same',
        }).apply(sightConv1);
        // const sightMaxPool2 = tf.layers.maxPooling2d({}).apply(sightConv2);
        const sightFlatten = tf.layers.flatten().apply(sightConv2);

        const sightDense = tf.layers.dense({
            units: 20,
            kernelInitializer: 'varianceScaling',
            activation: 'softmax',
        }).apply(sightFlatten);

        const otherInput = tf.input({ shape: [10] });
        const otherDense = tf.layers.dense({ units: 10 }).apply(otherInput);

        const fullConcat = tf.layers.concatenate().apply([sightDense as any, otherDense as any]);

        const fullDense = tf.layers.dense({
            units: NUM_OUTPUT_CLASSES,
            kernelInitializer: 'varianceScaling',
            activation: 'softmax',
        }).apply(fullConcat);

        const model = tf.model({
            inputs: [sightInput, otherInput],
            outputs: [fullDense as any],
        });

        // model.summary();

        return model;
    }

    compile() {
        return tf.tidy(() => {
            const optimizer = tf.train.adam();

            this.model.compile({
                optimizer: optimizer,
                loss: 'categoricalCrossentropy',
                metrics: ['accuracy'],
            });
        });
    }

    private getReward(current: number, previous: number): number {
        switch (true) {
            case current > previous:
                return 1;
            default:
                return 0.5;
            // default:
            //     return -1;
        }
    }

    async fit(options?: AnimalGrassNetworkFitInput) {
        const { lifeFrames, previousRecord } = options ?? { lifeFrames: this.lifeFrames, previousRecord: this.previousRecord };
        this.recordSum += lifeFrames.length;
        const averageRecord = this.recordSum / this.generation;
        const reward = this.getReward(lifeFrames.length, averageRecord);
        const BATCH_SIZE = lifeFrames.length;
        // const epochs = lifeFrames.length <= averageRecord ? 1 : Math.min(100, Math.ceil((lifeFrames.length - averageRecord) / 10));
        // const epochs = lifeFrames.length >= previousRecord ? 100 : 10;
        const epochs = 1;

        const [trainXs, trainYs] = tf.tidy(() => {
            const sightArray = lifeFrames.map(({ sight }) => sight);
            const sightTensor = tf.tensor4d(sightArray);
            const innerArray = lifeFrames.map(({ inner }) => inner);
            const innerTensor = tf.tensor2d(innerArray);
            let lastTasteIndex = 0;
            let lastLowEnergyIndex = 0;
            const trueArray = lifeFrames
                .slice().reverse()
                .map(({ output, taste, energy }, index) => {
                    if (taste > 0) {
                        lastTasteIndex = index;
                    }
                    if (energy <= 10) {
                        lastLowEnergyIndex = index;
                    }

                    return output.map((value) => {
                        if (index === 0) {
                            return Math.abs(value - 1);
                        }
                        if (index < 10) {
                            const reversedValue = Math.abs(value - 1);
                            return reversedValue - ((index - 1) / 10);
                        }

                        if (lastLowEnergyIndex > 0) {
                            const lowEnergyAgo = index - lastLowEnergyIndex;
                            if (lowEnergyAgo > 0 && lowEnergyAgo < 6) {
                                const reversedValue = Math.abs(value - 1);
                                return reversedValue - ((lowEnergyAgo - 1) / 5);
                            }
                        }

                        if (lastTasteIndex > 0) {
                            const tasteIndexAgo = index - lastTasteIndex;
                            if (tasteIndexAgo < 20) {
                                return value * (1 - (tasteIndexAgo / 20));
                            }
                        }

                        return value * 0.1;
                    });
                })
                .reverse();
            const trueTensor = tf.tensor2d(trueArray);
            return [
                [sightTensor, innerTensor],
                trueTensor,
            ];
        });
        let lastEpoch = {};
        await this.model.fit(trainXs, trainYs, {
            batchSize: BATCH_SIZE,
            epochs,
            verbose: 0,
            callbacks: {
                onEpochEnd: (epoch, log) => {
                    if (log && log.loss < 0) {
                        throw new Error('Loss less then 0');
                    }
                    if (epoch === epochs - 1) {
                        lastEpoch = { loss: log?.loss, acc: log?.acc };
                    }
                },
            },
        });
        console.log({ ...lastEpoch, generation: this.generation, reward, current: lifeFrames.length, averageRecord, previous: previousRecord });

        trainXs[0].dispose();
        trainXs[1].dispose();
        trainYs.dispose();
    }

    async saveToFile() {
        await this.model.save('file://./model');
        const meta: Omit<StorageModel, 'model'> = {
            previousRecord: this.previousRecord,
            generation: this.generation,
            recordSum: this.recordSum
        };
        fs.writeFileSync('./model/record.json', JSON.stringify(meta));
        if (this.lifeFrames.length >= this.previousRecord) {

            const stringFrames = this.lifeFrames.map(({ sight, output }) => {
                const plainSight = sight.map((row) => row.map((cell) => cell[0] * 10));
                const action = this.commands.find((command, index) => {
                    return output[index] === 1;
                });
                return `${visualEntitiesAsString(plainSight)}\naction: ${action}\n`;
            }).join('\n===\n');
            fs.writeFileSync('./model/recordLifeFrames.json', stringFrames);
        }
    }

    disposeVariables() {
        tf.disposeVariables();
    }

    async loadFromFile(): Promise<StorageModel> {
        const result: Omit<StorageModel, 'model' > = {
            previousRecord: 0,
            generation: 0,
            recordSum: 0,
        };
        try {
            const record = fs.readFileSync('./model/record.json', { encoding: 'utf-8' });
            const meta = JSON.parse(record);
            result.previousRecord = meta.previousRecord;
            result.generation = meta.generation + 1;
            result.recordSum = meta.recordSum;
        } catch (e) {
            console.error(e);
        }
        const model = await tf.loadLayersModel('file://./model/model.json');
        return {
            ...result,
            model,
        };
    }
}
