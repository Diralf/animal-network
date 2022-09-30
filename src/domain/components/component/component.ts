import { PropertyOwner } from '../../property/owner/property-owner';
import { PropertyWithOwner } from '../../property/owner/property-with-owner';
import { OnDestroy } from '../../time-thread/on-destroy';
import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';

export type Opt<T> = T extends void ? null | undefined | void : T;

export function Component<Comp, Props = void, Owner = unknown>() {
    return class ComponentClass implements PropertyWithOwner<Opt<Owner>>, OnTick, OnDestroy {
        public _owner: PropertyOwner<Opt<Owner>> = new PropertyOwner<Opt<Owner>>();
        protected props!: Opt<Props>;

        constructor(props: Opt<Props>) {
            this.props = props;
        }

        public get owner(): Opt<Owner> {
            return this._owner.ref;
        }

        public set owner(newOwner: Opt<Owner>) {
            this._owner.ref = newOwner;
        }

        public getProps(): Opt<Props> {
            return this.props;
        }

        public tick(world: World, time: number): void {}

        public onDestroy(world: World): void {}

        static build(props: Opt<Props>) {
            return (owner: Opt<Owner>, externalProps?: Opt<Props>): Comp => {
                const inst = new this(externalProps ?? props);
                if (owner) {
                    inst._owner.ref = owner;
                }
                return inst as unknown as Comp;
            };
        }

        static builder() {
            return (props: Opt<Props>) => {
                return (owner: Opt<Owner>, externalProps?: Opt<Props>): Comp => {
                    const inst = new this(externalProps ?? props);
                    if (owner) {
                        inst._owner.ref = owner;
                    }
                    return inst as unknown as Comp;
                };
            };
        }

        public __propsType!: Opt<Props>;
        public __ownerType!: Owner;
    }
}
