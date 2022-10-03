import { Component, EntityType } from '../../components/component/component';
import { EntityList } from '../../property-container-list/entity-list';
import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';
import { Positionable } from '../point/positionable';
import { positionableGuard } from '../point/positionable.guard';
import { Publisher } from '../utils/observer';
import { CollisionOptions } from './collision-options';

interface Props {
    handler?(options: CollisionOptions): void;
}

export class CollisionProperty extends Component<CollisionProperty, Props, Positionable>() implements OnTick {
    public publisher = new Publisher<[CollisionOptions]>();

    public check<Components extends Record<keyof Components, unknown>>(list: EntityList<Components>): EntityType<Components>[] {
        const ownPosition = this.owner.component.position.current;
        const entitiesWithPositions = (list as EntityList<any>).findWithType<Positionable>(
            positionableGuard,
            (instance) => instance.component.position.isEqualValue(ownPosition),
        )
            .filter((entity) => entity !== this.owner);
        return entitiesWithPositions as unknown as Array<EntityType<Components>>;
    }

    public collide(world: World<Positionable>): void {
        const result = this.check(world.getEntityList());
        this.props?.handler?.({ other: result, world });
        this.publisher.notify({ other: result, world });
    }

    public tick(world: World<Positionable>): void {
        this.collide(world);
    }
}
