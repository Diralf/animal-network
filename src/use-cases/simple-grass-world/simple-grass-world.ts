import {PropertyContainerList} from "../../domain/property-container-list/property-container-list";
import {PropertiesContainer} from "../../domain/property/container/properties-container";
import {PointProperty} from "../../domain/property/point/point-property";
import {PropertiesValueTypes} from "../../domain/property/utils/property-value.type";
import {ArrayProperty} from "../../domain/property/array/array-property";

export enum InstanceTypes {
    GRASS = 'GRASS',
    ANIMAL = 'ANIMAL'
}

interface Entity {
    tags: ArrayProperty<InstanceTypes>;
    position: PointProperty;
}

export class SimpleGrassWorld {
    entityList: PropertyContainerList<Entity> = new PropertyContainerList();

    getEntity(values: PropertiesValueTypes<Entity>) {
        return new PropertiesContainer<Entity>({
            tags: new ArrayProperty<InstanceTypes>(values.tags),
            position: new PointProperty(values.position),
        });
    }

    start() {
        const entitiesCount: Record<InstanceTypes, number> = {
            [InstanceTypes.GRASS]: 5,
            [InstanceTypes.ANIMAL]: 1,
        };
        const entities = (Object.entries(entitiesCount) as [InstanceTypes, number][])
            .map(([entityType, entityNumber]): InstanceTypes[] =>
                new Array(entityNumber).fill(entityType)
            )
            .flat()
            .map((entityType, index) => this.getEntity({
                tags: [entityType],
                position: { x: 0, y: index }
            }));

        this.entityList.add(...entities);
    };
}
