'use strict';
const fs = require('fs');
const path = require('path');
const urlLib = require('url');
const got = require('got');
const log = require('npmlog');

const mode = (function () {
    if (process.env.DEMO) {
        return 'demo';
    }

    if (process.env.RECORD) {
        return 'record';
    }

    return 'none';
})();

function makeKey(query) {
    const url = urlLib.parse(query);

    return url.hostname + ':' + url.pathname.split('/').filter(Boolean).join('.');
}

function getFilename(key) {
    return path.join(__dirname, 'fixtures', `${key}.txt`);
}

function record(query, options) {
    const key = makeKey(query);

    return got(query)
        .then(req => req.body)
        .then(data => {
            fs.writeFileSync(getFilename(key), data);

            return {
                body: options.json ? JSON.parse(data) : data
            };
        });
}

function delay(data) {
    const latency = 900 + Math.random() * 100;

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(data);
        }, latency);
    });
}

function mock(query, options) {
    const key = makeKey(query);

    const promise = new Promise((resolve, reject) => {
        fs.readFile(getFilename(key), (err, data) => {
            if (err) {
                return reject(err);
            }

            resolve(data.toString());
        });
    });

    return promise
        .then(data => {
            return {
                body: options.json ? JSON.parse(data) : data
            };
        })
        .then(delay);
}

function fakeGot(query, options) {
    options = options || {};
    if (mode === 'record') {
        return record(query, options);
    }

    if (mode === 'demo') {
        let start = Date.now();

        return mock(query, options)
            .then(result => {
                const url = query.split('?')[0];
                start = Date.now() - start;
                log.info(`← GET ${url} ${start} ms`);

                return result;
            });
    }

    return got(query, options);
}

require.cache[require.resolve('got')].exports = fakeGot;
