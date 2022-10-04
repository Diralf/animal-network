import { componentBuilder } from '../../components/component/component';
import { entityBuilder } from '../../components/entity-builder/entity-builder';
import { Property } from './base-property';

describe('BaseProperty', () => {
    const owner = { component: {} };

    it('should be truthy', () => {
        const property: Property<number> = componentBuilder(Property<number>)(0)({ owner });

        expect(property).toBeTruthy();
    });

    it('should get current', () => {
        const property = componentBuilder(Property<number>)(3)({ owner });

        expect(property.current).toBeTruthy();
        expect(property.current).toEqual(3);
    });

    it('should set and get current', () => {
        const property = componentBuilder(Property<number>)(0)({ owner });

        property.current = 5;

        expect(property.current).toEqual(5);
    });

    it('should have number current', () => {
        const value = 1;
        const property = componentBuilder(Property<number>)(value)({ owner });

        expect(property.current).toEqual(value);
        expect(typeof property.current).toEqual('number');
    });

    it('should have string current', () => {
        const value = '123';
        const property = componentBuilder(Property<string>)(value)({ owner });

        expect(property.current).toEqual(value);
        expect(typeof property.current).toEqual('string');
    });

    it('should have boolean current', () => {
        const value = true;
        const property = componentBuilder(Property<boolean>)(value)({ owner });

        expect(property.current).toEqual(value);
        expect(typeof property.current).toEqual('boolean');
    });

    it('should have object current', () => {
        const value = { foo: 5 };
        const property = componentBuilder(Property<{ foo: number }>)(value)({ owner });

        expect(property.current).toEqual(value);
        expect(typeof property.current).toEqual('object');
        expect(property.current).toBeInstanceOf(Object);
    });

    it('should have array current', () => {
        const value = [1, 2, 3];
        const property = componentBuilder(Property<number[]>)(value)({ owner });

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
        const property = componentBuilder(Property<TestEnum>)(value)({ owner });

        expect(property.current).toEqual(value);
        expect(typeof property.current).toEqual('string');
        expect(property.current in TestEnum).toBeTruthy();
    });

    it('should have some class current', () => {
        class Test {
            public field = 1;
        }
        const value = new Test();
        const property = componentBuilder(Property<Test>)(value)({ owner });

        expect(property.current).toEqual(value);
        expect(typeof property.current).toEqual('object');
        expect(property.current).toBeInstanceOf(Test);
    });

    it('should have another property current', () => {
        const value = componentBuilder(Property<number>)(1)({ owner });
        const property = componentBuilder(Property<Property<number>>)(value)({ owner });

        expect(property.current).toEqual(value);
        expect(typeof property.current).toEqual('object');
        expect(property.current.current).toEqual(1);
    });

    it('should compare equal values', () => {
        const value = componentBuilder(Property<number>)(1)({ owner });
        const value2 = componentBuilder(Property<number>)(1)({ owner });

        expect(value.isEqual(value2)).toBeTruthy();
        expect(value.isEqualValue(value2.current)).toBeTruthy();
    });

    it('should compare not equal values', () => {
        const value = componentBuilder(Property<number>)(1)({ owner });
        const value2 = componentBuilder(Property<number>)(2)({ owner });

        expect(value.isEqual(value2)).toBeFalsy();
        expect(value.isEqualValue(value2.current)).toBeFalsy();
    });

    describe('using in the class', () => {
        it('should add default component to class', () => {
            const Actor = entityBuilder({
                comp: componentBuilder(Property<number>)(3),
            });

            const actor = Actor.build();

            expect(actor).toBeTruthy();
            expect(actor.component.comp).toBeTruthy();
            expect(actor.component.comp.current).toEqual(3);
        });
    });
});
