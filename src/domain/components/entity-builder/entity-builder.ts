import { OnDestroy } from '../../time-thread/on-destroy';
import { OnTick } from '../../time-thread/on-tick';
import { World } from '../../world/world';
import { ComponentPropsType, componentBuilder } from '../component/component';
import { NullComponent } from '../component/null-component';
import { FactorySet, UnknownComponent } from '../components-owner/chain-builder';

type ComponentsWithPropsKeys<Components extends Record<keyof Components, UnknownComponent>> = {
    [Key in keyof Components]: ComponentPropsType<Components[Key]> extends void ? never : Key;
}[keyof Components];

export type ComponentsWithProps<Components extends Record<keyof Components, UnknownComponent>> = {
    [Key in ComponentsWithPropsKeys<Components>]: ComponentPropsType<Components[Key]>;
};

export class Entity<Components extends Record<keyof Components, UnknownComponent>> {
    private components: Components;

    constructor(private factorySet: FactorySet<Components>, private externalProps: Partial<ComponentsWithProps<Components>> = {}) {
        this.components = this.buildComponents(factorySet, externalProps);
    }

    public get component(): Components {
        return this.components;
    }

    public onInit(): void {
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
            instance[key] = componentBuilder(NullComponent)()({ owner: this });
        });
    }

    private buildComponents(factorySet: FactorySet<Components>, externalProps: Partial<ComponentsWithProps<Components>> = {}): Components {
        const builders = factorySet;
        const keys: Array<keyof Components> = Object.keys(builders) as any;
        const comps = {} as Components;
        keys.forEach((key) => {
            comps[key] = builders[key]({ owner: this, props: externalProps[key as ComponentsWithPropsKeys<Components>] });
        });
        return comps;
    }

    private forEachKey<Field>(action: (field: Field, key: string, instance: Record<string, Field>) => void): void {
        Object.keys(this.components).forEach((key) => {
            const inst = this.components as unknown as Record<string, Field>;
            action(inst[key], key, inst);
        });
    }
}

export function entityBuilder<Components extends Record<keyof Components, UnknownComponent>>(
    factorySet: FactorySet<Components>,
) {
    return {
        factorySet,
        build: (externalProps: Partial<ComponentsWithProps<Components>> = {}) => {
            const entity = new Entity<Components>(factorySet, externalProps);
            entity.onInit();
            return entity;
        },
    };
}
