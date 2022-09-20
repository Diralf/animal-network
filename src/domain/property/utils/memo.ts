export const memo = <Input extends unknown[], Output>(func: (...args: Input) => Output, cacheMaxSize = 1000) => {
    const cache = new Map<string, Output>();
    const usage: string[] = [];

    const addToCache = (key: string, result: Output) => {
        cache.set(key, result);

        const previousUsageIndex = usage.indexOf(key);
        if (previousUsageIndex >= 0) {
            usage.splice(previousUsageIndex, 1);
        }
        usage.unshift(key);

        if (usage.length > cacheMaxSize) {
            const keysToDelete = usage.splice(cacheMaxSize, usage.length - cacheMaxSize);
            keysToDelete.forEach((key) => {
                cache.delete(key);
            });
        }
    };

    return {
        call: (...args: Input) => {
            const key = JSON.stringify(args);
            const cacheValue = cache.get(key);
            if (cacheValue) {
                return cacheValue;
            }
            const result = func(...args);

            addToCache(key, result);

            return result;
        },
    };
};
