import { World } from '../../world/world';
import { Positionable } from '../point/positionable';

export interface CollisionOptions {
    other: Positionable[];
    world: World<Positionable>;
}
