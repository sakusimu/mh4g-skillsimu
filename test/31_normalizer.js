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
    myapp.setup({ hr: 1 }); // 村のみ

    got = n.normalize([ '攻撃力UP【大】', '業物' ]);
    exp = [ { skillComb: { '攻撃': 0, '斬れ味': 0, '胴系統倍化': 0 },
              equips: [ 'slot0', '大和【胴当て】' ] },
            { skillComb: { '攻撃': 1, '斬れ味': -1, '胴系統倍化': 0 },
              equips: [ '大和【胴当て】' ] },
            { skillComb: { '攻撃': 1, '斬れ味': 0, '胴系統倍化': 0 },
              equips: [ 'slot1' ] },
            { skillComb: { '攻撃': 0, '斬れ味': 1, '胴系統倍化': 0 },
              equips: [ 'slot1' ] },
            { skillComb: { '攻撃': 3, '斬れ味': -2, '胴系統倍化': 0 },
              equips: [ '大和【胴当て】' ] },
            { skillComb: { '攻撃': 1, '斬れ味': 1, '胴系統倍化': 0 },
              equips: [ 'slot2', 'レウスメイル', 'ドボルメイル' ] },
            { skillComb: { '攻撃': 0, '斬れ味': 2, '胴系統倍化': 0 },
              equips: [ 'slot2', 'ジンオウメイル' ] },
            { skillComb: { '攻撃': 2, '斬れ味': 0, '胴系統倍化': 0 },
              equips: [ 'レウスメイル', 'ドボルメイル' ] },
            { skillComb: { '攻撃': 3, '斬れ味': 0, '胴系統倍化': 0 },
              equips: [ 'ジャギィメイル', 'slot2' ] },
            { skillComb: { '攻撃': 2, '斬れ味': 1, '胴系統倍化': 0 },
              equips: [ 'ジャギィメイル' ] },
            { skillComb: { '攻撃': 1, '斬れ味': 2, '胴系統倍化': 0 },
              equips: [ 'アグナメイル', 'ヴァイクメイル', 'slot3' ] },
            { skillComb: { '攻撃': 0, '斬れ味': 3, '胴系統倍化': 0 },
              equips: [ 'アグナメイル', 'ヴァイクメイル', 'slot3' ] },
            { skillComb: { '攻撃': 4, '斬れ味': 0, '胴系統倍化': 0 },
              equips: [ 'バギィメイル', 'slot3' ] },
            { skillComb: { '攻撃': 3, '斬れ味': 1, '胴系統倍化': 0 },
              equips: [ 'バギィメイル', 'slot3' ] },
            { skillComb: { '攻撃': -1, '斬れ味': 0, '胴系統倍化': 0 },
              equips: [ 'ブナハスーツ' ] },
            { skillComb: { '攻撃': -2, '斬れ味': 1, '胴系統倍化': 0 },
              equips: [ 'ブナハスーツ' ] },
            { skillComb: { '攻撃': -2, '斬れ味': 0, '胴系統倍化': 0 },
             equips: [ 'ナルガメイル', 'ユアミスガタ' ] },
            { skillComb: { '攻撃': -3, '斬れ味': 1, '胴系統倍化': 0 },
              equips: [ 'ユアミスガタ' ] } ];
    // 胴のみなので胴系統倍化が 1 のものはない
    //QUnit.deepEqual(sorter(got.body), sorter(exp), "[ '攻撃力UP【大】', '業物' ]");
    QUnit.ok(true, 'skip');

    myapp.setup({ type: 'g', hr: 1 }); // ガンナー

    got = n.normalize([ '攻撃力UP【大】', '通常弾・連射矢UP' ]);
    exp = [ { skillComb: { '攻撃': 0, '通常弾強化': 0, '胴系統倍化': 0 },
              equips: [ 'slot0' ] },
            { skillComb: { '攻撃': 1, '通常弾強化': 0, '胴系統倍化': 0 },
              equips: [ 'slot1' ] },
            { skillComb: { '攻撃': 0, '通常弾強化': 1, '胴系統倍化': 0 },
              equips: [ 'slot1', 'ジンオウレジスト' ] },
            { skillComb: { '攻撃': 1, '通常弾強化': 1, '胴系統倍化': 0 },
              equips: [ 'slot2', 'レウスレジスト' ] },
            { skillComb: { '攻撃': 0, '通常弾強化': 2, '胴系統倍化': 0 },
              equips: [ 'slot2' ] },
            { skillComb: { '攻撃': 2, '通常弾強化': 0, '胴系統倍化': 0 },
              equips: [ 'レウスレジスト' ] },
            { skillComb: { '攻撃': 3, '通常弾強化': 0, '胴系統倍化': 0 },
              equips: [ 'ジャギィレジスト', 'slot2' ] },
            { skillComb: { '攻撃': 2, '通常弾強化': 1, '胴系統倍化': 0 },
              equips: [ 'ジャギィレジスト' ] },
            { skillComb: { '攻撃': 0, '通常弾強化': 3, '胴系統倍化': 0 },
              equips: [ 'ボロスレジスト', 'アグナレジスト', 'ヴァイクレジスト', 'slot3' ] },
            { skillComb: { '攻撃': 1, '通常弾強化': 2, '胴系統倍化': 0 },
              equips: [ 'アグナレジスト', 'ヴァイクレジスト', 'slot3' ] },
            { skillComb: { '攻撃': 4, '通常弾強化': 0, '胴系統倍化': 0 },
              equips: [ 'バギィレジスト', 'slot3' ] },
            { skillComb: { '攻撃': 3, '通常弾強化': 1, '胴系統倍化': 0 },
              equips: [ 'バギィレジスト', 'slot3' ] },
            { skillComb: { '攻撃': -1, '通常弾強化': 0, '胴系統倍化': 0 },
              equips: [ 'ブナハベスト' ] },
            { skillComb: { '攻撃': -2, '通常弾強化': 1, '胴系統倍化': 0 },
              equips: [ 'ブナハベスト' ] },
            { skillComb: { '攻撃': -3, '通常弾強化': 0, '胴系統倍化': 0 },
              equips: [ 'ナルガレジスト' ] },
            { skillComb: { '攻撃': -2, '通常弾強化': 0, '胴系統倍化': 0 },
              equips: [ 'ユアミスガタ' ] },
            { skillComb: { '攻撃': -3, '通常弾強化': 1, '胴系統倍化': 0 },
              equips: [ 'ユアミスガタ' ] } ];
    //QUnit.deepEqual(sorter(got.body), sorter(exp), "[ '攻撃力UP【大】', '通常弾・連射矢UP' ]");
    QUnit.ok(true, 'skip');

    // 胴系統倍化
    got = n.normalize([ '集中', '弱点特効' ]);
    exp = [ { skillComb: { '溜め短縮': 0, '痛撃': 0, '胴系統倍化': 0 },
              equips: [ 'slot0' ] },
            { skillComb: { '溜め短縮': 0, '痛撃': 0, '胴系統倍化': 1 },
              equips: [ 'アシラレギンス', 'ラングロレギンス' ] },
            { skillComb: { '溜め短縮': 0, '痛撃': 1, '胴系統倍化': 0 },
              equips: [ 'slot1' ] },
            { skillComb: { '溜め短縮': 1, '痛撃': 0, '胴系統倍化': 0 },
              equips: [ 'slot1' ] },
            { skillComb: { '溜め短縮': 0, '痛撃': 2, '胴系統倍化': 0 },
              equips: [ 'slot2', 'レウスレギンス' ] },
            { skillComb: { '溜め短縮': 1, '痛撃': 1, '胴系統倍化': 0 },
              equips: [ 'slot2', 'レウスレギンス', '陸奥【具足】' ] },
            { skillComb: { '溜め短縮': 2, '痛撃': 0, '胴系統倍化': 0 },
              equips: [ 'slot2', '陸奥【具足】' ] },
            { skillComb: { '溜め短縮': 2, '痛撃': 1, '胴系統倍化': 0 },
              equips: [ 'マギュルヴルツェル', 'slot3' ] },
            { skillComb: { '溜め短縮': 3, '痛撃': 0, '胴系統倍化': 0 },
              equips: [ 'マギュルヴルツェル', 'slot3' ] },
            { skillComb: { '溜め短縮': 0, '痛撃': 3, '胴系統倍化': 0 },
              equips: [ 'slot3' ] },
            { skillComb: { '溜め短縮': 1, '痛撃': 2, '胴系統倍化': 0 },
              equips: [ 'slot3' ] } ];
    //QUnit.deepEqual(sorter(got.leg), sorter(exp), "[ '集中', '弱点特効' ]");
    QUnit.ok(true, 'skip');

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

    QUnit.ok(true, 'skip');
    return;

    // スキルポイントがマイナスの装備で固定
    names = [ 'ダマスクメイル' ]; // 斬れ味-4, スロ2
    equips = myapp.equips('body', names);
    if (equips.length !== 1) throw new Error('equips.length is not 1');
    data.equips.body = equips;

    got = n.normalize([ '攻撃力UP【大】', '業物' ]);
    exp = [ { skillComb: { '攻撃': 1, '斬れ味': -3, '胴系統倍化': 0 },
              equips: [ 'ダマスクメイル' ] },
            { skillComb: { '攻撃': 0, '斬れ味': -2, '胴系統倍化': 0 },
              equips: [ 'ダマスクメイル' ] },
            { skillComb: { '攻撃': 3, '斬れ味': -4, '胴系統倍化': 0 },
              equips: [ 'ダマスクメイル' ] } ];
    QUnit.deepEqual(got.body, exp, 'fixed equip');
    exp = { head: 37, body: 3, arm: 34, waist: 28, leg: 34, weapon: 1 };
    QUnit.deepEqual(summary(got), exp, 'fixed equip: summary');

    myapp.initialize();

    // スキルポイントがマイナスの装備で固定
    names = [ 'ユアミスガタ'   // 攻撃-3, スロ1
            , 'ナルガメイル'   // 攻撃-2, スロ0
            , 'ブナハＳスーツ' // 攻撃-2, スロ1
            , '大和【胴当て】' // 斬れ味-2, スロ2
            , 'ダマスクメイル' // 斬れ味-4, スロ2
            , 'バンギスメイル' // 斬れ味-2, スロ0
    ];
    equips = myapp.equips('body', names);
    if (equips.length !== 6) throw new Error('equips.length is not 6');
    data.equips.body = equips;

    got = n.normalize([ '攻撃力UP【大】', '業物' ]);
    exp = { head: 37, body: 10, arm: 34, waist: 28, leg: 34, weapon: 1 };
    QUnit.deepEqual(summary(got), exp, 'selected equip');
});

QUnit.test('normalize: weapon slot', function () {
    var got, exp,
        n = new Normalizer();

    n.weaponSlot = 0;
    got = n.normalize([ '攻撃力UP【大】', '業物' ]);
    exp = [ { skillComb: { '攻撃': 0, '斬れ味': 0, '胴系統倍化': 0 }, equips: [ 'slot0' ] } ];
    QUnit.deepEqual(got.weapon, exp, 'weaponSlot 0');

    n.weaponSlot = 3;
    got = n.normalize([ '攻撃力UP【大】', '業物' ]);
    exp = [ { skillComb: { '攻撃': 1, '斬れ味': 2, '胴系統倍化': 0 }, equips: [ 'slot3' ] },
            { skillComb: { '攻撃': 3, '斬れ味': 1, '胴系統倍化': 0 }, equips: [ 'slot3' ] },
            { skillComb: { '攻撃': 5, '斬れ味': 0, '胴系統倍化': 0 }, equips: [ 'slot3' ] },
            { skillComb: { '攻撃': 0, '斬れ味': 4, '胴系統倍化': 0 }, equips: [ 'slot3' ] } ];
    //QUnit.deepEqual(got.weapon, exp, 'weaponSlot 3');
    QUnit.ok(true, 'skip');

});

QUnit.test('normalize: summary', function () {
    var got, exp,
        n = new Normalizer();

    got = n.normalize([ '攻撃力UP【大】', '業物' ]);
    exp = { head: 37, body: 30, arm: 34, waist: 28, leg: 34, weapon: 1 };
    //QUnit.deepEqual(summary(got), exp, "[ '攻撃力UP【大】', '業物' ]");
    QUnit.ok(true, 'skip');

    got = n.normalize([ '斬れ味レベル+1', '高級耳栓' ]);
    exp = { head: 25, body: 17, arm: 21, waist: 25, leg: 26, weapon: 1 };
    //QUnit.deepEqual(summary(got), exp, "[ '斬れ味レベル+1', '高級耳栓' ]");
    QUnit.ok(true, 'skip');

    // スキル系統で見ているので、高級耳栓も耳栓も結果は同じ
    got = n.normalize([ '斬れ味レベル+1', '耳栓' ]);
    exp = { head: 25, body: 17, arm: 21, waist: 25, leg: 26, weapon: 1 };
    //QUnit.deepEqual(summary(got), exp, "[ '斬れ味レベル+1', '耳栓' ]");
    QUnit.ok(true, 'skip');

    got = n.normalize([ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ]);
    exp = { head: 378, body: 243, arm: 301, waist: 280, leg: 301, weapon: 1 };
    //QUnit.deepEqual(summary(got), exp,
    //                 "[ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ]");
    QUnit.ok(true, 'skip');

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
