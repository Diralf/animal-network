import {PointProperty} from "./point-property";
import {BaseProperty} from "../base/base-property";

describe('PointProperty', () => {
    it('should be truthy', () => {
        const point = new PointProperty({
            x: 0,
            y: 0,
        });

        expect(point).toBeTruthy();
    });

    it('should be Property', () => {
        const point = new PointProperty({
            x: 0,
            y: 0,
        });

        expect(point).toBeInstanceOf(BaseProperty);
    });

    it.each([
        [{ x: 0, y: 0}, { x: 0, y: 0}, true],
        [{ x: 0, y: 1}, { x: 0, y: 1}, true],
        [{ x: 1, y: 0}, { x: 1, y: 0}, true],
        [{ x: 1, y: 1}, { x: 1, y: 1}, true],

        [{ x: 0, y: 0}, { x: 0, y: 1}, false],
        [{ x: 0, y: 0}, { x: 1, y: 0}, false],
        [{ x: 0, y: 0}, { x: 1, y: 1}, false],
        [{ x: 0, y: 1}, { x: 0, y: 0}, false],
        [{ x: 0, y: 1}, { x: 1, y: 0}, false],
        [{ x: 0, y: 1}, { x: 1, y: 1}, false],
        [{ x: 1, y: 0}, { x: 0, y: 0}, false],
        [{ x: 1, y: 0}, { x: 0, y: 1}, false],
        [{ x: 1, y: 0}, { x: 1, y: 1}, false],
        [{ x: 1, y: 1}, { x: 0, y: 0}, false],
        [{ x: 1, y: 1}, { x: 0, y: 1}, false],
        [{ x: 1, y: 1}, { x: 1, y: 0}, false],

        [{ x: 1, y: 1}, { x: 1, y: 2}, false],
    ])('should compare equal values %p %p %p', (rawPoint1, rawPoint2, expected) => {
        const point = new PointProperty(rawPoint1);
        const point2 = new PointProperty(rawPoint2);

        expect(point.isEqual(point2)).toEqual(expected);
        expect(point.isEqualValue(point2.current)).toEqual(expected);
    });
});
