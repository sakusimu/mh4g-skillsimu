(function (define) {
'use strict';
define([ '../lib/test-helper.js', '../../lib/deco.js' ], function (QUnit, Deco) {

QUnit.module('40_deco/00_deco');

QUnit.test('Deco', function () {
    QUnit.strictEqual(typeof Deco, 'object', 'is object');
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
           test(this.QUnit, this.simu.Deco);
       }
);
