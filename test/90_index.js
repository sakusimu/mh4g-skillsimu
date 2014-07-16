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
    QUnit.strictEqual(typeof simu.data, 'object', 'data');
});

QUnit.test('initialize', function () {
    var simu = new Simulator();

    simu.equip = null;
    simu.deco  = null;

    simu.initialize();
    QUnit.strictEqual(typeof simu.equip, 'object', 'equip');
    QUnit.strictEqual(typeof simu.deco, 'object', 'deco');
});

QUnit.test('simulateEquip', function () {
    var got, exp,
        simu = new Simulator();

    got = simu.simulateEquip([ '斬れ味レベル+1', '高級耳栓' ]);
    exp = 1378;
    QUnit.strictEqual(got.length, exp, 'simulate');
});

QUnit.test('simulateDeco', function () {
    var got, exp,
        simu = new Simulator();

    var omas = [ [ '龍の護石',3,'匠',4,'氷耐性',-5 ] ];
    omas = myapp.model.Oma.createSimuData(omas);

    // 装備に胴系統倍化、武器スロ、お守りがある場合
    var equipSet = {
        head  : myapp.equips('head', 'ユクモノカサ・天')[0]  // スロ2
      , body  : myapp.equips('body', '三眼の首飾り')[0]      // スロ3
      , arm   : myapp.equips('arm', 'ユクモノコテ・天')[0]   // スロ2
      , waist : myapp.equips('waist', 'バンギスコイル')[0]   // 胴系統倍化
      , leg   : myapp.equips('leg', 'ユクモノハカマ・天')[0] // スロ2
      , weapon: { name: 'slot2' }
      , oma   : omas[0]
    };
    got = simu.simulateDeco([ '斬れ味レベル+1', '高級耳栓' ], equipSet);
    exp = 3;
    QUnit.strictEqual(got.length, exp, 'simulate');
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
           test(this.QUnit, this.simu.Simulator, this.myapp);
       }
);
