import { Positionable } from '../../domain/property/point/positionable';
import { RawPoint } from '../../domain/property/point/raw-point';
import { Visualable } from '../../domain/property/sight/visualable';
import { World } from '../../domain/world/world';
import { Hole } from './entities/hole';
import { GrassGenerator } from './static/grass-generator';
import { InstanceTypes } from './types/instance-types';
import { NeuralAnimal } from './entities/neural-animal';
import { Taggable } from './types/taggable';

type SimpleGrassWorldEntityTypes = Positionable & Taggable & Visualable;

export interface FieldOptions {
    stringField: string;
    availableEntities: Record<string, (point: RawPoint) => SimpleGrassWorldEntityTypes>;
    staticEntities: Array<() => unknown>;
}

export class SimpleGrassWorld {
    public world: World<SimpleGrassWorldEntityTypes> = new World();

    public start({ stringField, availableEntities, staticEntities }: FieldOptions): void {
        this.world.registerStatic(staticEntities);
        this.world.registerEntities(new Map(Object.entries(availableEntities)));
        this.world.buildWorldFromString(stringField);
    }

    public tick(): void {
        this.world.tick();
    }

    public findByTag(tag: InstanceTypes): SimpleGrassWorldEntityTypes[] {
        return this.world.getEntityList().find((instance) => instance.tags.includes(tag));
    }

    startOneByOne(param: { width: number; height: number, maxGrass: number }) {
        this.world.addStatic(new GrassGenerator(1, param.maxGrass));
        this.world.addEntity(new NeuralAnimal({
            position: {
                x: Math.floor(param.width / 2),
                y: Math.floor(param.height / 2),
            },
            sightRange: 7,
        }));
        this.world.width = param.width;
        this.world.height = param.height;
        this.world.addEntity(
            ...this.getEntitiesByRect(
                { x: 0, y: 0 },
                { x: param.width - 1, y: param.height - 1 },
                (position) => new Hole({ position }),
            ),
        );
    }

    public getEntitiesByRect(
        start: RawPoint,
        end: RawPoint,
        factory: (position: RawPoint) => SimpleGrassWorldEntityTypes,
    ): SimpleGrassWorldEntityTypes[] {
        const entities = [];

        for (let i = start.y; i <= end.y; i++) {
            for (let j = start.x; j <= end.x; j++) {
                if (i === start.y || i === end.y || j === start.x || j === end.x) {
                    entities.push(factory({ x: j, y: i }));
                }
            }
        }

        return entities;
    }
}
