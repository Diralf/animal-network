import {NumberProperty} from "../property/base/number-property";
import {PropertiesContainer} from "../property/base/properties-container";
import {PropertiesValueTypes} from "../property/utils/property-value.type";

export interface FieldProperties {
    width: NumberProperty;
    height: NumberProperty;
}

export class Field extends PropertiesContainer<FieldProperties> {
    constructor({ width, height }: PropertiesValueTypes<FieldProperties>) {
        super({
            width: new NumberProperty({
                min: 1,
                max: 100,
                current: width,
                defaultValue: 1,
            }),
            height: new NumberProperty({
                min: 1,
                max: 100,
                current: height,
                defaultValue: 1,
            }),
        });
    }
}
