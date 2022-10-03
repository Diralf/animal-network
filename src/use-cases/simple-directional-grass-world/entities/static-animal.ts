import { entityBuilder } from '../../../domain/components/entity-builder/entity-builder';
import { DirectionMovementValue } from '../../../domain/property/direction-movement/direction-movement-property';
import { componentBuilder } from '../components/component-builder';
import { Animal } from './animal';

export const StaticAnimal = entityBuilder({
    ...Animal.factorySet,
    ...componentBuilder()
        .brain({ handler: () => DirectionMovementValue.FORWARD })
        .build(),
});

export type StaticAnimal = ReturnType<typeof StaticAnimal.build>;
