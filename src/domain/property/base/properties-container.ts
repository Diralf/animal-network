import {BaseProperty} from "./base-property";

export class PropertiesContainer<Properties extends Record<keyof Properties, BaseProperty<unknown>>> {
    constructor(private properties: Properties) {
    }

    setPropertyValue(property: keyof Properties, value: number) {
        this.properties[property].current = value;
    }

    getPropertyValue(property: keyof Properties) {
        return this.properties[property].current;
    }
}
