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
    private fieldOptions: FieldOptions = {
        stringField: '',
        availableEntities: {},
        staticEntities: [],
    };

    public start(fieldOptions: FieldOptions): void {
        this.fieldOptions = fieldOptions;
        const { stringField, availableEntities, staticEntities } = fieldOptions;
        const rows = stringField.split('\n');
        rows.forEach((row, rowIndex) => {
            const cells = row.split(',');
            cells.forEach((cell, cellIndex) => {
                const entityFactory = availableEntities[cell];
                if (entityFactory) {
                    const entityWithPosition = entityFactory({ x: cellIndex, y: rowIndex });
                    this.world.addEntity(entityWithPosition);
                }
            });
        });

        staticEntities.forEach((factory) => {
            this.world.addStatic(factory());
        });
    }

    public tick(): void {
        this.world.tick();
    }
}
