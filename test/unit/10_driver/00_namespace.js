(function (define) {
'use strict';
var deps = [ '../lib/test-helper.js', '../lib/driver-namespace.js' ];
define(deps, function (QUnit, myapp) {

QUnit.module('10_driver/00_namespace');

QUnit.test('myapp', function () {
    QUnit.strictEqual(typeof myapp, 'object', 'myapp');
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
           test(this.QUnit, this.myapp);
       }
);
