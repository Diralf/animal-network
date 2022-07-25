import {NumberProperty} from "./number-property";

export class PropertiesContainer<Properties extends Record<keyof Properties, NumberProperty>> {
    constructor(private properties: Properties) {
    }

    setPropertyValue(property: keyof Properties, value: number) {
        this.properties[property].current = value;
    }

    getPropertyValue(property: keyof Properties) {
        return this.properties[property].current;
    }
}
