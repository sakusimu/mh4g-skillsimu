(function (define) {
'use strict';
define([ './lib/test-helper.js', '../lib/namespace.js' ], function (QUnit, simu) {

QUnit.module('00_namespace');

QUnit.test('namespace', function () {
    QUnit.strictEqual(typeof simu, 'object', 'simu');
    QUnit.ok(/\d+\.\d+\.\d+/.test(simu.VERSION), 'version');
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
           test(this.QUnit, this.simu);
       }
);
