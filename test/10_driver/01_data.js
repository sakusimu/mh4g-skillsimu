(function (define) {
'use strict';
var deps = [ '../lib/test-helper.js', 'underscore', '../lib/driver-data.js' ];
define(deps, function (QUnit, _, data) {

QUnit.module('10_driver/01_data');

QUnit.test('data', function () {
    QUnit.strictEqual(typeof data, 'object', 'is object');
    QUnit.strictEqual(typeof data.initialize, 'function', 'has initialize()');
});

QUnit.test('equips', function () {
    var got,
        equips = data.equips;

    got = equips.head.length;
    QUnit.ok(got > 0, 'equips.head.length');

    got = equips.body.length;
    QUnit.ok(got > 0, 'equips.body.length');

    got = equips.arm.length;
    QUnit.ok(got > 0, 'equips.arm.length');

    got = equips.waist.length;
    QUnit.ok(got > 0, 'equips.waist.length');

    got = equips.leg.length;
    QUnit.ok(got > 0, 'equips.leg.length');
});

QUnit.test('decos', function () {
    var got;

    got = data.decos.length;
    QUnit.ok(got > 0, 'decos.length');
});

QUnit.test('skills', function () {
    var got;

    got = data.skills.length;
    QUnit.ok(got > 0, 'skills.length');
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
           test(this.QUnit, this._, this.myapp.data);
       }
);
