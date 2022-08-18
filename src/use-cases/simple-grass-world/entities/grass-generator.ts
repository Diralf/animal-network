import { Positionable } from '../../../domain/property/point/positionable';
import { OnTick } from '../../../domain/time-thread/on-tick';
import { World } from '../../../domain/world/world';
import { Taggable } from '../types/taggable';
import { Grass } from './grass';
import { InstanceTypes } from './instance-types';

export class GrassGenerator implements OnTick {
    constructor(private rate: number, private maxGrassAtOnce: number = 100) {
    }

    public tick(world: World<Taggable & Positionable>, time: number): void {
        const grassInstances = world.getEntityList().find((instance) => instance.tags.includes(InstanceTypes.GRASS));
        if (grassInstances.length < this.maxGrassAtOnce && time % this.rate === 0) {
            let success = false;
            let attempt = 0;
            do {
                success = this.spawnGrass(world);
                attempt += 1;
            } while (!success && attempt < 5);
        }
    }

    private spawnGrass(world: World<Positionable>): boolean {
        const newPoint = {
            x: Math.floor(Math.random() * world.width),
            y: Math.floor(Math.random() * world.height),
        };
        const entitiesByPosition = world.getEntityList().find((instance) => instance.position.isEqualValue(newPoint));

        if (entitiesByPosition.length === 0) {
            world.addEntity(new Grass({ position: newPoint }));
            return true;
        }
        return false;
    }
}
