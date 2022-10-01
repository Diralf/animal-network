import { UnknownComponent, ComponentPropsType } from './components-owner';

type Factory<Component extends UnknownComponent> = (owner: Component['__ownerType'], props?: Component['__propsType']) => Component;
export type FactorySet<Components extends Record<keyof Components, UnknownComponent>> = {
    [Key in keyof Components]: Factory<Components[Key]>;
};

interface Build<Remain, Original extends Record<keyof Original, UnknownComponent>> {
    build: () => FactorySet<Pick<Original, keyof Omit<Original, keyof Remain>>>;
}

type Builder<Components extends Record<keyof Components, UnknownComponent>, Original extends Record<keyof Components, UnknownComponent> = Components> = {
    [Key in keyof Components]: (props?: ComponentPropsType<Components[Key]>) => Builder<Omit<Components, Key>, Original> & Build<Omit<Components, Key>, Original>
};

type InitBuilders<Components extends Record<keyof Components, UnknownComponent>> = {
    [Key in keyof Components]: (props: ComponentPropsType<Components[Key]>) => Factory<Components[Key]>
};

export function builder<Components extends Record<keyof Components, UnknownComponent>>(initBuilder: InitBuilders<Components>): Builder<Components> {
    const result = {} as unknown as FactorySet<Components>;
    const build: Build<Components, Components> = {
        build: () => result,
    };
    const builder = build as unknown as Partial<Builder<Components>>;
    const keys = Object.keys(initBuilder) as unknown as Array<keyof Components>;
    keys.forEach((key: keyof Components) => {
        (builder as any)[key] = ((props: any) => {
            result[key] = initBuilder[key](props);
            return builder;
        });
    });
    return builder as unknown as Builder<Components>;
}

/** Example moved to entity-builder.spec.ts */
