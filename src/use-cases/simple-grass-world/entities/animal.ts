import {PropertiesValueTypes} from "../../../domain/property/utils/property-value.type";
import {BaseProperties, getBaseProperties} from "./base-properties";
import {PropertiesContainer} from "../../../domain/property/container/properties-container";
import {InstanceTypes} from "./instance-types";
import {SightProperty} from "../../../domain/property/sight/sight-property";
import {MovementProperty} from "../../../domain/property/movement/movement-property";

export interface AnimalProperties extends BaseProperties {
    sight: SightProperty;
    movement: MovementProperty;
}

export class Animal extends PropertiesContainer<AnimalProperties> {
    constructor(values: Pick<PropertiesValueTypes<AnimalProperties>, 'position'>) {
        super({
            ...getBaseProperties({
                position: values.position,
                tags: [InstanceTypes.ANIMAL],
                visual: 2,
            }),
            sight: new SightProperty({
                range: 2,
            }),
            movement: new MovementProperty(),
        });
    }
}
