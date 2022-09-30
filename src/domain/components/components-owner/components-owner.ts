import { OnDestroy } from '../../time-thread/on-destroy';
import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';
import { Component } from '../component/component';
import { NullComponent } from '../component/null-component';

const UnknownComponentConstructor = Component<unknown, unknown>();

export type UnknownComponent = InstanceType<typeof UnknownComponentConstructor>;

export type ComponentClassType<Props, Result> = new (props: Props) => Result;

export type ComponentPropsType<Component extends UnknownComponent> = Component['__propsType'];

type ComponentsKeys<Owner extends Record<keyof Owner, unknown>> = {
    [Key in keyof Owner]: Owner[Key] extends UnknownComponent ? Key : never;
}[keyof Owner];

export type ComponentsOnly<Owner> = {
    [Key in ComponentsKeys<Owner>]: Owner[Key] extends UnknownComponent ? Owner[Key] : never;
};

type ComponentsWithPropsKeys<Owner extends Record<keyof Owner, UnknownComponent>> = {
    [Key in keyof Owner]: ComponentPropsType<Owner[Key]> extends void ? never : Key;
}[keyof Owner];

export type ComponentsWithProps<Owner extends Record<keyof Owner, UnknownComponent>> = {
    [Key in ComponentsWithPropsKeys<Owner>]: ComponentPropsType<Owner[Key]>;
};

export type ComponentsBuilders<Owner extends Record<keyof Owner, UnknownComponent>> = {
    [Key in keyof Owner]: (owner: Owner, props?: ComponentPropsType<Owner[Key]>) => Owner[Key];
};

export type ExternalComponentsProps<Owner extends Record<keyof Owner, UnknownComponent>> = Partial<ComponentsWithProps<Owner>>;

type BuilderResult<Builders extends Record<keyof Builders, (props?: any) => ReturnType<Builders[keyof Builders]>>> = {
    [Key in keyof Builders]: ReturnType<Builders[Key]>;
};

export type Entity<Components> = { component: Components };

export abstract class ComponentsOwner<ComponentsSet extends Record<keyof ComponentsSet, UnknownComponent>> implements OnTick, OnDestroy {
    private componentsOwner!: ComponentsSet;

    constructor(private externalProps: ExternalComponentsProps<ComponentsSet> = {}) {
    }

    public get component(): ComponentsSet {
        return this.componentsOwner;
    }

    protected abstract components(): ComponentsBuilders<ComponentsSet>;

    protected buildComponents(): ComponentsSet {
        const builders = this.components();
        const keys: Array<keyof ComponentsSet> = Object.keys(builders) as any;
        this.componentsOwner = {} as ComponentsSet;
        const components = keys.reduce<ComponentsSet>((acc, key) => {
            acc[key] = builders[key](this.componentsOwner, this.externalProps[key as ComponentsWithPropsKeys<ComponentsSet>]);
            return acc;
        }, this.componentsOwner);

        this.onInit();

        return components;
    }

    protected onInit(): void {}

    public tick(world: World, time: number): void {
        this.forEachKey<Partial<OnTick>>((field, key) => {
            field?.tick?.(world, time);
        });
    }

    public onDestroy(world: World): void {
        this.forEachKey<Partial<OnDestroy>>((field) => {
            field?.onDestroy?.(world);
        });
        this.forEachKey((field, key, instance) => {
            instance[key] = new NullComponent();
        });
    }

    private forEachKey<Field>(action: (field: Field, key: string, instance: Record<string, Field>) => void): void {
        Object.keys(this.componentsOwner).forEach((key) => {
            const inst = this as unknown as Record<string, Field>;
            action(inst[key], key, inst);
        });
    }
}
