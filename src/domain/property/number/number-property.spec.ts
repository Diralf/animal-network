import { componentBuilder } from '../../components/component/component';
import { NumberProperty } from './number-property';

describe('NumberProperty', () => {
    const owner = { component: {} };
    describe('should have default value', () => {
        it('when no options', () => {
            const numberProperty = componentBuilder(NumberProperty)()({ owner });

            expect(numberProperty.default).toEqual(0);
        });

        it('when no default in options', () => {
            const numberProperty = componentBuilder(NumberProperty)({})({ owner });

            expect(numberProperty.default).toEqual(0);
        });

        it('when default in options', () => {
            const defaultValue = 10;
            const numberProperty = componentBuilder(NumberProperty)({ defaultValue })({ owner });

            expect(numberProperty.default).toEqual(defaultValue);
        });

        it('when default is lower than min', () => {
            const min = 10;
            const defaultValue = 5;

            expect(() => componentBuilder(NumberProperty)({
                defaultValue,
                min,
            })({ owner })).toThrowError();
        });

        it('when default is greater than max', () => {
            const max = 10;
            const defaultValue = 50;

            expect(() => componentBuilder(NumberProperty)({
                defaultValue,
                max,
            })({ owner })).toThrowError();
        });
    });

    describe('should have min value', () => {
        it('when no options', () => {
            const numberProperty = componentBuilder(NumberProperty)()({ owner });

            expect(numberProperty.min).toEqual(-Number.MAX_SAFE_INTEGER);
        });

        it('when no min in options', () => {
            const numberProperty = componentBuilder(NumberProperty)({})({ owner });

            expect(numberProperty.min).toEqual(-Number.MAX_SAFE_INTEGER);
        });

        it('when min in options', () => {
            const minValue = -10;
            const numberProperty = componentBuilder(NumberProperty)({ min: minValue })({ owner });

            expect(numberProperty.min).toEqual(minValue);
        });
    });

    describe('should have max value', () => {
        it('when no options', () => {
            const numberProperty = componentBuilder(NumberProperty)()({ owner });

            expect(numberProperty.max).toEqual(Number.MAX_SAFE_INTEGER);
        });

        it('when no max in options', () => {
            const numberProperty = componentBuilder(NumberProperty)({})({ owner });

            expect(numberProperty.max).toEqual(Number.MAX_SAFE_INTEGER);
        });

        it('when max in options', () => {
            const maxValue = 10;
            const numberProperty = componentBuilder(NumberProperty)({ max: maxValue })({ owner });

            expect(numberProperty.max).toEqual(maxValue);
        });
    });

    describe('should have current value', () => {
        it('when no options', () => {
            const numberProperty = componentBuilder(NumberProperty)()({ owner });

            expect(numberProperty.current).toEqual(numberProperty.default);
        });

        it('when no default in options', () => {
            const numberProperty = componentBuilder(NumberProperty)({})({ owner });

            expect(numberProperty.current).toEqual(numberProperty.default);
        });

        it('when default in options', () => {
            const defaultValue = 10;
            const numberProperty = componentBuilder(NumberProperty)({ defaultValue })({ owner });

            expect(numberProperty.current).toEqual(defaultValue);
        });

        it('when new value is valid', () => {
            const newNumber = 5;
            const numberProperty = componentBuilder(NumberProperty)()({ owner });

            numberProperty.current = newNumber;

            expect(numberProperty.current).toEqual(newNumber);
        });

        it('when new value is lower than min', () => {
            const min = -10;
            const newValue = -50;
            const numberProperty = componentBuilder(NumberProperty)({ min })({ owner });

            expect(() => {
                numberProperty.current = newValue;
            }).toThrowError();
        });

        it('when new value is greater than max', () => {
            const max = 10;
            const newValue = 50;
            const numberProperty = componentBuilder(NumberProperty)({ max })({ owner });

            expect(() => {
                numberProperty.current = newValue;
            }).toThrowError();
        });
    });

    describe('getOutOfRangeError', () => {
        it('should return error', () => {
            const max = 10;
            const min = -10;
            const value = 20;
            const numberProperty = componentBuilder(NumberProperty)({
                max,
                min,
            })({ owner });

            const error = numberProperty.getOutOfRangeError(value);

            expect(() => {
                throw error;
            }).toThrowError(`Value out of range. Value ${value}, allowed [${min}, ${max}]`);
        });
    });
});
