import { BrainProperty, BrainHandlerInput, BrainCommand } from '../../../domain/property/brain/brain-property';
import { World } from '../../../domain/world/world';
import { AnimalGrassNetwork } from '../../../network/animal-grass-network/animal-grass-network';
import { Animal, AnimalOptions } from './animal';

export interface NeuralAnimalOptions extends AnimalOptions {
    network?: AnimalGrassNetwork;
}

export class NeuralAnimal extends Animal {
    public brain: BrainProperty;
    private network = new AnimalGrassNetwork();

    constructor(animalOptions: NeuralAnimalOptions) {
        super(animalOptions);
        this.brain = new BrainProperty((options) => this.brainHandler(options));

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

    async setNetwork(network: AnimalGrassNetwork) {
        this.network.dispose();
        await network.saveToFile();
        network.disposeVariables();
        this.network = await network?.copyByFile(false);
    }

    public tick(world: World<Animal>, time: number): void {
        super.tick(world, time);
        this.brain.tick(world);
    }

    private brainHandler(options: BrainHandlerInput): BrainCommand {
        const sight = options.owner.sight.current;
        return this.network.predict({ sight });
    }

    dispose() {
        this.network.dispose();
    }

    getNetwork() {
        return this.network;
    }
}
