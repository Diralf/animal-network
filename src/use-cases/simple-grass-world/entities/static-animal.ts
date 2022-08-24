import { BrainProperty } from '../../../domain/property/brain/brain-property';
import { MovementDirections } from '../../../domain/property/movement/movement-property';
import { World } from '../../../domain/world/world';
import { Animal, AnimalOptions } from './animal';

export class StaticAnimal extends Animal {
    public brain: BrainProperty;

    constructor(animalOptions: AnimalOptions) {
        super(animalOptions);
        this.brain = new BrainProperty(() => MovementDirections.UP);

        this.brain.owner.ref = this;
    }

    public tick(world: World<Animal>, time: number): void {
        super.tick(world, time);
        this.brain.tick(world);
    }
}
