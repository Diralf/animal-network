import { SimpleGrassWorld } from './simple-grass-world';
import { InstanceTypes } from './entities/instance-types';
import { PropertiesContainer } from '../../domain/property/container/properties-container';
import { AnimalProperties } from './entities/animal';
import { MovementDirections } from '../../domain/property/movement/movement-property';
import { FieldBuilder } from '../../clients/console/utils/field-builder';

describe('SimpleGrassWorld', () => {
    it('should generate world with 5 grass and one animal', () => {
        const simpleGrassWorld = new SimpleGrassWorld();
        simpleGrassWorld.start();
        const { entityList } = simpleGrassWorld;
        const grassInstances = entityList.find({ tags: [InstanceTypes.GRASS] });
        const animalInstances = entityList.find({ tags: [InstanceTypes.ANIMAL] });

        expect(grassInstances).toHaveLength(5);
        expect(animalInstances).toHaveLength(1);
    });

    it('should generate all instances in the different places', () => {
        const simpleGrassWorld = new SimpleGrassWorld();
        simpleGrassWorld.start();
        const { entityList } = simpleGrassWorld;
        const allInstances = entityList.getAll();

        expect(allInstances).toHaveLength(6);
        allInstances.forEach((instance) => {
            const position = instance.get.position();
            const result = entityList.find({ position });

            expect(result).toHaveLength(1);
        });
    });

    it('should get matrix of sight of animal', () => {
        const simpleGrassWorld = new SimpleGrassWorld();
        simpleGrassWorld.start();
        const { entityList } = simpleGrassWorld;
        const [animal] = entityList.find({ tags: [InstanceTypes.ANIMAL] }) as Array<PropertiesContainer<AnimalProperties>>;

        const animalSight = animal.getProperty('sight');
        animalSight.update(entityList);
        expect(animalSight.asString()).toEqual(''
            + '0,0,1,0,0\n'
            + '0,0,1,0,0\n'
            + '0,0,2,0,0\n'
            + '0,0,0,0,0\n'
            + '0,0,0,0,0');
    });

    it.each([
        {
            direction: MovementDirections.RIGHT,
            result: new FieldBuilder()
                .row('0,1,0,0,0')
                .row('0,1,0,0,0')
                .row('0,0,2,0,0')
                .row('0,0,0,0,0')
                .row('0,0,0,0,0')
                .join(),
        },
    ])('should animal move right', () => {
        const simpleGrassWorld = new SimpleGrassWorld();
        simpleGrassWorld.start();
        const { entityList } = simpleGrassWorld;
        const [animal] = entityList.find({ tags: [InstanceTypes.ANIMAL] }) as Array<PropertiesContainer<AnimalProperties>>;

        const animalSight = animal.getProperty('sight');
        animalSight.update(entityList);
        expect(animalSight.asString()).toEqual(''
            + '0,0,1,0,0\n'
            + '0,0,1,0,0\n'
            + '0,0,2,0,0\n'
            + '0,0,0,0,0\n'
            + '0,0,0,0,0');

        const animalMovement = animal.getProperty('movement');
        animalMovement.move(MovementDirections.RIGHT);

        animalSight.update(entityList);
        expect(animalSight.asString()).toEqual(''
            + '0,1,0,0,0\n'
            + '0,1,0,0,0\n'
            + '0,0,2,0,0\n'
            + '0,0,0,0,0\n'
            + '0,0,0,0,0');
    });
});
