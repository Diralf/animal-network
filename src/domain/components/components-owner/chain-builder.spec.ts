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
});
