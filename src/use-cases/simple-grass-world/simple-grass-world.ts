import { PropertyContainerList } from '../../domain/property-container-list/property-container-list';
import { PropertiesContainer } from '../../domain/property/container/properties-container';
import { RawPoint } from '../../domain/property/point/point-property';
import { BaseProperties } from './entities/base-properties';

interface FieldOptions {
    stringField: string;
    availableEntities: Record<string, (point: RawPoint) => PropertiesContainer<BaseProperties>>;
}

export class SimpleGrassWorld {
    public entityList: PropertyContainerList<BaseProperties> = new PropertyContainerList();

    public start(fieldOptions: FieldOptions): void {
        const { stringField, availableEntities } = fieldOptions;
        const rows = stringField.split('\n');
        rows.forEach((row, rowIndex) => {
            const cells = row.split(',');
            cells.forEach((cell, cellIndex) => {
                const entityFactory = availableEntities[cell];
                if (entityFactory) {
                    const entityWithPosition = entityFactory({ x: cellIndex, y: rowIndex });
                    this.entityList.add(entityWithPosition);
                }
            });
        });
    }
}
