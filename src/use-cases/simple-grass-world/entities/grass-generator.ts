import { PropertiesContainer } from '../../../domain/property/container/properties-container';
import { TimeThreadListener } from '../../../domain/time-thread/time-thread-listener';
import { World } from '../../../domain/world/world';
import { Grass } from './grass';
import { InstanceTypes } from './instance-types';

export class GrassGenerator extends PropertiesContainer<{}> implements TimeThreadListener {
    constructor(private rate: number, private maxGrassAtOnce: number = 100) {
        super({});
    }

    public tick(world: World, time: number): void {
        super.tick(world, time);
        const grassInstances = world.getEntityList().find({ tags: [InstanceTypes.GRASS] });
        if (grassInstances.length < this.maxGrassAtOnce
            && time % this.rate === 0) {
            let success = false;
            let attempt = 0;
            do {
                success = this.spawnGrass(world);
                attempt += 1;
            } while (!success && attempt < 5);
        }
    }

    private spawnGrass(world: World): boolean {
        const newPoint = {
            x: Math.floor(Math.random() * world.width),
            y: Math.floor(Math.random() * world.height),
        };
        const entitiesByPosition = world.getEntityList().find({ position: newPoint });

        if (entitiesByPosition.length === 0) {
            world.addEntity(new Grass({ position: newPoint }));
            return true;
        }
        return false;
    }
}
