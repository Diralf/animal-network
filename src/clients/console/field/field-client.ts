import {Field, FieldProperties} from "../../../domain/field/field";
import {PropertiesValueTypes} from "../../../domain/property/utils/property-value.type";

interface Options extends PropertiesValueTypes<FieldProperties> {
    emptyCell?: string;
}

export class FieldClient {

    private field: Field;
    private readonly emptyCell: string;

    constructor({ emptyCell, ...options}: Options) {
        this.field = new Field(options);
        this.emptyCell = emptyCell ?? ' ';
    }

    toStringField() {
        const width = this.field.getPropertyValue('width');
        const height = this.field.getPropertyValue('height');
        const row = ''.padEnd(width, this.emptyCell);
        return new Array(height).fill(row).join('\n');
    }
}
