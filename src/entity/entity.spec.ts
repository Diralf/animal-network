import {Entity} from "./entity";

describe('Entity', () => {
    it('should be created correctly', () => {
        const entity = new Entity();

        expect(entity).toBeTruthy();
    });

    describe('size', () => {
        describe('default size', () => {
            it('should have default size when no options', () => {
                const entity = new Entity();

                expect(entity.size).toEqual(1);
            });

            it('should have default size when options does not contain size', () => {
                const entity = new Entity({});

                expect(entity.size).toEqual(1);
            });
        });

        describe.each([1, 5, 50, 100])('valid size %p', (size) => {
            it('should have initially set size', () => {
                const entity = new Entity({
                    size,
                });

                expect(entity.size).toEqual(size);
            });

            it('should have set size', () => {
                const entity = new Entity();

                entity.setSize(size);

                expect(entity.size).toEqual(size);
            });
        });

        describe.each([-1, 0, 1000])('invalid size %p', (size) => {
            it('should have initially set size', () => {
                expect(() => {
                    new Entity({
                        size,
                    });
                }).toThrow('Invalid entity size');
            });

            it('should have set size', () => {
                const entity = new Entity();

                expect(() => {
                    entity.setSize(size);
                }).toThrow('Invalid entity size');
            });
        });
    });
});
