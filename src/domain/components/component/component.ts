import { PropertyOwner } from '../../property/owner/property-owner';
import { PropertyWithOwner } from '../../property/owner/property-with-owner';
import { OnDestroy } from '../../time-thread/on-destroy';
import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';

type Opt<T> = T extends void ? null | undefined | void : T;

export function Component<Props = void, Owner = unknown>() {
    return class ComponentClass implements PropertyWithOwner<Opt<Owner>>, OnTick, OnDestroy {
        public owner: PropertyOwner<Opt<Owner>> = new PropertyOwner<Opt<Owner>>();
        protected props!: Opt<Props>;

        constructor(props: Opt<Props>) {
            this.props = props;
        }

        public getProps(): Opt<Props> {
            return this.props;
        }

        public setProps(props: Opt<Props>): void {
            this.props = props;
        }

        public tick(world: World, time: number): void {}

        public onDestroy(world: World): void {}

        static build(owner: Opt<Owner>, props: Opt<Props>) {
            const inst = new this(props);
            if (owner) {
                inst.owner.ref = owner;
            }
            return inst;
        }

        public __propsType: Props | undefined;
    }
}
