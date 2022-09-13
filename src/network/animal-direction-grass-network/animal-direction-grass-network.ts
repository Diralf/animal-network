import * as tf from '@tensorflow/tfjs-node';
import * as fs from 'fs';
import { DirectionBrainCommand, BrainCommandsOther } from '../../domain/property/direction-brain/direction-brain-property';
import { DirectionMovementValue } from '../../domain/property/direction-movement/direction-movement-property';
import { DirectionSightable } from '../../domain/property/direction-sight/direction-sightable';
import { DirectionTurn } from '../../domain/property/direction/direction-property';
import { NumberProperty } from '../../domain/property/number/number-property';
import { visualEntitiesAsString } from '../../domain/property/utils/visual-entities-as-string';

export type AnimalGrassNetworkPredictInput = DirectionSightable & { size: NumberProperty, taste: number };

interface LifeFrame {
    sight: number[][][];
    output: number[];
    taste: number;
}

export interface AnimalGrassNetworkFitInput {
    lifeFrames: LifeFrame[];
    previousRecord: number;
}

interface StorageModel {
    previousRecord: number;
    generation: number;
    recordSum: number;
    model: tf.Sequential;
}

export class AnimalDirectionGrassNetwork {
    private model: tf.Sequential;
    private lifeFrames: LifeFrame[] = [];
    private previousRecord;
    private inputShape = [8, 8, 2];
    private commands: DirectionBrainCommand[] = [
        DirectionTurn.TURN_LEFT,
        DirectionTurn.TURN_RIGHT,
        DirectionMovementValue.FORWARD,
        DirectionMovementValue.BACK,
        BrainCommandsOther.STAND,
    ];
    private generation = 0;
    private recordSum = 0;

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

    public predict({ sight, size, taste }: AnimalGrassNetworkPredictInput): DirectionBrainCommand {
        return tf.tidy(() => {
            const normalizedSight = this.getNormalizedSight(sight.current, size.current);
            const xs = tf.tensor4d([normalizedSight]);
            const ys: tf.Tensor<tf.Rank> = this.model.predict(xs) as tf.Tensor<tf.Rank>;
            const outputs: Int32Array = ys.dataSync() as Int32Array;

            const { command, index } = this.getMaxCommand(outputs);
            const output = new Array(this.commands.length).fill(0);
            output[index] = 1;

            this.lifeFrames.push({
                sight: normalizedSight,
                output,
                taste,
            });

            return command;
        });
    }

    private getNormalizedSight(sight: number[][], size: number): number[][][] {
        const normalized: number[][][] = [];
        const shape = [this.inputShape[0], this.inputShape[1]];

        for (let i = 0; i < shape[0]; i++) {
            normalized[i] = [];
            for (let j = 0; j < shape[1]; j++) {
                const cell = sight[i] && sight[i][j];
                let cellSize;
                switch (cell) {
                    case 6:
                        cellSize = Math.min(Math.max(size, 0), 10) / 10;
                        break;
                    case 3:
                        cellSize = 0.5;
                        break;
                    case 9:
                        cellSize = 1;
                        break;
                    default:
                        cellSize = 0;
                }
                normalized[i][j] = [
                    (cell && cell / 10) ?? 0,
                    cellSize,
                ];
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

        return { command: this.commands[maxIndex], index: maxIndex };
    }

    private createModel(): tf.Sequential {
        const model = tf.sequential();

        model.add(tf.layers.conv2d({
            inputShape: this.inputShape,
            kernelSize: 3,
            filters: 8,
            activation: 'relu',
            kernelInitializer: 'varianceScaling',
        }));

        model.add(tf.layers.maxPooling2d({}));

        model.add(tf.layers.conv2d({
            kernelSize: 3,
            filters: 16,
            activation: 'relu',
            kernelInitializer: 'varianceScaling',
            padding: 'same',
        }));
        model.add(tf.layers.maxPooling2d({}));

        model.add(tf.layers.flatten());

        const NUM_OUTPUT_CLASSES = this.commands.length;
        model.add(tf.layers.dense({
            units: NUM_OUTPUT_CLASSES,
            kernelInitializer: 'varianceScaling',
            activation: 'softmax',
        }));

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
            let lastTasteIndex = 0;
            const trueArray = lifeFrames
                .slice().reverse()
                .map(({ output, taste }, index) => {
                    if (taste > 0) {
                        lastTasteIndex = index;
                    }

                    return output.map((value) => {
                        if (index === 0) {
                            return Math.abs(value - 1);
                        }
                        if (index < 10) {
                            const reversedValue = Math.abs(value - 1);
                            const signOfIncrement = reversedValue - 0.1;
                            return reversedValue - (0.1 * (index - 1) * signOfIncrement);
                        }

                        if (lastTasteIndex > 0) {
                            const tasteIndexAgo = index - lastTasteIndex;
                            if (tasteIndexAgo < 9) {
                                return value * (1 - (0.1 * tasteIndexAgo));
                            }
                        }

                        return value * 0.1;
                    });
                })
                .reverse();
            const trueTensor = tf.tensor2d(trueArray);
            return [
                sightTensor,
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

        trainXs.dispose();
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
        const model = await tf.loadLayersModel('file://./model/model.json') as unknown as tf.Sequential;
        return {
            ...result,
            model,
        };
    }
}
