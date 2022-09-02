import {
    DirectionBrainProperty,
    DirectionBrainCommand,
    DirectionBrainHandlerInput,
} from '../../../domain/property/direction-brain/direction-brain-property';
import { World } from '../../../domain/world/world';
import { AnimalDirectionGrassNetwork } from '../../../network/animal-direction-grass-network/animal-direction-grass-network';
import { Animal, AnimalOptions } from './animal';

export interface NeuralAnimalOptions extends AnimalOptions {
    network?: AnimalDirectionGrassNetwork;
}

export class NeuralAnimal extends Animal {
    public brain: DirectionBrainProperty;
    private network = new AnimalDirectionGrassNetwork();

    constructor(animalOptions: NeuralAnimalOptions) {
        super(animalOptions);
        this.brain = new DirectionBrainProperty((options) => this.brainHandler(options));

        this.brain.owner.ref = this;

        // this.network = animalOptions.network?.copy() ?? new AnimalGrassNetwork();
    }

    async loadFromFile() {
        try {
            // this.network.dispose();
            this.network = await this.network?.copyByFile(false);
        } catch (e) {
            console.error(e);
        }
    }

    async setNetwork(network: AnimalDirectionGrassNetwork) {
        this.network.dispose();
        await network.saveToFile();
        network.disposeVariables();
        this.network = await network?.copyByFile(false);
    }

    public tick(world: World<Animal>, time: number): void {
        super.tick(world, time);
        this.brain.tick(world);
    }

    private brainHandler(options: DirectionBrainHandlerInput): DirectionBrainCommand {
        const sight = options.owner.sight.current;
        const size = this.size.current;
        return this.network.predict({ sight, size });
    }

    dispose() {
        this.network.dispose();
    }

    getNetwork() {
        return this.network;
    }
}
