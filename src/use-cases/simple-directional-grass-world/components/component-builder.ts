import { componentBuilder } from '../../../domain/components/component/component';
import { chainBuilder } from '../../../domain/components/components-owner/chain-builder';
import { Property } from '../../../domain/property/base/base-property';
import { CollisionProperty } from '../../../domain/property/collision/collision-property';
import { DirectionBrainProperty } from '../../../domain/property/direction-brain/direction-brain-property';
import { DirectionMovementProperty } from '../../../domain/property/direction-movement/direction-movement-property';
import { DirectionSightProperty } from '../../../domain/property/direction-sight/direction-sight-property';
import { DirectionProperty } from '../../../domain/property/direction/direction-property';
import { NumberProperty } from '../../../domain/property/number/number-property';
import { PointProperty } from '../../../domain/property/point/point-property';
import { InstanceTypes } from '../types/instance-types';

export interface Components {
    tags: Property<InstanceTypes[]>;
    visual: NumberProperty;
    position: PointProperty;
    size: NumberProperty;
    metabolizeSpeed: NumberProperty;
    direction: DirectionProperty;
    sight: DirectionSightProperty;
    movement: DirectionMovementProperty;
    collision: CollisionProperty;
    energy: NumberProperty;
    brain: DirectionBrainProperty;
    taste: NumberProperty;
}

export const simpleBuilder = () => chainBuilder<Components>({
    tags: componentBuilder(Property<InstanceTypes[]>),
    visual: componentBuilder(NumberProperty),
    position: componentBuilder(PointProperty),
    size: componentBuilder(NumberProperty),
    metabolizeSpeed: componentBuilder(NumberProperty),
    direction: componentBuilder(DirectionProperty),
    sight: componentBuilder(DirectionSightProperty),
    movement: componentBuilder(DirectionMovementProperty),
    collision: componentBuilder(CollisionProperty),
    energy: componentBuilder(NumberProperty),
    brain: componentBuilder(DirectionBrainProperty),
    taste: componentBuilder(NumberProperty),
});

export type Owner<ComponentKeys extends keyof Components> = Pick<Components, ComponentKeys>;
