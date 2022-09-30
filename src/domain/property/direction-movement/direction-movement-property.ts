import { Component } from '../../components/component/component';
import { Directional } from '../direction/directional';
import { Positionable } from '../point/positionable';
import { Publisher } from '../utils/observer';

export enum DirectionMovementValue {
    FORWARD = 'FORWARD',
    BACK = 'BACK',
}

type Owner = Directional & Positionable;

export class DirectionMovementProperty extends Component<DirectionMovementProperty, void, Owner>() {
    public publisher = new Publisher<[DirectionMovementValue]>();
    public active = true;

    move(to: DirectionMovementValue) {
        if (!this.active) {
            return;
        }
        let speed = 0;
        switch (to) {
            case DirectionMovementValue.FORWARD:
                speed = 1;
                break;
            case DirectionMovementValue.BACK:
                speed = -1;
                break;
        }
        const currentDirection = this.owner.direction.getCurrent();
        const currentPoint = this.owner.position.current;
        this.owner.position.current = {
            x: currentPoint.x + (currentDirection.x * speed),
            y: currentPoint.y + (currentDirection.y * speed),
        };
        this.publisher.notify(to);
    }
}
