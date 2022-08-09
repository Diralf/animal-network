import { CollisionOptions } from '../../../domain/property/collision/collision-options';
import { NumberProperty } from '../../../domain/property/number/number-property';
import { PropertiesValueTypes } from '../../../domain/property/utils/property-value.type';
import { BaseProperties, getBaseProperties } from './base-properties';
import { PropertiesContainer } from '../../../domain/property/container/properties-container';
import { InstanceTypes } from './instance-types';
import { SightProperty } from '../../../domain/property/sight/sight-property';
import { MovementProperty } from '../../../domain/property/movement/movement-property';

export interface AnimalProperties extends BaseProperties {
    sight: SightProperty;
    movement: MovementProperty;
    size: NumberProperty;
}

export class Animal extends PropertiesContainer<AnimalProperties> {
    constructor(values: Pick<PropertiesValueTypes<AnimalProperties>, 'position'>) {
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
        });
    }

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
