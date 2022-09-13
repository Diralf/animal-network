import { memo } from './memo';

const getMemoFunc = () => {
    const spy = jest.fn().mockImplementation((a: number, b: number) => a + b);
    return {
        memoFunc: memo(spy, 3),
        originalFuncSpy: spy,
    };
};

describe('memo', () => {
    it('should return real value', () => {
        const { memoFunc, originalFuncSpy } = getMemoFunc();

        expect(memoFunc.call(1, 2)).toEqual(3);
        expect(originalFuncSpy).toHaveBeenCalledWith(1, 2);
    });

    it('should return cached value', () => {
        const { memoFunc, originalFuncSpy } = getMemoFunc();

        expect(memoFunc.call(1, 2)).toEqual(3);
        expect(originalFuncSpy).toHaveBeenCalledTimes(1);
        expect(originalFuncSpy).toHaveBeenCalledWith(1, 2);

        expect(memoFunc.call(1, 2)).toEqual(3);
        expect(originalFuncSpy).toHaveBeenCalledTimes(1);
    });

    it('should clear cache', () => {
        const { memoFunc, originalFuncSpy } = getMemoFunc();

        // Called only here before clearing of cache
        expect(memoFunc.call(1, 2)).toEqual(3);
        expect(originalFuncSpy).toHaveBeenCalledTimes(1);
        expect(originalFuncSpy).toHaveBeenCalledWith(1, 2);

        expect(memoFunc.call(2, 2)).toEqual(4);
        expect(originalFuncSpy).toHaveBeenCalledTimes(2);
        expect(originalFuncSpy).toHaveBeenCalledWith(2, 2);

        expect(memoFunc.call(2, 2)).toEqual(4);
        expect(originalFuncSpy).toHaveBeenCalledTimes(2);

        expect(memoFunc.call(2, 3)).toEqual(5);
        expect(originalFuncSpy).toHaveBeenCalledTimes(3);
        expect(originalFuncSpy).toHaveBeenCalledWith(2, 3);

        // Cache should be cleared after this call
        expect(memoFunc.call(3, 3)).toEqual(6);
        expect(originalFuncSpy).toHaveBeenCalledTimes(4);
        expect(originalFuncSpy).toHaveBeenCalledWith(3, 3);

        // After cache clear those parameter calls real function
        expect(memoFunc.call(1, 2)).toEqual(3);
        expect(originalFuncSpy).toHaveBeenCalledTimes(5);
        expect(originalFuncSpy).toHaveBeenCalledWith(1, 2);
    });
});
