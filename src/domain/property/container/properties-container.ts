import {BaseProperty} from "../base/base-property";
import {PropertyValueType} from "../utils/property-value.type";

export class PropertiesContainer<Properties extends Record<keyof Properties, BaseProperty<unknown>>> {
    constructor(private properties: Properties) {
    }

    setPropertyValue<Key extends keyof Properties>(property: keyof Properties, value: PropertyValueType<Properties[Key]>) {
        this.properties[property].current = value;
    }

    getPropertyValue<Key extends keyof Properties>(property: keyof Properties): PropertyValueType<Properties[Key]> {
        return this.properties[property].current;
    }
}
