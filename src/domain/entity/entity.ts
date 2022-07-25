import {NumberProperty} from "../property/base/number-property";

export interface EntityProperties {
    size: NumberProperty;
}

export class Entity {
    private properties: EntityProperties;

    constructor(options: { size?: number } = {}) {
        this.properties = {
          size: new NumberProperty({
              defaultValue: 1,
              min: 1,
              max: 100,
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
