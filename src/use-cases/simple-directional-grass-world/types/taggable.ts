import { Property } from '../../../domain/property/base/base-property';
import { InstanceTypes } from './instance-types';

export interface Taggable {
    readonly tags: Property<InstanceTypes[]>;
}
