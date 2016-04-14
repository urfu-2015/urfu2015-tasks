'use strict';

const LRU = require('lru-cache');

class Cache {
    constructor() {
        this._cache = new LRU();
    }

    memoize(key, maxAge, fn) {
        const cache = this._cache;
        const value = cache.get(key);
        if (value) {
            return Promise.resolve(value);
        }

        return Promise.resolve()
            .then(fn)
            .then(result => {
                cache.set(key, result, maxAge * 1000);
                return result;
            });
    }
}

module.exports = Cache;

