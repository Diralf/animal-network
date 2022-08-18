import { EntityList } from '../../property-container-list/entity-list';
import { BaseProperty } from '../base/base-property';
import { PointProperty } from '../point/point-property';
import { RawPoint } from '../point/raw-point';
import { CollisionProperty } from './collision-property';

interface Entity {
    id: BaseProperty<number>;
    collision: CollisionProperty;
    position: PointProperty;
}

const getEntity = ({ id, point }: { id: number, point: RawPoint }): Entity => {
    const entity = {
        id: new BaseProperty(id),
        position: new PointProperty(point),
        collision: new CollisionProperty(jest.fn()),
    };
    entity.collision.owner.ref = entity;
    return entity;
};

const prepareContext = () => {
    const entity1 = getEntity({
        id: 1,
        point: {
            x: 0,
            y: 0,
        },
    });
    const entity2 = getEntity({
        id: 2,
        point: {
            x: 0,
            y: 0,
        },
    });
    const entity3 = getEntity({
        id: 3,
        point: {
            x: 1,
            y: 1,
        },
    });
    const entityList = new EntityList<Entity>();
    entityList.add(entity1, entity2, entity3);
    return {
        entity1,
        entity2,
        entity3,
        entityList,
    };
};

describe('CollisionProperty', () => {
    it('should get all instances with collision in the same cell', () => {
        const {
            entity1,
            entity2,
            entityList,
        } = prepareContext();

        const result = entity1.collision.check(entityList);
        expect(result.map((entity) => entity.id)).toEqual([entity2.id]);
    });

    it('should emit collision event for collided entities', () => {
        const {
            entity1,
            entity2,
            entity3,
            entityList,
        } = prepareContext();

        entity1.collision.collide(entityList);

        expect(entity1.collision['handler']).toHaveBeenCalledTimes(1);
        expect(entity1.collision['handler']).toHaveBeenCalledWith(expect.objectContaining({ other: [entity2] }));
        expect(entity2.collision['handler']).not.toHaveBeenCalled();
        expect(entity3.collision['handler']).not.toHaveBeenCalled();
    });
});
