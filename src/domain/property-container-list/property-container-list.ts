import { PropertiesContainer, PropertiesContainerBase } from '../property/container/properties-container';
import { PropertiesValueTypes } from '../property/utils/property-value.type';

interface InstanceConstructor<Properties extends PropertiesContainerBase<Properties>> { new(): PropertiesContainer<Properties> }

interface InstanceOfFilter<T extends InstanceConstructor<Properties>, Properties extends PropertiesContainerBase<Properties>> {
    byInstanceOf: T;
}

export class PropertyContainerList<Properties extends PropertiesContainerBase<Properties>> {
    private instances: Array<PropertiesContainer<Properties>> = [];

    public add(...instances: Array<PropertiesContainer<Properties>>): void {
        this.instances.push(...instances);
    }

    public find<T extends InstanceConstructor<Properties>>(
        properties: Partial<PropertiesValueTypes<Properties>> = {},
        additional: Partial<InstanceOfFilter<T, Properties>> = {},
    ): Array<PropertiesContainer<Properties>> {
        const propertyNames = Object.keys(properties) as Array<keyof Properties>;

        return this.instances.filter((instance) => {
            if (additional.byInstanceOf && !(instance instanceof additional.byInstanceOf)) {
                return false;
            }
            return propertyNames.every((propertyName) => instance.getProperty(propertyName)?.isEqualValue(properties[propertyName] as any));
        });
    }

    public getAll(): Array<PropertiesContainer<Properties>> {
        return this.instances;
    }
}
