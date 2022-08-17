export const arrayToMatrix = (array: number[], rowSize: number): number[][] =>
    new Array(rowSize).fill(0)
        .map((zero, index) => array.slice(index * rowSize, (index * rowSize) + rowSize));
