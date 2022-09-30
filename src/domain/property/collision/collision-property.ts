import { Component } from '../../components/component/component';
import { Entity } from '../../components/components-owner/components-owner';
import { EntityList } from '../../property-container-list/entity-list';
import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';
import { Positionable } from '../point/positionable';
import { positionableGuard } from '../point/positionable.guard';
import { CollisionOptions } from './collision-options';

interface Props {
    handler(options: CollisionOptions): void;
}

export class CollisionProperty extends Component<CollisionProperty, Props, Positionable>() implements OnTick {
    public check<Components extends Positionable>(list: EntityList<Components | Positionable>): Entity<Components>[] {
        const ownPosition = this.owner.position.current;
        const entitiesWithPositions = list.findWithType<Positionable>(
            positionableGuard,
            (instance) => instance.component.position.isEqualValue(ownPosition),
        )
            .filter((entity) => entity.component !== this.owner);
        return entitiesWithPositions as Entity<Components>[];
    }

    public collide(world: World<Positionable>): void {
        const result = this.check(world.getEntityList());
        this.props.handler({ other: result, world });
    }

    public tick(world: World<Positionable>): void {
        this.collide(world);
    }
}
