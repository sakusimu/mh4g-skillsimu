(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', './lib/driver-context' ];
define(deps, function (QUnit, context) {

QUnit.module('12_driver-context');

QUnit.test('context', function () {
    var got;

    got = context;
    QUnit.strictEqual(typeof got, 'object', 'is object');
    QUnit.strictEqual(typeof got.initialize, 'function', 'has initialize()');

    context.initialize();

    QUnit.strictEqual(got.sex, 'm', 'sex');
    QUnit.strictEqual(got.type, 'k', 'type');
    QUnit.strictEqual(got.hr, 8, 'hr');
    QUnit.strictEqual(got.vs, 6, 'vs');
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
           test(this.QUnit, this.myapp.context);
       }
);
