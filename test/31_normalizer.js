(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', 'underscore',
             '../lib/normalizer.js', '../lib/data.js', './lib/driver-myapp.js' ];
define(deps, function (QUnit, _, Normalizer, data, myapp) {

QUnit.module('31_normalizer', {
    setup: function () {
        myapp.initialize();
    }
});

var sorter = function (actiCombs) {
    return _.sortBy(actiCombs, function (comb) {
        return _.reduce(comb.skillComb, function (memo, pt, skill) {
            return memo + skill + pt;
        }, '');
    });
};

QUnit.test('normalize', function () {
    var got, exp,
        n = new Normalizer();

    // 村のみに装備をしぼってスキルの組み合わせ
    myapp.setup({ hr: 1, vs: 6 });

    got = n.normalize([ '攻撃力UP【大】', '業物' ]);
    exp = [ { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] },
            { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ 'slot1' ] },
            { skillComb: { '攻撃': 0, '斬れ味': 1 }, equips: [ 'slot1' ] },
            { skillComb: { '攻撃': 1, '斬れ味': 1 }, equips: [ 'slot2' ] },
            { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ 'slot2' ] },
            { skillComb: { '攻撃': 3, '斬れ味': 0 },
              equips: [ 'slot2', 'ランポスヘルム', 'クックヘルム', 'レウスヘルム' ] },
            { skillComb: { '攻撃': 1, '斬れ味': 2 },
              equips: [ 'slot3', 'ランポスキャップ', 'ギザミヘルム' ] },
            { skillComb: { '攻撃': 0, '斬れ味': 3 },
              equips: [ 'slot3', 'ギザミヘルム' ] },
            { skillComb: { '攻撃': 2, '斬れ味': 1 },
              equips: [ 'ランポスヘルム', 'ランポスキャップ', 'クックヘルム' ] },
            { skillComb: { '攻撃': 4, '斬れ味': 0 },
              equips: [ 'slot3', 'ランポスキャップ', 'ボロスヘルム', 'ボロスキャップ',
                        'レックスヘルム', 'レウスキャップ' ] },
            { skillComb: { '攻撃': 3, '斬れ味': 1 },
              equips: [ 'slot3', 'バトルヘルム', 'バトルキャップ', 'クックキャップ',
                        'ボロスヘルム', 'ボロスキャップ', 'レックスヘルム' ] },
            { skillComb: { '攻撃': 2, '斬れ味': 2 },
              equips: [ 'バトルヘルム', 'バトルキャップ', 'クックキャップ' ] },
            { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ 'セルタスヘルム' ] },
            { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ 'セルタスヘルム' ] },
            { skillComb: { '攻撃': 5, '斬れ味': 0 },
              equips: [ 'バトルヘルム', 'バトルキャップ', 'クックキャップ',
                        'レックスキャップ', 'ドボルキャップ' ] },
            { skillComb: { '攻撃': 4, '斬れ味': 1 },
              equips: [ 'レックスキャップ', 'ドボルヘルム', 'ドボルキャップ' ] },
            { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ 'ドボルヘルム' ] },
            { skillComb: { '攻撃': 6, '斬れ味': 0 }, equips: [ 'ドボルヘルム' ] },
            { skillComb: { '攻撃': -2, '斬れ味': 0 },
              equips: [ 'ブナハハット', 'ブナハキャップ' ] } ];
    QUnit.deepEqual(sorter(got.head), sorter(exp), "[ '攻撃力UP【大】', '業物' ]");

    myapp.setup({ type: 'g', hr: 1, vs: 6 }); // ガンナー

    got = n.normalize([ '攻撃力UP【大】', '通常弾・連射矢UP' ]);
    exp = [ { skillComb: { '攻撃': 0, '通常弾強化': 0 }, equips: [ 'slot0' ] },
            { skillComb: { '攻撃': 1, '通常弾強化': 0 },
              equips: [ 'slot1', 'バトルレジスト', 'ボロスレジスト' ] },
            { skillComb: { '攻撃': 0, '通常弾強化': 1 }, equips: [ 'slot1' ] },
            { skillComb: { '攻撃': 2, '通常弾強化': 0 },
              equips: [ 'ランポスレジスト', 'レウスレジスト' ] },
            { skillComb: { '攻撃': 1, '通常弾強化': 1 }, equips: [ 'slot2' ] },
            { skillComb: { '攻撃': 0, '通常弾強化': 2 }, equips: [ 'slot2' ] },
            { skillComb: { '攻撃': 3, '通常弾強化': 0 },
              equips: [ 'slot2', 'クックレジスト' ] },
            { skillComb: { '攻撃': 2, '通常弾強化': 1 },
              equips: [ 'クックレジスト', 'ドボルレジスト' ] },
            { skillComb: { '攻撃': 1, '通常弾強化': 2 },
              equips: [ 'ガンキンレジスト', 'ドボルレジスト' ] },
            { skillComb: { '攻撃': 0, '通常弾強化': 3 }, equips: [ 'ガンキンレジスト' ] },
            { skillComb: { '攻撃': 3, '通常弾強化': 1 }, equips: [ 'レックスレジスト' ] },
            { skillComb: { '攻撃': 2, '通常弾強化': 2 }, equips: [ 'レックスレジスト' ] },
            { skillComb: { '攻撃': 4, '通常弾強化': 0 }, equips: [ 'ドボルレジスト' ] },
            { skillComb: { '攻撃': 5, '通常弾強化': 0 }, equips: [ 'レックスレジスト' ] },
            { skillComb: { '攻撃': -2, '通常弾強化': 0 }, equips: [ 'ブナハベスト' ] } ];
    QUnit.deepEqual(sorter(got.body), sorter(exp), "[ '攻撃力UP【大】', '通常弾・連射矢UP' ]");

    // 胴系統倍化
    got = n.normalize([ '集中', '弱点特効' ]);
    exp = [ { skillComb: { '溜め短縮': 0, '痛撃': 0 }, equips: [ 'slot0' ] },
            { skillComb: { '胴系統倍化': 1 }, equips: [ '胴系統倍化' ] },
            { skillComb: { '溜め短縮': 0, '痛撃': 1 }, equips: [ 'slot1' ] },
            { skillComb: { '溜め短縮': 1, '痛撃': 0 }, equips: [ 'slot1' ] },
            { skillComb: { '溜め短縮': 0, '痛撃': 2 },
              equips: [ 'slot2', 'ナルガレギンス' ] },
            { skillComb: { '溜め短縮': 1, '痛撃': 1 }, equips: [ 'slot2' ] },
            { skillComb: { '溜め短縮': 2, '痛撃': 0 }, equips: [ 'slot2' ] },
            { skillComb: { '溜め短縮': 0, '痛撃': 3 }, equips: [ 'slot3' ] },
            { skillComb: { '溜め短縮': 1, '痛撃': 2 }, equips: [ 'slot3' ] },
            { skillComb: { '溜め短縮': 2, '痛撃': 1 }, equips: [ 'slot3' ] },
            { skillComb: { '溜め短縮': 3, '痛撃': 0 },
              equips: [ 'slot3', 'マギュルヴルツェル' ] } ];
    QUnit.deepEqual(sorter(got.leg), sorter(exp), "[ '集中', '弱点特効' ]");

    got = n.normalize();
    QUnit.deepEqual(got, null, 'nothing in');
    got = n.normalize(undefined);
    QUnit.deepEqual(got, null, 'undefined');
    got = n.normalize(null);
    QUnit.deepEqual(got, null, 'null');
    QUnit.deepEqual(n.normalize([]), null, '[]');
});

var summary = function (norCombs) {
    var ret = {};
    _.each(norCombs, function (norComb, part) { ret[part] = norComb.length; });
    return ret;
};

QUnit.test('normalize: selected equips', function () {
    var got, exp, names, equips,
        n = new Normalizer();

    // スキルポイントがマイナスの装備で固定
    names = [ 'アカムトウルンテ' ]; // 斬れ味-2, スロ1
    equips = myapp.equips('body', names);
    if (equips.length !== 1) throw new Error('error: equips.length=' + equips.length);
    data.equips.body = equips;

    got = n.normalize([ '攻撃力UP【大】', '業物' ]);
    exp = [ { skillComb: { '攻撃': 1, '斬れ味': -2 }, equips: [ 'アカムトウルンテ' ] },
            { skillComb: { '攻撃': 0, '斬れ味': -1 }, equips: [ 'アカムトウルンテ' ] } ];
    QUnit.deepEqual(got.body, exp, 'fixed equip');
    exp = { head: 37, body: 2, arm: 28, waist: 30, leg: 34, weapon: 1 };
    QUnit.deepEqual(summary(got), exp, 'fixed equip: summary');

    myapp.initialize();

    // スキルポイントがマイナスの装備で固定
    names = [ 'ブナハＳスーツ'   // 攻撃-2, スロ0
            , 'リベリオンメイル' // 攻撃-4, スロ1
            , 'アカムトウルンテ' // 斬れ味-2, スロ1
    ];
    equips = myapp.equips('body', names);
    if (equips.length !== 3) throw new Error('error: equips.length=' + equips.length);
    data.equips.body = equips;

    got = n.normalize([ '攻撃力UP【大】', '業物' ]);
    exp = { head: 37, body: 5, arm: 28, waist: 30, leg: 34, weapon: 1 };
    QUnit.deepEqual(summary(got), exp, 'selected equip');
});

QUnit.test('normalize: weapon slot', function () {
    var got, exp,
        n = new Normalizer();

    n.weaponSlot = 0;
    got = n.normalize([ '攻撃力UP【大】', '業物' ]);
    exp = [ { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] } ];
    QUnit.deepEqual(got.weapon, exp, 'weaponSlot 0');

    n.weaponSlot = 3;
    got = n.normalize([ '攻撃力UP【大】', '業物' ]);
    exp = [ { skillComb: { '攻撃': 1, '斬れ味': 2 }, equips: [ 'slot3' ] },
            { skillComb: { '攻撃': 3, '斬れ味': 1 }, equips: [ 'slot3' ] },
            { skillComb: { '攻撃': 5, '斬れ味': 0 }, equips: [ 'slot3' ] },
            { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ 'slot3' ] } ];
    QUnit.deepEqual(got.weapon, exp, 'weaponSlot 3');
});

QUnit.test('normalize: summary', function () {
    var got, exp,
        n = new Normalizer();

    got = n.normalize([ '攻撃力UP【大】', '業物' ]);
    exp = { head: 37, body: 28, arm: 28, waist: 30, leg: 34, weapon: 1 };
    QUnit.deepEqual(summary(got), exp, "[ '攻撃力UP【大】', '業物' ]");

    got = n.normalize([ '斬れ味レベル+1', '高級耳栓' ]);
    exp = { head: 18, body: 16, arm: 21, waist: 21, leg: 23, weapon: 1 };
    QUnit.deepEqual(summary(got), exp, "[ '斬れ味レベル+1', '高級耳栓' ]");

    // スキル系統で見ているので、高級耳栓も耳栓も結果は同じ
    got = n.normalize([ '斬れ味レベル+1', '耳栓' ]);
    exp = { head: 18, body: 16, arm: 21, waist: 21, leg: 23, weapon: 1 };
    QUnit.deepEqual(summary(got), exp, "[ '斬れ味レベル+1', '耳栓' ]");

    got = n.normalize([ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ]);
    exp = { head: 444, body: 228, arm: 249, waist: 342, leg: 270, weapon: 1 };
    QUnit.deepEqual(summary(got), exp,
                    "[ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ]");
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
           test(this.QUnit, this._, this.simu.Normalizer, this.simu.data, this.myapp);
       }
);
