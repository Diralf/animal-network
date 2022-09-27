import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';
import { Component } from '../component/component';

type UnknownComponent = Component<unknown>;

type ClassType<Options, Result> = new (options: Options) => Result;

type ComponentsKeys<Owner extends Record<keyof Owner, unknown>> = {
    [Key in keyof Owner]: Owner[Key] extends UnknownComponent ? Key : never;
}[keyof Owner];

export type ComponentsOnly<Owner> = {
    [Key in ComponentsKeys<Owner>]: Owner[Key] extends UnknownComponent ? Owner[Key] : never;
};

type ComponentsKeysWithOptions<Owner extends Record<keyof Owner, unknown>> = {
    [Key in keyof Owner]: Owner[Key] extends UnknownComponent ? Owner[Key]['options'] extends void ? never : Key : never;
}[keyof Owner];

export type ComponentsOptions<Owner extends Record<keyof Owner, unknown>> = {
    [Key in ComponentsKeysWithOptions<Owner>]: Owner[Key] extends UnknownComponent ? Owner[Key]['options'] : never;
};

interface InitialComponentProps<Owner, ComponentConstructorType> {
    owner: Owner,
    class: ComponentConstructorType,
}

interface OptionsComponentProps<ComponentOptions> {
    options: ComponentOptions,
}

type ComponentProps<Owner, ComponentConstructorType, ComponentOptions> = ComponentOptions extends void
    ? InitialComponentProps<Owner, ComponentConstructorType>
    : InitialComponentProps<Owner, ComponentConstructorType> & OptionsComponentProps<ComponentOptions>;

export class ComponentsOwner<Owner extends Record<keyof Owner, unknown>> implements OnTick {
    private components: UnknownComponent[] = [];

    constructor() {
    }

    protected createComponent<
        Components extends ComponentsOnly<Owner>,
        ComponentName extends keyof Components,
        ComponentType extends Components[ComponentName],
        ComponentOptions extends ComponentType['options'],
        ComponentConstructorType extends ClassType<ComponentOptions, ComponentType>,
    >(
        props: ComponentProps<ComponentType['owner']['ref'], ComponentConstructorType, ComponentOptions>,
    ): ComponentType {
        const { owner, class: ComponentConstructor, options } = props;
        const component = new ComponentConstructor(options as ComponentOptions);

        if (component.owner) {
            component.owner.ref = owner;
        }

        this.components.push(component);

        return component;
    }

    tick(world: World, time: number): void {
        this.components.forEach((component) => {
            component.tick(world, time);
        });
    }
}
