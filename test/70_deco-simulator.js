(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', 'underscore',
             '../lib/deco-simulator.js', '../lib/deco.js', '../lib/skill.js',
             './lib/driver-myapp.js' ];
define(deps, function (QUnit, _, DecoSimulator, Deco, Skill, myapp) {

QUnit.module('70_deco-simulator', {
    setup: function () {
        myapp.initialize();
    }
});

QUnit.test('DecoSimulator', function () {
    QUnit.strictEqual(typeof DecoSimulator, 'function', 'is function');
});

QUnit.test('new', function () {
    var got, exp;

    got = new DecoSimulator();

    QUnit.strictEqual(typeof got, 'object', 'is object');
    QUnit.strictEqual(typeof got.initialize, 'function', 'has initialize()');

    exp = [ 'head', 'body', 'arm', 'waist', 'leg', 'weapon', 'oma' ];
    QUnit.deepEqual(got.set, exp, 'set');
    QUnit.strictEqual(got.result, null, 'reuslt');
});

QUnit.test('_normalize', function () {
    var got, exp, equipSet, norSet,
        ds = new DecoSimulator();

    var name = function (norSet) {
        var set = {};
        _.each(norSet, function (comb, part) {
            var e = comb.equip.name;
            var d = _.map(comb.decos, function (deCombs) {
                return _.map(deCombs, function (deComb) {
                    return deComb.names.join(',');
                });
            });
            set[part] = { equip: e, decos: d };
        });
        return set;
    };

    // 普通に装備が5つ
    equipSet = {
        head : myapp.equips('head', 'ユクモノカサ・天')[0]  // 匠+2, 研ぎ師+3
      , body : myapp.equips('body', '三眼の首飾り')[0]
      , arm  : myapp.equips('arm', 'ユクモノコテ・天')[0]   // 匠+1, 研ぎ師+3
      , waist: myapp.equips('waist', 'バンギスコイル')[0]
      , leg  : myapp.equips('leg', 'ユクモノハカマ・天')[0] // 匠+1, 研ぎ師+1
    };
    norSet = ds._normalize([ '匠', '研ぎ師' ], equipSet);
    got = name(norSet);
    exp = {
        head:
        { equip: 'ユクモノカサ・天',
          decos: [ [], [ '研磨珠【１】' ], [ '研磨珠【１】,研磨珠【１】', '匠珠【２】' ] ] }
      , body:
        { equip: '三眼の首飾り',
          decos: [ [],
                   [ '研磨珠【１】' ],
                   [ '研磨珠【１】,研磨珠【１】', '匠珠【２】' ],
                   [ '研磨珠【１】,研磨珠【１】,研磨珠【１】', '匠珠【２】,研磨珠【１】',
                     '匠珠【３】' ] ] }
      , arm:
        { equip: 'ユクモノコテ・天',
          decos: [ [], [ '研磨珠【１】' ], [ '研磨珠【１】,研磨珠【１】', '匠珠【２】' ] ] }
      , waist:
        { equip: 'バンギスコイル', decos: [] }
      , leg:
        { equip: 'ユクモノハカマ・天',
          decos: [ [], [ '研磨珠【１】' ], [ '研磨珠【１】,研磨珠【１】', '匠珠【２】' ] ] }
      , weapon: { equip: 'weapon', decos: [] }
      , oma: { equip: 'oma', decos: [] }
    };
    QUnit.deepEqual(got, exp, 'case 1');

    // 装備に slotN と胴系統倍化、武器スロ、お守りがある場合
    var omas = [ [ '龍の護石',3,'匠',4,'氷耐性',-5 ] ];
    omas = myapp.model.Oma.createSimuData(omas);
    equipSet = {
        head  : myapp.equips('head', 'ユクモノカサ・天')[0],
        body  : { name: 'slot3' },
        arm   : { name: 'slot0' },
        waist : { name: '胴系統倍化' },
        leg   : myapp.equips('leg', 'ユクモノハカマ・天')[0],
        weapon: { name: 'slot2' },
        oma   : omas[0]
    };
    ds.weaponSlot = 2; // 武器スロ2
    norSet = ds._normalize([ '匠', '研ぎ師' ], equipSet);
    got = name(norSet);
    exp = {
        head:
        { equip: 'ユクモノカサ・天',
          decos: [ [], [ '研磨珠【１】' ], [ '研磨珠【１】,研磨珠【１】', '匠珠【２】' ] ] }
      , body:
        { equip: 'slot3',
          decos: [ [],
                   [ '研磨珠【１】' ],
                   [ '研磨珠【１】,研磨珠【１】', '匠珠【２】' ],
                   [ '研磨珠【１】,研磨珠【１】,研磨珠【１】', '匠珠【２】,研磨珠【１】',
                     '匠珠【３】' ] ] }
      , arm:
        { equip: 'slot0', decos: [] },
        waist:
        { equip: '胴系統倍化', decos: [] }
      , leg:
        { equip: 'ユクモノハカマ・天',
          decos: [ [], [ '研磨珠【１】' ], [ '研磨珠【１】,研磨珠【１】', '匠珠【２】' ] ] }
      , weapon:
        { equip: 'slot2',
          decos: [ [], [ '研磨珠【１】' ], [ '研磨珠【１】,研磨珠【１】', '匠珠【２】' ] ] }
      , oma:
        { equip: '龍の護石(スロ3,匠+4,氷耐性,-5)',
          decos: [ [],
                   [ '研磨珠【１】' ],
                   [ '研磨珠【１】,研磨珠【１】', '匠珠【２】' ],
                   [ '研磨珠【１】,研磨珠【１】,研磨珠【１】', '匠珠【２】,研磨珠【１】',
                     '匠珠【３】' ] ] }
    };
    QUnit.deepEqual(got, exp, 'case 2');
});

QUnit.test('_euipSkillComb', function () {
    var got, exp, equipSet, norSet,
        ds = new DecoSimulator();

    equipSet = {
        head : myapp.equips('head', 'ユクモノカサ・天')[0]  // 匠+2, 研ぎ師+3
      , body : myapp.equips('body', '三眼の首飾り')[0]
      , arm  : myapp.equips('arm', 'ユクモノコテ・天')[0]   // 匠+1, 研ぎ師+3
      , waist: myapp.equips('waist', 'バンギスコイル')[0]   // 胴系統倍化
      , leg  : myapp.equips('leg', 'ユクモノハカマ・天')[0] // 匠+1, 研ぎ師+1
    };
    norSet = ds._normalize([ '匠', '研ぎ師' ], equipSet);
    got = ds._equipSkillComb(norSet);
    exp = { '匠': 4, '研ぎ師': 7, '回復量': 5, '加護': 6 };
    QUnit.deepEqual(got, exp, 'case 1');

    // 胴系統倍化が効いてくるパターン
    equipSet = {
        head : myapp.equips('head', 'ユクモノカサ・天')[0]   // 匠+2, 研ぎ師+3
      , body : myapp.equips('body', 'ユクモノドウギ・天')[0] // 匠+1, 研ぎ師+1
      , arm  : myapp.equips('arm', 'ユクモノコテ・天')[0]    // 匠+1, 研ぎ師+3
      , waist: myapp.equips('waist', 'バンギスコイル')[0]    // 胴系統倍化
      , leg  : myapp.equips('leg', 'ユクモノハカマ・天')[0]  // 匠+1, 研ぎ師+1
    };
    norSet = ds._normalize([ '匠', '研ぎ師' ], equipSet);
    got = ds._equipSkillComb(norSet);
    exp = { '匠': 6, '研ぎ師': 9, '回復量': 9, '加護': 10 };
    QUnit.deepEqual(got, exp, 'case 2');
});

QUnit.test('_needSkillComb', function () {
    var got, exp, skillNames, equipSkillComb,
        ds = new DecoSimulator();

    skillNames     = [ '斬れ味レベル+1', '砥石使用高速化' ];
    equipSkillComb = { '匠': 4, '研ぎ師': 7, '回復量': 5, '加護': 6 };

    got = ds._needSkillComb(skillNames, equipSkillComb);
    exp = { '匠': 6, '研ぎ師': 3 };
    QUnit.deepEqual(got, exp, 'need');

    // 既に必要なスキルポイントがある
    skillNames     = [ '斬れ味レベル+1', '砥石使用高速化' ];
    equipSkillComb = { '匠': 10, '研ぎ師': 10, '回復量': 5, '加護': 6 };

    got = ds._needSkillComb(skillNames, equipSkillComb);
    exp = null;
    QUnit.strictEqual(got, exp, 'no need');
});

QUnit.test('_slotsSet', function () {
    var got, exp, equipSet, norSet,
        ds = new DecoSimulator();

    equipSet = {
        head : myapp.equips('head', 'ユクモノカサ・天')[0]  // スロ2
      , body : myapp.equips('body', '三眼の首飾り')[0]      // スロ3
      , arm  : myapp.equips('arm', 'ユクモノコテ・天')[0]   // スロ2
      , waist: myapp.equips('waist', 'バンギスコイル')[0]   // 胴系統倍化
      , leg  : myapp.equips('leg', 'ユクモノハカマ・天')[0] // スロ2
    };
    norSet = ds._normalize([ '匠', '研ぎ師' ], equipSet);

    got = ds._slotsSet(norSet);
    exp = [ [],
            [ 'body:1' ],
            [ 'body:2' ],
            [ 'body:3' ],
            [ 'body:3', 'head:1' ],
            [ 'body:3', 'head:2' ],
            [ 'body:3', 'head:2', 'arm:1' ],
            [ 'body:3', 'head:2', 'arm:2' ],
            [ 'body:3', 'head:2', 'arm:2', 'leg:1' ],
            [ 'body:3', 'head:2', 'arm:2', 'leg:2' ] ];
    QUnit.deepEqual(got, exp, 'slotsSet');

    // 合計スロ数が10以上でも、合計スロ数の昇順か
    // (辞書順じゃなくて数値でソートされてるか)
    equipSet = {
        head  : myapp.equips('head', 'ユクモノカサ・天')[0]  // スロ2
      , body  : myapp.equips('body', '三眼の首飾り')[0]      // スロ3
      , arm   : myapp.equips('arm', 'ユクモノコテ・天')[0]   // スロ2
      , waist : myapp.equips('waist', 'バンギスコイル')[0]   // 胴系統倍化
      , leg   : myapp.equips('leg', 'ユクモノハカマ・天')[0] // スロ2
      , weapon: { name: 'slot2' }
      , oma   : { name: 'slot3' }
    };
    norSet = ds._normalize([ '匠', '研ぎ師' ], equipSet);

    got = ds._slotsSet(norSet);
    exp = [ [],
            [ 'body:1' ],
            [ 'body:2' ],
            [ 'body:3' ],
            [ 'body:3', 'head:1' ],
            [ 'body:3', 'head:2' ],
            [ 'body:3', 'head:2', 'arm:1' ],
            [ 'body:3', 'head:2', 'arm:2' ],
            [ 'body:3', 'head:2', 'arm:2', 'leg:1' ],
            [ 'body:3', 'head:2', 'arm:2', 'leg:2' ],
            [ 'body:3', 'head:2', 'arm:2', 'leg:2', 'weapon:1' ],
            [ 'body:3', 'head:2', 'arm:2', 'leg:2', 'weapon:2' ],
            [ 'body:3', 'head:2', 'arm:2', 'leg:2', 'weapon:2', 'oma:1' ],
            [ 'body:3', 'head:2', 'arm:2', 'leg:2', 'weapon:2', 'oma:2' ],
            [ 'body:3', 'head:2', 'arm:2', 'leg:2', 'weapon:2', 'oma:3' ] ];
    QUnit.deepEqual(got, exp, 'asc');
});

var name = function (deCombSets) {
    return _.map(deCombSets, function (deCombSet) {
        var  set = {};
        _.each(deCombSet, function (deComb, part) {
            set[part] = _.map(deComb, function (deco) { return deco.name; });
        });
        return set;
    });
};

QUnit.test('_appendDeCombSets', function () {
    var got, exp, deCombs, deCombSets,
        ds = new DecoSimulator();

    var deCombsBySlot = Deco.combs([ '匠', '研ぎ師' ]);
    deCombSets = [];
    deCombs    = deCombsBySlot[2];

    deCombSets = ds._appendDeCombSets(deCombSets, 'head', deCombs);
    got = name(deCombSets);
    exp = [ { head: [ '研磨珠【１】', '研磨珠【１】' ] },
            { head: [ '匠珠【２】' ] } ];
    QUnit.deepEqual(got, exp, 'head');

    deCombSets = ds._appendDeCombSets(deCombSets, 'body', deCombs);
    got = name(deCombSets);
    exp = [ { head: [ '研磨珠【１】', '研磨珠【１】' ],
              body: [ '研磨珠【１】', '研磨珠【１】' ] },
            { head: [ '研磨珠【１】', '研磨珠【１】' ],
              body: [ '匠珠【２】' ] },
            { head: [ '匠珠【２】' ],
              body: [ '研磨珠【１】', '研磨珠【１】' ] },
            { head: [ '匠珠【２】' ],
              body: [ '匠珠【２】' ] } ];
    QUnit.deepEqual(got, exp, 'body');
});

QUnit.test('_activatedDeCombs', function () {
    var got, exp, equipSet, norSet, need, slots, deCombSets,
        ds = new DecoSimulator();

    var skillNames = [ '斬れ味レベル+1', '砥石使用高速化' ],
        skillTrees = Skill.trees(skillNames);
    var deCombsBySlot = Deco.combs(skillTrees);

    equipSet = {
        head : myapp.equips('head', 'ユクモノカサ・天')[0]  // スロ2
      , body : myapp.equips('body', '三眼の首飾り')[0]      // スロ3
      , arm  : myapp.equips('arm', 'ユクモノコテ・天')[0]   // スロ2
      , waist: myapp.equips('waist', 'バンギスコイル')[0]   // 胴系統倍化
      , leg  : myapp.equips('leg', 'ユクモノハカマ・天')[0] // スロ2
    };
    norSet = ds._normalize(skillTrees, equipSet);

    need = ds._needSkillComb(skillNames,
                             ds._equipSkillComb(norSet));

    // 脚スロ1では発動しない
    slots = [ 'body:3', 'head:2', 'arm:2', 'leg:1' ];
    got = ds._activatedDeCombs(need, slots, deCombsBySlot, norSet);
    exp = [];
    QUnit.deepEqual(got, exp, 'not activated');

    // 脚スロ2なので発動
    slots = [ 'body:3', 'head:2', 'arm:2', 'leg:2' ];
    deCombSets = ds._activatedDeCombs(need, slots, deCombsBySlot, norSet);
    got = name(deCombSets);
    exp = [ { body: [ '匠珠【３】' ],
              head: [ '研磨珠【１】', '研磨珠【１】' ],
              arm: [ '匠珠【２】' ],
              leg: [ '匠珠【２】' ],
              waist: [ '匠珠【３】' ] } ];
    QUnit.deepEqual(got, exp, 'activated');
});

QUnit.test('_combine', function () {
    var got, exp, equipSet, norSet, deCombSets,
        ds = new DecoSimulator();

    equipSet = {
        head : myapp.equips('head', 'ユクモノカサ・天')[0]  // スロ2
      , body : myapp.equips('body', '三眼の首飾り')[0]      // スロ3
      , arm  : myapp.equips('arm', 'ユクモノコテ・天')[0]   // スロ2
      , waist: myapp.equips('waist', 'バンギスコイル')[0]   // 胴系統倍化
      , leg  : myapp.equips('leg', 'ユクモノハカマ・天')[0] // スロ2
    };
    norSet = ds._normalize([ '匠', '研ぎ師' ], equipSet);
    
    deCombSets = ds._combine([ '斬れ味レベル+1', '砥石使用高速化' ], norSet);
    got = name(deCombSets);
    exp = [ { body: [ '匠珠【３】' ],
              head: [ '研磨珠【１】', '研磨珠【１】' ],
              arm: [ '匠珠【２】' ],
              leg: [ '匠珠【２】' ],
              waist: [ '匠珠【３】' ] } ];
    QUnit.deepEqual(got, exp, 'case 1');

    // 頑シミュさんだと、結果が2パターンある場合
    // (実際は、精霊の加護が発動するパターンも表示され3パターン)
    equipSet = {
        head  : myapp.equips('head', 'ユクモノカサ・天')[0]  // スロ2
      , body  : myapp.equips('body', '三眼の首飾り')[0]      // スロ3
      , arm   : myapp.equips('arm', 'ユクモノコテ・天')[0]   // スロ2
      , waist : myapp.equips('waist', 'バンギスコイル')[0]   // 胴系統倍化
      , leg   : myapp.equips('leg', 'ユクモノハカマ・天')[0] // スロ2
      , weapon: { name: 'slot2' }
    };
    norSet = ds._normalize([ '匠', '研ぎ師' ], equipSet);
    
    deCombSets = ds._combine([ '斬れ味レベル+1', '砥石使用高速化' ], norSet);
    got = name(deCombSets);
    exp = [ { body: [ '匠珠【３】' ],
              head: [ '研磨珠【１】', '研磨珠【１】' ],
              arm: [ '匠珠【２】' ],
              leg: [ '匠珠【２】' ],
              waist: [ '匠珠【３】' ] } ];
    QUnit.deepEqual(got, exp, 'case 2');
});

QUnit.test('_calcPoint', function () {
    var got, exp, equipSet,
        ds = new DecoSimulator();

    equipSet = {
        head  : myapp.equips('head', 'ユクモノカサ・天')[0]  // スロ2
      , body  : myapp.equips('body', '三眼の首飾り')[0]      // スロ3
      , arm   : myapp.equips('arm', 'ユクモノコテ・天')[0]   // スロ2
      , waist : myapp.equips('waist', 'バンギスコイル')[0]   // 胴系統倍化
      , leg   : myapp.equips('leg', 'ユクモノハカマ・天')[0] // スロ2
      , weapon: { name: 'slot2' }
    };
    var norSet     = ds._normalize([ '匠', '研ぎ師' ], equipSet);
    var deCombSets = ds._combine([ '斬れ味レベル+1', '砥石使用高速化' ], norSet);
    var deCombSet  = deCombSets[0];

    got = ds._calcPoint(norSet, deCombSet);
    exp = { '匠': 10, '研ぎ師': 11, '回復量': 5, '加護': 6, '斬れ味': -6 };

    QUnit.deepEqual(got, exp, 'point');
});

QUnit.test('_sumFreeSlot', function () {
    var got, exp, equipSet,
        ds = new DecoSimulator();

    equipSet = {
        head  : myapp.equips('head', 'ユクモノカサ・天')[0]  // スロ2
      , body  : myapp.equips('body', '三眼の首飾り')[0]      // スロ3
      , arm   : myapp.equips('arm', 'ユクモノコテ・天')[0]   // スロ2
      , waist : myapp.equips('waist', 'バンギスコイル')[0]   // 胴系統倍化
      , leg   : myapp.equips('leg', 'ユクモノハカマ・天')[0] // スロ2
      , weapon: { name: 'slot2' }
    };
    var norSet     = ds._normalize([ '匠', '研ぎ師' ], equipSet);
    var deCombSets = ds._combine([ '斬れ味レベル+1', '砥石使用高速化' ], norSet);
    var deCombSet  = deCombSets.pop();

    got = ds._sumFreeSlot(norSet, deCombSet);
    exp = 2; // 武器スロの2スロ分が余る
    QUnit.strictEqual(got, exp, 'freeSlot');
});

QUnit.test('simulate', function () {
    var got, exp, equipSet,
        ds = new DecoSimulator();

    equipSet = {
        head  : myapp.equips('head', 'ユクモノカサ・天')[0]  // 匠+2, 研ぎ師+3
      , body  : { name: 'slot3' }
      , arm   : myapp.equips('arm', 'ユクモノコテ・天')[0]   // 匠+1, 研ぎ師+3
      , waist : { name: '胴系統倍化' }
      , leg   : myapp.equips('leg', 'ユクモノハカマ・天')[0] // 匠+1, 研ぎ師+1
      , weapon: { name: 'slot2' }
    };

    ds.simulate([ '斬れ味レベル+1', '砥石使用高速化' ], equipSet);

    got = ds.result;
    exp = {
        head:
        { name: 'ユクモノカサ・天',
          slot: 2,
          skillComb: { '匠': 2, '研ぎ師': 3, '回復量': 1, '加護': 1 } },
        body: { name: 'slot3', slot: 3, skillComb: {} },
        arm:
        { name: 'ユクモノコテ・天',
          slot: 2,
          skillComb: { '匠': 1, '研ぎ師': 3, '回復量': 2, '加護': 3 } },
        waist: { name: '胴系統倍化', slot: 0, skillComb: { '胴系統倍化': 1 } },
        leg:
        { name: 'ユクモノハカマ・天',
          slot: 2,
          skillComb: { '匠': 1, '研ぎ師': 1, '回復量': 2, '加護': 2 } },
        weapon: { name: 'slot2', slot: 2, skillComb: {} },
        oma: { name: 'oma', slot: 0, skillComb: {} },
        decos:
        [ { names: [ '匠珠【３】(胴)', '研磨珠【１】', '研磨珠【１】',
                     '匠珠【２】', '匠珠【２】', '匠珠【３】' ],
            skillComb: { '匠': 10, '斬れ味': -6, '研ぎ師': 11, '回復量': 5, '加護': 6 },
            freeSlot: 2 } ]
    };
    QUnit.deepEqual(got, exp, 'simulate');

    // お守りあり
    myapp.setup({ hr: 1, vs: 6 }); // 装備を村のみにしぼる
    var omas = [ [ '龍の護石',3,'匠',4,'氷耐性',-5 ] ];
    omas = myapp.model.Oma.createSimuData(omas);
    equipSet = {
        head  : myapp.equips('head', 'ガララキャップ')[0]
      , body  : myapp.equips('body', 'ガルルガメイル')[0]
      , arm   : myapp.equips('arm', 'レウスアーム')[0]
      , waist : myapp.equips('waist', 'ゴアフォールド')[0]
      , leg   : myapp.equips('leg', 'アークグリーヴ')[0]
      , weapon: { name: 'slot3' }
      , oma   : omas[0]
    };
    ds.simulate([ '斬れ味レベル+1', '攻撃力UP【大】', '耳栓' ], equipSet);
    got = ds.result;
    exp = {
        head: 
        { name: 'ガララキャップ',
          slot: 2,
          skillComb: { '捕獲': 1, '聴覚保護': 4, '気まぐれ': -3, '麻痺': 1 } },
        body: 
        { name: 'ガルルガメイル',
          slot: 1,
          skillComb: { '剣術': -1, '達人': 1, '聴覚保護': 4 } },
        arm: 
        { name: 'レウスアーム',
          slot: 1,
          skillComb: { '攻撃': 5, '火属性攻撃': 2, '回復量': -2 } },
        waist: 
        { name: 'ゴアフォールド',
          slot: 1,
          skillComb: { '細菌学': 2, '匠': 3, '闘魂': 2, '火耐性': -3 } },
        leg: 
        { name: 'アークグリーヴ',
          slot: 2,
          skillComb: { '匠': 3, '本気': 3, '火耐性': -3, '狂撃耐性': 1 } },
        weapon: { name: 'slot3', slot: 3, skillComb: {} },
        oma:
        { name: '龍の護石(スロ3,匠+4,氷耐性,-5)',
          slot: 3,
          skillComb: { '匠': 4, '氷耐性': -5 } },
        decos:
        [ { names:
            [ '防音珠【１】',
              '攻撃珠【２】',
              '防音珠【１】',
              '攻撃珠【１】',
              '攻撃珠【２】',
              '攻撃珠【２】',
              '攻撃珠【１】',
              '攻撃珠【２】',
              '攻撃珠【１】' ],
            skillComb:
            { '剣術': -1,
              '達人': 1,
              '聴覚保護': 10,
              '加護': -2,
              '捕獲': 1,
              '気まぐれ': -3,
              '麻痺': 1,
              '攻撃': 20,
              '防御': -7,
              '火属性攻撃': 2,
              '回復量': -2,
              '細菌学': 2,
              '匠': 10,
              '闘魂': 2,
              '火耐性': -6,
              '本気': 3,
              '狂撃耐性': 1,
              '氷耐性': -5 },
            freeSlot: 0 } ]
    };
    QUnit.deepEqual(got, exp, 'with oma');
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
           test(this.QUnit, this._, this.simu.DecoSimulator, this.simu.Skill, this.myapp);
       }
);
