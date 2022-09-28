import { DirectionBrainProperty } from '../../../domain/property/direction-brain/direction-brain-property';
import { DirectionMovementValue } from '../../../domain/property/direction-movement/direction-movement-property';
import { World } from '../../../domain/world/world';
import { Animal } from './animal';

export class StaticAnimal extends Animal {
    public brain: DirectionBrainProperty = this.createComponent({ owner: this, class: DirectionBrainProperty, name: 'brain', props: {
        handler: () => DirectionMovementValue.FORWARD,
    }});

    public tick(world: World<Animal>, time: number): void {
        super.tick(world, time);
        this.brain.tick(world);
    }
}
