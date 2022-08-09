import { PropertyContainerList } from '../../property-container-list/property-container-list';
import { BaseProperty } from '../base/base-property';
import { PropertiesContainer } from '../container/properties-container';
import { PointProperty } from '../point/point-property';
import { RawPoint } from '../point/raw-point';
import { CollisionProperty } from './collision-property';

interface Entity {
    id: BaseProperty<number>;
    collision: CollisionProperty;
    position: PointProperty;
}

const getPropertiesContainer = ({ id, point }: { id: number, point: RawPoint }): PropertiesContainer<Entity> => new PropertiesContainer({
    id: new BaseProperty(id),
    position: new PointProperty(point),
    collision: new CollisionProperty(jest.fn()),
});

const prepareContext = () => {
    const entity1 = getPropertiesContainer({
        id: 1,
        point: {
            x: 0,
            y: 0,
        },
    });
    const entity2 = getPropertiesContainer({
        id: 2,
        point: {
            x: 0,
            y: 0,
        },
    });
    const entity3 = getPropertiesContainer({
        id: 3,
        point: {
            x: 1,
            y: 1,
        },
    });
    const entityList = new PropertyContainerList<Entity>();
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

        const result = entity1.getProperty('collision').check(entityList) as Array<PropertiesContainer<Entity>>;
        expect(result.map((entity) => entity.get.id())).toEqual([entity2.get.id()]);
    });

    it('should emit collision event for collided entities', () => {
        const {
            entity1,
            entity2,
            entity3,
            entityList,
        } = prepareContext();

        entity1.getProperty('collision').collide(entityList);

        expect(entity1.get.collision()).toHaveBeenCalledTimes(1);
        expect(entity1.get.collision()).toHaveBeenCalledWith(expect.objectContaining({ other: [entity2] }));
        expect(entity2.get.collision()).not.toHaveBeenCalled();
        expect(entity3.get.collision()).not.toHaveBeenCalled();
    });
});
