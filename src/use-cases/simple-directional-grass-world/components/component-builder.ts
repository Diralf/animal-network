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

export const componentBuilder = () => chainBuilder<Components>({
    tags: Property<InstanceTypes[]>().builder(),
    visual: NumberProperty.builder(),
    position: PointProperty.builder(),
    size: NumberProperty.builder(),
    metabolizeSpeed: NumberProperty.builder(),
    direction: DirectionProperty.builder(),
    sight: DirectionSightProperty.builder(),
    movement: DirectionMovementProperty.builder(),
    collision: CollisionProperty.builder(),
    energy: NumberProperty.builder(),
    brain: DirectionBrainProperty.builder(),
    taste: NumberProperty.builder(),
});

export type Owner<ComponentKeys extends keyof Components> = Pick<Components, ComponentKeys>;
