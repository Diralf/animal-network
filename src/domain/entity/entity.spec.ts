import {Entity, EntityProperties} from "./entity";
import {SIZE} from "./entity.contants";

describe('Entity', () => {
    it('should be created correctly', () => {
        const entity = new Entity();

        expect(entity).toBeTruthy();
    });

    describe.each<{ property: keyof EntityProperties, min: number, max: number, defaultValue: number, custom: number }>([
        { property: 'size', min: SIZE.MIN, max: SIZE.MAX, defaultValue: SIZE.DEFAULT, custom: 50 },
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

    describe('position', () => {
        describe('default', () => {
            it(`should be equal to default {x: 0, y: 0}`, () => {
                const entity = new Entity();

                expect(entity.getPropertyValue('position')).toEqual({ x: 0, y: 0 });
            });
        });

        describe('defined', () => {
            it('should be initially defined', () => {
                const point = { x: 1, y: 2 };
                const entity = new Entity({ position: point });

                expect(entity.getPropertyValue('position')).toEqual(point);
            });
        });
    });
});
