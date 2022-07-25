import {Entity} from "./entity";

describe('Entity', () => {
    it('should be created correctly', () => {
        const entity = new Entity();

        expect(entity).toBeTruthy();
    });

    describe('size', () => {
        describe('default', () => {
            it('should be greater than zero', () => {
                const entity = new Entity();

                expect(entity.getPropertyValue('size')).toBeGreaterThan(0);
            });

            it('should less or equal than 100', () => {
                const entity = new Entity();

                expect(entity.getPropertyValue('size')).toBeLessThanOrEqual(100);
            });
        });

        describe('defined', () => {
            it('should be initially defined', () => {
                const size = 50;
                const entity = new Entity({ size });

                expect(entity.getPropertyValue('size')).toEqual(size);
            });

            it('should be greater than zero', () => {
                const entity = new Entity({ size: 1 });

                expect(entity.getPropertyValue('size')).toBeGreaterThan(0);
            });

            it('should throw an error when less than 1', () => {
               expect(() => {
                   new Entity({size: 0});
               }).toThrowError();
            });

            it('should less or equal than 100', () => {
                const entity = new Entity({ size: 100 });

                expect(entity.getPropertyValue('size')).toBeLessThanOrEqual(100);
            });

            it('should throw an error when greater than 100', () => {
                expect(() => {
                    new Entity({size: 101});
                }).toThrowError();
            });
        });
    });
});
