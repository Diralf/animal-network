import { InstanceTypes } from '../entities/instance-types';

export interface Taggable {
    readonly tags: InstanceTypes[];
}
