import { Component } from '../component/component';
import { chainBuilder } from './chain-builder';

describe('ChainBuilder', () => {
    it('should build components', () => {
        class NumberComponent extends Component<number> {
            public value: number = 0;
            public onPropsInit(props: number) {
                this.value = props;
            }
        }

        class OptNumberComponent extends Component<number> {
            public value: number = 0;
            public onPropsInit(props: number = 5) {
                this.value = props;
            }
        }

        interface Foo {
            field1: NumberComponent;
            field2: OptNumberComponent;
            field3: NumberComponent;
            field4: NumberComponent;
        }

        const defaultOwner = { component: {} };

        const testBuilder = chainBuilder<Foo>({
            field1: NumberComponent.builder(),
            field2: OptNumberComponent.builder(),
            field3: NumberComponent.builder(),
            field4: NumberComponent.builder(),
        });

        testBuilder
            // @ts-expect-error
            .field1()
            .build();

        const entity = testBuilder
            .field1(1)
            .field2()
            .build();

        entity.field1;
        entity.field2;
        // @ts-expect-error
        entity.field3;
        // @ts-expect-error
        entity.field4;

        expect(entity.field1({ owner: defaultOwner }).value).toEqual(1);
        expect(entity.field2({ owner: defaultOwner }).value).toEqual(5);
    });

    it('should add builders to build components', () => {
        class NumberComponent extends Component<number> {
            public value: number = 0;
            public onPropsInit(props: number) {
                this.value = props;
            }
        }

        class OptNumberComponent extends Component<number> {
            public value: number = 0;
            public onPropsInit(props: number = 5) {
                this.value = props;
            }
        }

        interface Foo {
            field1: NumberComponent;
            field2: OptNumberComponent;
        }

        interface Foo2 {
            field3: NumberComponent;
        }

        interface Foo3 {
            field4: NumberComponent;
        }

        const defaultOwner = { component: {} };

        const testBuilder = chainBuilder<Foo>({
            field1: NumberComponent.builder(),
            field2: OptNumberComponent.builder(),
        });

        const testBuilder2 = testBuilder.add<Foo2>({
            field3: NumberComponent.builder(),
        });

        const testBuilder3 = testBuilder2.add<Foo3>({
            field4: NumberComponent.builder(),
        });

        const entity = testBuilder
            .field1(1)
            .field2()
            .build();

        entity.field1;
        entity.field2;
        // @ts-expect-error
        entity.field3;
        // @ts-expect-error
        entity.field4;

        expect(entity.field1({ owner: defaultOwner }).value).toEqual(1);
        expect(entity.field2({ owner: defaultOwner }).value).toEqual(5);

        const entity2 = testBuilder2
            .field1(1)
            .field3(3)
            .build();

        entity2.field1;
        entity2.field3;
        // @ts-expect-error
        entity2.field2;
        // @ts-expect-error
        entity2.field4;

        expect(entity2.field1({ owner: defaultOwner }).value).toEqual(1);
        expect(entity2.field3({ owner: defaultOwner }).value).toEqual(3);

        const entity3 = testBuilder3
            .field1(1)
            .field3(3)
            .field4(4)
            .build();

        entity3.field1;
        entity3.field3;
        entity3.field4;
        // @ts-expect-error
        entity3.field2;

        expect(entity3.field1({ owner: defaultOwner }).value).toEqual(1);
        expect(entity3.field3({ owner: defaultOwner }).value).toEqual(3);
        expect(entity3.field4({ owner: defaultOwner }).value).toEqual(4);
    });
});
