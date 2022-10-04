import { entityBuilder } from '../../../domain/components/entity-builder/entity-builder';
import { simpleBuilder } from '../components/component-builder';
import { InstanceTypes } from '../types/instance-types';

export const Hole = entityBuilder(simpleBuilder()
    .tags([InstanceTypes.HOLE])
    .position()
    .visual({ current: 9 })

    .build());

export type Hole = ReturnType<typeof Hole.build>;
