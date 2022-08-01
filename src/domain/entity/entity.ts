import {NumberProperty} from "../property/number/number-property";
import {SIZE} from "./entity.contants";
import {PropertiesContainer} from "../property/container/properties-container";
import {PropertiesValueTypes} from "../property/utils/property-value.type";
import {PointProperty} from "../property/point/point-property";

export interface EntityProperties {
    id: NumberProperty;
    size: NumberProperty;
    position: PointProperty;
}

export type EntityPropertiesValues = PropertiesValueTypes<EntityProperties>;

export class Entity extends PropertiesContainer<EntityProperties> {
    constructor(options: Partial<EntityPropertiesValues> = {}) {
        super({
            id: new NumberProperty({
                current: options.id,
            }),
            size: new NumberProperty({
                defaultValue: SIZE.DEFAULT,
                min: SIZE.MIN,
                max: SIZE.MAX,
                current: options.size,
            }),
            position: new PointProperty({
                x: 0,
                y: 0,
                ...options.position,
            })
        });
    }
}
