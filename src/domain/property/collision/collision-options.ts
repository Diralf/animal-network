import { EntityType } from '../../components/component/component';
import { World } from '../../world/world';
import { Positionable } from '../point/positionable';

export interface CollisionOptions {
    other: Array<EntityType<Positionable>>;
    world: World<Positionable>;
}
