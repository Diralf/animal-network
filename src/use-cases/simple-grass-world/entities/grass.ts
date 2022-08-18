import { NumberProperty } from '../../../domain/property/number/number-property';
import { PointProperty } from '../../../domain/property/point/point-property';
import { Positionable } from '../../../domain/property/point/positionable';
import { RawPoint } from '../../../domain/property/point/raw-point';
import { Visualable } from '../../../domain/property/sight/visualable';
import { Taggable } from '../types/taggable';
import { InstanceTypes } from './instance-types';

export class Grass implements Positionable, Taggable, Visualable {
    public readonly tags = [InstanceTypes.GRASS];
    public readonly visual = 1;
    public position: PointProperty;
    public size: NumberProperty = new NumberProperty({ current: 1 });

    constructor({ position }: { position: RawPoint }) {
        this.position = new PointProperty(position);
    }
}
