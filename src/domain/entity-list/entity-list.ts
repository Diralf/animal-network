import {Entity, EntityProperties, EntityPropertiesValues} from "../entity/entity";

type EntityConstructor = { new(): Entity };

interface InstanceOfFilter<T extends EntityConstructor> {
    byInstanceOf: T;
}

export class EntityList {
    private entities: Entity[] = [];

    addEntity(...entities: Entity[]) {
        this.entities.push(...entities);
    }

    getEntity<T extends EntityConstructor>(properties: Partial<EntityPropertiesValues & InstanceOfFilter<T>>): Entity[] {
        const propertyNames = Object.keys(properties) as (keyof EntityProperties)[];

        return this.entities.filter((entity) => {
            return propertyNames.every((propertyName) => {
                if ((propertyName as unknown) === 'byInstanceOf') {
                    return entity instanceof (properties as  InstanceOfFilter<T>).byInstanceOf;
                }
                return entity.getProperty(propertyName).isEqualValue(properties[propertyName] as any);
            });
        });
    }
}
