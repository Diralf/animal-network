import { ArrayProperty } from '../../../domain/property/array/array-property';
import { CollisionProperty } from '../../../domain/property/collision/collision-property';
import { NumberProperty } from '../../../domain/property/number/number-property';
import { PointProperty } from '../../../domain/property/point/point-property';
import { PropertiesValueTypes } from '../../../domain/property/utils/property-value.type';
import { InstanceTypes } from './instance-types';
import { BaseProperty } from '../../../domain/property/base/base-property';

export interface BaseProperties {
    tags: ArrayProperty<InstanceTypes>;
    position: PointProperty;
    visual: BaseProperty<number>;
    collision: CollisionProperty;
    size: NumberProperty;
}

export const getBaseProperties = (values: PropertiesValueTypes<BaseProperties>): BaseProperties => ({
    tags: new ArrayProperty<InstanceTypes>(values.tags),
    position: new PointProperty(values.position),
    visual: new BaseProperty<number>(values.visual),
    collision: new CollisionProperty(values.collision),
    size: new NumberProperty({ current: values.size }),
});
