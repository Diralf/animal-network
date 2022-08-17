export const visualEntitiesAsString = (matrix: number[][], emptyCell = '_'): string =>
    matrix
        .map((row) => row.join(','))
        .join('\n')
        .replaceAll('0', emptyCell);
