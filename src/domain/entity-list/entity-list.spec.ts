import {EntityList} from "./entity-list";
import {Entity} from "../entity/entity";
import {Field} from "../field/field";

describe('EntityList', () => {
    it('should be created', () => {
        const entityList = new EntityList();

        expect(entityList).toBeTruthy();
    });

    it('should add and get entity', () => {
        const entityList = new EntityList();
        const entity = new Entity();
        const field = new Field({ width: 5, height: 5});

        entityList.addEntity({ entity, field, point: {x: 1, y: 2} });

        expect(entityList.getEntity({ field, point: {x: 1, y: 2} })).toEqual(entity);
    });
});
