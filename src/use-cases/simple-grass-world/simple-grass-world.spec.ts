import { FieldBuilder } from '../../clients/console/utils/field-builder';
import { PropertiesContainer } from '../../domain/property/container/properties-container';
import { MovementDirections } from '../../domain/property/movement/movement-property';
import { RawPoint } from '../../domain/property/point/raw-point';
import { AnimalProperties, Animal } from './entities/animal';
import { Grass } from './entities/grass';
import { InstanceTypes } from './entities/instance-types';
import { StaticAnimal } from './entities/static-animal';
import { SimpleGrassWorld, FieldOptions } from './simple-grass-world';

const startWorld = (simpleGrassWorld: SimpleGrassWorld, options: Partial<FieldOptions> = {}): void => {
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
        ...options,
    });
};

describe('SimpleGrassWorld', () => {
    it('should generate world with 5 grass and one animal', () => {
        const simpleGrassWorld = new SimpleGrassWorld();
        startWorld(simpleGrassWorld);
        const { world } = simpleGrassWorld;
        const grassInstances = world.entityList.find({ tags: [InstanceTypes.GRASS] });
        const animalInstances = world.entityList.find({ tags: [InstanceTypes.ANIMAL] });

        expect(grassInstances).toHaveLength(5);
        expect(animalInstances).toHaveLength(1);
    });

    it('should generate all instances in the different places', () => {
        const simpleGrassWorld = new SimpleGrassWorld();
        startWorld(simpleGrassWorld);
        const { world } = simpleGrassWorld;
        const allInstances = world.entityList.getAll();

        expect(allInstances).toHaveLength(6);
        allInstances.forEach((instance) => {
            const position = instance.get.position();
            const result = world.entityList.find({ position });

            expect(result).toHaveLength(1);
        });
    });

    it('should build field from string and display whole field as string', () => {
        const simpleGrassWorld = new SimpleGrassWorld();
        startWorld(simpleGrassWorld);
        const { world } = simpleGrassWorld;
        const grassInstances = world.entityList.find({ tags: [InstanceTypes.GRASS] });
        const animalInstances = world.entityList.find({ tags: [InstanceTypes.ANIMAL] });
        const allInstances = world.entityList.getAll();

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
        const { world } = simpleGrassWorld;
        const [animal] = world.entityList.find({ tags: [InstanceTypes.ANIMAL] }) as Array<PropertiesContainer<AnimalProperties>>;

        const animalSight = animal.getProperty('sight');
        animalSight.update(world.entityList);
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
        const { world } = simpleGrassWorld;
        const [animal] = world.entityList.find({ tags: [InstanceTypes.ANIMAL] }) as Array<PropertiesContainer<AnimalProperties>>;
        const animalSight = animal.getProperty('sight');
        const animalMovement = animal.getProperty('movement');

        animalMovement.move(direction);
        animalSight.update(world.entityList);

        expect(animalSight.asString()).toEqual(result);
    });

    it('should eat grass', () => {
        const simpleGrassWorld = new SimpleGrassWorld();
        startWorld(simpleGrassWorld);
        const { world } = simpleGrassWorld;
        const [animal] = world.entityList.find({ tags: [InstanceTypes.ANIMAL] }) as Array<PropertiesContainer<AnimalProperties>>;
        const animalSight = animal.getProperty('sight');
        const animalMovement = animal.getProperty('movement');

        simpleGrassWorld.tick();
        expect(animalSight.asString()).toEqual(FieldBuilder.build(`
            _,1,1,1,_
            1,_,_,_,1
            _,_,2,_,_
            _,_,_,_,_
            _,_,_,_,_
        `));
        expect(animal.get.size()).toEqual(1);

        animalMovement.move(MovementDirections.UP);
        simpleGrassWorld.tick();
        animalMovement.move(MovementDirections.UP);
        simpleGrassWorld.tick();
        animalMovement.move(MovementDirections.UP);
        simpleGrassWorld.tick();

        expect(animalSight.asString()).toEqual(FieldBuilder.build(`
            _,_,_,_,_
            _,_,_,_,_
            _,_,2,_,_
            _,1,_,1,_
            1,_,_,_,1
        `));
        expect(animal.get.size()).toEqual(2);
    });

    it('should eat grass by static animal with brain', () => {
        const simpleGrassWorld = new SimpleGrassWorld();
        startWorld(
            simpleGrassWorld,
            {
                availableEntities: {
                    '1': (point: RawPoint) => new Grass({ position: point }),
                    '2': (point: RawPoint) => new StaticAnimal({ position: point }),
                },
            },
        );
        const { world } = simpleGrassWorld;
        const [animal] = world.entityList.find({ tags: [InstanceTypes.ANIMAL] }) as Array<PropertiesContainer<AnimalProperties>>;
        const animalSight = animal.getProperty('sight');

        simpleGrassWorld.tick();
        expect(animalSight.asString()).toEqual(FieldBuilder.build(`
            _,1,1,1,_
            1,_,_,_,1
            _,_,2,_,_
            _,_,_,_,_
            _,_,_,_,_
        `));
        expect(animal.get.size()).toEqual(1);

        simpleGrassWorld.tick();
        simpleGrassWorld.tick();
        simpleGrassWorld.tick();

        expect(animalSight.asString()).toEqual(FieldBuilder.build(`
            _,_,_,_,_
            _,_,_,_,_
            _,_,2,_,_
            _,1,_,1,_
            1,_,_,_,1
        `));
        expect(animal.get.size()).toEqual(2);
    });
});
