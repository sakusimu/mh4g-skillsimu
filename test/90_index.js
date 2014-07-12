(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', '../index.js', './lib/driver-myapp.js' ];
define(deps, function (QUnit, Simulator, myapp) {

QUnit.module('90_index', {
    setup: function () {
        myapp.initialize();
    }
});

QUnit.test('Simulator', function () {
    QUnit.strictEqual(typeof Simulator, 'function', 'is function');
});

QUnit.test('new', function () {
    var simu = new Simulator();
    QUnit.strictEqual(typeof simu, 'object', 'is object');
    QUnit.strictEqual(typeof simu.initialize, 'function', 'has initialize()');

    QUnit.strictEqual(typeof simu.equip, 'object', 'equip');
    QUnit.strictEqual(typeof simu.deco, 'object', 'deco');
});

QUnit.test('initialize', function () {
    var simu = new Simulator();

    simu.equip = null;
    simu.deco  = null;

    simu.initialize();
    QUnit.strictEqual(typeof simu.equip, 'object', 'equip');
    QUnit.strictEqual(typeof simu.deco, 'object', 'deco');
});

QUnit.test('simulate', function () {
//    var got, exp;
//
//    simu.engin = null;
//
//    got = simu.simulate([ '攻撃力UP【大】', '業物' ]);
//    exp = 2788;
//    QUnit.strictEqual(got.length, exp, "[ '攻撃力UP【大】', '業物' ]");

    QUnit.ok(true, 'skip');
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
           test(this.QUnit, this.simu.Simulator, this.simu.data, this.myapp);
       }
);
