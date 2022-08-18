import { EntityList } from '../../property-container-list/entity-list';
import { Positionable } from '../point/positionable';

export interface CollisionOptions {
    other: Positionable[];
    list: EntityList<Positionable>;
}
