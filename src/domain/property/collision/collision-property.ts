import { Component } from '../../components/component/component';
import { EntityList } from '../../property-container-list/entity-list';
import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';
import { Positionable } from '../point/positionable';
import { positionableGuard } from '../point/positionable.guard';
import { CollisionOptions } from './collision-options';

type Handler = (options: CollisionOptions) => void;

export class CollisionProperty extends Component<Handler, Positionable> implements OnTick {
    private handler: Handler = this.options;

    public check<Entity extends Positionable>(list: EntityList<Entity | Positionable>): Entity[] {
        const ownPosition = this.owner.ref.position.current;
        const entitiesWithPositions = list.findWithType<Positionable>(
            positionableGuard,
            (instance) => instance.position.isEqualValue(ownPosition),
        )
            .filter((entity) => entity !== this.owner.ref);
        return entitiesWithPositions as Entity[];
    }

    public collide(world: World<Positionable>): void {
        const result = this.check(world.getEntityList());
        this.handler({ other: result, world });
    }

    public tick(world: World<Positionable>): void {
        this.collide(world);
    }
}
