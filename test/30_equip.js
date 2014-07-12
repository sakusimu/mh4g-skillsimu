(function (define) {
'use strict';
define([ './lib/test-helper.js', '../lib/equip.js' ], function (QUnit, Equip) {

QUnit.module('30_equip');

QUnit.test('Equip', function () {
    QUnit.strictEqual(typeof Equip, 'object', 'is object');
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
           test(this.QUnit, this.simu.Equip);
       }
);
