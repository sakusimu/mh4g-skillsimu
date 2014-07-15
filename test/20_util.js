(function (define) {
'use strict';
define([ './lib/test-helper.js', '../lib/util.js' ], function (QUnit, Util) {

QUnit.module('20_util');

QUnit.test('Util', function () {
    QUnit.strictEqual(typeof Util, 'object', 'is object');
});

QUnit.test('parts', function () {
    var got, exp;

    got = Util.parts;
    exp = [ 'body', 'head', 'arm', 'waist', 'leg', 'weapon', 'oma' ];
    QUnit.deepEqual(got, exp, 'parts');
});

QUnit.test('clone', function () {
    var got, exp;

    got = Util.clone({ a: 1, b: 2 });
    exp = { a: 1, b: 2 };
    QUnit.deepEqual(got, exp, 'skillComb');

    got = Util.clone({});
    exp = {};
    QUnit.deepEqual(got, exp, 'empty');

    got = Util.clone(null);
    exp = null;
    QUnit.deepEqual(got, exp, 'null');

    got = Util.clone();
    exp = null;
    QUnit.deepEqual(got, exp, 'nothing in');
});

QUnit.test('has', function () {
    var got, obj;

    obj = { a: 'A' };
    got = Util.has(obj, 'a');
    QUnit.strictEqual(got, true, 'has');

    var fn = function () { Util.has(null, 'a'); };
    QUnit.throws(fn, Error, 'null');
});

QUnit.test('isArray', function () {
    var got;

    got = Util.isArray('string');
    QUnit.strictEqual(got, false, 'string');
    got = Util.isArray([]);
    QUnit.strictEqual(got, true, '[]');
    got = Util.isArray({});
    QUnit.strictEqual(got, false, '{}');

    got = Util.isArray(null);
    QUnit.strictEqual(got, false, 'null');
    got = Util.isArray();
    QUnit.strictEqual(got, false, 'nothing in');
});

QUnit.test('isObject', function () {
    var got;

    got = Util.isObject('string');
    QUnit.strictEqual(got, false, 'string');
    got = Util.isObject([]);
    QUnit.strictEqual(got, true, '[]');
    got = Util.isObject({});
    QUnit.strictEqual(got, true, '{}');

    got = Util.isObject(null);
    QUnit.strictEqual(got, false, 'null');
    got = Util.isObject();
    QUnit.strictEqual(got, false, 'nothing in');
});

QUnit.test('keys', function () {
    var got, exp;

    got = Util.keys({ a: 'A', b: 'B' });
    exp = [ 'a', 'b' ];
    QUnit.deepEqual(got, exp, 'keys');

    got = Util.keys(null);
    exp = [];
    QUnit.deepEqual(got, exp, 'null');
});

QUnit.test('_combination', function () {
    var got , exp, list;

    list = [ 'a', 'b', 'c', 'd', 'e' ];
    got = Util._combination(list, 4, [], 0, 0);
    exp = [ [ 'a', 'b', 'c', 'd' ],
            [ 'a', 'b', 'c', 'e' ],
            [ 'a', 'b', 'd', 'e' ],
            [ 'a', 'c', 'd', 'e' ] ];
    QUnit.deepEqual(got, exp, '_comb');
});

QUnit.test('combination', function () {
    var got , exp, list;

    list = [ 'a', 'b', 'c', 'd', 'e' ];
    got = Util.combination(list, 4);
    exp = [ [ 'a', 'b', 'c', 'd' ],
            [ 'a', 'b', 'c', 'e' ],
            [ 'a', 'b', 'd', 'e' ],
            [ 'a', 'c', 'd', 'e' ],
            [ 'b', 'c', 'd', 'e' ] ];
    QUnit.deepEqual(got, exp, '5C4');

    list = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g' ];
    got = Util.combination(list, 1);
    exp = [ [ 'a' ], [ 'b' ], [ 'c' ], [ 'd' ], [ 'e' ], [ 'f' ], [ 'g' ] ];
    QUnit.deepEqual(got, exp, '7C1');

    list = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g' ];
    got = Util.combination(list, 7);
    exp = [ [ 'a', 'b', 'c', 'd', 'e', 'f', 'g' ] ];
    QUnit.deepEqual(got, exp, '7C1');

    list = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g' ];
    got = Util.combination(list, 0);
    exp = [];
    QUnit.deepEqual(got, exp, '7C0');

    list = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g' ];
    got = Util.combination(null, 4);
    exp = [];
    QUnit.deepEqual(got, exp, 'null');
});

QUnit.test('power', function () {
    var got , exp, list;

    list = [ 'a', 'b', 'c' ];
    got = Util.power(list);
    exp = [ [],
            [ 'a' ],
            [ 'b' ],
            [ 'a', 'b' ],
            [ 'c' ],
            [ 'a', 'c' ],
            [ 'b', 'c' ],
            [ 'a', 'b', 'c' ] ];
    QUnit.deepEqual(got, exp, 'power');

    list = [];
    got = Util.power(list);
    exp = [ [] ];
    QUnit.deepEqual(got, exp, 'empty list');
});

});
})(typeof define !== 'undefined' ?
   define :
   typeof module !== 'undefined' && module.exports ?
       function (deps, test) {
           var modules = [], len = deps.length;
           for (var i = 0; i < len; ++i) modules.push(require(deps[i]));
           test.apply(this, modules);
       } :
       function (deps, test) {
           test(this.QUnit, this.simu.Util);
       }
);
