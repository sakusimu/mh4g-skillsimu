(function (define) {
'use strict';
var deps = [ '../lib/test-helper.js', 'underscore',
             '../../lib/deco/normalizer.js', '../../lib/util/deco.js', '../lib/driver-myapp.js' ];
define(deps, function (QUnit, _, Normalizer, Deco, myapp) {

QUnit.module('40_deco/10_normalizer', {
    setup: function () {
        myapp.initialize();
    }
});

QUnit.test('Normalizer', function () {
    QUnit.strictEqual(typeof Normalizer, 'function', 'is function');
});

QUnit.test('new', function () {
    var got;

    got = new Normalizer();

    QUnit.strictEqual(typeof got, 'object', 'is object');
    QUnit.strictEqual(typeof got.initialize, 'function', 'has initialize()');
});

QUnit.test('_normalizeEquip', function () {
    var got, exp, equipSet,
        n = new Normalizer();

    // 普通に装備が5つ
    equipSet = {
        head : myapp.equip('head', 'ユクモノカサ・天')  // 匠+2, 研ぎ師+3
      , body : myapp.equip('body', '三眼の首飾り')
      , arm  : myapp.equip('arm', 'ユクモノコテ・天')   // 匠+1, 研ぎ師+3
      , waist: myapp.equip('waist', 'バンギスコイル')
      , leg  : myapp.equip('leg', 'ユクモノハカマ・天') // 匠+1, 研ぎ師+1
    };
    got = n._normalizeEquip(equipSet);
    exp = {
        body  : { name: '三眼の首飾り', slot: 3, skillComb: {} }
      , head  : { name: 'ユクモノカサ・天',
                  slot: 2, skillComb: { '匠': 2, '研ぎ師': 3, '回復量': 1, '加護': 1 } }
      , arm   : { name: 'ユクモノコテ・天',
                  slot: 2, skillComb: { '匠': 1, '研ぎ師': 3, '回復量': 2, '加護': 3 } }
      , waist : { name: 'バンギスコイル', slot: 0, skillComb: { '胴系統倍化': 1 } }
      , leg   : { name: 'ユクモノハカマ・天',
                  slot: 2, skillComb: { '匠': 1, '研ぎ師': 1, '回復量': 2, '加護': 2 } }
      , weapon: null
      , oma   : null
    };
    QUnit.deepEqual(got, exp, '5 equips');

    // 装備に slotN と胴系統倍化、武器スロ、お守りがある場合
    var omas = [ myapp.oma([ '龍の護石',3,'匠',4,'氷耐性',-5 ]) ];
    equipSet = {
        head  : myapp.equip('head', 'ユクモノカサ・天')
      , body  : { name: 'slot3' }
      , arm   : { name: 'slot0' }
      , waist : { name: '胴系統倍化' }
      , leg   : myapp.equip('leg', 'ユクモノハカマ・天')
      , weapon: { name: 'slot2' }
      , oma   : omas[0]
    };
    got = n._normalizeEquip(equipSet);
    exp = {
        body  : { name: 'slot3', slot: 3, skillComb: {} }
      , head  : { name: 'ユクモノカサ・天',
                  slot: 2, skillComb: { '匠': 2, '研ぎ師': 3, '回復量': 1, '加護': 1 } }
      , arm   : { name: 'slot0', slot: 0, skillComb: {} }
      , waist : { name: '胴系統倍化', slot: 0, skillComb: { '胴系統倍化': 1 } }
      , leg   : { name: 'ユクモノハカマ・天',
                  slot: 2, skillComb: { '匠': 1, '研ぎ師': 1, '回復量': 2, '加護': 2 } }
      , weapon: { name: 'slot2', slot: 2, skillComb: {} }
      , oma   : { name: '龍の護石(スロ3,匠+4,氷耐性-5)',
                  slot: 3, skillComb: { '匠': 4, '氷耐性': -5 } }
    };
    QUnit.deepEqual(got, exp, 'slotN, torsoUp, weapon, oma');

    equipSet = {};
    got = n._normalizeEquip(equipSet);
    exp = {
        body  : null
      , head  : null
      , arm   : null
      , waist : null
      , leg   : null
      , weapon: null
      , oma   : null
    };
    QUnit.deepEqual(got, exp, 'empty equipSet');
});

QUnit.test('_makeDecombs', function () {
    var got, exp, decoCombsBySlot,
        n = new Normalizer();

    decoCombsBySlot = Deco.combs([ '研ぎ師' ]);
    got = n._makeDecombs(decoCombsBySlot, 0);
    exp = [];
    QUnit.deepEqual(got, exp, 'slot0');

    decoCombsBySlot = Deco.combs([ '研ぎ師' ]);
    got = n._makeDecombs(decoCombsBySlot, 1);
    exp = [ { names: [], slot: 0, skillComb: {} }
          , { names: [ '研磨珠【１】' ], slot: 1, skillComb: { '研ぎ師': 2 } } ];
    QUnit.deepEqual(got, exp, "slot1: [ '研ぎ師' ]");

    decoCombsBySlot = Deco.combs([ '匠' ]);
    got = n._makeDecombs(decoCombsBySlot, 1);
    exp = [ { names: [], slot: 0, skillComb: {} } ];
    QUnit.deepEqual(got, exp, "slot1: [ '匠' ]");

    decoCombsBySlot = Deco.combs([ '匠', '研ぎ師' ]);
    got = n._makeDecombs(decoCombsBySlot, 3);
    exp = [
        { names: [], slot: 0, skillComb: {} }
      , { names: [ '研磨珠【１】' ], slot: 1, skillComb: { '研ぎ師': 2 } }
      , { names: [ '研磨珠【１】', '研磨珠【１】' ],
          slot: 2, skillComb: { '研ぎ師': 4 } }
      , { names: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '斬れ味': -1 } }
      , { names: [ '研磨珠【１】', '研磨珠【１】', '研磨珠【１】' ],
          slot: 3, skillComb: { '研ぎ師': 6 } }
      , { names: [ '匠珠【２】', '研磨珠【１】' ],
          slot: 3, skillComb: { '匠': 1, '斬れ味': -1, '研ぎ師': 2 } }
      , { names: [ '匠珠【３】' ], slot: 3, skillComb: { '匠': 2, '斬れ味': -2 } }
    ];
    QUnit.deepEqual(got, exp, "slot3: [ '匠', '研ぎ師' ]");

    decoCombsBySlot = Deco.combs([ '匠' ]);
    got = n._makeDecombs(decoCombsBySlot, 3);
    exp = [
        { names: [], slot: 0, skillComb: {} }
      , { names: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '斬れ味': -1 } }
      , { names: [ '匠珠【２】' ], slot: 3, skillComb: { '匠': 1, '斬れ味': -1 } }
      , { names: [ '匠珠【３】' ], slot: 3, skillComb: { '匠': 2, '斬れ味': -2 } }
    ];
    QUnit.deepEqual(got, exp, "slot3: [ '匠' ]");
});

QUnit.test('normalize', function () {
    var got, exp, equipSet, normalized,
        n = new Normalizer();

    // 普通に装備が5つ
    equipSet = {
        head : myapp.equip('head', 'ユクモノカサ・天')  // 匠+2, 研ぎ師+3
      , body : myapp.equip('body', '三眼の首飾り')
      , arm  : myapp.equip('arm', 'ユクモノコテ・天')   // 匠+1, 研ぎ師+3
      , waist: myapp.equip('waist', 'バンギスコイル')
      , leg  : myapp.equip('leg', 'ユクモノハカマ・天') // 匠+1, 研ぎ師+1
    };
    normalized = n.normalize([ '斬れ味レベル+1', '砥石使用高速化' ], equipSet);
    got = normalized.decombsSet;
    exp = {
        head: [
            { names: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } }
          , { names: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } }
          , { names: [ '研磨珠【１】', '研磨珠【１】' ],
              slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } }
          , { names: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } } ],
        body: [
            { names: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } }
          , { names: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } }
          , { names: [ '研磨珠【１】', '研磨珠【１】' ],
              slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } }
          , { names: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } }
          , { names: [ '研磨珠【１】', '研磨珠【１】', '研磨珠【１】' ],
              slot: 3, skillComb: { '匠': 0, '研ぎ師': 6 } }
          , { names: [ '匠珠【２】', '研磨珠【１】' ],
              slot: 3, skillComb: { '匠': 1, '研ぎ師': 2 } }
          , { names: [ '匠珠【３】' ], slot: 3, skillComb: { '匠': 2, '研ぎ師': 0 } } ],
        arm: [
            { names: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } }
          , { names: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } }
          , { names: [ '研磨珠【１】', '研磨珠【１】' ],
              slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } }
          , { names: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } } ],
        waist: [
            { names: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0, '胴系統倍化': 1 } } ],
        leg: [
            { names: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } }
          , { names: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } }
          , { names: [ '研磨珠【１】', '研磨珠【１】' ],
              slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } }
          , { names: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } } ],
        weapon: [],
        oma: []
    };
    QUnit.deepEqual(got, exp, 'case 1');

    // 装備に slotN と胴系統倍化、武器スロ、お守りがある場合
    var omas = [ myapp.oma([ '龍の護石',3,'匠',4,'氷耐性',-5 ]) ];
    equipSet = {
        head  : myapp.equip('head', 'ユクモノカサ・天'),
        body  : { name: 'slot3' },
        arm   : { name: 'slot0' },
        waist : { name: '胴系統倍化' },
        leg   : myapp.equip('leg', 'ユクモノハカマ・天'),
        weapon: { name: 'slot2' },
        oma   : omas[0]
    };
    normalized = n.normalize([ '斬れ味レベル+1', '砥石使用高速化' ], equipSet);
    got = normalized.decombsSet;
    exp = {
        head: [
            { names: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } }
          , { names: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } }
          , { names: [ '研磨珠【１】', '研磨珠【１】' ],
              slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } }
          , { names: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } } ],
        body: [
            { names: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } }
          , { names: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } }
          , { names: [ '研磨珠【１】', '研磨珠【１】' ],
              slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } }
          , { names: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } }
          , { names: [ '研磨珠【１】', '研磨珠【１】', '研磨珠【１】' ],
            slot: 3, skillComb: { '匠': 0, '研ぎ師': 6 } }
          , { names: [ '匠珠【２】', '研磨珠【１】' ],
            slot: 3, skillComb: { '匠': 1, '研ぎ師': 2 } }
          , { names: [ '匠珠【３】' ], slot: 3, skillComb: { '匠': 2, '研ぎ師': 0 } } ],
        arm: [],
        waist: [
            { names: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0, '胴系統倍化': 1 } } ],
        leg: [
            { names: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } }
          , { names: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } }
          , { names: [ '研磨珠【１】', '研磨珠【１】' ],
              slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } }
          , { names: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } } ],
        weapon: [
            { names: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } }
          , { names: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } }
          , { names: [ '研磨珠【１】', '研磨珠【１】' ],
              slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } }
          , { names: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } } ],
        oma: [
            { names: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } }
          , { names: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } }
          , { names: [ '研磨珠【１】', '研磨珠【１】' ],
              slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } }
          , { names: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } }
          , { names: [ '研磨珠【１】', '研磨珠【１】', '研磨珠【１】' ],
              slot: 3, skillComb: { '匠': 0, '研ぎ師': 6 } }
          , { names: [ '匠珠【２】', '研磨珠【１】' ],
              slot: 3, skillComb: { '匠': 1, '研ぎ師': 2 } }
          , { names: [ '匠珠【３】' ], slot: 3, skillComb: { '匠': 2, '研ぎ師': 0 } } ]
    };
    QUnit.deepEqual(got, exp, 'case 2');

    got = n.normalize();
    QUnit.deepEqual(got, null, 'nothing in');
    got = n.normalize(undefined);
    QUnit.deepEqual(got, null, 'undefined');
    got = n.normalize(null);
    QUnit.deepEqual(got, null, 'null');
    got = n.normalize([]);
    QUnit.deepEqual(got, null, '[]');

    got = n.normalize([ '攻撃力UP【大】' ]);
    QUnit.deepEqual(got, null, 'skillNames only');
    got = n.normalize([ '攻撃力UP【大】' ], undefined);
    QUnit.deepEqual(got, null, 'skillNames, undefined');
    got = n.normalize([ '攻撃力UP【大】' ], null);
    QUnit.deepEqual(got, null, 'skillNames, null');
    got = n.normalize([ '攻撃力UP【大】' ], {});
    exp = {
        decombsSet: {
            head: [], body: [], arm: [], waist: [],leg: [], weapon: [], oma: []
        },
        equipSet: {
            head: null, body: null, arm: null, waist: null, leg: null,
            weapon: null, oma: null
        }
    };
    QUnit.deepEqual(got, exp, 'skillNames, {}');
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
           test(this.QUnit, this._,
                this.simu.Deco.Normalizer, this.simu.Util.Deco, this.myapp);
       }
);
