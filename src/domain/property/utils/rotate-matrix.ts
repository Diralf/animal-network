export const rotateMatrix = (matrix: number[][], direction: number): number[][] => {
    const result: number[][] = [];

    if (direction === 1 || direction === -3) {
        for (let i = 0, y = 0; i < matrix[0].length; i++, y++) {
            for (let j = matrix.length - 1, x = 0; j >= 0; j--, x++) {
                if (!result[y]) {
                    result[y] = [];
                }
                result[y][x] = matrix[j][i];
            }
        }
    }

    if (direction === -1 || direction === 3) {
        for (let i = matrix[0].length - 1, y = 0; i >= 0; i--, y++) {
            for (let j = 0, x = 0; j < matrix.length; j++, x++) {
                if (!result[y]) {
                    result[y] = [];
                }
                result[y][x] = matrix[j][i];
            }
        }
    }

    if (direction === 2 || direction === -2) {
        for (let i = matrix.length - 1, y = 0; i >= 0; i--, y++) {
            for (let j = matrix[0].length - 1, x = 0; j >= 0; j--, x++) {
                if (!result[y]) {
                    result[y] = [];
                }
                result[y][x] = matrix[i][j];
            }
        }
    }

    if (direction === 0) {
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[0].length; x++) {
                if (!result[y]) {
                    result[y] = [];
                }
                result[y][x] = matrix[y][x];
            }
        }
    }

    return result;
};
