import { DirectionBrainProperty } from '../../../domain/property/direction-brain/direction-brain-property';
import { DirectionMovementValue } from '../../../domain/property/direction-movement/direction-movement-property';
import { World } from '../../../domain/world/world';
import { Animal, AnimalOptions } from './animal';

export class StaticAnimal extends Animal {
    public brain: DirectionBrainProperty;

    constructor(animalOptions: AnimalOptions) {
        super(animalOptions);
        this.brain = new DirectionBrainProperty(() => DirectionMovementValue.FORWARD);

        this.brain.owner.ref = this;
    }

    public tick(world: World<Animal>, time: number): void {
        super.tick(world, time);
        this.brain.tick(world);
    }
}
