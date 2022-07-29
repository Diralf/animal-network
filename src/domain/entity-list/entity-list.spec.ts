import {EntityList} from "./entity-list";
import {Entity, EntityPropertiesValues} from "../entity/entity";

describe('EntityList', () => {
    it('should be created', () => {
        const entityList = new EntityList();

        expect(entityList).toBeTruthy();
    });

    it.each<{ filter: Partial<EntityPropertiesValues>, expected: string[] }>([
        { filter: {}, expected: ['1', '2', '3', '4'] },
        { filter: { position: { x: 0, y: 0 } }, expected: ['2', '3'] },
        { filter: { size: 1 }, expected: ['1', '3'] },
        { filter: { position: { x: 0, y: 0 }, size: 1 }, expected: ['3'] },

        { filter: { position: { x: 1, y: 2 } }, expected: ['1'] },
        { filter: { size: 2 }, expected: ['2'] },
        { filter: { position: { x: 3, y: 2 }, size: 4 }, expected: ['4'] },
        { filter: { position: { x: 3, y: 2 } }, expected: ['4'] },
        { filter: { size: 4 }, expected: ['4'] },

        { filter: { position: { x: 9, y: 9 } }, expected: [] },
        { filter: { position: { x: 1, y: 2 }, size: 9 }, expected: [] },
        { filter: { position: { x: 3, y: 2 }, size: 9 }, expected: [] },
        { filter: { position: { x: 9, y: 9 }, size: 2 }, expected: [] },
        { filter: { position: { x: 9, y: 9 }, size: 4 }, expected: [] },
    ])('should add and get entities $expected by filter $filter.position size $filter.size', ({ filter, expected }) => {
        const entityList = new EntityList();
        const entities: Record<string, Entity> = {
            ['1']: new Entity({
                position: { x: 1, y: 2 },
            }),
            ['2']: new Entity({
                size: 2,
            }),
            ['3']: new Entity(),
            ['4']: new Entity({
                position: { x: 3, y: 2 },
                size: 4,
            }),
        }

        entityList.addEntity(
            entities['1'],
            entities['2'],
            entities['3'],
            entities['4'],
        );

        expect(entityList.getEntity(filter)).toEqual(expected.map((id) => entities[id]));
    });
});
