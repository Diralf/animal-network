import { Component } from '../../components/component/component';
import { RawPoint } from '../point/raw-point';
import { rotateVector, angleOfVector } from '../utils/rotate-vector';

export enum DirectionTurn {
    TURN_LEFT = 'TURN_LEFT',
    TURN_RIGHT = 'TURN_RIGHT',
}

interface Options {
    initialDirection?: RawPoint;
}

export class DirectionProperty extends Component<Options> {
    private current: RawPoint;

    constructor(options: Options) {
        super(options);
        this.current = options.initialDirection ?? { x: 0, y: -1 };
    }

    turn(to: DirectionTurn) {
        let angle;
        switch (to) {
            case DirectionTurn.TURN_LEFT:
                angle = -90;
                break;
            case DirectionTurn.TURN_RIGHT:
                angle = 90;
                break;
            default:
                angle = 0;
        }
        const p = { ...this.current };

        this.current = rotateVector(p, angle);
    }

    getCurrent() {
        return this.current;
    }

    getAsAngle() {
        return angleOfVector(this.current);
    }
}
