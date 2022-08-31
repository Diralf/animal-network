import { rotateMatrix } from './rotate-matrix';

describe('rotateMatrix', () => {
    it('should rotate matrix by 1', () => {
        const matrix = [
            [1, 2, 3],
            [4, 5, 6],
        ];
        const expected = [
            [4, 1],
            [5, 2],
            [6, 3],
        ];

        const result = rotateMatrix(matrix, 1);

        expect(result).toEqual(expected);
    });

    it('should rotate matrix by -1', () => {
        const matrix = [
            [4, 1],
            [5, 2],
            [6, 3],
        ];
        const expected = [
            [1, 2, 3],
            [4, 5, 6],
        ];

        const result = rotateMatrix(matrix, -1);

        expect(result).toEqual(expected);
    });

    it('should rotate matrix by 2', () => {
        const matrix = [
            [1, 2, 3],
            [4, 5, 6],
        ];
        const expected = [
            [6, 5, 4],
            [3, 2, 1],
        ];

        const result = rotateMatrix(matrix, 2);

        expect(result).toEqual(expected);
    });

    it('should rotate matrix by 0', () => {
        const matrix = [
            [1, 2, 3],
            [4, 5, 6],
        ];

        const result = rotateMatrix(matrix, 0);

        expect(result).toEqual(matrix);
    });
});
