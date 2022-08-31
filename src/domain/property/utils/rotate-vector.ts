import { RawPoint } from '../point/raw-point';

export const rotateVector = (point: RawPoint, angle: number): RawPoint => {
    const rad = angle * (Math.PI / 180);

    const result = {
        x: +((Math.cos(rad) * point.x) - (Math.sin(rad) * point.y)).toFixed(3),
        y: +((Math.sin(rad) * point.x) + (Math.cos(rad) * point.y)).toFixed(3),
    };

    return {
        x: normalizeZero(result.x),
        y: normalizeZero(result.y),
    };
};

const normalizeZero = (value: number) => {
    return value === -0 ? 0 : value;
};

export const angleOfVector = (point: RawPoint) => {
    const result = Math.atan2(point.y, point.x) / (Math.PI / 180);
    if (result === -180) {
        return 180;
    }
    return normalizeZero(result);
}
