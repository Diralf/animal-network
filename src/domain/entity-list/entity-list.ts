import {Entity, EntityProperties, EntityPropertiesValues} from "../entity/entity";

export class EntityList {
    private entities: Entity[] = [];

    addEntity(...entities: Entity[]) {
        this.entities.push(...entities);
    }

    getEntity(properties: Partial<EntityPropertiesValues>): Entity[] {
        const propertyNames = Object.keys(properties) as (keyof EntityProperties)[];

        return this.entities.filter((entity) => {
            return propertyNames.every((propertyName) => {
                return entity.getProperty(propertyName).isEqualValue(properties[propertyName] as any);
            });
        });
    }
}
