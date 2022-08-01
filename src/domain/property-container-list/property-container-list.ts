import {PropertiesContainer, PropertiesContainerBase} from "../property/container/properties-container";
import {PropertiesValueTypes} from "../property/utils/property-value.type";

type InstanceConstructor<Properties extends PropertiesContainerBase<Properties>> = { new(): PropertiesContainer<Properties> };

interface InstanceOfFilter<T extends InstanceConstructor<Properties>, Properties extends PropertiesContainerBase<Properties>> {
    byInstanceOf: T;
}

export class PropertyContainerList<Properties extends PropertiesContainerBase<Properties>> {
    private instances: PropertiesContainer<Properties>[] = [];

    add(...instances: PropertiesContainer<Properties>[]) {
        this.instances.push(...instances);
    }

    find<T extends InstanceConstructor<Properties>>(
        properties: Partial<PropertiesValueTypes<Properties>> = {},
        additional: Partial<InstanceOfFilter<T, Properties>> = {},
    ): PropertiesContainer<Properties>[] {
        const propertyNames = Object.keys(properties) as (keyof Properties)[];

        return this.instances.filter((instance) => {
            if (additional.byInstanceOf && !(instance instanceof additional.byInstanceOf)) {
                return false;
            }
            return propertyNames.every((propertyName) => {
                return instance.getProperty(propertyName)?.isEqualValue(properties[propertyName] as any);
            });
        });
    }

    getAll(): PropertiesContainer<Properties>[] {
        return this.instances;
    }
}
