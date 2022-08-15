import { PropertyContainerList } from '../../property-container-list/property-container-list';
import { TimeThreadListener } from '../../time-thread/time-thread-listener';
import { World } from '../../world/world';
import { BaseProperty } from '../base/base-property';
import { PropertiesContainer } from '../container/properties-container';
import { PropertiesContainerBase } from '../container/properties-container-base.type';
import { PropertyOwner } from '../owner/property-owner';
import { PropertyWithOwner } from '../owner/property-with-owner';
import { CollisionOptions } from './collision-options';
import { CollisionOwner } from './collision-owner';

type Current = (options: CollisionOptions) => void;

export class CollisionProperty extends BaseProperty<Current> implements PropertyWithOwner<CollisionOwner>, TimeThreadListener {
    public owner = new PropertyOwner<CollisionOwner>();

    public check<Entity extends PropertiesContainerBase<Entity>>(
        list: PropertyContainerList<Entity>,
    ): Array<PropertiesContainer<Entity>> {
        const ownerList = list as unknown as PropertyContainerList<CollisionOwner>;
        const ownPosition = this.owner.ref.get.position();
        const result = ownerList
            .find({ position: ownPosition })
            .filter((entity) => entity !== this.owner.ref);
        return result as unknown as Array<PropertiesContainer<Entity>>;
    }

    public collide(list: PropertyContainerList<CollisionOwner>): void {
        const result = this.check(list);
        this.current({ other: result, list });
    }

    public tick(world: World<CollisionOwner>): void {
        this.collide(world.getEntityList());
    }
}
