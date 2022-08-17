import { PropertiesContainer } from '../../domain/property/container/properties-container';
import { RawPoint } from '../../domain/property/point/raw-point';
import { World } from '../../domain/world/world';
import { BaseProperties } from './entities/base-properties';

export interface FieldOptions {
    stringField: string;
    availableEntities: Record<string, (point: RawPoint) => PropertiesContainer<BaseProperties>>;
    staticEntities: Array<() => PropertiesContainer<{}>>;
}

export class SimpleGrassWorld {
    public world: World<BaseProperties, {}> = new World();

    public start({ stringField, availableEntities, staticEntities }: FieldOptions): void {
        this.world.registerStatic(staticEntities);
        this.world.registerEntities(new Map(Object.entries(availableEntities)));
        this.world.buildWorldFromString(stringField);
    }

    public tick(): void {
        this.world.tick();
    }
}
