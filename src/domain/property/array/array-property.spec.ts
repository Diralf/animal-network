import { ArrayProperty } from './array-property';

describe('ArrayProperty', () => {
    it.each([
        {
            value1: [],
            value2: [],
            expected: true,
        },
        {
            value1: [1],
            value2: [1],
            expected: true,
        },
        {
            value1: [1, 2],
            value2: [1, 2],
            expected: true,
        },
        {
            value1: ['1', '2'],
            value2: ['1', '2'],
            expected: true,
        },

        {
            value1: [1],
            value2: [],
            expected: false,
        },
        {
            value1: [1, 2],
            value2: [1],
            expected: false,
        },
        {
            value1: [1],
            value2: [1, 2],
            expected: false,
        },
        {
            value1: [1, 2],
            value2: [2, 1],
            expected: false,
        },
    ])('should compare $value1 with $value2 and get $expected', ({ value1, value2, expected }) => {
        const array1 = new ArrayProperty<typeof value1[number]>(value1);

        expect(array1.isEqualValue(value2)).toEqual(expected);
    });
});
