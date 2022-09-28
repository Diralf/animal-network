import { PropertyOwner } from '../../property/owner/property-owner';
import { PropertyWithOwner } from '../../property/owner/property-with-owner';
import { OnDestroy } from '../../time-thread/on-destroy';
import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';

export abstract class Component<Props = void, Owner = unknown> implements PropertyWithOwner<Owner>, OnTick, OnDestroy {
    public owner: PropertyOwner<Owner> = new PropertyOwner<Owner>();

    constructor(protected props: Props) {}

    public getProps(): Props {
        return this.props;
    }

    public tick(world: World, time: number): void {}

    public onDestroy(world: World): void {}
}
