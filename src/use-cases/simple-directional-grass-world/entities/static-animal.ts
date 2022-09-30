import { ComponentOwnerDecorator } from '../../../domain/components/components-owner/component-owner.decorator';
import { DirectionBrainProperty } from '../../../domain/property/direction-brain/direction-brain-property';
import { DirectionMovementValue } from '../../../domain/property/direction-movement/direction-movement-property';
import { Animal } from './animal';

@ComponentOwnerDecorator()
export class StaticAnimal extends Animal {
    protected components() {
        return {
            ...super.components(),
            brain: DirectionBrainProperty.build({ handler: () => DirectionMovementValue.FORWARD }),
        };
    }
}
