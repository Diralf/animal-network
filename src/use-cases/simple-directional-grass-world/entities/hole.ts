import { entityBuilder } from '../../../domain/components/entity-builder/entity-builder';
import { componentBuilder } from '../components/component-builder';
import { InstanceTypes } from '../types/instance-types';

export const Hole = entityBuilder(componentBuilder()
    .tags([InstanceTypes.HOLE])
    .position()
    .visual({ current: 9 })

    .build());

export type Hole = ReturnType<typeof Hole.build>;
