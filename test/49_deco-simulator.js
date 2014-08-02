(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', 'underscore',
             '../lib/deco/simulator.js', './lib/driver-myapp.js' ];
define(deps, function (QUnit, _, Simulator, myapp) {

QUnit.module('49_deco-simulator', {
    setup: function () {
        myapp.initialize();
    }
});

QUnit.test('Simulator', function () {
    QUnit.strictEqual(typeof Simulator, 'function', 'is function');
});

QUnit.test('new', function () {
    var got;

    got = new Simulator();
    QUnit.strictEqual(typeof got, 'object', 'is object');
    QUnit.strictEqual(typeof got.initialize, 'function', 'has initialize()');
});

QUnit.test('simulate', function () {
    var got, exp, equipSet, assems,
        simu = new Simulator();

    var sorter = function (assems) {
        return _.map(assems, function (assem) {
            var sorted = {};
            _.each(assem, function (decoNames, key) {
                sorted[key] = decoNames.sort().reverse();
            });
            return sorted;
        });
    };

    var omas = [ [ '龍の護石',3,'匠',4,'氷耐性',-5 ] ];
    omas = myapp.model.Oma.createSimuData(omas);

    // 装備に胴系統倍化、武器スロ、お守りがある場合
    equipSet = {
        head  : myapp.equips('head', 'ユクモノカサ・天')[0]  // スロ2
      , body  : myapp.equips('body', '三眼の首飾り')[0]      // スロ3
      , arm   : myapp.equips('arm', 'ユクモノコテ・天')[0]   // スロ2
      , waist : myapp.equips('waist', 'バンギスコイル')[0]   // 胴系統倍化
      , leg   : myapp.equips('leg', 'ユクモノハカマ・天')[0] // スロ2
      , weapon: { name: 'slot2' }
      , oma   : omas[0]
    };
    assems = simu.simulate([ '斬れ味レベル+1', '高級耳栓' ], equipSet);
    got = sorter(assems);
    exp = [
        { all    : ['防音珠【３】','防音珠【１】','防音珠【１】','防音珠【１】',
                    '防音珠【１】','防音珠【１】','防音珠【１】','防音珠【１】','匠珠【３】']
        , torsoUp: ['防音珠【３】']
        , rest   : ['防音珠【１】','防音珠【１】','防音珠【１】','防音珠【１】',
                    '防音珠【１】','防音珠【１】','防音珠【１】','匠珠【３】'] },
        { all    : ['防音珠【３】','防音珠【３】','防音珠【１】','防音珠【１】','防音珠【１】',
                    '匠珠【２】','匠珠【２】']
        , torsoUp: ['防音珠【３】']
        , rest   : ['防音珠【３】','防音珠【１】','防音珠【１】','防音珠【１】',
                    '匠珠【２】','匠珠【２】'] },
        { all    : ['防音珠【３】','防音珠【１】','防音珠【１】','防音珠【１】','防音珠【１】',
                    '防音珠【１】','防音珠【１】','防音珠【１】','匠珠【２】','匠珠【２】']
        , torsoUp: ['防音珠【３】']
        , rest   : ['防音珠【１】','防音珠【１】','防音珠【１】','防音珠【１】','防音珠【１】',
                    '防音珠【１】','防音珠【１】','匠珠【２】','匠珠【２】'] }
    ];
    QUnit.deepEqual(got, exp, 'torsoUp, weaponSlot, oma');

    // ALL三眼, 武器スロ3, お守り(匠4,スロ3)
    equipSet = {
        head  : myapp.equips('head', '三眼のピアス')[0]
      , body  : myapp.equips('body', '三眼の首飾り')[0]
      , arm   : myapp.equips('arm', '三眼の腕輪')[0]
      , waist : myapp.equips('waist', '三眼の腰飾り')[0]
      , leg   : myapp.equips('leg', '三眼の足輪')[0]
      , weapon: { name: 'slot3' }
      , oma   : omas[0]
    };
    assems = simu.simulate([ '斬れ味レベル+1', '砥石使用高速化' ], equipSet);
    got = sorter(assems);
    exp = [
        { all    : ['研磨珠【１】','研磨珠【１】','研磨珠【１】','研磨珠【１】','研磨珠【１】',
                    '匠珠【３】','匠珠【３】','匠珠【３】']
        , torsoUp: []
        , rest   : ['研磨珠【１】','研磨珠【１】','研磨珠【１】','研磨珠【１】','研磨珠【１】',
                    '匠珠【３】','匠珠【３】','匠珠【３】'] },
        { all    : ['研磨珠【１】','研磨珠【１】','研磨珠【１】','研磨珠【１】','研磨珠【１】',
                    '匠珠【３】','匠珠【３】','匠珠【２】','匠珠【２】']
        , torsoUp: []
        , rest   : ['研磨珠【１】','研磨珠【１】','研磨珠【１】','研磨珠【１】','研磨珠【１】',
                    '匠珠【３】','匠珠【３】','匠珠【２】','匠珠【２】'] }
    ];
    QUnit.deepEqual(got, exp, 'all slot3');

    // 1つだけ見つかるケース
    myapp.setup({ hr: 1, vs: 6 }); // 装備を村のみにしぼる
    equipSet = {
        head  : myapp.equips('head', 'ガララキャップ')[0]  // スロ2
      , body  : myapp.equips('body', 'レックスメイル')[0]  // スロ2
      , arm   : myapp.equips('arm', 'ガルルガアーム')[0]   // スロ3
      , waist : myapp.equips('waist', 'ゴアフォールド')[0] // スロ1
      , leg   : myapp.equips('leg', 'アークグリーヴ')[0]   // スロ2
      , weapon: { name: 'slot3' }
      , oma   : omas[0]
    };
    assems = simu.simulate([ '斬れ味レベル+1', '攻撃力UP【大】', '耳栓' ], equipSet);
    got = sorter(assems);
    exp = [
        { all    : ['防音珠【１】','防音珠【１】','防音珠【１】','防音珠【１】',
                    '攻撃珠【２】','攻撃珠【２】','攻撃珠【２】','攻撃珠【２】',
                    '攻撃珠【２】','攻撃珠【２】']
        , torsoUp: []
        , rest   : ['防音珠【１】','防音珠【１】','防音珠【１】','防音珠【１】',
                    '攻撃珠【２】','攻撃珠【２】','攻撃珠【２】','攻撃珠【２】',
                    '攻撃珠【２】','攻撃珠【２】'] }
    ];
    QUnit.deepEqual(got, exp, '1 hit');

    myapp.initialize();
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
           test(this.QUnit, this._, this.simu.Deco.Simulator, this.myapp);
       }
);
