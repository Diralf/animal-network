import { entityBuilder } from '../../../domain/components/entity-builder/entity-builder';
import { DirectionMovementValue } from '../../../domain/property/direction-movement/direction-movement-property';
import { simpleBuilder } from '../components/component-builder';
import { Animal } from './animal';

// TODO add method for factorySet injection
export const StaticAnimal = entityBuilder({
    ...Animal.factorySet,
    ...simpleBuilder()
        .brain({ handler: () => DirectionMovementValue.FORWARD })
        .build(),
});

export type StaticAnimal = ReturnType<typeof StaticAnimal.build>;
