(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', '../lib/equip/assembler.js' ];
define(deps, function (QUnit, Assembler) {

QUnit.module('35_eq-assembler');

QUnit.test('Assembler', function () {
    QUnit.strictEqual(typeof Assembler, 'function', 'is function');
});

QUnit.test('new', function () {
    var a = new Assembler();
    QUnit.strictEqual(typeof a, 'object', 'is object');
    QUnit.strictEqual(typeof a.initialize, 'function', 'has initialie()');
});

QUnit.test('_assemble', function () {
    var got, exp, eqcomb,
        a = new Assembler();

    // case 1
    eqcomb = {
        head  : [ 'head01' ],
        body  : [ 'body01' ],
        arm   : [ 'arm01' ],
        waist : [ 'waist01' ],
        leg   : [ 'leg01' ],
        weapon: [ 'wpn01' ],
        oma   : [ 'oma01' ]
    };
    got = a._assemble(eqcomb);
    exp = [
        [ 'head01', 'body01', 'arm01', 'waist01', 'leg01', 'wpn01', 'oma01' ]
    ];
    QUnit.deepEqual(got, exp, 'case 1');

    // case 2: weapon や oma が [] でも展開される
    eqcomb = {
        head  : [ 'head01' ],
        body  : [ 'body01' ],
        arm   : [ 'arm01' ],
        waist : [ 'waist01' ],
        leg   : [ 'leg01' ],
        weapon: [],
        oma   : []
    };
    got = a._assemble(eqcomb);
    exp = [
        [ 'head01', 'body01', 'arm01', 'waist01', 'leg01', null, null ]
    ];
    QUnit.deepEqual(got, exp, 'case 2');

    // case 3: equips が複数ある場合に展開されるか
    eqcomb = {
        head  : [ 'head01', 'head02' ],
        body  : [ 'body01' ],
        arm   : [ 'arm01', 'arm02' ],
        waist : [ 'waist01' ],
        leg   : [ 'leg01', 'leg02' ],
        weapon: [],
        oma   : []
    };
    got = a._assemble(eqcomb);
    exp = [
        [ 'head01', 'body01', 'arm01', 'waist01', 'leg01', null, null ],
        [ 'head01', 'body01', 'arm01', 'waist01', 'leg02', null, null ],
        [ 'head01', 'body01', 'arm02', 'waist01', 'leg01', null, null ],
        [ 'head01', 'body01', 'arm02', 'waist01', 'leg02', null, null ],
        [ 'head02', 'body01', 'arm01', 'waist01', 'leg01', null, null ],
        [ 'head02', 'body01', 'arm01', 'waist01', 'leg02', null, null ],
        [ 'head02', 'body01', 'arm02', 'waist01', 'leg01', null, null ],
        [ 'head02', 'body01', 'arm02', 'waist01', 'leg02', null, null ]
    ];
    QUnit.deepEqual(got, exp, 'case 3');
});

QUnit.test('_assemble: use cache', function () {
    var got, exp, eqcomb,
        a = new Assembler();

    var cache = {};

    eqcomb = {
        head  : [ 'head01' ],
        body  : [ 'body01' ],
        arm   : [ 'arm01' ],
        waist : [ 'waist01' ],
        leg   : [ 'leg01' ],
        weapon: [],
        oma   : [ 'oma01' ]
    };
    a._assemble(eqcomb, cache);

    eqcomb = {
        head  : [ 'head01', 'head02' ],
        body  : [ 'body01' ],
        arm   : [ 'arm01' ],
        waist : [ 'waist01' ],
        leg   : [ 'leg01' ],
        weapon: [],
        oma   : [ 'oma01' ]
    };
    got = a._assemble(eqcomb, cache);
    exp = [
        // head01 の組み合わせは既にキャッシュされているので出てこない
        [ 'head02', 'body01', 'arm01', 'waist01', 'leg01', null, 'oma01' ]
    ];
    QUnit.deepEqual(got, exp, 'use cache');
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
           test(this.QUnit, this.simu.Equip.Assembler);
       }
);
