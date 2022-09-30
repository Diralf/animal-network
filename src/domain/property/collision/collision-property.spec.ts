import { Entity } from '../../components/components-owner/components-owner';
import { World } from '../../world/world';
import { NumberProperty } from '../number/number-property';
import { PointProperty } from '../point/point-property';
import { RawPoint } from '../point/raw-point';
import { CollisionProperty } from './collision-property';

interface Components {
    id: NumberProperty;
    collision: CollisionProperty;
    position: PointProperty;
}

const getEntity = ({ id, point }: { id: number, point: RawPoint }): Entity<Components> => {
    const entity: Entity<Components> = {
        component: {
            id: new NumberProperty({ current: id }),
            position: new PointProperty(point),
            collision: new CollisionProperty({ handler: jest.fn() }),
        }
    };
    entity.component.collision.owner = entity.component;
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
    const world = new World<Components>();
    world.addEntity(entity1, entity2, entity3);
    return {
        entity1,
        entity2,
        entity3,
        world,
    };
};

describe('CollisionProperty', () => {
    it('should get all instances with collision in the same cell', () => {
        const {
            entity1,
            entity2,
            world,
        } = prepareContext();

        const result = entity1.component.collision.check(world.getEntityList());
        expect(result.map((entity) => entity.component.id)).toEqual([entity2.component.id]);
    });

    it('should emit collision event for collided entities', () => {
        const {
            entity1,
            entity2,
            entity3,
            world,
        } = prepareContext();

        entity1.component.collision.collide(world);

        expect(entity1.component.collision.getProps().handler).toHaveBeenCalledTimes(1);
        expect(entity1.component.collision.getProps().handler).toHaveBeenCalledWith(expect.objectContaining({ other: [entity2] }));
        expect(entity2.component.collision.getProps().handler).not.toHaveBeenCalled();
        expect(entity3.component.collision.getProps().handler).not.toHaveBeenCalled();
    });
});
