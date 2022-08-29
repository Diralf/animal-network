import * as tf from '@tensorflow/tfjs-node';
import { BrainCommand, BrainCommandsOther } from '../../domain/property/brain/brain-property';
import { MovementDirections } from '../../domain/property/movement/movement-property';

export interface AnimalGrassNetworkPredictInput {
    sight: number[][];
}

export class AnimalGrassNetwork {
    private model: tf.Sequential;

    constructor(model?: tf.Sequential) {
        this.model = model ?? this.createModel();
    }

    copy(): AnimalGrassNetwork {
        return tf.tidy(() => {
            const modelCopy = this.createModel();
            const weights = this.model.getWeights();
            const weightCopies = [];
            for (let i = 0; i < weights.length; i++) {
                weightCopies[i] = weights[i].clone();
            }
            modelCopy.setWeights(weightCopies);
            return new AnimalGrassNetwork(modelCopy) as any;
        });
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

    public predict({ sight }: AnimalGrassNetworkPredictInput): BrainCommand {
        const normalizedSight = this.getNormalizedSight(sight);
        return tf.tidy(() => {
            const xs = tf.tensor4d([normalizedSight]);
            const ys: tf.Tensor<tf.Rank> = this.model.predict(xs) as tf.Tensor<tf.Rank>;
            const outputs: Int32Array = ys.dataSync() as Int32Array;

            return this.getMaxCommand(outputs);
        });
    }

    private getNormalizedSight(sight: number[][]): number[][][] {
        const normalized: number[][][] = [];
        const shape = [16, 16, 1];

        for (let i = 0; i < shape[0]; i++) {
            normalized[i] = [];
            for (let j = 0; j < shape[1]; j++) {
                const cell = sight[i] && sight[i][j];
                normalized[i][j] = [cell ?? 0];
            }
        }

        return normalized;
    }

    private getMaxCommand(outputs: Int32Array): BrainCommand {
        const commands: BrainCommand[] = [
            MovementDirections.UP,
            MovementDirections.DOWN,
            MovementDirections.LEFT,
            MovementDirections.RIGHT,
            BrainCommandsOther.STAND,
        ];

        let max = outputs[0];
        let maxIndex = 0;
        outputs.forEach((value, index) => {
            if (value > max) {
                max = value;
                maxIndex = index;
            }
        });

        return commands[maxIndex];
    }

    private createModel(): tf.Sequential {
        const model = tf.sequential();

        const IMAGE_WIDTH = 16;
        const IMAGE_HEIGHT = 16;
        const IMAGE_CHANNELS = 1;

        model.add(tf.layers.conv2d({
            inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
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

        const NUM_OUTPUT_CLASSES = 5;
        model.add(tf.layers.dense({
            units: NUM_OUTPUT_CLASSES,
            kernelInitializer: 'varianceScaling',
            activation: 'softmax',
        }));

        return model;
    }
}
