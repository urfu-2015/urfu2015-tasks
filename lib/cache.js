'use strict';

const Redis = require('ioredis');

class Cache {
    constructor() {
        this._cache = new Redis();
    }

    memoize(key, maxAge, fn) {
        const cache = this._cache;

        return cache.get(key)
            .then(value => {
                if (value) {
                    return JSON.parse(value);
                }

                return Promise.resolve()
                    .then(fn)
                    .then(result => {
                        cache.setex(key, maxAge, JSON.stringify(result));
                        return result;
                    });
            });
    }
}

module.exports = Cache;

