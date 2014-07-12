(function (define) {
'use strict';
define([ './lib/test-helper.js', '../lib/util.js' ], function (QUnit, Util) {

QUnit.module('20_util');

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
