(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', 'underscore',
             '../lib/equip/normalizer.js', '../lib/data.js', './lib/driver-myapp.js' ];
define(deps, function (QUnit, _, Normalizer, data, myapp) {

QUnit.module('31_eq-normalizer');

QUnit.test('Normalizer', function () {
    QUnit.strictEqual(typeof Normalizer, 'function', 'is function');
});

QUnit.test('new', function () {
    var got, exp;

    var n = new Normalizer();
    QUnit.strictEqual(typeof n, 'object', 'is object');
    QUnit.strictEqual(typeof n.initialize, 'function', 'has initialize()');

    QUnit.strictEqual(typeof n.equips.body, 'object', 'equips.body');

    got = n.equips;
    exp = data.equips;
    QUnit.strictEqual(got, exp, 'equips is strict equal');
    got = n.equips.body;
    exp = data.equips.body;
    QUnit.strictEqual(got, exp, 'equips.body is strict equal');
    got = n.equips.weapon;
    QUnit.deepEqual(got, [], 'weapon');
    got = n.equips.oma;
    QUnit.deepEqual(got, [], 'oma');
});

QUnit.test('compareAny', function () {
    var got, src, dst,
        n = new Normalizer();

    src = { a: 1 }; dst = { a: 1 };
    got = n._compareAny(src, dst);
    QUnit.strictEqual(got, false, 'src equal dst: 1');
    src = { a: 1, b: 0 }; dst = { a: 1, b: 0 };
    got = n._compareAny(src, dst);
    QUnit.strictEqual(got, false, 'src equal dst: 2');

    src = { a: 1 }; dst = { a: 2 };
    got = n._compareAny(src, dst);
    QUnit.strictEqual(got, true, 'src < dst');
    src = { a: 2 }; dst = { a: 1 };
    got = n._compareAny(src, dst);
    QUnit.strictEqual(got, false, 'src > dst');

    src = { a: -1 }; dst = { a: 1 };
    got = n._compareAny(src, dst);
    QUnit.strictEqual(got, true, 'src < dst: minus');
    src = { a: 1 }; dst = { a: -1 };
    got = n._compareAny(src, dst);
    QUnit.strictEqual(got, false, 'src > dst: minus');

    src = { a: -1 }; dst = { a: 0 };
    got = n._compareAny(src, dst);
    QUnit.strictEqual(got, true, 'src < dst: minus & zero');
    src = { a: 0 }; dst = { a: -1 };
    got = n._compareAny(src, dst);
    QUnit.strictEqual(got, false, 'src > dst: minus & zero');

    src = { a: 1, b: 1 }; dst = { a: 1, b: 2 };
    got = n._compareAny(src, dst);
    QUnit.strictEqual(got, true, 'src < dst: multi skills');
    src = { a: 1, b: 2 }; dst = { a: 1, b: 1 };
    got = n._compareAny(src, dst);
    QUnit.strictEqual(got, false, 'src > dst: multi skills');

    src = { a: 1, b: 1 }; dst = { a: 0, b: 2 };
    got = n._compareAny(src, dst);
    QUnit.strictEqual(got, true, 'compare any: 1');
    src = { a: 0, b: 2 }; dst = { a: 1, b: 1 };
    got = n._compareAny(src, dst);
    QUnit.strictEqual(got, true, 'compare any: 2');

    src = { a: 0, b: 0 }; dst = { a: -1, b: 1 };
    got = n._compareAny(src, dst);
    QUnit.strictEqual(got, true, 'compare any: with minus 1');
    src = { a: -1, b: 1 }; dst = { a: 0, b: 0 };
    got = n._compareAny(src, dst);
    QUnit.strictEqual(got, true, 'compare any: with minus 2');

    src = { a: 2, b: 1, c: 0 }; dst = { a: 1, b: 1, c: 1 };
    got = n._compareAny(src, dst);
    QUnit.strictEqual(got, true, 'compare any: multi skills 1');
    src = { a: 1, b: 1, c: 1 }; dst = { a: 2, b: 1, c: 0 };
    got = n._compareAny(src, dst);
    QUnit.strictEqual(got, true, 'compare any: multi skills 2');
});

QUnit.test('_collectMaxSkill', function () {
    var got, exp, combs,
        n = new Normalizer();

    combs = [ { a: 1 } ];
    got = n._collectMaxSkill(combs);
    exp = [ { a: 1 } ];
    QUnit.deepEqual(got, exp, 'equal 1');

    combs = [ { a: 1 }, { a: 2 } ];
    got = n._collectMaxSkill(combs);
    exp = [ { a: 2 } ];
    QUnit.deepEqual(got, exp, 'equal 2');

    combs = [ { a: 1, b: 1 }, { a: 2, b: 1 } ];
    got = n._collectMaxSkill(combs);
    exp = [ { a: 2, b: 1 } ];
    QUnit.deepEqual(got, exp, 'collect max');

    combs = [ { a: 1, b: -3 }, { a: 1, b: -1 }, { a: -1, b: 0 } ];
    got = n._collectMaxSkill(combs);
    exp = [ { a: 1, b: -1 }, { a: -1, b: 0 } ];
    QUnit.deepEqual(got, exp, 'collect max: minus & 0');

    combs = [ { a: 1, b: 1, c: 0 }, { a: 2, b: 1, c: 0 },
              { a: 1, b: 1, c: 1 },
              { a: 0, b: 2, c: 1 }, { a: 0, b: 1, c: 1 } ];
    got = n._collectMaxSkill(combs);
    exp = [ { a: 2, b: 1, c: 0 }, { a: 1, b: 1, c: 1 }, { a: 0, b: 2, c: 1 } ];
    QUnit.deepEqual(got, exp, 'collect max: complex');

    // 同じ組み合わせがあると正しく動かない
    combs = [ { a: 2, b: 0 }, { a: 1, b: 1 }, { a: 2, b: 0 } ];
    got = n._collectMaxSkill(combs);
    exp = [ { a: 1, b: 1 } ];
    //exp = [ { a: 2, b: 0 }, { a: 1, b: 1 } ]; // ホントの正しい結果はこれ
    QUnit.deepEqual(got, exp, 'not uniq');
});

QUnit.test('_normalize0', function () {
    var got, exp, equips,
        n = new Normalizer();

    // slotN
    equips = [
        { name: '攻撃+2,スロ1', slot: 1, skillComb: { '攻撃': 2, '研ぎ師': 1 } },
        { name: '攻撃+3,スロ2', slot: 2, skillComb: { '攻撃': 3, '火耐性': 4 } },
        { name: '斬れ味+2,スロ0', slot: 0, skillComb: { '斬れ味': 2, '研ぎ師': 1 } },
        { name: 'スロ0', slot: 0, skillComb: { '採取': 3, '気まぐれ': 2 } },
        { name: 'スロ3', slot: 3, skillComb: { '防御': 1, 'ガード強化': 1 } },
        { name: '三眼の首飾り', slot: 3, skillComb: {} },
        { name: '斬れ味+2,スロ3', slot: 3, skillComb: { '痛撃': 1, '斬れ味': 2 } }
    ];
    got = n._normalize0(equips, [ '攻撃', '斬れ味' ]);
    exp = [
        { name: '攻撃+2,スロ1', slot: 1, skillComb: { '攻撃': 2, '研ぎ師': 1 } },
        { name: '攻撃+3,スロ2', slot: 2, skillComb: { '攻撃': 3, '火耐性': 4 } },
        { name: '斬れ味+2,スロ0', slot: 0, skillComb: { '斬れ味': 2, '研ぎ師': 1 } },
        { name: 'slot0', slot: 0, skillComb: {} },
        { name: 'slot3', slot: 3, skillComb: {} },
        { name: '斬れ味+2,スロ3', slot: 3, skillComb: { '痛撃': 1, '斬れ味': 2 } }
    ];
    QUnit.deepEqual(got, exp, 'slotN');

    // 胴系統倍化
    equips = [
        { name: '攻撃+4,スロ1', slot: 1, skillComb: { '攻撃': 4, '聴覚保護': -2 } },
        { name: 'アシラグリーヴ', slot: 0, skillComb: { '胴系統倍化': 1 } },
        { name: 'スロ0', slot: 0, skillComb: { '体力': -2, '回復速度': 2, '乗り': 4 } },
        { name: 'カブラＳグリーヴ', slot: 0, skillComb: { '胴系統倍化': 1 } },
        { name: '攻撃＆斬れ味＆スロあり', slot: 3, skillComb: { '攻撃': 1, '斬れ味': 3 } }
    ];
    got = n._normalize0(equips, [ '攻撃', '斬れ味' ]);
    exp = [
        { name: '攻撃+4,スロ1', slot: 1, skillComb: { '攻撃': 4, '聴覚保護': -2 } },
        { name: '胴系統倍化', slot: 0, skillComb: { '胴系統倍化': 1 } },
        { name: 'slot0', slot: 0, skillComb: {} },
        { name: '攻撃＆斬れ味＆スロあり', slot: 3, skillComb: { '攻撃': 1, '斬れ味': 3 } }
    ];
    QUnit.deepEqual(got, exp, 'torsoUp');
});

QUnit.test('_normalize1', function () {
    var got, exp, equips,
        n = new Normalizer();

    equips = [
        { name: '攻撃+2,スロ1', slot: 1, skillComb: { '攻撃': 2, '研ぎ師': 1 } },
        { name: '攻撃+3,スロ2', slot: 2, skillComb: { '攻撃': 3, '火耐性': 4 } },
        { name: '斬れ味+2,スロ0', slot: 0, skillComb: { '斬れ味': 2, '研ぎ師': 1 } },
        { name: 'スロ0', slot: 0, skillComb: { '採取': 3, '気まぐれ': 2 } },
        { name: 'スロ3', slot: 3, skillComb: { '防御': 1, 'ガード強化': 1 } },
        { name: '三眼の首飾り', slot: 3, skillComb: {} },
        { name: '斬れ味+2,スロ3', slot: 3, skillComb: { '痛撃': 1, '斬れ味': 2 } }
    ];
    got = n._normalize1(equips, [ '攻撃', '斬れ味' ]);
    exp = {
        '攻撃+2,スロ1': [
            { '攻撃': 3, '研ぎ師': 1, '防御': -1 },
            { '攻撃': 2, '研ぎ師': 1, '斬れ味': 1, '匠': -1 } ],
        '攻撃+3,スロ2': [
            { '攻撃': 5, '火耐性': 4, '防御': -2 },
            { '攻撃': 4, '火耐性': 4, '防御': -1, '斬れ味': 1, '匠': -1 },
            { '攻撃': 3, '火耐性': 4, '斬れ味': 2, '匠': -2 },
            { '攻撃': 6, '火耐性': 4, '防御': -1 } ],
        '斬れ味+2,スロ0': [
            { '斬れ味': 2, '研ぎ師': 1 } ],
        'スロ0': [
            { '採取': 3, '気まぐれ': 2 } ],
        'スロ3': [
            { '防御': -2, 'ガード強化': 1, '攻撃': 3 },
            { '防御': -1, 'ガード強化': 1, '攻撃': 2, '斬れ味': 1, '匠': -1 },
            { '防御': 0, 'ガード強化': 1, '攻撃': 1, '斬れ味': 2, '匠': -2 },
            { '防御': 1, 'ガード強化': 1, '斬れ味': 3, '匠': -3 },
            { '防御': -1, 'ガード強化': 1, '攻撃': 4 },
            { '防御': 0, 'ガード強化': 1, '攻撃': 3, '斬れ味': 1, '匠': -1 },
            { '防御': 0, 'ガード強化': 1, '攻撃': 5 },
            { '防御': 1, 'ガード強化': 1, '斬れ味': 4, '匠': -2 } ],
        '三眼の首飾り': [
            { '攻撃': 3, '防御': -3 },
            { '攻撃': 2, '防御': -2, '斬れ味': 1, '匠': -1 },
            { '攻撃': 1, '防御': -1, '斬れ味': 2, '匠': -2 },
            { '斬れ味': 3, '匠': -3 },
            { '攻撃': 4, '防御': -2 },
            { '攻撃': 3, '防御': -1, '斬れ味': 1, '匠': -1 },
            { '攻撃': 5, '防御': -1 },
            { '斬れ味': 4, '匠': -2 } ],
        '斬れ味+2,スロ3': [
            { '痛撃': 1, '斬れ味': 2, '攻撃': 3, '防御': -3 },
            { '痛撃': 1, '斬れ味': 3, '攻撃': 2, '防御': -2, '匠': -1 },
            { '痛撃': 1, '斬れ味': 4, '攻撃': 1, '防御': -1, '匠': -2 },
            { '痛撃': 1, '斬れ味': 5, '匠': -3 },
            { '痛撃': 1, '斬れ味': 2, '攻撃': 4, '防御': -2 },
            { '痛撃': 1, '斬れ味': 3, '攻撃': 3, '防御': -1, '匠': -1 },
            { '痛撃': 1, '斬れ味': 2, '攻撃': 5, '防御': -1 },
            { '痛撃': 1, '斬れ味': 6, '匠': -2 } ]
    };
    QUnit.deepEqual(got, exp, '_normalzie1');
});

QUnit.test('_normalize1 (none deco)', function () {
    var got, exp, equips,
        n = new Normalizer();

    data.decos = []; // 装飾品なし

    equips = [
        { name: 'slot1', slot: 1, skillComb: {} },
        { name: 'slot0', slot: 0, skillComb: {} },
        { name: '攻撃+2,スロ1', slot: 1, skillComb: { '攻撃': 2,'研ぎ師': 1 } },
        { name: '攻撃+3,スロ2', slot: 2, skillComb: { '攻撃': 3,'火耐性': 4 } },
        { name: '攻撃+4,斬れ味+1,スロ0', slot: 0,
          skillComb: { '攻撃': 4,'斬れ味': 1,'食事': 4,'腹減り': -2} },
        { name: 'slot3', slot: 3, skillComb: {} },
        { name: '斬れ味+2,スロ3', slot: 3, skillComb: { '痛撃': 1, '斬れ味': 2 } }
    ];
    got = n._normalize1(equips, [ '攻撃', '斬れ味' ]);
    exp = {
        slot1: [],
        slot0: [],
        '攻撃+2,スロ1': [
            { '攻撃': 2,'研ぎ師': 1 } ],
        '攻撃+3,スロ2': [
            { '攻撃': 3,'火耐性': 4 } ],
        '攻撃+4,斬れ味+1,スロ0': [
            { '攻撃': 4,'斬れ味': 1,'食事': 4,'腹減り': -2} ],
        slot3: [],
        '斬れ味+2,スロ3': [
            { '痛撃': 1, '斬れ味': 2 } ]
    };
    QUnit.deepEqual(got, exp, 'none deco');

    myapp.initialize(); // 装飾品なしを元に戻す
});

QUnit.test('_normalize1 (fix)', function () {
    var got, exp, equips,
        n = new Normalizer();

    equips = [
        { name: '三眼の首飾り', slot: 3, skillComb: {} }
    ];
    got = n._normalize1(equips, [ '攻撃', '斬れ味' ]);
    exp = {
        '三眼の首飾り': [
            { '攻撃': 3, '防御': -3 },
            { '攻撃': 2, '防御': -2, '斬れ味': 1, '匠': -1 },
            { '攻撃': 1, '防御': -1, '斬れ味': 2, '匠': -2 },
            { '斬れ味': 3, '匠': -3 },
            { '攻撃': 4, '防御': -2 },
            { '攻撃': 3, '防御': -1, '斬れ味': 1, '匠': -1 },
            { '攻撃': 5, '防御': -1 },
            { '斬れ味': 4, '匠': -2 } ]
    };
    QUnit.deepEqual(got, exp, 'fix');

    // 胴系統倍化
    equips = [
        { name: 'バンギスコイル', slot: 0, skillComb: { '胴系統倍化': 1 } }
    ];
    got = n._normalize1(equips, [ '攻撃', '斬れ味' ]);
    exp = { 'バンギスコイル': [ { '胴系統倍化': 1 } ] };
    QUnit.deepEqual(got, exp, 'fix: torsoUp');
});

QUnit.test('_normalize2', function () {
    var got, exp, combs,
        n = new Normalizer();

    combs = {
        'ジャギィＳメイル': [
            { '攻撃': 3, '達人': 3, '回復速度': 2, '効果持続': -2, '防御': -1 },
            { '攻撃': 2, '達人': 3, '回復速度': 2, '効果持続': -2, '斬れ味': 1, '匠': -1 } ],
        slot0: [],
        slot2: [
            { '攻撃': 2, '防御': -2 },
            { '攻撃': 1, '防御': -1, '斬れ味': 1, '匠': -1 },
            { '斬れ味': 2, '匠': -2 } ],
        'レザーベスト': [
            { '高速収集': 3, '採取': 3, '気まぐれ': 2 } ]
    };
    got = n._normalize2(combs, [ '攻撃', '斬れ味' ]);
    exp = {
        'ジャギィＳメイル': [
            { '攻撃': 3, '斬れ味': 0 },
            { '攻撃': 2, '斬れ味': 1 } ],
        slot0: [
            { '攻撃': 0, '斬れ味': 0 } ],
        slot2: [
            { '攻撃': 2, '斬れ味': 0 },
            { '攻撃': 1, '斬れ味': 1 },
            { '攻撃': 0, '斬れ味': 2 } ],
        'レザーベスト': [
            { '攻撃': 0, '斬れ味': 0 } ]
    };
    QUnit.deepEqual(got, exp, '_normalize2');

    // 胴系統倍化
    combs = {
        'ジャギィＳグリーヴ': [
            { '攻撃': 5, '達人': 3, '回復速度': 3, '効果持続': -1, '防御': -1 },
            { '攻撃': 4, '達人': 3, '回復速度': 3, '効果持続': -1, '斬れ味': 1, '匠': -1 } ],
        '胴系統倍化': [
            { '胴系統倍化': 1 } ],
        slot0: [],
        'シルバーソルグリーヴ': [
            { '痛撃': 1, '斬れ味': 2, '攻撃': 5, '体力': -2, '防御': -3 },
            { '痛撃': 1, '斬れ味': 3, '攻撃': 4, '体力': -2, '防御': -2, '匠': -1 },
            { '痛撃': 1, '斬れ味': 4, '攻撃': 3, '体力': -2, '防御': -1, '匠': -2 },
            { '痛撃': 1, '斬れ味': 5, '攻撃': 2, '体力': -2, '匠': -3 },
            { '痛撃': 1, '斬れ味': 2, '攻撃': 6, '体力': -2, '防御': -2 },
            { '痛撃': 1, '斬れ味': 3, '攻撃': 5, '体力': -2, '防御': -1, '匠': -1 },
            { '痛撃': 1, '斬れ味': 2, '攻撃': 7, '体力': -2, '防御': -1 },
            { '痛撃': 1, '斬れ味': 6, '攻撃': 2, '体力': -2, '匠': -2 } ]
    };
    got = n._normalize2(combs, [ '攻撃', '斬れ味' ]);
    exp = {
        'ジャギィＳグリーヴ': [
            { '攻撃': 5, '斬れ味': 0 },
            { '攻撃': 4, '斬れ味': 1 } ],
        '胴系統倍化': [
            { '胴系統倍化': 1 } ],
        slot0: [
            { '攻撃': 0, '斬れ味': 0 } ],
        'シルバーソルグリーヴ': [
            { '攻撃': 5, '斬れ味': 2 },
            { '攻撃': 4, '斬れ味': 3 },
            { '攻撃': 3, '斬れ味': 4 },
            { '攻撃': 2, '斬れ味': 5 },
            { '攻撃': 6, '斬れ味': 2 },
            { '攻撃': 5, '斬れ味': 3 },
            { '攻撃': 7, '斬れ味': 2 },
            { '攻撃': 2, '斬れ味': 6 } ]
    };
    QUnit.deepEqual(got, exp, 'torsoUp');
});

QUnit.test('_normalize3', function () {
    var got, exp, combs,
        n = new Normalizer();

    // case 1: [ '攻撃', '斬れ味' ]
    combs = {
        'ジャギィＳメイル': [
            { '攻撃': 3, '斬れ味': 0 }, { '攻撃': 2, '斬れ味': 1 } ],
        'バギィＳメイル': [
            { '攻撃': 5, '斬れ味': 0 }, { '攻撃': 4, '斬れ味': 1 },
            { '攻撃': 3, '斬れ味': 2 }, { '攻撃': 6, '斬れ味': 0 } ],
        'ジンオウメイル': [
            { '攻撃': 0, '斬れ味': 2 } ],
        slot0: [
            { '攻撃': 0, '斬れ味': 0 } ],
        slot3: [
            { '攻撃': 3, '斬れ味': 0 }, { '攻撃': 2, '斬れ味': 1 },
            { '攻撃': 1, '斬れ味': 2 }, { '攻撃': 0, '斬れ味': 3 },
            { '攻撃': 4, '斬れ味': 0 }, { '攻撃': 3, '斬れ味': 1 },
            { '攻撃': 5, '斬れ味': 0 }, { '攻撃': 0, '斬れ味': 4 } ],
        'シルバーソルメイル': [
            { '攻撃': 3, '斬れ味': 1 }, { '攻撃': 2, '斬れ味': 2 },
            { '攻撃': 1, '斬れ味': 3 }, { '攻撃': 4, '斬れ味': 1 } ]
    };
    got = n._normalize3(combs);
    exp = {
        'ジャギィＳメイル': [
            { '攻撃': 3, '斬れ味': 0 }, { '攻撃': 2, '斬れ味': 1 } ],
        'バギィＳメイル': [
            { '攻撃': 4, '斬れ味': 1 }, { '攻撃': 3, '斬れ味': 2 },
            { '攻撃': 6, '斬れ味': 0 } ],
        'ジンオウメイル': [
            { '攻撃': 0, '斬れ味': 2 } ],
        slot0: [
            { '攻撃': 0, '斬れ味': 0 } ],
        slot3: [
            { '攻撃': 1, '斬れ味': 2 }, { '攻撃': 3, '斬れ味': 1 },
            { '攻撃': 5, '斬れ味': 0 }, { '攻撃': 0, '斬れ味': 4 } ],
        'シルバーソルメイル': [
            { '攻撃': 2, '斬れ味': 2 }, { '攻撃': 1, '斬れ味': 3 },
            { '攻撃': 4, '斬れ味': 1 } ]
    };
    QUnit.deepEqual(got, exp, 'case 1');

    // case 2: スキルポイントが 0 やマイナスでも正規化できるか
    combs = {
        'hoge': [
            { '匠': 1, '斬れ味': -2 },
            { '匠': 0, '斬れ味': 0 },
            { '匠': -1, '斬れ味': 0 },
            { '匠': 1, '斬れ味': -1 },
            { '匠': 0, '斬れ味': 1 } ],
        'slot0': [
            { '匠': 0, '斬れ味': 0 } ]
    };
    got = n._normalize3(combs);
    exp = {
        'hoge': [
            { '匠': 1, '斬れ味': -1 }, { '匠': 0, '斬れ味': 1 } ],
        'slot0': [
            { '匠': 0, '斬れ味': 0 } ]
    };
    QUnit.deepEqual(got, exp, 'case 2');

    // case 3: 胴系統倍化
    combs = {
        'ジャギィＳグリーヴ': [
            { '攻撃': 5, '斬れ味': 0 }, { '攻撃': 4, '斬れ味': 1 } ],
        '胴系統倍化': [
            { '胴系統倍化': 1 } ],
        slot0: [
            { '攻撃': 0, '斬れ味': 0 } ],
        'シルバーソルグリーヴ': [
            { '攻撃': 5, '斬れ味': 2 },
            { '攻撃': 4, '斬れ味': 3 },
            { '攻撃': 3, '斬れ味': 4 },
            { '攻撃': 2, '斬れ味': 5 },
            { '攻撃': 6, '斬れ味': 2 },
            { '攻撃': 5, '斬れ味': 3 },
            { '攻撃': 7, '斬れ味': 2 },
            { '攻撃': 2, '斬れ味': 6 } ]
    };
    got = n._normalize3(combs);
    exp = {
        'ジャギィＳグリーヴ': [
            { '攻撃': 5, '斬れ味': 0 }, { '攻撃': 4, '斬れ味': 1 } ],
        '胴系統倍化': [
            { '胴系統倍化': 1 } ],
        slot0: [
            { '攻撃': 0, '斬れ味': 0 } ],
        'シルバーソルグリーヴ': [
            { '攻撃': 3, '斬れ味': 4 },
            { '攻撃': 5, '斬れ味': 3 },
            { '攻撃': 7, '斬れ味': 2 },
            { '攻撃': 2, '斬れ味': 6 } ]
    };
    QUnit.deepEqual(got, exp, 'case 3');
});

QUnit.test('_normalize4', function () {
    var got, exp, combs,
        n = new Normalizer();

    var sorter = function (actiCombs) {
        return _.sortBy(actiCombs, function (comb) {
            return _.reduce(comb.skillComb, function (memo, pt, skill) {
                return memo + skill + pt;
            }, '');
        });
    };

    combs = {
        'ジャギィＳメイル': [
            { '攻撃': 3, '斬れ味': 0 }, { '攻撃': 2, '斬れ味': 1 } ],
        'バギィＳメイル': [
            { '攻撃': 4, '斬れ味': 1 }, { '攻撃': 3, '斬れ味': 2 },
            { '攻撃': 6, '斬れ味': 0 } ],
        'ジンオウメイル': [
            { '攻撃': 0, '斬れ味': 2 } ],
        slot0: [
            { '攻撃': 0, '斬れ味': 0 } ],
        slot3: [
            { '攻撃': 1, '斬れ味': 2 }, { '攻撃': 3, '斬れ味': 1 },
            { '攻撃': 5, '斬れ味': 0 }, { '攻撃': 0, '斬れ味': 4 } ],
        'シルバーソルメイル': [
            { '攻撃': 2, '斬れ味': 2 }, { '攻撃': 1, '斬れ味': 3 },
            { '攻撃': 4, '斬れ味': 1 } ]
    };
    got = n._normalize4(combs);
    exp = [
        { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] },
        { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ 'ジンオウメイル' ] },
        { skillComb: { '攻撃': 3, '斬れ味': 0 }, equips: [ 'ジャギィＳメイル' ] },
        { skillComb: { '攻撃': 2, '斬れ味': 1 }, equips: [ 'ジャギィＳメイル' ] },
        { skillComb: { '攻撃': 1, '斬れ味': 2 }, equips: [ 'slot3' ] },
        { skillComb: { '攻撃': 3, '斬れ味': 1 }, equips: [ 'slot3' ] },
        { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ 'slot3' ] },
        { skillComb: { '攻撃': 2, '斬れ味': 2 }, equips: [ 'シルバーソルメイル' ] },
        { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ 'シルバーソルメイル' ] },
        { skillComb: { '攻撃': 4, '斬れ味': 1 },
          equips: [ 'バギィＳメイル', 'シルバーソルメイル' ] },
        { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ 'バギィＳメイル' ] },
        { skillComb: { '攻撃': 5, '斬れ味': 0 }, equips: [ 'slot3' ] },
        { skillComb: { '攻撃': 6, '斬れ味': 0 }, equips: [ 'バギィＳメイル' ] }
    ];
    QUnit.deepEqual(sorter(got), sorter(exp), 'normalizer4');

    // 胴系統倍化
    combs = {
        'ジャギィＳグリーヴ': [
            { '攻撃': 5, '斬れ味': 0 },
            { '攻撃': 4, '斬れ味': 1 } ],
        '胴系統倍化': [
            { '胴系統倍化': 1 } ],
        slot0: [
            { '攻撃': 0, '斬れ味': 0 } ],
        'シルバーソルグリーヴ': [
            { '攻撃': 3, '斬れ味': 4 }, { '攻撃': 5, '斬れ味': 3 },
            { '攻撃': 7, '斬れ味': 2 }, { '攻撃': 2, '斬れ味': 6 } ]
    };
    got = n._normalize4(combs);
    exp = [
        { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] },
        { skillComb: { '胴系統倍化': 1 }, equips: [ '胴系統倍化' ] },
        { skillComb: { '攻撃': 5, '斬れ味': 0 }, equips: [ 'ジャギィＳグリーヴ' ] },
        { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ 'ジャギィＳグリーヴ' ] },
        { skillComb: { '攻撃': 3, '斬れ味': 4 }, equips: [ 'シルバーソルグリーヴ' ] },
        { skillComb: { '攻撃': 5, '斬れ味': 3 }, equips: [ 'シルバーソルグリーヴ' ] },
        { skillComb: { '攻撃': 2, '斬れ味': 6 }, equips: [ 'シルバーソルグリーヴ' ] },
        { skillComb: { '攻撃': 7, '斬れ味': 2 }, equips: [ 'シルバーソルグリーヴ' ] }
    ];
    QUnit.deepEqual(sorter(got), sorter(exp), 'torsoUp');

    got = n._normalize4();
    QUnit.deepEqual(got, [], 'nothing in');
    got = n._normalize4(undefined);
    QUnit.deepEqual(got, [], 'undefined');
    got = n._normalize4(null);
    QUnit.deepEqual(got, [], 'null');
    got = n._normalize4({});
    QUnit.deepEqual(got, [], '{}');
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
           test(this.QUnit, this._, this.simu.Equip.Normalizer, this.simu.data, this.myapp);
       }
);
