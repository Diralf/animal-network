import { BrainProperty, BrainHandlerInput, BrainCommands } from '../../../domain/property/brain/brain-property';
import { World } from '../../../domain/world/world';
import { AnimalGrassNetwork } from '../../../network/animal-grass-network/animal-grass-network';
import { Animal, AnimalOptions } from './animal';

export class NeuralAnimal extends Animal {
    public brain: BrainProperty;
    private network = new AnimalGrassNetwork();

    constructor(animalOptions: AnimalOptions) {
        super(animalOptions);
        this.brain = new BrainProperty((options) => this.brainHandler(options));

        this.brain.owner.ref = this;
    }

    public tick(world: World<Animal>, time: number): void {
        super.tick(world, time);
        this.brain.tick(world);
    }

    private brainHandler(options: BrainHandlerInput): BrainCommands {
        const sight = options.owner.sight.current;
        const command = this.network.predict({ sight });
        console.log(options.owner.sight.asString());
        console.log(command);
        return command;
    }
}
