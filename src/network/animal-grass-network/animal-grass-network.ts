import * as tf from '@tensorflow/tfjs-node';
import { BrainCommands, BrainCommandsOther } from '../../domain/property/brain/brain-property';
import { MovementDirections } from '../../domain/property/movement/movement-property';

export interface AnimalGrassNetworkPredictInput {
    sight: number[];
}

export class AnimalGrassNetwork {
    private model: tf.Sequential;

    constructor(model?: tf.Sequential) {
        this.model = model ?? this.createModel();
    }

    public predict({ sight }: AnimalGrassNetworkPredictInput): BrainCommands {
        const commands: BrainCommands[] = [
            MovementDirections.UP,
            MovementDirections.DOWN,
            MovementDirections.LEFT,
            MovementDirections.RIGHT,
            BrainCommandsOther.STAND,
        ];
        return commands[Math.floor(Math.random() * commands.length)];
    }

    private createModel(): tf.Sequential {
        const model = tf.sequential();

        const IMAGE_WIDTH = 16;
        const IMAGE_HEIGHT = 16;
        const IMAGE_CHANNELS = 1;

        model.add(tf.layers.conv2d({
            inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
            kernelSize: 5,
            filters: 8,
            strides: 1,
            activation: 'relu',
            kernelInitializer: 'varianceScaling',
        }));

        model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));

        model.add(tf.layers.conv2d({
            kernelSize: 5,
            filters: 16,
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
