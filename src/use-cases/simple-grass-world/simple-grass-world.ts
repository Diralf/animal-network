import { Positionable } from '../../domain/property/point/positionable';
import { RawPoint } from '../../domain/property/point/raw-point';
import { Visualable } from '../../domain/property/sight/visualable';
import { World } from '../../domain/world/world';
import { InstanceTypes } from './entities/instance-types';
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
}
