import {SizeProperty} from "./size-property";

describe('SizeProperty', () => {
    it('should have default size values', () => {
        const sizeProperty = new SizeProperty();

        expect(sizeProperty).toBeTruthy();
        expect(sizeProperty.min).toEqual(1);
        expect(sizeProperty.max).toEqual(100);
        expect(sizeProperty.default).toEqual(1);
        expect(sizeProperty.current).toEqual(sizeProperty.default);
    });

    it('should have defined current size value', () => {
        const current = 50;
        const sizeProperty = new SizeProperty({ current });

        expect(sizeProperty).toBeTruthy();
        expect(sizeProperty.min).toEqual(1);
        expect(sizeProperty.max).toEqual(100);
        expect(sizeProperty.default).toEqual(1);
        expect(sizeProperty.current).toEqual(current);
    });
});
