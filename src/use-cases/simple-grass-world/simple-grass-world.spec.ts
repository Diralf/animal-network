import { RawPoint } from '../../domain/property/point/point-property';
import { Grass } from './entities/grass';
import { SimpleGrassWorld } from './simple-grass-world';
import { InstanceTypes } from './entities/instance-types';
import { PropertiesContainer } from '../../domain/property/container/properties-container';
import { AnimalProperties, Animal } from './entities/animal';
import { MovementDirections } from '../../domain/property/movement/movement-property';
import { FieldBuilder } from '../../clients/console/utils/field-builder';

const startWorld = (simpleGrassWorld: SimpleGrassWorld): void => {
    simpleGrassWorld.start({
        stringField: FieldBuilder.build(`
                _,_,_,_,_,_,_,_,_,_
                _,_,_,_,_,_,_,_,_,_
                _,_,_,_,_,_,_,_,_,_
                _,_,_,1,1,1,_,_,_,_
                _,_,1,_,_,_,1,_,_,_
                _,_,_,_,2,_,_,_,_,_
                _,_,_,_,_,_,_,_,_,_
                _,_,_,_,_,_,_,_,_,_
                _,_,_,_,_,_,_,_,_,_
                _,_,_,_,_,_,_,_,_,_
            `),
        availableEntities: {
            '1': (point: RawPoint) => new Grass({ position: point }),
            '2': (point: RawPoint) => new Animal({ position: point }),
        },
    });
};

describe('SimpleGrassWorld', () => {
    it('should generate world with 5 grass and one animal', () => {
        const simpleGrassWorld = new SimpleGrassWorld();
        startWorld(simpleGrassWorld);
        const { entityList } = simpleGrassWorld;
        const grassInstances = entityList.find({ tags: [InstanceTypes.GRASS] });
        const animalInstances = entityList.find({ tags: [InstanceTypes.ANIMAL] });

        expect(grassInstances).toHaveLength(5);
        expect(animalInstances).toHaveLength(1);
    });

    it('should generate all instances in the different places', () => {
        const simpleGrassWorld = new SimpleGrassWorld();
        startWorld(simpleGrassWorld);
        const { entityList } = simpleGrassWorld;
        const allInstances = entityList.getAll();

        expect(allInstances).toHaveLength(6);
        allInstances.forEach((instance) => {
            const position = instance.get.position();
            const result = entityList.find({ position });

            expect(result).toHaveLength(1);
        });
    });

    it('should build field from string and display whole field as string', () => {
        const simpleGrassWorld = new SimpleGrassWorld();
        startWorld(simpleGrassWorld);
        const { entityList } = simpleGrassWorld;
        const grassInstances = entityList.find({ tags: [InstanceTypes.GRASS] });
        const animalInstances = entityList.find({ tags: [InstanceTypes.ANIMAL] });
        const allInstances = entityList.getAll();

        expect(grassInstances).toHaveLength(5);
        expect(animalInstances).toHaveLength(1);
        expect(allInstances.map((instance) => instance.get.position())).toEqual([
            { x: 3, y: 3 },
            { x: 4, y: 3 },
            { x: 5, y: 3 },
            { x: 2, y: 4 },
            { x: 6, y: 4 },
            { x: 4, y: 5 },
        ]);
    });

    it('should get matrix of sight of animal', () => {
        const simpleGrassWorld = new SimpleGrassWorld();
        startWorld(simpleGrassWorld);
        const { entityList } = simpleGrassWorld;
        const [animal] = entityList.find({ tags: [InstanceTypes.ANIMAL] }) as Array<PropertiesContainer<AnimalProperties>>;

        const animalSight = animal.getProperty('sight');
        animalSight.update(entityList);
        expect(animalSight.asString()).toEqual(FieldBuilder.build(`
            _,1,1,1,_
            1,_,_,_,1
            _,_,2,_,_
            _,_,_,_,_
            _,_,_,_,_
        `));
    });

    it.each([
        {
            direction: MovementDirections.RIGHT,
            result: FieldBuilder.build(`
                1,1,1,_,_
                _,_,_,1,_
                _,_,2,_,_
                _,_,_,_,_
                _,_,_,_,_
            `),
        },
        {
            direction: MovementDirections.LEFT,
            result: FieldBuilder.build(`
                _,_,1,1,1
                _,1,_,_,_
                _,_,2,_,_
                _,_,_,_,_
                _,_,_,_,_
            `),
        },
        {
            direction: MovementDirections.UP,
            result: FieldBuilder.build(`
                _,_,_,_,_
                _,1,1,1,_
                1,_,2,_,1
                _,_,_,_,_
                _,_,_,_,_
            `),
        },
        {
            direction: MovementDirections.DOWN,
            result: FieldBuilder.build(`
                1,_,_,_,1
                _,_,_,_,_
                _,_,2,_,_
                _,_,_,_,_
                _,_,_,_,_
            `),
        },
    ])('should animal move $direction', ({ direction, result }) => {
        const simpleGrassWorld = new SimpleGrassWorld();
        startWorld(simpleGrassWorld);
        const { entityList } = simpleGrassWorld;
        const [animal] = entityList.find({ tags: [InstanceTypes.ANIMAL] }) as Array<PropertiesContainer<AnimalProperties>>;
        const animalSight = animal.getProperty('sight');
        const animalMovement = animal.getProperty('movement');

        animalMovement.move(direction);
        animalSight.update(entityList);

        expect(animalSight.asString()).toEqual(result);
    });
});
