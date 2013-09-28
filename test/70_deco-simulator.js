(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', 'underscore',
             '../lib/deco-simulator.js', '../lib/skill.js',
             './lib/driver-myapp.js' ];
define(deps, function (QUnit, _, DecoSimulator, Skill, myapp) {

QUnit.module('70_deco-simulator', {
    setup: function () {
        myapp.initialize();
    }
});

QUnit.test('DecoSimulator', function () {
    QUnit.strictEqual(typeof DecoSimulator, 'function', 'is function');
});

QUnit.test('new', function () {
    var got;

    got = new DecoSimulator();

    QUnit.strictEqual(typeof got, 'object', 'is object');
    QUnit.strictEqual(typeof got.initialize, 'function', 'has initialize()');

    QUnit.strictEqual(got.result, null, 'reuslt');
    QUnit.strictEqual(got.weaponSlot, 0, 'weaponSlot');
});

QUnit.test('initialize', function () {
    var got,
        ds = new DecoSimulator();

    ds.initialize({ weaponSlot: 2 });
    got = ds.weaponSlot;
    QUnit.strictEqual(got, 2, 'weaponSlot');
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

    equipSet = {
        head : myapp.equips('head', 'ユクモノカサ・天')[0], // 匠+2, 研ぎ師+3
        body : myapp.equips('body', '三眼の首飾り')[0],
        arm  : myapp.equips('arm', 'ユクモノコテ・天')[0],  // 匠+1, 研ぎ師+3
        waist: myapp.equips('waist', 'バンギスコイル')[0],
        leg  : myapp.equips('leg', 'ユクモノハカマ・天')[0] // 匠+1, 研ぎ師+1
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
      , weapon:
        { equip: 'weapon', decos: [] }
    };
    QUnit.deepEqual(got, exp, '_normalize');

    // 装備に slotN と胴系統倍化がある場合
    equipSet = {
        head : myapp.equips('head', 'ユクモノカサ・天')[0],
        body : { name: 'slot3' },
        arm  : { name: 'slot0' },
        waist: { name: '胴系統倍化' },
        leg  : myapp.equips('leg', 'ユクモノハカマ・天')[0]
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
        { equip: 'weapon',
          decos: [ [], [ '研磨珠【１】' ], [ '研磨珠【１】,研磨珠【１】', '匠珠【２】' ] ] }
    };
    QUnit.deepEqual(got, exp, 'slotN');
});

QUnit.test('_combine', function () {
    var got, exp, norSet,
        ds = new DecoSimulator();

    norSet = {
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
        { equip: 'バンギスコイル', decos: [] }
      , leg:
        { equip: 'ユクモノハカマ・天',
          decos: [ [], [ '研磨珠【１】' ], [ '研磨珠【１】,研磨珠【１】', '匠珠【２】' ] ] }
      , weapon:
        { equip: 'weapon',
          decos: [ [], [ '研磨珠【１】' ], [ '研磨珠【１】,研磨珠【１】', '匠珠【２】' ] ] }
    };
    got = ds._combine(norSet);
    exp = (1 + 1 + 2) * (1 + 1 + 2 + 3) * (1) * (1) * (1 + 1 + 2) * (1 + 1 + 2);
    QUnit.strictEqual(got.length, exp, 'length');

    got = got.slice(0, 5);
    exp = [ { head: { equip: 'ユクモノカサ・天', deco: null },
              body: { equip: 'slot3', deco: null },
              arm: { equip: 'slot0', deco: null },
              waist: { equip: 'バンギスコイル', deco: null },
              leg: { equip: 'ユクモノハカマ・天', deco: null },
              weapon: { equip: 'weapon', deco: null } },
            { head: { equip: 'ユクモノカサ・天', deco: null },
              body: { equip: 'slot3', deco: null },
              arm: { equip: 'slot0', deco: null },
              waist: { equip: 'バンギスコイル', deco: null },
              leg: { equip: 'ユクモノハカマ・天', deco: null },
              weapon: { equip: 'weapon', deco: '研磨珠【１】' } },
            { head: { equip: 'ユクモノカサ・天', deco: null },
              body: { equip: 'slot3', deco: null },
              arm: { equip: 'slot0', deco: null },
              waist: { equip: 'バンギスコイル', deco: null },
              leg: { equip: 'ユクモノハカマ・天', deco: null },
              weapon: { equip: 'weapon', deco: '研磨珠【１】,研磨珠【１】' } },
            { head: { equip: 'ユクモノカサ・天', deco: null },
              body: { equip: 'slot3', deco: null },
              arm: { equip: 'slot0', deco: null },
              waist: { equip: 'バンギスコイル', deco: null },
              leg: { equip: 'ユクモノハカマ・天', deco: null },
              weapon: { equip: 'weapon', deco: '匠珠【２】' } },
            { head: { equip: 'ユクモノカサ・天', deco: null },
              body: { equip: 'slot3', deco: null },
              arm: { equip: 'slot0', deco: null },
              waist: { equip: 'バンギスコイル', deco: null },
              leg: { equip: 'ユクモノハカマ・天', deco: '研磨珠【１】' },
              weapon: { equip: 'weapon', deco: null } } ];
    QUnit.deepEqual(got, exp, 'combine');
});

QUnit.test('_calcPoint', function () {
    var got, exp, equipSet,
        ds = new DecoSimulator();

    ds.weaponSlot = 2; // 武器スロ2
    equipSet = {
        head : myapp.equips('head', 'ユクモノカサ・天')[0], // 匠+2, 研ぎ師+3
        body : myapp.equips('body', '三眼の首飾り')[0],
        arm  : { name: 'slot0' },
        waist: myapp.equips('waist', 'バンギスコイル')[0],  // 胴系統倍化
        leg  : myapp.equips('leg', 'ユクモノハカマ・天')[0] // 匠+1, 研ぎ師+1
    };
    var norSet  = ds._normalize([ '匠', '研ぎ師' ], equipSet);
    var list    = ds._combine(norSet);
    var combSet = list.pop();

    got = ds._calcPoint(combSet);

    // exp は、以下の結果から求めてる
    //var pluck = _.map(combSet, function (comb) { return _.pluck(comb, 'skillComb'); });
    var pluck = [ [ { '匠': 2, '研ぎ師': 3, '回復量': 1, '加護': 1 },
                    { '匠': 1, '斬れ味': -1 } ],   
                  [ {}, { '匠': 2, '斬れ味': -2 } ],
                  [ {}, undefined ],
                  [ {}, { '匠': 2, '斬れ味': -2 } ], // 胴系統倍化
                  [ { '匠': 1, '研ぎ師': 1, '回復量': 2, '加護': 2 },
                    { '匠': 1, '斬れ味': -1 } ],
                  [ {}, { '匠': 1, '斬れ味': -1 } ] ];
    exp = Skill.merge(_.flatten(pluck));

    QUnit.deepEqual(got, exp, 'point');
});

QUnit.test('_genKey', function () {
    var got, exp, equipSet,
        ds = new DecoSimulator();

    ds.weaponSlot = 2; // 武器スロ2
    equipSet = {
        head : myapp.equips('head', 'ユクモノカサ・天')[0], // 匠+2, 研ぎ師+3
        body : myapp.equips('body', '三眼の首飾り')[0],
        arm  : { name: 'slot0' },
        waist: myapp.equips('waist', 'バンギスコイル')[0],  // 胴系統倍化
        leg  : myapp.equips('leg', 'ユクモノハカマ・天')[0] // 匠+1, 研ぎ師+1
    };
    var norSet  = ds._normalize([ '匠', '研ぎ師' ], equipSet);
    var list    = ds._combine(norSet);
    var combSet = list.pop();

    got = ds._genKey(combSet);
    exp = '匠珠【２】,匠珠【２】,匠珠【２】,匠珠【３】(胴)';
    QUnit.strictEqual(got, exp, 'key');
});

QUnit.test('_sumFreeSlot', function () {
    var got, exp, equipSet,
        ds = new DecoSimulator();

    ds.weaponSlot = 2; // 武器スロ2
    equipSet = {
        head : myapp.equips('head', 'ユクモノカサ・天')[0], // スロ2
        body : myapp.equips('body', '三眼の首飾り')[0],     // スロ3
        arm  : { name: 'slot0' },
        waist: myapp.equips('waist', 'バンギスコイル')[0],  // スロ0
        leg  : myapp.equips('leg', 'ユクモノハカマ・天')[0] // スロ2
    };
    var norSet  = ds._normalize([ '匠', '研ぎ師' ], equipSet);
    var list    = ds._combine(norSet);
    var combSet = list.shift();

    got = ds._sumFreeSlot(combSet);
    exp = 9;
    QUnit.strictEqual(got, exp, 'freeSlot');
});

QUnit.test('simulate', function () {
    var got, exp, equipSet, opts,
        ds = new DecoSimulator();

    opts = { weaponSlot: 2 }; // 武器スロ2
    equipSet = {
        head : myapp.equips('head', 'ユクモノカサ・天')[0], // 匠+2, 研ぎ師+3
        body : { name: 'slot3' },
        arm  : myapp.equips('arm', 'ユクモノコテ・天')[0],  // 匠+1, 研ぎ師+3
        waist: { name: '胴系統倍化' },
        leg  : myapp.equips('leg', 'ユクモノハカマ・天')[0] // 匠+1, 研ぎ師+1
    };

    ds.simulate([ '斬れ味レベル+1', '砥石使用高速化' ], equipSet, opts);

    got = ds.result;
    exp = {
        head:
        { name: 'ユクモノカサ・天',
          slot: 2,
          skillComb: { '匠': 2, '研ぎ師': 3, '回復量': 1, '加護': 1 } },
        body:
        { name: 'slot3', slot: 3, skillComb: {} },
        arm:
        { name: 'ユクモノコテ・天',
          slot: 2,
          skillComb: { '匠': 1, '研ぎ師': 3, '回復量': 2, '加護': 3 } },
        waist: { name: '胴系統倍化', slot: 0, skillComb: { '胴系統倍化': 1 } },
        leg:
        { name: 'ユクモノハカマ・天',
          slot: 2,
          skillComb: { '匠': 1, '研ぎ師': 1, '回復量': 2, '加護': 2 } },
        decos: [ [ '匠珠【３】', '研磨珠【１】', '研磨珠【１】', '匠珠【２】', '匠珠【２】' ] ],
        summaries:
        [ { names: '匠珠【２】,匠珠【２】,匠珠【３】(胴),研磨珠【１】,研磨珠【１】',
            skillComb: { '匠': 10, '研ぎ師': 11, '回復量': 5, '加護': 6, '斬れ味': -6 },
            freeSlot: 2 } ] };
    QUnit.deepEqual(got, exp, 'result');
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
