import { BrainProperty } from '../../../domain/property/brain/brain-property';
import { CollisionOptions } from '../../../domain/property/collision/collision-options';
import { PropertiesContainer } from '../../../domain/property/container/properties-container';
import { MovementProperty, MovementDirections } from '../../../domain/property/movement/movement-property';
import { SightProperty } from '../../../domain/property/sight/sight-property';
import { PropertiesValueTypes } from '../../../domain/property/utils/property-value.type';
import { AnimalProperties } from './animal';
import { getBaseProperties, BaseProperties } from './base-properties';
import { InstanceTypes } from './instance-types';

export interface StaticAnimalProperties extends AnimalProperties {
    brain: BrainProperty;
}

export class StaticAnimal extends PropertiesContainer<StaticAnimalProperties> {
    constructor(values: Pick<PropertiesValueTypes<StaticAnimalProperties>, 'position'>) {
        super({
            ...getBaseProperties({
                position: values.position,
                tags: [InstanceTypes.ANIMAL],
                visual: 2,
                collision: (options) => {
                    this.handleCollision(options);
                },
                size: 1,
            }),
            sight: new SightProperty({
                range: 2,
            }),
            movement: new MovementProperty(),
            brain: new BrainProperty(() => MovementDirections.UP),
        });
    }

    // TODO move to separate property
    private handleCollision({ other, list }: CollisionOptions): void {
        const grass = (other as Array<PropertiesContainer<BaseProperties>>).filter((entity) => {
            const tags = entity.get.tags();
            return tags.includes(InstanceTypes.GRASS);
        });
        const totalScore = grass.reduce((acc, entity) => acc + entity.get.size(), 0);
        this.set.size(this.get.size() + totalScore);
        list.remove(...grass);
    }
}
