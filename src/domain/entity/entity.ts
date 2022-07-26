import {NumberProperty} from "../property/number/number-property";
import {SIZE} from "./entity.contants";
import {PropertiesContainer} from "../property/container/properties-container";
import {PropertiesValueTypes} from "../property/utils/property-value.type";
import {PointProperty} from "../property/point/point-property";

export interface EntityProperties {
    size: NumberProperty;
    position: PointProperty;
}

export class Entity extends PropertiesContainer<EntityProperties> {
    constructor(options: Partial<PropertiesValueTypes<EntityProperties>> = {}) {
        super({
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
