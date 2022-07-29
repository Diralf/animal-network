import {BaseProperty} from "./base-property";

describe('BaseProperty', () => {
    it('should be truthy', () => {
        const property = new BaseProperty<number>(0);

        expect(property).toBeTruthy();
    });

    it('should get current', () => {
        const property = new BaseProperty<number>(3);

        expect(property.current).toEqual(3);
    });

    it('should set and get current', () => {
        const property = new BaseProperty<number>(0);

        property.current = 5;

        expect(property.current).toEqual(5);
    });

    it('should have number current', () => {
        const value = 1;
        const property = new BaseProperty<number>(value);

        expect(property.current).toEqual(value);
        expect(typeof property.current).toEqual('number');
    });

    it('should have string current', () => {
        const value = '123';
        const property = new BaseProperty<string>(value);

        expect(property.current).toEqual(value);
        expect(typeof property.current).toEqual('string');
    });

    it('should have boolean current', () => {
        const value = true;
        const property = new BaseProperty<boolean>(value);

        expect(property.current).toEqual(value);
        expect(typeof property.current).toEqual('boolean');
    });

    it('should have object current', () => {
        const value = { a: 5 };
        const property = new BaseProperty<{ a: number }>(value);

        expect(property.current).toEqual(value);
        expect(typeof property.current).toEqual('object');
        expect(property.current).toBeInstanceOf(Object);
    });

    it('should have array current', () => {
        const value = [1, 2, 3];
        const property = new BaseProperty<number[]>(value);

        expect(property.current).toEqual(value);
        expect(typeof property.current).toEqual('object');
        expect(Array.isArray(property.current)).toBeTruthy();
    });

    it('should have enum current', () => {
        enum TestEnum {
            ONE = 'ONE',
            TWO = 'TWO'
        }
        const value: TestEnum = TestEnum.ONE;
        const property = new BaseProperty<TestEnum>(value);

        expect(property.current).toEqual(value);
        expect(typeof property.current).toEqual('string');
        expect(property.current in TestEnum).toBeTruthy();
    });

    it('should have some class current', () => {
        class Test {
            a: number = 3;
        }
        const value = new Test();
        const property = new BaseProperty<Test>(value);

        expect(property.current).toEqual(value);
        expect(typeof property.current).toEqual('object');
        expect(property.current).toBeInstanceOf(Test);
    });

    it('should have another property current', () => {
        const value = new BaseProperty<number>(1);
        const property = new BaseProperty<BaseProperty<number>>(value);

        expect(property.current).toEqual(value);
        expect(typeof property.current).toEqual('object');
        expect(property.current).toBeInstanceOf(BaseProperty);
    });

    it('should compare equal values', () => {
        const value = new BaseProperty<number>(1);
        const value2 = new BaseProperty<number>(1);

        expect(value.isEqual(value2)).toBeTruthy();
        expect(value.isEqualValue(value2.current)).toBeTruthy();
    });

    it('should compare not equal values', () => {
        const value = new BaseProperty<number>(1);
        const value2 = new BaseProperty<number>(2);

        expect(value.isEqual(value2)).toBeFalsy();
        expect(value.isEqualValue(value2.current)).toBeFalsy();
    });
});
