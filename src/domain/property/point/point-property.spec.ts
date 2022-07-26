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
    })
});
