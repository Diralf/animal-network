import { Component } from '../../components/component/component';
import { RawPoint } from '../point/raw-point';
import { rotateVector, angleOfVector } from '../utils/rotate-vector';

export enum DirectionTurn {
    TURN_LEFT = 'TURN_LEFT',
    TURN_RIGHT = 'TURN_RIGHT',
}

interface Props {
    initialDirection: RawPoint;
}

export class DirectionProperty extends Component<Props> {
    private current!: RawPoint;

    public onPropsInit(props: Props = { initialDirection: { x: 0, y: -1 } }): void {
        this.current = props.initialDirection;
    }

    public turn(to: DirectionTurn): void {
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

    public getCurrent(): RawPoint {
        return this.current;
    }

    public getAsAngle(): number {
        return angleOfVector(this.current);
    }
}
