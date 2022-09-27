import { PropertyOwner } from '../../property/owner/property-owner';
import { PropertyWithOwner } from '../../property/owner/property-with-owner';
import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';

export abstract class Component<Options = void, Owner = unknown> implements PropertyWithOwner<Owner>, OnTick {
    public owner: PropertyOwner<Owner> = new PropertyOwner<Owner>();

    constructor(public options: Options) {}

    public tick(world: World, time: number): void {};
}
