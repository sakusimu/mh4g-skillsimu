(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', 'underscore',
             './lib/driver-myapp.js', '../lib/data.js' ];
define(deps, function (QUnit, _, myapp, data) {

QUnit.module('19_driver-myapp');

QUnit.test('setup', function() {
    var got, exp;

    myapp.setup();
    got = {};
    _.each(data.equips, function (equips, part) { got[part] = equips.length; });
    exp = { head: 285, body: 144, arm: 143, waist: 143, leg: 143 };
    QUnit.deepEqual(got, exp, 'simu.data.equips');
    got = data.decos.length;
    exp = 175;
    QUnit.deepEqual(got, exp, 'simu.data.decos');
    got = _.keys(data.skills).length;
    exp = 255;
    QUnit.deepEqual(got, exp, 'simu.data.skills');
});

QUnit.test('equips', function () {
    var got, exp, fn;

    got = myapp.equips('body', 'ブレイブベスト');
    QUnit.strictEqual(got[0].name, 'ブレイブベスト', 'name');
    QUnit.strictEqual(got[0].slot, 0, 'slot');

    got = myapp.equips('body', [ 'ブレイブベスト', 'チェーンベスト' ]);
    got = _.pluck(got, 'name').join(',');
    exp = 'ブレイブベスト,チェーンベスト';
    QUnit.strictEqual(got, exp, 'array');

    got = myapp.equips('body', 'ユクモ');
    QUnit.deepEqual(got, [], 'not found');

    fn = function () { myapp.equips('hoge', 'ユクモノドウギ'); };
    QUnit.throws(fn, /unknown part:/, 'unknown part');
    fn = function () { myapp.equips(); };
    QUnit.throws(fn, /two arguments are required/, 'nothing in');
    fn = function () { myapp.equips(undefined); };
    QUnit.throws(fn, /two arguments are required/, 'undefined');
    fn = function () { myapp.equips(null); };
    QUnit.throws(fn, /two arguments are required/, 'null');
    fn = function () { myapp.equips(''); };
    QUnit.throws(fn, /two arguments are required/, 'empty string');

    fn = function () { myapp.equips('body'); };
    QUnit.throws(fn, /two arguments are required/, '(body)');
    got = myapp.equips('body', undefined);
    QUnit.deepEqual(got, [], '(body, undefined)');
    got = myapp.equips('body', null);
    QUnit.deepEqual(got, [], '(body, null)');
    got = myapp.equips('body', '');
    QUnit.deepEqual(got, [], '(body, "")');
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
           test(this.QUnit, this._, this.myapp, this.simu.data);
       }
);
