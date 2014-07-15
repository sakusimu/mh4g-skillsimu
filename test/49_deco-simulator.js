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

// 頑シミュさんの装飾品検索の結果と比較しやすくする
var simplify = function (decombSets) {
    return _.map(decombSets, function (decombSet) {
        var torsoUp = _.some(decombSet, function (decomb) {
            if (decomb == null) return false;
            return decomb.skillComb['胴系統倍化'] ? true : false;
        });
        var names = _.map(decombSet, function (decomb, part) {
            var names = decomb ? decomb.names : [];
            if (torsoUp && part === 'body')
                names = _.map(names, function (n) { return n += '(胴)'; });
            return names;
        });
        names = _.flatten(names);
        return names.sort().join(',');
    });
};

QUnit.test('simulate', function () {
    var got, exp, equipSet, decombSets,
        simu = new Simulator();

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
    decombSets = simu.simulate([ '斬れ味レベル+1', '高級耳栓' ], equipSet);
    got = simplify(decombSets);
    exp = [
        '匠珠【３】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【３】(胴)',
        '匠珠【２】,匠珠【２】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【３】,防音珠【３】(胴)',
        '匠珠【２】,匠珠【２】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【３】(胴)'
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
    decombSets = simu.simulate([ '斬れ味レベル+1', '砥石使用高速化' ], equipSet);
    got = simplify(decombSets);
    exp = [
        '匠珠【３】,匠珠【３】,匠珠【３】,研磨珠【１】,研磨珠【１】,研磨珠【１】,研磨珠【１】,研磨珠【１】',
        '匠珠【２】,匠珠【２】,匠珠【３】,匠珠【３】,研磨珠【１】,研磨珠【１】,研磨珠【１】,研磨珠【１】,研磨珠【１】'
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
    decombSets = simu.simulate([ '斬れ味レベル+1', '攻撃力UP【大】', '耳栓' ], equipSet);
    got = simplify(decombSets);
    exp = [
        '攻撃珠【２】,攻撃珠【２】,攻撃珠【２】,攻撃珠【２】,攻撃珠【２】,攻撃珠【２】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】'
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
