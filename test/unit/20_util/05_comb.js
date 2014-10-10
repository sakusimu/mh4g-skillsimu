'use strict';
var assert = require('power-assert'),
    cutil = require('../../../lib/util/comb.js'),
    myapp = require('../../../test/lib/driver-myapp.js');

describe('20_util/05_comb', function () {
    var got, exp;

    beforeEach(function () {
        myapp.initialize();
    });

    it('require', function () {
        assert(typeof cutil === 'object', 'is object');
    });

    it('parts', function () {
        got = cutil.parts;
        exp = [ 'body', 'head', 'arm', 'waist', 'leg', 'weapon', 'oma' ];
        assert.deepEqual(got, exp, 'parts');
    });

    it('activates', function () {
        var goal, sc;

        sc   = { a: 20, b: 10 };
        goal = { a: 20, b: 10 };
        got = cutil.activates(sc, goal);
        assert(got === true, 'case 1');

        sc   = { a: 19, b: 10 };
        goal = { a: 20, b: 10 };
        got = cutil.activates(sc, goal);
        assert(got === false, 'case 2');

        sc   = { a: 21, b: 10 };
        goal = { a: 20, b: 10 };
        got = cutil.activates(sc, goal);
        assert(got === true, 'case 3');

        sc   = { a: 20 };
        goal = { a: 20, b: 10 };
        got = cutil.activates(sc, goal);
        assert(got === false, 'case 4');

        sc   = { a: 20, b: 10, '胴系統倍化': 1 };
        goal = { a: 20, b: 10 };
        got = cutil.activates(sc, goal);
        assert(got === true, 'torsoUp');

        sc   = {};
        goal = { a: 0, b: 0 };
        got = cutil.activates(sc, goal);
        assert(got === true, 'already activate');

        sc   = { a: 20, b: 10 };
        goal = null;
        try { cutil.activates(sc, goal); } catch (e) { got = e.message; }
        assert(got === 'goal is required');
    });

    it('justActivates', function () {
        var goal, sc;

        sc   = { a: 20, b: 10 };
        goal = { a: 20, b: 10 };
        got = cutil.justActivates(sc, goal);
        assert(got === true, 'case 1');

        sc   = { a: 19, b: 10 };
        goal = { a: 20, b: 10 };
        got = cutil.justActivates(sc, goal);
        assert(got === false, 'case 2');

        sc   = { a: 21, b: 10 };
        goal = { a: 20, b: 10 };
        got = cutil.justActivates(sc, goal);
        assert(got === false, 'case 3');

        sc   = { a: 20 };
        goal = { a: 20, b: 10 };
        got = cutil.justActivates(sc, goal);
        assert(got === false, 'case 4');

        sc   = { a: 20, b: 10, '胴系統倍化': 1 };
        goal = { a: 20, b: 10 };
        got = cutil.justActivates(sc, goal);
        assert(got === true, 'torsoUp');

        sc   = {};
        goal = { a: 0, b: 0 };
        got = cutil.justActivates(sc, goal);
        assert(got === true, 'already activate');

        sc   = { a: 20, b: 10 };
        goal = null;
        try { cutil.justActivates(sc, goal); } catch (e) { got = e.message; }
        assert(got === 'goal is required');
    });

    it('isOver', function () {
        var a, b;

        a = { a: 6, b: 4, c: 2 };
        b = { a: 7, b: 4, c: 2 };
        got = cutil.isOver(a, b);
        assert(got === true, 'over');

        a = { a: 6, b: 4, c: 2 };
        b = { a: 6, b: 4, c: 2 };
        got = cutil.isOver(a, b);
        assert(got === true, 'over: same');

        a = { a: 6, b: 4, c: 2 };
        b = { a: 7, b: 4, c: 1 };
        got = cutil.isOver(a, b);
        assert(got === false, 'not over');

        a = { a: 6, b: 4, c: 2 };
        b = { a: 7, b: 4 };
        got = cutil.isOver(a, b);
        assert(got === false, 'not over: no c');
    });
});
