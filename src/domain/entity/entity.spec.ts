import {Entity} from "./entity";
import {SizeProperty} from "../property/size/size-property";

describe('Entity', () => {
    it('should be created correctly', () => {
        const entity = new Entity();

        expect(entity).toBeTruthy();
    });

    describe('size', () => {
        const sizeProperty = new SizeProperty();

        describe('default size', () => {
            it('should have default size when no options', () => {
                const entity = new Entity();

                expect(entity.getPropertyValue('size')).toEqual(sizeProperty.default);
            });

            it('should have default size when options does not contain size', () => {
                const entity = new Entity({});

                expect(entity.getPropertyValue('size')).toEqual(sizeProperty.default);
            });
        });

        describe.each([sizeProperty.default, sizeProperty.min, sizeProperty.max])('valid size %p', (size) => {
            it('should have initially set size', () => {
                const entity = new Entity({
                    size,
                });

                expect(entity.getPropertyValue('size')).toEqual(size);
            });

            it('should have set size', () => {
                const entity = new Entity();

                entity.setPropertyValue('size', size);

                expect(entity.getPropertyValue('size')).toEqual(size);
            });
        });

        describe.each([sizeProperty.min - 1, sizeProperty.max + 1])('invalid size %p', (size) => {
            it('should have initially set size', () => {
                const sizeProperty = new SizeProperty();
                expect(() => {
                    new Entity({
                        size,
                    });
                }).toThrowError(sizeProperty.getOutOfRangeError(size));
            });

            it('should have set size', () => {
                const sizeProperty = new SizeProperty();
                const entity = new Entity();

                expect(() => {
                    entity.setPropertyValue('size', size);
                }).toThrowError(sizeProperty.getOutOfRangeError(size));
            });
        });
    });
});
