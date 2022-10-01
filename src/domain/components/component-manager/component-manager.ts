import { OnDestroy } from '../../time-thread/on-destroy';
import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';
import { NullComponent } from '../component/null-component';
import { UnknownComponent } from '../components-owner/components-owner';
import { FactorySet } from '../components-owner/entity-builder';

export type ComponentPropsType<Component extends UnknownComponent> = Component['__propsType'];

type ComponentsWithPropsKeys<Components extends Record<keyof Components, UnknownComponent>> = {
    [Key in keyof Components]: ComponentPropsType<Components[Key]> extends void ? never : Key;
}[keyof Components];

export type ComponentsWithProps<Components extends Record<keyof Components, UnknownComponent>> = {
    [Key in ComponentsWithPropsKeys<Components>]: ComponentPropsType<Components[Key]>;
};

export class ComponentManager<Components extends Record<keyof Components, UnknownComponent>> {
    public component!: Components;

    constructor(private factorySet: FactorySet<Components>) {
    }

    public buildComponents(externalProps: Partial<ComponentsWithProps<Components>> = {}): void {
        const builders = this.factorySet;
        const keys: Array<keyof Components> = Object.keys(builders) as any;
        this.component = {} as Components;
        keys.forEach((key) => {
            this.component[key] = builders[key](this.component, externalProps[key as ComponentsWithPropsKeys<Components>]);
        });
        this.onInit();
    }

    protected onInit(): void {
        this.forEachKey<Partial<{ onInit: () => void }>>((field) => {
            field?.onInit?.();
        });
    }

    public tick(world: World, time: number): void {
        this.forEachKey<Partial<OnTick>>((field) => {
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
        Object.keys(this.component).forEach((key) => {
            const inst = this.component as unknown as Record<string, Field>;
            action(inst[key], key, inst);
        });
    }
}

export function componentManager<Components extends Record<keyof Components, UnknownComponent>>(
    factorySet: FactorySet<Components>,
) {
    return {
        build: (externalProps?: Partial<ComponentsWithProps<Components>>) => {
            const manager = new ComponentManager(factorySet);
            manager.buildComponents(externalProps);
            return manager;
        },
    };
}
