import { Component } from '../../components/component/component';
import { EntityList } from '../../property-container-list/entity-list';
import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';
import { Positionable } from '../point/positionable';
import { positionableGuard } from '../point/positionable.guard';
import { CollisionOptions } from './collision-options';

interface Props {
    handler(options: CollisionOptions): void;
}

export class CollisionProperty extends Component<Props, Positionable> implements OnTick {
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
        this.props.handler({ other: result, world });
    }

    public tick(world: World<Positionable>): void {
        this.collide(world);
    }
}
