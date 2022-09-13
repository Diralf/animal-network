export const memo = <Input extends unknown[], Output>(func: (...args: Input) => Output, cacheMaxSize = 1000) => {
    const cache = new Map<string, Output>();
    const wasUsed = new Set<string>();

    return {
        call: (...args: Input) => {
            const key = JSON.stringify(args);
            const cacheValue = cache.get(key);
            if (cacheValue) {
                wasUsed.add(key);
                return cacheValue;
            }
            const result = func(...args);
            cache.set(key, result);

            if (cache.size > cacheMaxSize) {
                const keys = Array.from(cache).map(([key]) => key);
                keys.forEach((key) => {
                    if (!wasUsed.has(key)) {
                        cache.delete(key);
                    }
                });
            }

            return result;
        },
    };
};
