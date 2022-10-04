import { Component, EntityType } from '../component/component';

const UnknownComponentConstructor = Component<unknown, unknown>();
export type UnknownComponent = InstanceType<typeof UnknownComponentConstructor>;

export type ComponentPropsType<Component extends UnknownComponent> = Component['__propsType'];

type Factory<Component extends UnknownComponent, Owner extends Component['__ownerType']> = (owner?: Owner, props?: Component['__propsType']) => Component;
export type FactorySet<Components extends Record<keyof Components, UnknownComponent>> = {
    [Key in keyof Components]: Factory<Components[Key], Components[Key]['__ownerType']>;
};

interface Build<Remain, Original extends Record<keyof Original, UnknownComponent>> {
    build: () => FactorySet<Pick<Original, keyof Omit<Original, keyof Remain>>>;
}

type Builder<Components extends Record<keyof Components, UnknownComponent>, Original extends Record<keyof Original, UnknownComponent> = Components> = {
    [Key in keyof Components]: (props?: ComponentPropsType<Components[Key]>) => Builder<Omit<Components, Key>, Original> & Build<Omit<Components, Key>, Original>
};

type InitBuilders<Components extends Record<keyof Components, UnknownComponent>> = {
    [Key in keyof Components]: (props: ComponentPropsType<Components[Key]>) => Factory<Components[Key], EntityType<Components>>
};

export function chainBuilder<
    Original extends Record<keyof Original, UnknownComponent>,
    Components extends Record<keyof Components, UnknownComponent> = Original,
    Result extends FactorySet<Omit<Original, keyof Components>> = FactorySet<Omit<Original, keyof Components>>
>(
    initBuilder: InitBuilders<Components>, result: Result = ({} as unknown as Result),
): Builder<Components, Original> {
    const builder = {} as Builder<Components, Original>;
    const keys = Object.keys(initBuilder) as Array<keyof Components>;
    keys.forEach(<Key extends keyof Components>(key: Key) => {
        builder[key] = (props: Components[Key]['__propsType']) => {
            const newResult = result as unknown as FactorySet<Omit<Original, keyof Omit<Components, Key>>>;
            const resultKey = key as unknown as keyof typeof newResult;
            newResult[resultKey] = initBuilder[key](props) as any;
            const build: Build<Omit<Components, Key>, Original> = {
                build: () => newResult as unknown as FactorySet<Omit<Original, keyof Omit<Components, Key>>>,
            };
            const newBuilders = initBuilder as unknown as InitBuilders<Omit<Components, Key>>;
            const newBuilder = chainBuilder<Original, Omit<Components, Key>, FactorySet<Omit<Original, keyof Omit<Components, Key>>>>(newBuilders, newResult);
            return {
                ...newBuilder,
                ...build,
            };
        };
    });
    return builder;
}

/** Example moved to entity-builder.spec.ts */
