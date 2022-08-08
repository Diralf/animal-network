import { PropertyValueType } from '../utils/property-value.type';
import { isGetValid, Get } from './get.type';
import { PropertiesContainerBase } from './properties-container-base.type';
import { isSetValid, SetWritable } from './set.type';

export const isPropertiesContainerValid = <Properties extends PropertiesContainerBase<Properties>>(
    instance: PropertiesContainer<PropertiesContainerBase<unknown>>,
    propertyKeys: Array<keyof Properties>,
): instance is PropertiesContainer<Properties> => {
    return isGetValid(instance.get, propertyKeys) && isSetValid(instance.set, propertyKeys);
};

export class PropertiesContainer<Properties extends PropertiesContainerBase<Properties>> {
    public get: Get<Properties>;
    public set: SetWritable<Properties>;

    constructor(private properties: Properties) {
        const propertyKeys = Object.keys(properties) as Array<keyof Properties>;
        this.get = this.propertiesToGetInstance(propertyKeys);
        this.set = this.propertiesToSetInstance(propertyKeys);
        propertyKeys.forEach((propertyKey) => {
            properties[propertyKey].owner = this;
        });
    }

    private propertiesToGetInstance(propertyKeys: Array<keyof Properties>): Get<Properties> {
        const getInstance = propertyKeys.reduce<Partial<Get<Properties>>>((acc, key) => ({
            ...acc,
            [key]: () => this.getPropertyValue(key),
        }), {});
        if (isGetValid(getInstance, propertyKeys)) {
            return getInstance;
        }
        throw new Error('"get" instance is not complete');
    }

    private propertiesToSetInstance(propertyKeys: Array<keyof Properties>): SetWritable<Properties> {
        const setInstance = propertyKeys.reduce<Partial<SetWritable<Properties>>>((acc, key) => ({
            ...acc,
            [key]: (value: PropertyValueType<Properties[typeof key]>) => {
                this.setPropertyValue(key, value);
            },
        }), {});

        if (isSetValid(setInstance, propertyKeys)) {
            return setInstance;
        }
        throw new Error('"set" instance is not complete');
    }

    private setPropertyValue<Key extends keyof Properties>(property: Key, value: PropertyValueType<Properties[Key]>): void {
        this.properties[property].current = value;
    }

    private getPropertyValue<Key extends keyof Properties>(property: Key): PropertyValueType<Properties[Key]> {
        return this.properties[property].current;
    }

    public getProperty<Key extends keyof Properties>(property: Key): Properties[Key] {
        return this.properties[property];
    }
}
