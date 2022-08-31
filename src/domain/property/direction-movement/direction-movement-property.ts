import { Directional } from '../direction/directional';
import { PropertyOwner } from '../owner/property-owner';
import { PropertyWithOwner } from '../owner/property-with-owner';
import { Positionable } from '../point/positionable';

export enum DirectionMovementValue {
    FORWARD = 'FORWARD',
    BACK = 'BACK',
}

type Owner = Directional & Positionable;

export class DirectionMovementProperty implements PropertyWithOwner<Owner> {
    public owner = new PropertyOwner<Owner>();

    move(to: DirectionMovementValue) {
        let speed = 0;
        switch (to) {
            case DirectionMovementValue.FORWARD:
                speed = 1;
                break;
            case DirectionMovementValue.BACK:
                speed = -1;
                break;
        }
        const currentDirection = this.owner.ref.direction.getCurrent();
        const currentPoint = this.owner.ref.position.current;
        this.owner.ref.position.current = {
            x: currentPoint.x + (currentDirection.x * speed),
            y: currentPoint.y + (currentDirection.y * speed),
        };
    }
}
