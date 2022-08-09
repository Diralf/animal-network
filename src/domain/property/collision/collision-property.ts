import { PropertyContainerList } from '../../property-container-list/property-container-list';
import { TimeThreadListener } from '../../time-thread/time-thread-listener';
import { World } from '../../world/world';
import { BaseProperty } from '../base/base-property';
import { PropertiesContainer } from '../container/properties-container';
import { CollisionOptions } from './collision-options';
import { CollisionOwner } from './collision-owner';

type Current = (options: CollisionOptions) => void;

export class CollisionProperty extends BaseProperty<Current, PropertiesContainer<CollisionOwner>> implements TimeThreadListener {
    public check(list: PropertyContainerList<CollisionOwner>): Array<PropertiesContainer<CollisionOwner>> {
        const ownPosition = this.owner.get.position();
        return list
            .find({ position: ownPosition })
            .filter((entity) => entity !== this.owner);
    }

    public collide(list: PropertyContainerList<CollisionOwner>): void {
        const result = this.check(list);
        this.current({ other: result, list });
    }

    public tick(world: World): void {
        this.collide(world.entityList);
    }
}