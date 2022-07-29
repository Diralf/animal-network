import {BaseProperty} from "../base/base-property";

export interface RawPoint {
    x: number;
    y: number;
}

export class PointProperty extends BaseProperty<RawPoint>{

    isEqual(other: BaseProperty<RawPoint>): boolean {
        return this.isEqualValue(other.current);
    }

    isEqualValue(otherValue: RawPoint): boolean {
        const { x: x1, y: y1 } = this.current;
        const { x: x2, y: y2 } = otherValue;
        return x1 === x2 && y1 === y2;
    }
}
