import { EntityList } from '../../property-container-list/entity-list';
import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';
import { PropertyOwner } from '../owner/property-owner';
import { PropertyWithOwner } from '../owner/property-with-owner';
import { Positionable } from '../point/positionable';
import { positionableGuard } from '../point/positionable.guard';
import { CollisionOptions } from './collision-options';

type Handler = (options: CollisionOptions) => void;

export class CollisionProperty implements OnTick, PropertyWithOwner<Positionable> {
    public owner = new PropertyOwner<Positionable>();

    constructor(private handler: Handler) {
    }

    public check<Entity extends Positionable>(list: EntityList<Entity | Positionable>): Entity[] {
        const ownPosition = this.owner.ref.position.current;
        const entitiesWithPositions = list.findWithType<Positionable>(
            positionableGuard,
            (instance) => instance.position.isEqualValue(ownPosition),
        )
            .filter((entity) => entity !== this.owner.ref);
        return entitiesWithPositions as Entity[];
    }

    public collide(list: EntityList<Positionable>): void {
        const result = this.check(list);
        this.handler({ other: result, list });
    }

    public tick(world: World<Positionable>): void {
        this.collide(world.getEntityList());
    }
}
