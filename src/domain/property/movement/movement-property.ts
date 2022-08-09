import { BaseProperty } from '../base/base-property';
import { PropertyOwner } from '../owner/property-owner';
import { PropertyWithOwner } from '../owner/property-with-owner';
import { PointProperty } from '../point/point-property';
import { RawPoint } from '../point/raw-point';

export enum MovementDirections {
    UP = 'UP',
    DOWN = 'DOWN',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
}

interface Owner {
    position: PointProperty;
}

export class MovementProperty extends BaseProperty<void> implements PropertyWithOwner<Owner> {
    public owner = new PropertyOwner<Owner>();

    public move(direction: MovementDirections): void {
        let delta: RawPoint;
        switch (direction) {
            case MovementDirections.UP:
                delta = {
                    x: 0,
                    y: -1,
                };
                break;
            case MovementDirections.DOWN:
                delta = {
                    x: 0,
                    y: 1,
                };
                break;
            case MovementDirections.LEFT:
                delta = {
                    x: -1,
                    y: 0,
                };
                break;
            case MovementDirections.RIGHT:
                delta = {
                    x: 1,
                    y: 0,
                };
                break;
            default:
                delta = {
                    x: 0,
                    y: 0,
                };
        }
        const currentPoint = this.owner.ref.get.position();
        this.owner.ref.set.position({
            x: currentPoint.x + delta.x,
            y: currentPoint.y + delta.y,
        });
    }
}
