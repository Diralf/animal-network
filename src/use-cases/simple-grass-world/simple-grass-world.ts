import { PropertiesContainer } from '../../domain/property/container/properties-container';
import { RawPoint } from '../../domain/property/point/raw-point';
import { TimeThread } from '../../domain/time-thread/time-thread';
import { World } from '../../domain/world/world';
import { BaseProperties } from './entities/base-properties';

export interface FieldOptions {
    stringField: string;
    availableEntities: Record<string, (point: RawPoint) => PropertiesContainer<BaseProperties>>;
}

export class SimpleGrassWorld {
    public world: World = new World();
    public timeThread = new TimeThread();

    public start(fieldOptions: FieldOptions): void {
        const { stringField, availableEntities } = fieldOptions;
        const rows = stringField.split('\n');
        rows.forEach((row, rowIndex) => {
            const cells = row.split(',');
            cells.forEach((cell, cellIndex) => {
                const entityFactory = availableEntities[cell];
                if (entityFactory) {
                    const entityWithPosition = entityFactory({ x: cellIndex, y: rowIndex });
                    this.world.entityList.add(entityWithPosition);
                    this.timeThread.addListener(entityWithPosition);
                }
            });
        });
    }

    public tick(): void {
        this.timeThread.tick(this.world);
    }
}
