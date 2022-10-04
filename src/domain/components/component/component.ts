import { PropertyOwner } from '../../property/owner/property-owner';
import { OnDestroy } from '../../time-thread/on-destroy';
import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';
import { UnknownComponent } from '../components-owner/chain-builder';

// export type Opt<T> = T extends void ? null | undefined | void : T;

export interface EntityType<Components extends Record<keyof Components, unknown>> {
    component: Components;
}

export interface ComponentOptions<Props, Owner> {
    props: Props,
    owner?: Owner,
}

export interface ComponentOptionsOptProps<Props, Owner> {
    props?: Props,
    owner: Owner,
}

export type ComponentPropsType<Component extends UnknownComponent> = Component['__propsType'];
export type ComponentDepsType<Component extends UnknownComponent> = Component['__depsType'];

export class Component<Props = void, Deps = {}> implements OnTick, OnDestroy {
    private _owner: PropertyOwner<EntityType<Deps>> = new PropertyOwner<EntityType<Deps>>();
    public __propsType!: Props;
    public __depsType!: Deps;
    public __ownerType!: EntityType<Deps>;
    public __initProps: () => void;

    constructor({ props, owner }: ComponentOptions<Props, EntityType<Deps>>) {
        this._owner.ref = owner as EntityType<Deps>;
        this.__initProps = () => {
            this.onPropsInit(props);
        };
    }

    public onPropsInit(props: Props): void {}

    public get owner(): EntityType<Deps> {
        return this._owner.ref;
    }

    public onInit(): void {}

    public tick(world: World, time: number): void {}

    public onDestroy(world: World): void {}
}

export type StaticPropsType<Comp extends Component<Props, Deps>, Props, Deps> = Parameters<Comp['onPropsInit']>;

export type ComponentFactory<Comp extends Component<Props, Deps>, Props, Deps>
    = ({ owner, props }: ComponentOptionsOptProps<Props, EntityType<Deps>>) => Comp;

export type ComponentStaticFactory<Comp extends Component<Props, Deps>, Props, Deps>
    = (...[staticProps]: StaticPropsType<Comp, Props, Deps>) => ComponentFactory<Comp, Props, Deps>;

export const componentBuilder = <Comp extends Component<Props, Deps>, Props, Deps>(
    ComponentCtor: new (options: ComponentOptions<Props, EntityType<Deps>>) => Comp,
): ComponentStaticFactory<Comp, Props, Deps> => {
    return (...[staticProps]: StaticPropsType<Comp, Props, Deps>): ComponentFactory<Comp, Props, Deps> => {
        return ({ owner, props: externalProps }: ComponentOptionsOptProps<Props, EntityType<Deps>>): Comp => {
            const component = new ComponentCtor({
                props: externalProps ?? staticProps,
                owner,
            });
            component.__initProps();
            return component;
        };
    };
};
