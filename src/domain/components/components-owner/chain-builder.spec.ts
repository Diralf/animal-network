import { NumberProperty } from '../../property/number/number-property';
import { chainBuilder } from './chain-builder';

describe('ChainBuilder', () => {
    it('should build components', () => {
        interface Foo {
            field1: NumberProperty;
            field2: NumberProperty;
            field3: NumberProperty;
            field4: NumberProperty;
        }

        const componentBuilder = () => chainBuilder<Foo>({
            field1: NumberProperty.builder(),
            field2: NumberProperty.builder(),
            field3: NumberProperty.builder(),
            field4: NumberProperty.builder(),
        });

        const entity = componentBuilder()
            .field1({ current: 1 })
            .field2()
            .build();

        entity.field1;
        entity.field2;
        // @ts-expect-error
        entity.field3;
        // @ts-expect-error
        entity.field4;

        expect(entity.field1().current).toEqual(1);
        expect(entity.field2().current).toEqual(0);
    });
});
