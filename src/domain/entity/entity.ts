import {NumberProperty} from "../property/base/number-property";
import {SIZE} from "./entity.contants";
import {PropertiesContainer} from "../property/base/properties-container";
import {PropertiesValueTypes} from "../property/utils/property-value.type";

export interface EntityProperties {
    size: NumberProperty;
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
        });
    }
}
