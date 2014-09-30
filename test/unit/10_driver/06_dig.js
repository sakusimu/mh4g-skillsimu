(function (define) {
'use strict';
var deps = [ '../lib/test-helper.js', '../lib/driver-dig.js', '../lib/driver-context.js' ];
define(deps, function (QUnit, model, Context) {

QUnit.module('10_driver/06_dig');

QUnit.test('dig: new', function () {
    var got;

    got = new model.Dig([ 0, 1, '刀匠', 4 ]);
    QUnit.strictEqual(typeof got, 'object', 'is object');
    QUnit.strictEqual(typeof got.initialize, 'function', 'has initialize()');

    QUnit.strictEqual(got.name, '発掘(刀匠+4)', 'name');
    QUnit.strictEqual(got.sex, 0, 'sex');
    QUnit.strictEqual(got.type, 1, 'type');
    QUnit.strictEqual(got.slot, 0, 'slot');
    QUnit.strictEqual(got.skillTree1, '刀匠', 'skillTree1');
    QUnit.strictEqual(got.skillPt1, 4, 'skillPt1');
});

QUnit.test('dig: toStirng', function () {
    var got, exp, dig;

    dig = new model.Dig([ 0, 1, '刀匠', 4 ]);
    got = dig.toString();
    exp = '発掘(刀匠+4)';
    QUnit.strictEqual(got, exp, 'toString()');
});

QUnit.test('dig: isEnabled', function () {
    var got, exp, data, digs,
        ctx = new Context();

    // "性別(0=両,1=男,2=女)","タイプ(0=両方,1=剣士,2=ガンナー)",スキル系統1,スキル値1
    data = [
        [ '0','0','強欲','6' ],
        [ '0','1','刀匠','4' ],
        [ '0','2','射手','4' ]
    ];
    digs = data.map(function (list) { return new model.Dig(list); });

    ctx.initialize({ sex: 'm', type: 'k' });
    got = digs.map(function (d) { return d.isEnabled(ctx); });
    exp = [ true,true,false ];
    QUnit.deepEqual(got, exp, 'm k');
    ctx.initialize({ sex: 'w', type: 'g' });
    got = digs.map(function (d) { return d.isEnabled(ctx); });
    exp = [ true,false,true ];
    QUnit.deepEqual(got, exp, 'w g');
});

QUnit.test('dig: simuData', function () {
    var got, exp, dig;

    dig = new model.Dig([ 0, 1, '刀匠', 4 ]);
    got = dig.simuData();
    exp = {
        name: '発掘(刀匠+4)',
        slot: 0,
        skillComb: { '刀匠': 4 }
    };
    QUnit.deepEqual(got, exp, 'simuData');
});

QUnit.test('digs: data', function () {
    var got, exp;

    got = Object.keys(model.digs.data.weapon).length;
    exp = 24;
    QUnit.strictEqual(got, exp, 'weapon');
    got = Object.keys(model.digs.data.head).length;
    exp = 36;
    QUnit.strictEqual(got, exp, 'head');
});

QUnit.test('digs: enabled', function () {
    var got,
        ctx = new Context();

    var gunner = function (dig) { return dig.skillTree1 === '射手'; };

    model.digs.initialize();
    got = model.digs.enabled('head', ctx).filter(gunner).length;
    QUnit.ok(got > 0, 'enabled: head');
    got = model.digs.enabled('body', ctx).filter(gunner).length;
    QUnit.strictEqual(got, 0, 'enabled: body');

    QUnit.throws(function () { model.digs.enabled(); },
                 /part is required/, 'part is required');
    QUnit.throws(function () { model.digs.enabled('hoge'); },
                 /unknown part: hoge/, 'unknown part');
});

QUnit.test('digs: get', function () {
    var got;

    got = model.digs.get('head', '発掘(刀匠+2)');
    QUnit.ok(got instanceof model.Dig, 'instanceof');
    QUnit.strictEqual(got.name, '発掘(刀匠+2)', 'name');

    QUnit.throws(function () { model.digs.get(); },
                 /part is required/, 'part is required');
    QUnit.throws(function () { model.digs.get('hoge'); },
                 /unknown part: hoge/, 'unknown part');

    got = model.digs.get('head', null);
    QUnit.strictEqual(got, null, 'null');

    got = model.digs.get('head', 'そんな装備ないよ');
    QUnit.strictEqual(got, null, 'non-existent dig');
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
           test(this.QUnit, this.myapp.model, this.myapp.Context);
       }
);
