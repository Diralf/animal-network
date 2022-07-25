import {SizeProperty} from "../property/size/size-property";
import {NumberProperty} from "../property/base/number-property";

export interface EntityProperties {
    size: NumberProperty;
}

export class Entity {
    private properties: EntityProperties;

    constructor(options: { size?: number } = {}) {
        this.properties = {
          size: new SizeProperty({
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
