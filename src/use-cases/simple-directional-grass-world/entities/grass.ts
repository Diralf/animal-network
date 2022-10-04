import { entityBuilder } from '../../../domain/components/entity-builder/entity-builder';
import { simpleBuilder } from '../components/component-builder';
import { InstanceTypes } from '../types/instance-types';

export const Grass = entityBuilder(simpleBuilder()
    .tags([InstanceTypes.GRASS])
    .size({ current: 10 })
    .position()
    .visual({ current: 3 })

    .build());

export type Grass = ReturnType<typeof Grass.build>;
