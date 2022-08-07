import { BaseProperty } from '../base/base-property';
import { PointProperty, RawPoint } from '../point/point-property';
import { PropertiesContainer } from '../container/properties-container';

export enum MovementDirections {
    UP = 'UP',
    DOWN = 'DOWN',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
}

interface Owner {
    position: PointProperty;
}

export class MovementProperty extends BaseProperty<void, PropertiesContainer<Owner>> {
    move(direction: MovementDirections) {
        let delta: RawPoint;
        switch (direction) {
            case MovementDirections.UP:
                delta = {
                    x: 1,
                    y: 0,
                };
                break;
            case MovementDirections.DOWN:
                delta = {
                    x: 1,
                    y: 0,
                };
                break;
            case MovementDirections.LEFT:
                delta = {
                    x: 1,
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
        const currentPoint = this.owner.get.position();
        this.owner.set.position({
            x: currentPoint.x + delta.x,
            y: currentPoint.y + delta.y,
        });
    }
}
