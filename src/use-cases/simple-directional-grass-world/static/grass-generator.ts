import { Component } from '../../../domain/components/component/component';
import { entityBuilder } from '../../../domain/components/entity-builder/entity-builder';
import { Positionable } from '../../../domain/property/point/positionable';
import { OnTick } from '../../../domain/time-thread/on-tick';
import { World } from '../../../domain/world/world';
import { Taggable } from '../types/taggable';
import { Grass } from '../entities/grass';
import { InstanceTypes } from '../types/instance-types';

interface Props {
    rate?: number;
    maxGrassAtOnce?: number;
}

export class GrassGeneratorComponent extends Component<GrassGeneratorComponent, Props>() implements OnTick {
    private initial = true;

    public tick(world: World<Taggable & Positionable>, time: number): void {
        const { rate = 1, maxGrassAtOnce = 100 } = this.props;
        const grassInstances = world.getEntityList().find((instance) => instance.component.tags.current.includes(InstanceTypes.GRASS));
        if (this.initial) {
            this.spawnMany(maxGrassAtOnce, world);
            this.initial = false;
        }
        if (grassInstances.length < maxGrassAtOnce && time % rate === 0) {
            let success = false;
            let attempt = 0;
            do {
                success = this.spawnGrass(world);
                attempt += 1;
            } while (!success && attempt < 5);
        }
    }

    private spawnMany(count: number, world: World<Positionable>) {
        for (let i = 0; i < count; i++) {
            this.spawnGrass(world);
        }
    }

    private spawnGrass(world: World<Positionable>): boolean {
        const newPoint = {
            x: Math.floor(Math.random() * world.width),
            y: Math.floor(Math.random() * world.height),
        };
        const entitiesByPosition = world.getEntityList().find((instance) => instance.component.position.isEqualValue(newPoint));

        if (entitiesByPosition.length === 0) {
            world.addEntity(Grass.build({ position: newPoint }));
            return true;
        }
        return false;
    }
}

export const GrassGenerator = entityBuilder({
    grassGenerator: GrassGeneratorComponent.build({ rate: 1, maxGrassAtOnce: 100 }),
});

export type GrassGenerator = ReturnType<typeof GrassGenerator.build>;
