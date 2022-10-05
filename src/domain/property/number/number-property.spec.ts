import { NumberProperty } from './number-property';

describe('NumberProperty', () => {
    const owner = { component: {} };
    describe('should have default value', () => {
        it('when no options', () => {
            const numberProperty = NumberProperty.build(owner);

            expect(numberProperty.default).toEqual(0);
        });

        it('when no default in options', () => {
            const numberProperty = NumberProperty.build(owner, {});

            expect(numberProperty.default).toEqual(0);
        });

        it('when default in options', () => {
            const defaultValue = 10;
            const numberProperty = NumberProperty.build(owner, { defaultValue });

            expect(numberProperty.default).toEqual(defaultValue);
        });

        it('when default is lower than min', () => {
            const min = 10;
            const defaultValue = 5;

            expect(() => NumberProperty.build(owner, { defaultValue, min })).toThrowError();
        });

        it('when default is greater than max', () => {
            const max = 10;
            const defaultValue = 50;

            expect(() => NumberProperty.build(owner, { defaultValue, max })).toThrowError();
        });
    });

    describe('should have min value', () => {
        it('when no options', () => {
            const numberProperty = NumberProperty.build(owner);

            expect(numberProperty.min).toEqual(-Number.MAX_SAFE_INTEGER);
        });

        it('when no min in options', () => {
            const numberProperty = NumberProperty.build(owner, {});

            expect(numberProperty.min).toEqual(-Number.MAX_SAFE_INTEGER);
        });

        it('when min in options', () => {
            const minValue = -10;
            const numberProperty = NumberProperty.build(owner, { min: minValue });

            expect(numberProperty.min).toEqual(minValue);
        });
    });

    describe('should have max value', () => {
        it('when no options', () => {
            const numberProperty = NumberProperty.build(owner);

            expect(numberProperty.max).toEqual(Number.MAX_SAFE_INTEGER);
        });

        it('when no max in options', () => {
            const numberProperty = NumberProperty.build(owner, {});

            expect(numberProperty.max).toEqual(Number.MAX_SAFE_INTEGER);
        });

        it('when max in options', () => {
            const maxValue = 10;
            const numberProperty = NumberProperty.build(owner, { max: maxValue });

            expect(numberProperty.max).toEqual(maxValue);
        });
    });

    describe('should have current value', () => {
        it('when no options', () => {
            const numberProperty = NumberProperty.build(owner);

            expect(numberProperty.current).toEqual(numberProperty.default);
        });

        it('when no default in options', () => {
            const numberProperty = NumberProperty.build(owner, {});

            expect(numberProperty.current).toEqual(numberProperty.default);
        });

        it('when default in options', () => {
            const defaultValue = 10;
            const numberProperty = NumberProperty.build(owner, { defaultValue });

            expect(numberProperty.current).toEqual(defaultValue);
        });

        it('when new value is valid', () => {
            const newNumber = 5;
            const numberProperty = NumberProperty.build(owner);

            numberProperty.current = newNumber;

            expect(numberProperty.current).toEqual(newNumber);
        });

        it('when new value is lower than min', () => {
            const min = -10;
            const newValue = -50;
            const numberProperty = NumberProperty.build(owner, { min });

            expect(() => {
                numberProperty.current = newValue;
            }).toThrowError();
        });

        it('when new value is greater than max', () => {
            const max = 10;
            const newValue = 50;
            const numberProperty = NumberProperty.build(owner, { max });

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
            const numberProperty = NumberProperty.build(owner, { min, max });

            const error = numberProperty.getOutOfRangeError(value);

            expect(() => {
                throw error;
            }).toThrowError(`Value out of range. Value ${value}, allowed [${min}, ${max}]`);
        });
    });
});
