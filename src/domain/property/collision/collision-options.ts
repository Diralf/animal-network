import { Entity } from '../../components/components-owner/components-owner';
import { World } from '../../world/world';
import { Positionable } from '../point/positionable';

export interface CollisionOptions {
    other: Array<Entity<Positionable>>;
    world: World<Positionable>;
}
