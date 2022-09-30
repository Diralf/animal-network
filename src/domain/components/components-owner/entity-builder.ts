import { NumberProperty } from '../../property/number/number-property';
import { UnknownComponent, ComponentPropsType } from './components-owner';

interface Build<Remain, Original> {
    build: () => Omit<Original, keyof Remain>;
}

type Builder<Components extends Record<keyof Components, UnknownComponent>, Original = Components> = {
    [Key in keyof Components]: (props: ComponentPropsType<Components[Key]>) => Builder<Omit<Components, Key>, Original> & Build<Omit<Components, Key>, Original>;
};


export function builder<Components extends Record<keyof Components, UnknownComponent>>(): Builder<Components> {
    // @ts-ignore
    return {/* real methods */};
}

interface Foo {
    field1: NumberProperty;
    field2: NumberProperty;
    field3: NumberProperty;
    field4: NumberProperty;
}

const aaa = builder<Foo>()
    .field1({ current: 1 })
    .field2({ current: 2 })
    .build();

aaa.field1;
aaa.field2;
// @ts-expect-error
aaa.field3;
// @ts-expect-error
aaa.field4;
