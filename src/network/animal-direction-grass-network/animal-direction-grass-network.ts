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
}

export class AnimalDirectionGrassNetwork {
    private model: tf.Sequential;
    private lifeFrames: LifeFrame[] = [];
    private previousRecord;
    private inputShape = [16, 16, 1];
    private commands: DirectionBrainCommand[] = [
        DirectionTurn.TURN_LEFT,
        DirectionTurn.TURN_RIGHT,
        DirectionMovementValue.FORWARD,
        DirectionMovementValue.BACK,
        BrainCommandsOther.STAND,
    ];

    constructor({ model, previousRecord }: NetworkOptions = {}) {
        this.model = model ?? this.createModel();
        this.previousRecord = previousRecord ?? 0;
    }

    copy(): AnimalDirectionGrassNetwork {
        return tf.tidy(() => {
            const modelCopy = this.createModel();
            const weights = this.model.getWeights();
            const weightCopies = [];
            for (let i = 0; i < weights.length; i++) {
                weightCopies[i] = weights[i].clone();
            }
            modelCopy.setWeights(weightCopies);
            const record = Math.max(this.previousRecord, this.lifeFrames.length);
            return new AnimalDirectionGrassNetwork({ model: modelCopy, previousRecord: record }) as any;
        });
    }

    async copyByFile(save = true): Promise<AnimalDirectionGrassNetwork> {
        if (save) {
            await this.saveToFile();
        }
        const modelCopy = await this.loadFromFile();
        const record = Math.max(this.previousRecord, this.lifeFrames.length);
        return new AnimalDirectionGrassNetwork({ model: modelCopy, previousRecord: record });
    }

    mutate(rate: number) {
        tf.tidy(() => {
            const weights = this.model.getWeights();
            const mutatedWeights = [];
            for (let i = 0; i < weights.length; i++) {
                const values = weights[i].dataSync().slice();
                for (let j = 0; j < values.length; j++) {
                    if (Math.random() < rate) {
                        values[j] += (Math.random() * 2) - 1;
                    }
                }
                mutatedWeights[i] = tf.tensor(values, weights[i].shape);
            }
            this.model.setWeights(mutatedWeights);
        });
    }

    dispose() {
        this.model.dispose();
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
        const shape = [16, 16];

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
            case current === previous:
                return -0.1;
            default:
                return (current / previous) - 1;
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
            const trueArray = lifeFrames.map(({ output }) => output.map((value) => value * reward));
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
        fs.writeFileSync('./model/record.txt', this.previousRecord.toString());
    }

    disposeVariables() {
        tf.disposeVariables();
    }

    async loadFromFile() {
        try {
            const record = fs.readFileSync('./model/record.txt', { encoding: 'utf-8' });
            this.previousRecord = parseInt(record, 10);
        } catch (e) {
            console.error(e);
        }
        return tf.loadLayersModel('file://./model/model.json') as unknown as tf.Sequential;
    }
}
