import { OnDestroy } from '../../time-thread/on-destroy';
import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';
import { Component } from '../component/component';

type UnknownComponent = Component<unknown>;

export type ComponentClassType<Props, Result> = new (props: Props) => Result;

export type ComponentPropsType<Component extends UnknownComponent> = Component['__propsType'];

type ComponentsKeys<Owner extends Record<keyof Owner, unknown>> = {
    [Key in keyof Owner]: Owner[Key] extends UnknownComponent ? Key : never;
}[keyof Owner];

export type ComponentsOnly<Owner> = {
    [Key in ComponentsKeys<Owner>]: Owner[Key] extends UnknownComponent ? Owner[Key] : never;
};

type ComponentsWithPropsKeys<Owner extends Record<keyof Owner, unknown>> = {
    [Key in keyof Owner]: Owner[Key] extends UnknownComponent ? ComponentPropsType<Owner[Key]> extends void ? never : Key : never;
}[keyof Owner];

export type ComponentsWithProps<Owner extends Record<keyof Owner, unknown>> = {
    [Key in ComponentsWithPropsKeys<Owner>]: Owner[Key] extends UnknownComponent ? ComponentPropsType<Owner[Key]> : never;
};

export type ExternalComponentsProps<Owner extends Record<keyof Owner, unknown>> = Partial<ComponentsWithProps<Owner>>;

interface BaseComponentData<Owner, Constructor> {
    owner: Owner,
    class: Constructor,
}

interface PropsComponentData<Props, Name> {
    props: Props,
    name: Name,
}

export type ComponentData<Owner, Constructor, Props, Name> = Props extends void
    ? BaseComponentData<Owner, Constructor>
    : BaseComponentData<Owner, Constructor> & PropsComponentData<Props, Name>;

export class ComponentsOwner<Owner extends Record<keyof Owner, unknown>> implements OnTick, OnDestroy {
    private components: UnknownComponent[] = [];

    constructor(private externalProps: ExternalComponentsProps<Owner> = {}) {
    }

    public createComponent<
        Components extends ComponentsOnly<Owner>,
        ComponentKeys extends keyof Components,
        ComponentType extends Components[ComponentKeys],
        ComponentProps extends ComponentPropsType<ComponentType>,
        ComponentConstructorType extends ComponentClassType<ComponentProps, ComponentType>,
    >(
        props: ComponentData<ComponentType['owner']['ref'], ComponentConstructorType, ComponentProps, ComponentKeys>,
    ): ComponentType {
        const { owner, class: ComponentConstructor, props: staticProps, name } = props;
        const externalProps = this.externalProps as unknown as Record<ComponentKeys, ComponentProps>;
        const propsToApply = externalProps[name] ?? staticProps as ComponentProps;
        const component = new ComponentConstructor(propsToApply);

        if (component.owner) {
            component.owner.ref = owner;
        }

        this.components.push(component);

        return component;
    }

    public tick(world: World, time: number): void {
        this.components.forEach((component) => {
            component.tick(world, time);
        });
    }

    public onDestroy(world: World): void {
        this.components.forEach((component) => {
            component.onDestroy(world);
        });
        this.components = [];
    }
}
