import {Entity, EntityProperties} from "./entity";

describe('Entity', () => {
    it('should be created correctly', () => {
        const entity = new Entity();

        expect(entity).toBeTruthy();
    });

    describe.each<{ property: keyof EntityProperties, min: number, max: number, defaultValue: number, custom: number }>([
        { property: 'size', min: 1, max: 100, defaultValue: 1, custom: 50 },
    ])('number property $property', ({ property, min, max, defaultValue, custom }) => {
        describe('default', () => {
            it(`should be equal to default ${defaultValue}`, () => {
                const entity = new Entity();

                expect(entity.getPropertyValue(property)).toEqual(defaultValue);
            });

            it(`should be greater or equal than ${min}`, () => {
                const entity = new Entity();

                expect(entity.getPropertyValue(property)).toBeGreaterThanOrEqual(min);
            });

            it(`should less or equal than ${max}`, () => {
                const entity = new Entity();

                expect(entity.getPropertyValue(property)).toBeLessThanOrEqual(max);
            });
        });

        describe('defined', () => {
            it('should be initially defined', () => {
                const entity = new Entity({ [property]: custom });

                expect(entity.getPropertyValue(property)).toEqual(custom);
            });

            it(`should be greater or equal than ${min}`, () => {
                const entity = new Entity({ [property]: min });

                expect(entity.getPropertyValue(property)).toBeGreaterThanOrEqual(min);
            });

            it(`should throw an error when less than ${min}`, () => {
                expect(() => {
                    new Entity({ [property]: min - 1 });
                }).toThrowError();
            });

            it(`should less or equal than ${max}`, () => {
                const entity = new Entity({ [property]: max });

                expect(entity.getPropertyValue(property)).toBeLessThanOrEqual(max);
            });

            it(`should throw an error when greater than ${max}`, () => {
                expect(() => {
                    new Entity({ [property]: max + 1 });
                }).toThrowError();
            });
        });
    });
});
