'use strict';
var assert = require('power-assert'),
    util = require('../../../lib/util/util.js');

describe('20_util/00_util', function () {
    var got, exp;

    it('require', function () {
        assert(typeof util === 'object', 'is object');
    });

    it('parts', function () {
        got = util.parts;
        exp = [ 'head', 'body', 'arm', 'waist', 'leg', 'weapon', 'oma' ];
        assert.deepEqual(got, exp, 'parts');
    });

    it('clone', function () {
        got = util.clone({ a: 1, b: 2 });
        exp = { a: 1, b: 2 };
        assert.deepEqual(got, exp, 'skillComb');

        got = util.clone({});
        exp = {};
        assert.deepEqual(got, exp, 'empty');

        got = util.clone(null);
        exp = null;
        assert.deepEqual(got, exp, 'null');

        got = util.clone();
        exp = null;
        assert.deepEqual(got, exp, 'nothing in');
    });

    it('has', function () {
        var obj;

        obj = { a: 'A' };
        got = util.has(obj, 'a');
        assert(got === true, 'has');

        try { util.has(null, 'a'); } catch (e) { got = e; }
        assert(got instanceof Error, 'null');
    });

    it('isArray', function () {
        got = util.isArray('string');
        assert(got === false, 'string');
        got = util.isArray([]);
        assert(got === true, '[]');
        got = util.isArray({});
        assert(got === false, '{}');

        got = util.isArray(null);
        assert(got === false, 'null');
        got = util.isArray();
        assert(got === false, 'nothing in');
    });

    it('isObject', function () {
        got = util.isObject('string');
        assert(got === false, 'string');
        got = util.isObject([]);
        assert(got === true, '[]');
        got = util.isObject({});
        assert(got === true, '{}');

        got = util.isObject(null);
        assert(got === false, 'null');
        got = util.isObject();
        assert(got === false, 'nothing in');
    });
});
