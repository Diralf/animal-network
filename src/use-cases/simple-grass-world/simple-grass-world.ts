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
        this.entityList.add(
            this.getEntity({ tags: [InstanceTypes.GRASS], position: { x: 0, y: 1 }}),
            this.getEntity({ tags: [InstanceTypes.GRASS], position: { x: 0, y: 2 }}),
            this.getEntity({ tags: [InstanceTypes.GRASS], position: { x: 0, y: 3 }}),
            this.getEntity({ tags: [InstanceTypes.GRASS], position: { x: 0, y: 4 }}),
            this.getEntity({ tags: [InstanceTypes.GRASS], position: { x: 0, y: 5 }}),
            this.getEntity({ tags: [InstanceTypes.ANIMAL], position: { x: 0, y: 6 }}),
        );
    };
}
