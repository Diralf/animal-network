import { PropertiesContainer } from '../../../domain/property/container/properties-container';
import { TimeThreadListener } from '../../../domain/time-thread/time-thread-listener';
import { World } from '../../../domain/world/world';
import { Grass } from './grass';

export class GrassGenerator extends PropertiesContainer<{}> implements TimeThreadListener {
    constructor() {
        super({});
    }

    public tick(world: World, time: number): void {
        super.tick(world, time);
        if (time % 2 === 0) {
            world.addEntity(new Grass({ position: { x: 0, y: 0 } }));
        }
    }
}
