import {NumberProperty} from "./number-property";

describe('NumberProperty', () => {
    describe('should have default value', () => {
        it('when no options', () => {
            const numberProperty = new NumberProperty();

            expect(numberProperty.default).toEqual(0);
        });

        it('when no default in options', () => {
            const numberProperty = new NumberProperty({});

            expect(numberProperty.default).toEqual(0);
        });

        it('when default in options', () => {
            const defaultValue = 10;
            const numberProperty = new NumberProperty({ defaultValue });

            expect(numberProperty.default).toEqual(defaultValue);
        });

        it('when default is lower than min', () => {
            const min = 10;
            const defaultValue = 5;

            expect(() => {
                new NumberProperty({ defaultValue, min })
            }).toThrowError();
        });

        it('when default is greater than max', () => {
            const max = 10;
            const defaultValue = 50;

            expect(() => {
                new NumberProperty({ defaultValue, max })
            }).toThrowError();
        });
    });

    describe('should have min value', () => {
        it('when no options', () => {
            const numberProperty = new NumberProperty();

            expect(numberProperty.min).toEqual(-Number.MAX_SAFE_INTEGER);
        });

        it('when no min in options', () => {
            const numberProperty = new NumberProperty({});

            expect(numberProperty.min).toEqual(-Number.MAX_SAFE_INTEGER);
        });

        it('when min in options', () => {
            const minValue = -10;
            const numberProperty = new NumberProperty({ min: minValue });

            expect(numberProperty.min).toEqual(minValue);
        });
    });

    describe('should have max value', () => {
        it('when no options', () => {
            const numberProperty = new NumberProperty();

            expect(numberProperty.max).toEqual(Number.MAX_SAFE_INTEGER);
        });

        it('when no max in options', () => {
            const numberProperty = new NumberProperty({});

            expect(numberProperty.max).toEqual(Number.MAX_SAFE_INTEGER);
        });

        it('when max in options', () => {
            const maxValue = 10;
            const numberProperty = new NumberProperty({ max: maxValue });

            expect(numberProperty.max).toEqual(maxValue);
        });
    });

    describe('should have current value', () => {
        it('when no options', () => {
            const numberProperty = new NumberProperty();

            expect(numberProperty.current).toEqual(numberProperty.default);
        });

        it('when no default in options', () => {
            const numberProperty = new NumberProperty({});

            expect(numberProperty.current).toEqual(numberProperty.default);
        });

        it('when default in options', () => {
            const defaultValue = 10;
            const numberProperty = new NumberProperty({ defaultValue });

            expect(numberProperty.current).toEqual(defaultValue);
        });

        it('when new value is valid', () => {
            const newNumber = 5;
            const numberProperty = new NumberProperty();

            numberProperty.current = newNumber;

            expect(numberProperty.current).toEqual(newNumber);
        });

        it('when new value is lower than min', () => {
            const min = -10;
            const newValue = -50;
            const numberProperty = new NumberProperty({ min });

            expect(() => {
                numberProperty.current = newValue;
            }).toThrowError();
        });

        it('when new value is greater than max', () => {
            const max = 10;
            const newValue = 50;
            const numberProperty = new NumberProperty({ max });

            expect(() => {
                numberProperty.current = newValue;
            }).toThrowError();
        });
    });
});
