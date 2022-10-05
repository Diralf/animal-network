import { entityBuilder } from '../../components/entity-builder/entity-builder';
import { Property } from './base-property';

describe('BaseProperty', () => {
    const owner = { component: {} };

    it('should be truthy', () => {
        const property: Property<number> = Property<number>.build(owner, 0);

        expect(property).toBeTruthy();
    });

    it('should get current', () => {
        const property = Property<number>.build(owner, 3);

        expect(property.current).toBeTruthy();
        expect(property.current).toEqual(3);
    });

    it('should set and get current', () => {
        const property = Property<number>.build(owner, 0);

        property.current = 5;

        expect(property.current).toEqual(5);
    });

    it('should have number current', () => {
        const value = 1;
        const property = Property<number>.build(owner, value);

        expect(property.current).toEqual(value);
        expect(typeof property.current).toEqual('number');
    });

    it('should have string current', () => {
        const value = '123';
        const property = Property<string>.build(owner, value);

        expect(property.current).toEqual(value);
        expect(typeof property.current).toEqual('string');
    });

    it('should have boolean current', () => {
        const value = true;
        const property = Property<boolean>.build(owner, value);

        expect(property.current).toEqual(value);
        expect(typeof property.current).toEqual('boolean');
    });

    it('should have object current', () => {
        const value = { foo: 5 };
        const property = Property<{ foo: number }>.build(owner, value);

        expect(property.current).toEqual(value);
        expect(typeof property.current).toEqual('object');
        expect(property.current).toBeInstanceOf(Object);
    });

    it('should have array current', () => {
        const value = [1, 2, 3];
        const property = Property<number[]>.build(owner, value);

        expect(property.current).toEqual(value);
        expect(typeof property.current).toEqual('object');
        expect(Array.isArray(property.current)).toBeTruthy();
    });

    it('should have enum current', () => {
        enum TestEnum {
            ONE = 'ONE',
            TWO = 'TWO',
        }
        const value: TestEnum = TestEnum.ONE;
        const property = Property<TestEnum>.build(owner, value);

        expect(property.current).toEqual(value);
        expect(typeof property.current).toEqual('string');
        expect(property.current in TestEnum).toBeTruthy();
    });

    it('should have some class current', () => {
        class Test {
            public field = 1;
        }
        const value = new Test();
        const property = Property<Test>.build(owner, value);

        expect(property.current).toEqual(value);
        expect(typeof property.current).toEqual('object');
        expect(property.current).toBeInstanceOf(Test);
    });

    it('should have another property current', () => {
        const value = Property<number>.build(owner, 1);
        const property = Property<Property<number>>.build(owner, value);

        expect(property.current).toEqual(value);
        expect(typeof property.current).toEqual('object');
        expect(property.current.current).toEqual(1);
    });

    it('should compare equal values', () => {
        const value = Property<number>.build(owner, 1);
        const value2 = Property<number>.build(owner, 1);

        expect(value.isEqual(value2)).toBeTruthy();
        expect(value.isEqualValue(value2.current)).toBeTruthy();
    });

    it('should compare not equal values', () => {
        const value = Property<number>.build(owner, 1);
        const value2 = Property<number>.build(owner, 2);

        expect(value.isEqual(value2)).toBeFalsy();
        expect(value.isEqualValue(value2.current)).toBeFalsy();
    });

    describe('using in the class', () => {
        it('should add default component to class', () => {
            const Actor = entityBuilder({
                comp: Property<number>.factory(3),
            });

            const actor = Actor.build();

            expect(actor).toBeTruthy();
            expect(actor.component.comp).toBeTruthy();
            expect(actor.component.comp.current).toEqual(3);
        });
    });
});
