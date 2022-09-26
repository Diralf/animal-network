import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';
import { Component } from '../component/component';

type ClassType<Options, Result> = new (options: Options) => Result;

type ComponentsKeys<Owner extends Record<keyof Owner, unknown>> = {
    [Key in keyof Owner]: Owner[Key] extends Component<unknown> ? Key : never;
}[keyof Owner];

type ComponentsKeysWithOptions<Owner extends Record<keyof Owner, unknown>> = {
    [Key in keyof Owner]: Owner[Key] extends Component<unknown> ? Owner[Key]['options'] extends void ? never : Key : never;
}[keyof Owner];

export type ComponentsOnly<Owner> = {
    [Key in ComponentsKeys<Owner>]: Owner[Key] extends Component<unknown> ? Owner[Key] : never;
};

type ComponentsOptions<Owner extends Record<keyof Owner, unknown>> = {
    [Key in ComponentsKeysWithOptions<Owner>]: Owner[Key] extends Component<unknown> ? Owner[Key]['options'] : never;
};

export class ComponentsOwner<Owner extends Record<keyof Owner, unknown>> implements OnTick {
    private components: Array<Component<unknown>> = [];

    constructor(private initOptions: ComponentsOptions<ComponentsOnly<Owner>>) {
    }

    protected createComponent<
        Components extends ComponentsOnly<Owner>,
        ComponentName extends keyof Components,
        ComponentType extends Components[ComponentName],
        ConstructorArgs extends ComponentType['options'],
        ComponentConstructorType extends ClassType<ConstructorArgs, ComponentType>,
    >(
        actualOwner: ComponentType['owner']['ref'],
        componentName: ComponentName,
        ComponentConstructor: ComponentConstructorType,
    ): ComponentType {
        const componentInitOptions = (this.initOptions as Record<keyof Components, ConstructorArgs>)[componentName];
        const component = new ComponentConstructor(componentInitOptions);

        if (component.owner) {
            component.owner.ref = actualOwner;
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
