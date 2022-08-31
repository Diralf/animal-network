import * as tf from '@tensorflow/tfjs-node';
import * as fs from 'fs';
import { DirectionBrainCommand, BrainCommandsOther } from '../../domain/property/direction-brain/direction-brain-property';
import { DirectionMovementValue } from '../../domain/property/direction-movement/direction-movement-property';
import { DirectionTurn } from '../../domain/property/direction/direction-property';

export interface AnimalGrassNetworkPredictInput {
    sight: number[][];
}

interface LifeFrame {
    sight: number[][];
    output: number[];
}

export interface AnimalGrassNetworkFitInput {
    lifeFrames: LifeFrame[];
    previousRecord: number;
}

interface NetworkOptions {
    model?: tf.Sequential;
    previousRecord?: number;
    generation?: number;
}

export class AnimalDirectionGrassNetwork {
    private model: tf.Sequential;
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

    constructor({ model, previousRecord, generation }: NetworkOptions = {}) {
        this.model = model ?? this.createModel();
        this.previousRecord = previousRecord ?? 0;
        this.generation = generation ?? 0;
    }

    async copyByFile(save = true): Promise<AnimalDirectionGrassNetwork> {
        if (save) {
            await this.saveToFile();
        }
        const modelCopy = await this.loadFromFile();
        const record = Math.max(this.previousRecord, this.lifeFrames.length);
        const generation = this.generation;
        return new AnimalDirectionGrassNetwork({ model: modelCopy, previousRecord: record, generation });
    }

    dispose() {
        try {
            this.model.dispose();
        } catch (e) {
            console.error(e);
        }
    }

    public predict({ sight }: AnimalGrassNetworkPredictInput): DirectionBrainCommand {
        return tf.tidy(() => {
            const normalizedSight = this.getNormalizedSight(sight);
            const xs = tf.tensor3d([normalizedSight]).reshape([1, ...this.inputShape]);
            const ys: tf.Tensor<tf.Rank> = this.model.predict(xs) as tf.Tensor<tf.Rank>;
            const outputs: Int32Array = ys.dataSync() as Int32Array;

            const { command, index } = this.getMaxCommand(outputs);
            const output = new Array(this.commands.length).fill(0);
            output[index] = 1;

            this.lifeFrames.push({
                sight: normalizedSight,
                output,
            });

            return command;
        });
    }

    private getNormalizedSight(sight: number[][]): number[][] {
        const normalized: number[][] = [];
        const shape = [this.inputShape[0], this.inputShape[1]];

        for (let i = 0; i < shape[0]; i++) {
            normalized[i] = [];
            for (let j = 0; j < shape[1]; j++) {
                const cell = sight[i] && sight[i][j];
                normalized[i][j] = cell ?? 0;
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
            kernelSize: 5,
            filters: 4,
            strides: 1,
            activation: 'relu',
            kernelInitializer: 'varianceScaling',
        }));

        model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));

        model.add(tf.layers.conv2d({
            kernelSize: 5,
            filters: 8,
            strides: 1,
            activation: 'relu',
            kernelInitializer: 'varianceScaling',
            padding: 'same',
        }));
        model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));

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
                // @ts-ignore
                loss: tf.losses.softmaxCrossEntropy,
                metrics: ['accuracy'],
            });
        });
    }

    private getReward(current: number, previous: number): number {
        switch (true) {
            case current > previous:
                return 1;
            default:
                return -1;
            // default:
            //     return -1;
        }
    }

    async fit(options?: AnimalGrassNetworkFitInput) {
        const { lifeFrames, previousRecord } = options ?? { lifeFrames: this.lifeFrames, previousRecord: this.previousRecord };
        const reward = this.getReward(lifeFrames.length, previousRecord);
        const BATCH_SIZE = lifeFrames.length;

        const [trainXs, trainYs] = tf.tidy(() => {
            const sightArray = lifeFrames.map(({ sight }) => sight);
            const sightTensor = tf.tensor3d(sightArray);
            const trueArray = lifeFrames.map(({ output }, index, array) => {
                const k = array.length - index - 1;
                const actualReward = k < 10 ? -1 : 1;

                return output.map((value) => value * actualReward);
            });
            const trueTensor = tf.tensor2d(trueArray);
            return [
                sightTensor.reshape([BATCH_SIZE, ...this.inputShape]),
                trueTensor,
            ];
        });

        await this.model.fit(trainXs, trainYs, {
            batchSize: BATCH_SIZE,
            epochs: 1,
            callbacks: {
                onEpochEnd: (epoch, log) => {
                    console.log({ loss: log?.loss, acc: log?.acc, reward, current: lifeFrames.length, previous: previousRecord });
                },
            },
        });

        trainXs.dispose();
        trainYs.dispose();
    }

    async saveToFile() {
        await this.model.save('file://./model');
        const meta = {
            previousRecord: this.previousRecord,
            generation: this.generation,
        }
        fs.writeFileSync('./model/record.json', JSON.stringify(meta));
    }

    disposeVariables() {
        tf.disposeVariables();
    }

    async loadFromFile() {
        try {
            const record = fs.readFileSync('./model/record.json', { encoding: 'utf-8' });
            const meta = JSON.parse(record);
            this.previousRecord = meta.previousRecord;
            this.generation = meta.generation + 1;
        } catch (e) {
            console.error(e);
        }
        return tf.loadLayersModel('file://./model/model.json') as unknown as tf.Sequential;
    }
}
