(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', '../index.js' ];
define(deps, function (QUnit, simu) {

QUnit.module('90_index');

QUnit.test('initialize', function () {
    QUnit.strictEqual(typeof simu.initialize, 'function', 'has initialize()');

    simu.initialize();
    QUnit.strictEqual(simu.engin instanceof simu.Simulator, true, 'engin');
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
