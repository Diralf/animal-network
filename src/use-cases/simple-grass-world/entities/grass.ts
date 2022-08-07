import { BaseProperties, getBaseProperties } from './base-properties';
import { PropertiesValueTypes } from '../../../domain/property/utils/property-value.type';
import { PropertiesContainer } from '../../../domain/property/container/properties-container';
import { InstanceTypes } from './instance-types';

export class Grass extends PropertiesContainer<BaseProperties> {
    constructor(values: Pick<PropertiesValueTypes<BaseProperties>, 'position'>) {
        super(getBaseProperties({
            position: values.position,
            tags: [InstanceTypes.GRASS],
            visual: 1,
        }));
    }
}
