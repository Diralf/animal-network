import { memo } from './memo';

const getMemoFunc = () => {
    const spy = jest.fn().mockImplementation((a: number, b: number) => a + b);
    return {
        memoFunc: memo(spy, 3),
        originalFuncSpy: spy,
    };
};

describe('memo', () => {
    it.each([
        {
            case: 'return real value',
            steps: [{ input: [1, 2], output: 3, cached: false }],
        },
        {
            case: 'return cached value',
            steps: [
                { input: [1, 2], output: 3, cached: false },
                { input: [1, 2], output: 3, cached: true },
            ],
        },
        {
            case: 'clear cache at size exceeding',
            steps: [
                // Called only here before clearing of cache
                { input: [1, 2], output: 3, cached: false },    // [12]
                { input: [2, 2], output: 4, cached: false },    // [22, 12]
                { input: [2, 2], output: 4, cached: true },     // [22, 12]
                { input: [2, 3], output: 5, cached: false },    // [23, 22, 12]
                // Cache should be cleared after this call
                { input: [3, 3], output: 6, cached: false },    // [33, 23, 22]
                { input: [2, 3], output: 5, cached: true },     // [23, 33, 22]
                // After cache clear those parameter calls real function
                { input: [1, 2], output: 3, cached: false },    // [12, 33, 23]
                { input: [2, 2], output: 4, cached: false },
            ],
        },
    ])('should $case', ({ steps }) => {
        const { memoFunc, originalFuncSpy } = getMemoFunc();

        steps.forEach(({ input, output, cached }) => {
            expect(memoFunc.call(...input)).toEqual(output);
            if (cached) {
                expect(originalFuncSpy).not.toHaveBeenCalled();
            } else {
                expect(originalFuncSpy).toHaveBeenCalledWith(...input);
                expect(originalFuncSpy).toHaveBeenCalledTimes(1);
            }
            originalFuncSpy.mockClear();
        });
    });
});
