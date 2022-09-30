import { ComponentOwnerDecorator } from '../../../domain/components/components-owner/component-owner.decorator';
import { ComponentsOwner, ComponentsBuilders } from '../../../domain/components/components-owner/components-owner';
import { Property } from '../../../domain/property/base/base-property';
import { NumberProperty } from '../../../domain/property/number/number-property';
import { PointProperty } from '../../../domain/property/point/point-property';
import { InstanceTypes } from '../types/instance-types';

interface Components {
    tags: Property<InstanceTypes[]>;
    visual: NumberProperty;
    position: PointProperty;
}

@ComponentOwnerDecorator()
export class Hole extends ComponentsOwner<Components> {
    protected components = (): ComponentsBuilders<Components> => ({
        tags: Property<InstanceTypes[]>().build([InstanceTypes.HOLE]),
        position: PointProperty.build(),
        visual: NumberProperty.build({ current: 9 }),
    });
}
