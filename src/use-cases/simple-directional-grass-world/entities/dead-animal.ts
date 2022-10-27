import { chainBuilder } from '../../../domain/components/components-owner/chain-builder';
import { entityBuilder } from '../../../domain/components/entity-builder/entity-builder';
import { Property } from '../../../domain/property/base/base-property';
import { AnimalDirectionGrassNetwork } from '../../../network/animal-direction-grass-network/animal-direction-grass-network';
import { simpleBuilder } from '../components/component-builder';

interface Custom {
    deadNetwork: Property<AnimalDirectionGrassNetwork | null>;
}

const customBuilders = chainBuilder<Custom>({
    deadNetwork: Property<AnimalDirectionGrassNetwork | null>.builder(),
});

export const DeadAnimal = entityBuilder(
    {
        ...simpleBuilder()
            .visual({ current: 5 })
            .size({ current: 1 })
            .metabolizeSpeed({ current: 0.1 })
            .build(),
        ...customBuilders
            .deadNetwork(null)
            .build(),
    },
);

export type DeadAnimal = ReturnType<typeof DeadAnimal.build>;
