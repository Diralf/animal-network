import { FieldBuilder } from '../../clients/console/utils/field-builder';
import { DirectionMovementValue } from '../../domain/property/direction-movement/direction-movement-property';
import { DirectionTurn } from '../../domain/property/direction/direction-property';
import { Positionable } from '../../domain/property/point/positionable';
import { RawPoint } from '../../domain/property/point/raw-point';
import { Animal } from './entities/animal';
import { Grass } from './entities/grass';
import { Hole } from './entities/hole';
import { GrassGenerator } from './static/grass-generator';
import { InstanceTypes } from './types/instance-types';
import { StaticAnimal } from './entities/static-animal';
import { SimpleGrassWorld, FieldOptions } from './simple-grass-world';

describe('Directional SimpleGrassWorld', () => {
    describe('static world', () => {
        const startWorld = (simpleGrassWorld: SimpleGrassWorld, options: Partial<FieldOptions> = {}): void => {
            simpleGrassWorld.start({
                stringField: FieldBuilder.build(`
                _,_,_,_,_,_,_,_,_,_
                _,_,_,_,_,_,_,_,_,_
                _,_,_,_,_,_,_,_,_,_
                _,_,_,3,3,3,_,_,_,_
                _,_,3,_,_,_,3,_,_,_
                _,_,_,_,6,_,_,_,_,_
                _,_,_,_,_,_,_,_,_,_
                _,_,_,_,_,_,_,_,_,_
                _,_,_,_,_,_,_,_,_,_
                _,_,_,_,_,_,_,_,_,_
            `),
                availableEntities: {
                    '3': (point: RawPoint) => new Grass({ position: point }),
                    '6': (point: RawPoint) => new Animal({ position: point, size: 1, metabolizeSpeed: 0 }),
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
                _,_,_,_,_
                _,_,_,_,_
                _,_,_,_,_
                _,3,3,3,_
                3,_,_,_,3
                _,_,6,_,_
            `));
        });

        it.each([
            {
                direction: DirectionMovementValue.FORWARD,
                result: FieldBuilder.build(`
                    _,_,_,_,_
                    _,_,_,_,_
                    _,_,_,_,_
                    _,_,_,_,_
                    _,3,3,3,_
                    3,_,6,_,3
                `),
            },
            {
                direction: DirectionMovementValue.BACK,
                result: FieldBuilder.build(`
                    _,_,_,_,_
                    _,_,_,_,_
                    _,3,3,3,_
                    3,_,_,_,3
                    _,_,_,_,_
                    _,_,6,_,_
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

        it.each([
            {
                direction: DirectionTurn.TURN_LEFT,
                result: FieldBuilder.build(`
                    _,_,_,_,_
                    _,_,_,_,_
                    _,_,_,_,_
                    _,_,_,3,_
                    _,_,_,_,3
                    _,_,6,_,3
                `),
            },
            {
                direction: DirectionTurn.TURN_RIGHT,
                result: FieldBuilder.build(`
                    _,_,_,_,_
                    _,_,_,_,_
                    _,_,_,_,_
                    _,3,_,_,_
                    3,_,_,_,_
                    3,_,6,_,_
                `),
            },
        ])('should animal turn $direction', ({ direction, result }) => {
            const simpleGrassWorld = new SimpleGrassWorld();
            startWorld(simpleGrassWorld);
            const { world } = simpleGrassWorld;
            const [animal] = simpleGrassWorld.findByTag(InstanceTypes.ANIMAL) as Animal[];

            animal.direction.turn(direction);
            animal.sight.update(world.getEntityList());

            expect(animal.sight.asString()).toEqual(result);
        });

        it('should eat grass', () => {
            const simpleGrassWorld = new SimpleGrassWorld();
            startWorld(simpleGrassWorld);
            const [animal] = simpleGrassWorld.findByTag(InstanceTypes.ANIMAL) as Animal[];

            simpleGrassWorld.tick();
            expect(animal.sight.asString()).toEqual(FieldBuilder.build(`
                _,_,_,_,_
                _,_,_,_,_
                _,_,_,_,_
                _,3,3,3,_
                3,_,_,_,3
                _,_,6,_,_
            `));
            expect(animal.size.current).toEqual(1);

            animal.movement.move(DirectionMovementValue.FORWARD);
            simpleGrassWorld.tick();
            animal.movement.move(DirectionMovementValue.FORWARD);
            simpleGrassWorld.tick();
            animal.movement.move(DirectionMovementValue.BACK);
            simpleGrassWorld.tick();

            expect(animal.sight.asString()).toEqual(FieldBuilder.build(`
                _,_,_,_,_
                _,_,_,_,_
                _,_,_,_,_
                _,_,_,_,_
                _,3,_,3,_
                3,_,6,_,3
            `));
            expect(animal.size.current).toEqual(11);
        });

        it('should eat grass by static animal with brain', () => {
            const simpleGrassWorld = new SimpleGrassWorld();
            startWorld(
                simpleGrassWorld,
                {
                    availableEntities: {
                        '3': (point: RawPoint) => new Grass({ position: point }),
                        '6': (point: RawPoint) => new StaticAnimal({ position: point, size: 1, metabolizeSpeed: 0 }),
                    },
                },
            );
            const [animal] = simpleGrassWorld.findByTag(InstanceTypes.ANIMAL) as Animal[];

            simpleGrassWorld.tick();
            expect(animal.sight.asString()).toEqual(FieldBuilder.build(`
                _,_,_,_,_
                _,_,_,_,_
                _,_,_,_,_
                _,3,3,3,_
                3,_,_,_,3
                _,_,6,_,_
            `));
            expect(animal.size.current).toEqual(1);

            simpleGrassWorld.tick();
            simpleGrassWorld.tick();
            simpleGrassWorld.tick();

            expect(animal.sight.asString()).toEqual(FieldBuilder.build(`
                _,_,_,_,_
                _,_,_,_,_
                _,_,_,_,_
                _,_,_,_,_
                _,_,_,_,_
                _,_,6,_,_
            `));
            expect(animal.size.current).toEqual(11);
        });

        it('should dead at hole', () => {
            const simpleGrassWorld = new SimpleGrassWorld();
            startWorld(
                simpleGrassWorld,
                {
                    stringField: FieldBuilder.build(`
                        9,9,9,9,9
                        9,_,_,_,9
                        9,_,6,_,9
                        9,_,_,_,9
                        9,9,9,9,9
                    `),
                    availableEntities: {
                        '3': (point: RawPoint) => new Grass({ position: point }),
                        '6': (point: RawPoint) => new StaticAnimal({ position: point }),
                        '9': (point: RawPoint) => new Hole({ position: point }),
                    },
                },
            );
            const [animal] = simpleGrassWorld.findByTag(InstanceTypes.ANIMAL) as Animal[];

            simpleGrassWorld.tick();
            expect(animal.sight.asString()).toEqual(FieldBuilder.build(`
                _,_,_,_,_
                _,_,_,_,_
                _,_,_,_,_
                9,9,9,9,9
                9,_,_,_,9
                9,_,6,_,9
            `));

            simpleGrassWorld.tick();
            simpleGrassWorld.tick();
            simpleGrassWorld.tick();

            expect(animal.sight.asString()).toEqual(FieldBuilder.build(`
                _,_,_,_,_
                _,_,_,_,_
                _,_,_,_,_
                _,_,_,_,_
                _,_,_,_,_
                9,9,9,9,9
            `));
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
                    '3': (point: RawPoint) => new Grass({ position: point }),
                },
                staticEntities: [
                    () => new GrassGenerator(2),
                ],
                ...options,
            });
        };

        it('should generate randomly', () => {
            const simpleGrassWorld = new SimpleGrassWorld();
            startWorld(simpleGrassWorld);
            const { world } = simpleGrassWorld;

            for (let i = 0; i < 6; i++) {
                simpleGrassWorld.tick();
            }
            const grassInstances = simpleGrassWorld.findByTag(InstanceTypes.GRASS);
            console.log(world.print(world.getEntityList()));
            expect(grassInstances.length).toBeGreaterThan(10);
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

            expect(result.toString()).toEqual([0, 2, 2, 0, 1, 1].toString());
        });

        it('should generate one by one with animal', () => {
            const simpleGrassWorld = new SimpleGrassWorld();
            simpleGrassWorld.startOneByOne({
                width: 20,
                height: 20,
                maxGrass: 3,
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

            console.log(world.print(world.getEntityList()));

            expect(result.toString()).toEqual([0, 1, 1, 0, 1, 1].toString());
        });
    });

    describe('getEntitiesByRect', () => {
        it('should spawn entities by rect', () => {
            const simpleGrassWorld = new SimpleGrassWorld();
            const rect = simpleGrassWorld.getEntitiesByRect(
                { x: 1, y: 2 },
                { x: 4, y: 4 },
                (position) => new Hole({ position }),
            );
            simpleGrassWorld.world.width = 6;
            simpleGrassWorld.world.height = 6;
            simpleGrassWorld.world.addEntity(...rect);

            expect(simpleGrassWorld.world.print(simpleGrassWorld.world.getEntityList())).toEqual(FieldBuilder.build(`
                _,_,_,_,_,_
                _,_,_,_,_,_
                _,9,9,9,9,_
                _,9,_,_,9,_
                _,9,9,9,9,_
                _,_,_,_,_,_
            `));
        });
    });
});
