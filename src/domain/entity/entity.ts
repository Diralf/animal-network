import {NumberProperty} from "../property/base/number-property";
import {SIZE} from "./entity.contants";

export interface EntityProperties {
    size: NumberProperty;
}

export class Entity {
    private properties: EntityProperties;

    constructor(options: { size?: number } = {}) {
        this.properties = {
          size: new NumberProperty({
              defaultValue: SIZE.DEFAULT,
              min: SIZE.MIN,
              max: SIZE.MAX,
              current: options.size,
          }),
        };
    }

    setPropertyValue(property: keyof EntityProperties, value: number) {
        this.properties[property].current = value;
    }

    getPropertyValue(property: keyof EntityProperties) {
        return this.properties[property].current;
    }
}
