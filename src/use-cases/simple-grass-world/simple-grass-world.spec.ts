import { FieldBuilder } from '../../clients/console/utils/field-builder';
import { MovementDirections } from '../../domain/property/movement/movement-property';
import { Positionable } from '../../domain/property/point/positionable';
import { RawPoint } from '../../domain/property/point/raw-point';
import { Animal } from './entities/animal';
import { Grass } from './entities/grass';
import { GrassGenerator } from './entities/grass-generator';
import { InstanceTypes } from './entities/instance-types';
import { StaticAnimal } from './entities/static-animal';
import { SimpleGrassWorld, FieldOptions } from './simple-grass-world';

describe('SimpleGrassWorld', () => {
    describe('static world', () => {
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
                staticEntities: [],
                ...options,
            });
        };

        it('should generate world with 5 grass and one animal', () => {
            const simpleGrassWorld = new SimpleGrassWorld();
            startWorld(simpleGrassWorld);
            const grassInstances = simpleGrassWorld.findByTag(InstanceTypes.GRASS);
            const animalInstances = simpleGrassWorld.findByTag(InstanceTypes.ANIMAL);

            expect(grassInstances).toHaveLength(5);
            expect(animalInstances).toHaveLength(1);
        });

        it('should generate all instances in the different places', () => {
            const simpleGrassWorld = new SimpleGrassWorld();
            startWorld(simpleGrassWorld);
            const { world } = simpleGrassWorld;
            const allInstances = world.getEntityList().getAll() as Positionable[];

            expect(allInstances).toHaveLength(6);
            allInstances.forEach((instance) => {
                const position = instance.position.current;
                const result = world.getEntityList().find(
                    (positionableInstance) => positionableInstance.position.isEqualValue(position),
                );

                expect(result).toHaveLength(1);
            });
        });

        it('should build field from string and display whole field as string', () => {
            const simpleGrassWorld = new SimpleGrassWorld();
            startWorld(simpleGrassWorld);
            const { world } = simpleGrassWorld;
            const grassInstances = simpleGrassWorld.findByTag(InstanceTypes.GRASS);
            const animalInstances = simpleGrassWorld.findByTag(InstanceTypes.ANIMAL);
            const allInstances = world.getEntityList().getAll() as Positionable[];

            expect(grassInstances).toHaveLength(5);
            expect(animalInstances).toHaveLength(1);
            expect(allInstances.map((instance) => instance.position.current)).toEqual([
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
            const [animal] = simpleGrassWorld.findByTag(InstanceTypes.ANIMAL) as Animal[];

            const animalSight = animal.sight;
            animalSight.update(world.getEntityList());
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
            const [animal] = simpleGrassWorld.findByTag(InstanceTypes.ANIMAL) as Animal[];

            animal.movement.move(direction);
            animal.sight.update(world.getEntityList());

            expect(animal.sight.asString()).toEqual(result);
        });

        it('should eat grass', () => {
            const simpleGrassWorld = new SimpleGrassWorld();
            startWorld(simpleGrassWorld);
            const [animal] = simpleGrassWorld.findByTag(InstanceTypes.ANIMAL) as Animal[];

            simpleGrassWorld.tick();
            expect(animal.sight.asString()).toEqual(FieldBuilder.build(`
                _,1,1,1,_
                1,_,_,_,1
                _,_,2,_,_
                _,_,_,_,_
                _,_,_,_,_
            `));
            expect(animal.size.current).toEqual(1);

            animal.movement.move(MovementDirections.UP);
            simpleGrassWorld.tick();
            animal.movement.move(MovementDirections.UP);
            simpleGrassWorld.tick();
            animal.movement.move(MovementDirections.UP);
            simpleGrassWorld.tick();

            expect(animal.sight.asString()).toEqual(FieldBuilder.build(`
                _,_,_,_,_
                _,_,_,_,_
                _,_,2,_,_
                _,1,_,1,_
                1,_,_,_,1
            `));
            expect(animal.size.current).toEqual(2);
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
            const [animal] = simpleGrassWorld.findByTag(InstanceTypes.ANIMAL) as Animal[];

            simpleGrassWorld.tick();
            expect(animal.sight.asString()).toEqual(FieldBuilder.build(`
                _,1,1,1,_
                1,_,_,_,1
                _,_,2,_,_
                _,_,_,_,_
                _,_,_,_,_
            `));
            expect(animal.size.current).toEqual(1);

            simpleGrassWorld.tick();
            simpleGrassWorld.tick();
            simpleGrassWorld.tick();

            expect(animal.sight.asString()).toEqual(FieldBuilder.build(`
                _,_,_,_,_
                _,_,_,_,_
                _,_,2,_,_
                _,1,_,1,_
                1,_,_,_,1
            `));
            expect(animal.size.current).toEqual(2);
        });
    });

    describe('random grass generation', () => {
        const startWorld = (simpleGrassWorld: SimpleGrassWorld, options: Partial<FieldOptions> = {}): void => {
            simpleGrassWorld.start({
                stringField: FieldBuilder.build(`
                    _,_,_,_,_,_,_,_,_,_
                    _,_,_,_,_,_,_,_,_,_
                    _,_,_,_,_,_,_,_,_,_
                    _,_,_,_,_,_,_,_,_,_
                    _,_,_,_,_,_,_,_,_,_
                    _,_,_,_,_,_,_,_,_,_
                    _,_,_,_,_,_,_,_,_,_
                    _,_,_,_,_,_,_,_,_,_
                    _,_,_,_,_,_,_,_,_,_
                    _,_,_,_,_,_,_,_,_,_
                `),
                availableEntities: {
                    '1': (point: RawPoint) => new Grass({ position: point }),
                },
                staticEntities: [
                    () => new GrassGenerator(2),
                ],
                ...options,
            });
        };

        it('should generate world with and grass each two steps', () => {
            const simpleGrassWorld = new SimpleGrassWorld();
            startWorld(simpleGrassWorld);
            const getGrassInstances = () => simpleGrassWorld.findByTag(InstanceTypes.GRASS) as Grass[];
            const result = [];

            for (let i = 0; i < 6; i++) {
                result.push(getGrassInstances().length);
                simpleGrassWorld.tick();
            }

            expect(result).toEqual([0, 1, 1, 2, 2, 3]);
        });

        it('should generate randomly', () => {
            const simpleGrassWorld = new SimpleGrassWorld();
            startWorld(simpleGrassWorld);
            const { world } = simpleGrassWorld;

            for (let i = 0; i < 6; i++) {
                simpleGrassWorld.tick();
            }
            const grassInstances = simpleGrassWorld.findByTag(InstanceTypes.GRASS);
            console.log(world.print(world.getEntityList()));
            expect(grassInstances).toHaveLength(3);
            grassInstances.forEach((instance) => {
                const position = instance.position.current;
                const result = world.getEntityList().find((inst) => inst.position.isEqualValue(position));

                expect(result).toHaveLength(1);
            });
        });

        it('should generate no more than 1 at once', () => {
            const simpleGrassWorld = new SimpleGrassWorld();
            startWorld(simpleGrassWorld, {
                staticEntities: [
                    () => new GrassGenerator(3, 1),
                ],
            });
            const { world } = simpleGrassWorld;
            const getGrassInstances = () => simpleGrassWorld.findByTag(InstanceTypes.GRASS);
            const result = [];

            for (let i = 0; i < 6; i++) {
                if (i === 3) {
                    const grass = getGrassInstances();
                    world.getEntityList().remove(...grass);
                }
                result.push(getGrassInstances().length);
                simpleGrassWorld.tick();
            }

            expect(result.toString()).toEqual([0, 1, 1, 0, 1, 1].toString());
        });
    });
});
