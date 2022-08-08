import { BaseProperty } from '../base/base-property';
import { PropertyValueType } from '../utils/property-value.type';

type IfEquals<X, Y, A=X, B=never> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? A : B;

type WritableKeys<T> = {
    [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>
}[keyof T];

export type PropertiesContainerBase<Properties> = Record<keyof Properties, BaseProperty<unknown>>;

type Get<Properties extends PropertiesContainerBase<Properties>> = {
    [Key in keyof Properties]: () => PropertyValueType<Properties[Key]>;
};

const isGetValid = <Properties extends PropertiesContainerBase<Properties>>(
    getInstance: Partial<Get<Properties>>,
    propertyKeys: Array<keyof Properties>,
): getInstance is Get<Properties> => propertyKeys.every((propertyKey) => propertyKey in getInstance);

type Set<Properties extends PropertiesContainerBase<Properties>> = {
    [Key in keyof Properties]: (value: PropertyValueType<Properties[Key]>) => void;
};

type SetWritable<Properties extends PropertiesContainerBase<Properties>> = Set<Pick<Properties, WritableKeys<Properties>>>;

const isSetValid = <Properties extends PropertiesContainerBase<Properties>>(
    getInstance: Partial<SetWritable<Properties>>,
    propertyKeys: Array<keyof Properties>,
): getInstance is SetWritable<Properties> => propertyKeys.every((propertyKey) => propertyKey in getInstance);

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
