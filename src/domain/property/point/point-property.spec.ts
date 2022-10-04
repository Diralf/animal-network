import { componentBuilder } from '../../components/component/component';
import { PointProperty } from './point-property';
import { RawPoint } from './raw-point';

describe('PointProperty', () => {
    function getPointProperty(point: RawPoint) {
        return componentBuilder(PointProperty)(point)({ props: point, owner: { component: {} } });
    }

    it('should be truthy', () => {
        const point = getPointProperty({
            x: 0,
            y: 0,
        });

        expect(point).toBeTruthy();
    });

    it('should be Property', () => {
        const point = getPointProperty({
            x: 0,
            y: 0,
        });

        expect(point).toBeInstanceOf(PointProperty);
    });

    it.each([
        [{ x: 0, y: 0 }, { x: 0, y: 0 }, true],
        [{ x: 0, y: 1 }, { x: 0, y: 1 }, true],
        [{
            x: 1,
            y: 0,
        }, {
            x: 1,
            y: 0,
        }, true],
        [{
            x: 1,
            y: 1,
        }, {
            x: 1,
            y: 1,
        }, true],

        [{
            x: 0,
            y: 0,
        }, {
            x: 0,
            y: 1,
        }, false],
        [{
            x: 0,
            y: 0,
        }, {
            x: 1,
            y: 0,
        }, false],
        [{
            x: 0,
            y: 0,
        }, {
            x: 1,
            y: 1,
        }, false],
        [{
            x: 0,
            y: 1,
        }, {
            x: 0,
            y: 0,
        }, false],
        [{
            x: 0,
            y: 1,
        }, {
            x: 1,
            y: 0,
        }, false],
        [{
            x: 0,
            y: 1,
        }, {
            x: 1,
            y: 1,
        }, false],
        [{
            x: 1,
            y: 0,
        }, {
            x: 0,
            y: 0,
        }, false],
        [{
            x: 1,
            y: 0,
        }, {
            x: 0,
            y: 1,
        }, false],
        [{
            x: 1,
            y: 0,
        }, {
            x: 1,
            y: 1,
        }, false],
        [{
            x: 1,
            y: 1,
        }, {
            x: 0,
            y: 0,
        }, false],
        [{
            x: 1,
            y: 1,
        }, {
            x: 0,
            y: 1,
        }, false],
        [{
            x: 1,
            y: 1,
        }, {
            x: 1,
            y: 0,
        }, false],

        [{
            x: 1,
            y: 1,
        }, {
            x: 1,
            y: 2,
        }, false],
    ])('should compare equal values %p %p %p', (rawPoint1, rawPoint2, expected) => {
        const point = getPointProperty(rawPoint1);
        const point2 = getPointProperty(rawPoint2);

        expect(point.isEqual(point2)).toEqual(expected);
        expect(point.isEqualValue(point2.current)).toEqual(expected);
    });
});
