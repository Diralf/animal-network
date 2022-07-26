import { entityBuilder } from '../../../domain/components/entity-builder/entity-builder';
import { Property } from '../../../domain/property/base/base-property';
import { AnimalDirectionGrassNetwork } from '../../../network/animal-direction-grass-network/animal-direction-grass-network';
import { simpleBuilder } from '../components/component-builder';
import { InstanceTypes } from '../types/instance-types';

const customBuilders = simpleBuilder().add({
    deadNetwork: Property<AnimalDirectionGrassNetwork | null>.builder(),
});

export const DeadAnimal = entityBuilder(
    customBuilders
        .visual({ current: 5 })
        .tags([InstanceTypes.DEAD])
        .size({ current: 1 })
        .position()
        .metabolizeSpeed({ current: 0.1 })

        .deadNetwork(null)

        .build(),
);

export type DeadAnimal = ReturnType<typeof DeadAnimal.build>;
