import { OnDestroy } from '../../time-thread/on-destroy';
import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';
import { Component } from '../component/component';
import { NullComponent } from '../component/null-component';

const UnknownComponentConstructor = Component<unknown>();

type UnknownComponent = InstanceType<typeof UnknownComponentConstructor>;

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

export class ComponentsOwner<Owner extends Record<keyof Owner, unknown>> implements OnTick, OnDestroy {
    constructor(private externalProps: ExternalComponentsProps<Owner> = {}) {
        this.init();
    }

    protected init(): void {
        Object.keys(this.externalProps).forEach((key) => {
            const componentOwner = this as unknown as Record<string, UnknownComponent>;
            const externalProps = this.externalProps as unknown as Record<string, unknown>;
            componentOwner[key]?.setProps?.(externalProps[key]);
        });
    }

    public tick(world: World, time: number): void {
        this.forEachKey<Partial<OnTick>>((field) => {
            field.tick?.(world, time);
        });
    }

    public onDestroy(world: World): void {
        this.forEachKey<Partial<OnDestroy>>((field) => {
            field.onDestroy?.(world);
        });
        this.forEachKey((field, key, instance) => {
            instance[key] = new NullComponent();
        });
    }

    private forEachKey<Field>(action: (field: Field, key: string, instance: Record<string, Field>) => void): void {
        Object.keys(this).forEach((key) => {
            const inst = this as unknown as Record<string, Field>;
            action(inst[key], key, inst);
        });
    }
}
