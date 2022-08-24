import { BrainProperty, BrainHandlerInput, BrainCommands } from '../../../domain/property/brain/brain-property';
import { MovementDirections } from '../../../domain/property/movement/movement-property';
import { World } from '../../../domain/world/world';
import { Animal, AnimalOptions } from './animal';

export class NeuralAnimal extends Animal {
    public brain: BrainProperty;

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
        const commands: BrainCommands[] = [
            MovementDirections.UP,
            MovementDirections.DOWN,
            MovementDirections.LEFT,
            MovementDirections.RIGHT,
            'STAND',
        ];
        return commands[Math.floor(Math.random() * commands.length)];
    }
}
