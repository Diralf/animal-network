import {BaseProperty} from "../base/base-property";
import {PropertyValueType} from "../utils/property-value.type";

type IfEquals<X, Y, A=X, B=never> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? A : B;

type WritableKeys<T> = {
    [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>
}[keyof T];

type Get<Properties extends Record<keyof Properties, BaseProperty<unknown>>> = {
    [Key in keyof Properties]: () => PropertyValueType<Properties[Key]>;
}

type Set<Properties extends Record<keyof Properties, BaseProperty<unknown>>> = {
    [Key in keyof Properties]: (value: PropertyValueType<Properties[Key]>) => void;
}

export type PropertiesContainerBase<Properties> = Record<keyof Properties, BaseProperty<unknown>>;

export class PropertiesContainer<Properties extends PropertiesContainerBase<Properties>> {
    public get: Get<Properties>;
    public set: Set<Pick<Properties, WritableKeys<Properties>>>

    constructor(private properties: Properties) {
        const propertyKeys = Object.keys(properties) as (keyof Properties)[];
        this.get = propertyKeys.reduce((acc, key) => {
            return {
                ...acc,
                [key]: () => this.getPropertyValue(key),
            }
        }, {} as Get<Properties>);
        this.set = propertyKeys.reduce((acc, key) => {
            return {
                ...acc,
                [key]: (value: PropertyValueType<Properties[typeof key]>) => this.setPropertyValue(key, value),
            }
        }, {} as Set<Properties>);
        propertyKeys.forEach((propertyKey) => {
           properties[propertyKey].owner = this;
        });
    }

    private setPropertyValue<Key extends keyof Properties>(property: Key, value: PropertyValueType<Properties[Key]>) {
        this.properties[property].current = value;
    }

    private getPropertyValue<Key extends keyof Properties>(property: Key): PropertyValueType<Properties[Key]> {
        return this.properties[property].current;
    }

    public getProperty<Key extends keyof Properties>(property: Key): Properties[Key] {
        return this.properties[property];
    }
}
