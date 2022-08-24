import { PointProperty } from '../../../domain/property/point/point-property';
import { Positionable } from '../../../domain/property/point/positionable';
import { Visualable } from '../../../domain/property/sight/visualable';
import { InstanceTypes } from '../types/instance-types';
import { Taggable } from '../types/taggable';
import { AnimalOptions } from './animal';

export class Hole implements Positionable, Taggable, Visualable {
    public readonly tags = [InstanceTypes.HOLE];
    public readonly visual = 9;
    public position: PointProperty;

    constructor({ position }: AnimalOptions) {
        this.position = new PointProperty(position);
    }
}
