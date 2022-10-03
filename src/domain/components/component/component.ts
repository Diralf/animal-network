import { PropertyOwner } from '../../property/owner/property-owner';
import { PropertyWithOwner } from '../../property/owner/property-with-owner';
import { OnDestroy } from '../../time-thread/on-destroy';
import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';

// export type Opt<T> = T extends void ? null | undefined | void : T;

export interface EntityType<Components extends Record<keyof Components, unknown>> {
    component: Components;
}

export function Component<Comp, Props = void, Owner extends Record<keyof Owner, unknown> = {}>() {
    return class ComponentClass implements PropertyWithOwner<EntityType<Owner>>, OnTick, OnDestroy {
        public _owner: PropertyOwner<EntityType<Owner>> = new PropertyOwner<EntityType<Owner>>();
        protected props!: Props;

        constructor(props: Props) {
            this.props = props;
        }

        public get owner(): EntityType<Owner> {
            return this._owner.ref;
        }

        public set owner(newOwner: EntityType<Owner>) {
            this._owner.ref = newOwner;
        }

        public getProps(): Props {
            return this.props;
        }

        public onInit(): void {}

        public tick(world: World, time: number): void {}

        public onDestroy(world: World): void {}

        static build(props: Props) {
            return (owner?: EntityType<Owner>, externalProps?: Props): Comp => {
                const inst = new this(externalProps ?? props);
                if (owner) {
                    inst._owner.ref = owner;
                }
                return inst as unknown as Comp;
            };
        }

        static builder() {
            return (props: Props) => {
                return (owner?: EntityType<Owner>, externalProps?: Props): Comp => {
                    const inst = new this(externalProps ?? props);
                    if (owner) {
                        inst._owner.ref = owner;
                    }
                    return inst as unknown as Comp;
                };
            };
        }

        public __propsType!: Props;
        public __ownerType!: EntityType<Owner>;
    }
}
