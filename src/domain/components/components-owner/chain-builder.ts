import {
    Component,
    ComponentFactory,
    ComponentStaticFactory,
    StaticPropsType,
    ComponentPropsType,
    ComponentDepsType,
} from '../component/component';

export type UnknownComponent = Component<unknown>;

export type FactorySet<Components extends Record<keyof Components, UnknownComponent>> = {
    [Key in keyof Components]: ComponentFactory<Components[Key], ComponentPropsType<Components[Key]>, ComponentDepsType<Components[Key]>>;
};

export type FactoryKeysSet<Components> = {
    [Key in keyof Components]: unknown;
};

interface Build<Remain, Original extends Record<keyof Original, UnknownComponent>> {
    build: () => FactorySet<Pick<Original, keyof Omit<Original, keyof Remain>>>;
}

type Builder<Comps extends Record<keyof Comps, UnknownComponent>, Original extends Record<keyof Original, UnknownComponent> = Comps> = {
    [Key in keyof Comps]:
        (...[staticProps]: StaticPropsType<Comps[Key], ComponentPropsType<Comps[Key]>, ComponentDepsType<Comps[Key]>>)
            => Builder<Omit<Comps, Key>, Original>
        & Build<Omit<Comps, Key>, Original>
};

type InitBuilders<Components extends Record<keyof Components, UnknownComponent>> = {
    [Key in keyof Components]: ComponentStaticFactory<Components[Key], ComponentPropsType<Components[Key]>, ComponentDepsType<Components[Key]>>;
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
        builder[key] = (...staticProps: StaticPropsType<Components[Key], ComponentPropsType<Components[Key]>, ComponentDepsType<Components[Key]>>) => {
            const newResult = result as unknown as FactorySet<Omit<Original, keyof Omit<Components, Key>>>;
            const resultKey = key as unknown as keyof typeof newResult;
            newResult[resultKey] = initBuilder[key](...staticProps) as any;
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
