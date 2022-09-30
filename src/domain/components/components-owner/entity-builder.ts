import { NumberProperty } from '../../property/number/number-property';
import { UnknownComponent, ComponentPropsType } from './components-owner';

type Builder<Components extends Record<keyof Components, UnknownComponent>> = {
    [Key in keyof Components]: (props: ComponentPropsType<Components[Key]>) => Builder<Components>
};

export function builder<Components extends Record<keyof Components, UnknownComponent>>(): Builder<Components> {
    // @ts-ignore
    return {/* real methods */};
}

interface Foo {
    field1: NumberProperty;
    field2: NumberProperty;
}

builder<Foo>()
    .field1({ current: 1 })
    .field2({ current: 2 })
