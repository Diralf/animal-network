import { Property } from '../base/base-property';
import { RawPoint } from './raw-point';

export class PointProperty extends Property<RawPoint> {
    onPropsInit(props: RawPoint = { x: 0, y: 0 }) {
        super.onPropsInit(props);
    }

    public isEqualValue(otherValue: RawPoint): boolean {
        const { x: x1, y: y1 } = this.current;
        const { x: x2, y: y2 } = otherValue;
        return x1 === x2 && y1 === y2;
    }
}
