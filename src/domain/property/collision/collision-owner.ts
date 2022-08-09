import { PointProperty } from '../point/point-property';
import { CollisionProperty } from './collision-property';

export interface CollisionOwner {
    collision: CollisionProperty;
    position: PointProperty;
}
