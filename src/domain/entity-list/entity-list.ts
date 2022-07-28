import {Field} from "../field/field";
import {Entity} from "../entity/entity";
import {RawPoint} from "../property/point/point-property";

export interface EntityListItem {
    field: Field;
    entity: Entity;
    point: RawPoint;
}

export type EntityListGetEntity = Omit<EntityListItem, 'entity'>;

export class EntityList {
    private entities: EntityListItem[] = [];

    addEntity({ field, entity, point }: EntityListItem) {
        this.entities.push({ field, entity, point });
    }

    getEntity({ field: targetField, point: targetPoint }: EntityListGetEntity) {
        const result = this.entities.find(({ field, point }) => {
            return field === targetField && point.x === targetPoint.x && point.y === targetPoint.y;
        });

        return result?.entity ?? null;
    }
}
