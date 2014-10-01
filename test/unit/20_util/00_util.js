'use strict';
var assert = require('power-assert'),
    Util = require('../../../lib/util.js');

describe('20_util/00_util', function () {
    var got, exp;

    it('Util', function () {
        assert(typeof Util === 'object', 'is object');
    });

    it('parts', function () {
        got = Util.parts;
        exp = [ 'head', 'body', 'arm', 'waist', 'leg', 'weapon', 'oma' ];
        assert.deepEqual(got, exp, 'parts');
    });

    it('clone', function () {
        got = Util.clone({ a: 1, b: 2 });
        exp = { a: 1, b: 2 };
        assert.deepEqual(got, exp, 'skillComb');

        got = Util.clone({});
        exp = {};
        assert.deepEqual(got, exp, 'empty');

        got = Util.clone(null);
        exp = null;
        assert.deepEqual(got, exp, 'null');

        got = Util.clone();
        exp = null;
        assert.deepEqual(got, exp, 'nothing in');
    });

    it('has', function () {
        var obj;

        obj = { a: 'A' };
        got = Util.has(obj, 'a');
        assert(got === true, 'has');

        try { Util.has(null, 'a'); } catch (e) { got = e; }
        assert(got instanceof Error, 'null');
    });

    it('isArray', function () {
        got = Util.isArray('string');
        assert(got === false, 'string');
        got = Util.isArray([]);
        assert(got === true, '[]');
        got = Util.isArray({});
        assert(got === false, '{}');

        got = Util.isArray(null);
        assert(got === false, 'null');
        got = Util.isArray();
        assert(got === false, 'nothing in');
    });

    it('isObject', function () {
        got = Util.isObject('string');
        assert(got === false, 'string');
        got = Util.isObject([]);
        assert(got === true, '[]');
        got = Util.isObject({});
        assert(got === true, '{}');

        got = Util.isObject(null);
        assert(got === false, 'null');
        got = Util.isObject();
        assert(got === false, 'nothing in');
    });
});
