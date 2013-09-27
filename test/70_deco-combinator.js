(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', 'underscore',
             '../lib/deco-combinator.js',
             './lib/driver-myapp.js' ];
define(deps, function (QUnit, _, DecoCombinator, myapp) {

QUnit.module('70_deco-combinator', {
    setup: function () {
        myapp.initialize();
    }
});

QUnit.test('Combinator', function () {
    QUnit.strictEqual(typeof DecoCombinator, 'function', 'is function');
});

QUnit.test('new', function () {
    var got;

    got = new DecoCombinator();
    QUnit.strictEqual(typeof got, 'object', 'is object');
    QUnit.strictEqual(typeof got.initialize, 'function', 'has initialize()');

    QUnit.strictEqual(got.result, null, 'reuslt');
    QUnit.deepEqual(got.equips, {}, 'equips');
    QUnit.strictEqual(got.weaponSlot, null, 'weaponSlot');
});

QUnit.test('_makeCombsSet', function () {
    var got, exp, equips, combsSet,
        dc = new DecoCombinator();

    var name = function (combsSet) {
        var set = {};
        _.each(combsSet, function (combs, part) {
            set[part] = _.map(combs, function (comb) {
                var e = comb.equip.name,
                    d = comb.deco ? comb.deco.names : null;
                return { equip: e, deco: d };
            });
        });
        return set;
    };

    equips = {
        head : myapp.equips('head', 'ユクモノカサ・天')[0], // 匠+2, 研ぎ師+3
        body : myapp.equips('body', '三眼の首飾り')[0],
        arm  : myapp.equips('arm', 'ユクモノコテ・天')[0],  // 匠+1, 研ぎ師+1
        waist: myapp.equips('waist', 'バンギスコイル')[0],
        leg  : myapp.equips('leg', 'ユクモノハカマ・天')[0] // 匠+1, 研ぎ師+1
    };
    combsSet = dc._makeCombsSet([ '匠', '研ぎ師' ], equips);
    got = name(combsSet);
    exp = {
        head:
        [ { equip: 'ユクモノカサ・天', deco: [ '研磨珠【１】', '研磨珠【１】' ] },
          { equip: 'ユクモノカサ・天', deco: [ '匠珠【２】' ] } ],
        body:
        [ { equip: '三眼の首飾り', deco: [ '研磨珠【１】', '研磨珠【１】', '研磨珠【１】' ] },
          { equip: '三眼の首飾り', deco: [ '匠珠【２】', '研磨珠【１】' ] },
          { equip: '三眼の首飾り', deco: [ '匠珠【３】' ] } ],
        arm:
        [ { equip: 'ユクモノコテ・天', deco: [ '研磨珠【１】', '研磨珠【１】' ] },
          { equip: 'ユクモノコテ・天', deco: [ '匠珠【２】' ] } ],
        waist:
        [ { equip: 'バンギスコイル', deco: null } ],
        leg:
        [ { equip: 'ユクモノハカマ・天', deco: [ '研磨珠【１】', '研磨珠【１】' ] },
          { equip: 'ユクモノハカマ・天', deco: [ '匠珠【２】' ] } ]
    };
    QUnit.deepEqual(got, exp, 'combsSet');

    // 装備に slotN がある場合
    equips = {
        head : myapp.equips('head', 'ユクモノカサ・天')[0],
        body : { name: 'slot3' },
        arm  : { name: 'slot0' },
        waist: myapp.equips('waist', 'バンギスコイル')[0],
        leg  : myapp.equips('leg', 'ユクモノハカマ・天')[0]
    };
    combsSet = dc._makeCombsSet([ '匠', '研ぎ師' ], equips);
    got = name(combsSet);
    exp = {
        head:
        [ { equip: 'ユクモノカサ・天', deco: [ '研磨珠【１】', '研磨珠【１】' ] },
          { equip: 'ユクモノカサ・天', deco: [ '匠珠【２】' ] } ],
        body:
        [ { equip: 'slot3', deco: [ '研磨珠【１】', '研磨珠【１】', '研磨珠【１】' ] },
          { equip: 'slot3', deco: [ '匠珠【２】', '研磨珠【１】' ] },
          { equip: 'slot3', deco: [ '匠珠【３】' ] } ],
        arm:
        [ { equip: 'slot0', deco: null } ],
        waist:
        [ { equip: 'バンギスコイル', deco: null } ],
        leg:
        [ { equip: 'ユクモノハカマ・天', deco: [ '研磨珠【１】', '研磨珠【１】' ] },
          { equip: 'ユクモノハカマ・天', deco: [ '匠珠【２】' ] } ]
    };
    got = name(combsSet);
    QUnit.deepEqual(got, exp, 'slotN');
});

QUnit.test('_calcPoint', function () {
    var got, exp, equips,
        dc = new DecoCombinator();

    equips = {
        head : myapp.equips('head', 'ユクモノカサ・天')[0], // 匠+2, 研ぎ師+3
        body : myapp.equips('body', '三眼の首飾り')[0],
        arm  : { name: 'slot0' },
        waist: myapp.equips('waist', 'バンギスコイル')[0],  // 胴系統倍化
        leg  : myapp.equips('leg', 'ユクモノハカマ・天')[0] // 匠+1, 研ぎ師+1
    };
    var combsSet = dc._makeCombsSet([ '匠', '研ぎ師' ], equips);
    var combSet = { head : combsSet.head[1],  // 匠珠【２】
                    body : combsSet.body[1],  // 匠珠【２】, 研磨珠【１】
                    arm  : combsSet.arm[0],
                    waist: combsSet.waist[0],
                    leg  : combsSet.leg[1] }; // 匠珠【２】
    got = dc._calcPoint(combSet);
    exp = { '匠': 7, '研ぎ師': 8, '回復量': 3, '加護': 3, '斬れ味': -4 };
    QUnit.deepEqual(got, exp, 'point');
});

QUnit.test('_makeCombSetList', function () {
    var got, exp, combsSet,
        dc = new DecoCombinator();

    combsSet = {
        head:
        [ { equip: 'ユクモノカサ・天', deco: '研磨珠【１】,研磨珠【１】' },
          { equip: 'ユクモノカサ・天', deco: '匠珠【２】' } ],
        body:
        [ { equip: 'slot3', deco: '研磨珠【１】,研磨珠【１】,研磨珠【１】' },
          { equip: 'slot3', deco: '匠珠【２】,研磨珠【１】' },
          { equip: 'slot3', deco: '匠珠【３】' } ],
        arm:
        [ { equip: 'slot0', deco: null } ],
        waist:
        [ { equip: 'バンギスコイル', deco: null } ],
        leg:
        [ { equip: 'ユクモノハカマ・天', deco: '研磨珠【１】,研磨珠【１】' },
          { equip: 'ユクモノハカマ・天', deco: '匠珠【２】' } ]
    };
    got = dc._makeCombSetList(combsSet);
    exp = 2 * 3 * 1 * 1 * 2;
    QUnit.strictEqual(got.length, exp, 'length');
    exp = [ { head: { equip: 'ユクモノカサ・天', deco: '研磨珠【１】,研磨珠【１】' },
              body: { equip: 'slot3', deco: '研磨珠【１】,研磨珠【１】,研磨珠【１】' },
              arm: { equip: 'slot0', deco: null },
              waist: { equip: 'バンギスコイル', deco: null },
              leg: { equip: 'ユクモノハカマ・天', deco: '研磨珠【１】,研磨珠【１】' } },
            { head: { equip: 'ユクモノカサ・天', deco: '研磨珠【１】,研磨珠【１】' },
              body: { equip: 'slot3', deco: '研磨珠【１】,研磨珠【１】,研磨珠【１】' },
              arm: { equip: 'slot0', deco: null },
              waist: { equip: 'バンギスコイル', deco: null },
              leg: { equip: 'ユクモノハカマ・天', deco: '匠珠【２】' } },
            { head: { equip: 'ユクモノカサ・天', deco: '研磨珠【１】,研磨珠【１】' },
              body: { equip: 'slot3', deco: '匠珠【２】,研磨珠【１】' },
              arm: { equip: 'slot0', deco: null },
              waist: { equip: 'バンギスコイル', deco: null },
              leg: { equip: 'ユクモノハカマ・天', deco: '研磨珠【１】,研磨珠【１】' } },
            { head: { equip: 'ユクモノカサ・天', deco: '研磨珠【１】,研磨珠【１】' },
              body: { equip: 'slot3', deco: '匠珠【２】,研磨珠【１】' },
              arm: { equip: 'slot0', deco: null },
              waist: { equip: 'バンギスコイル', deco: null },
              leg: { equip: 'ユクモノハカマ・天', deco: '匠珠【２】' } },
            { head: { equip: 'ユクモノカサ・天', deco: '研磨珠【１】,研磨珠【１】' },
              body: { equip: 'slot3', deco: '匠珠【３】' },
              arm: { equip: 'slot0', deco: null },
              waist: { equip: 'バンギスコイル', deco: null },
              leg: { equip: 'ユクモノハカマ・天', deco: '研磨珠【１】,研磨珠【１】' } },
            { head: { equip: 'ユクモノカサ・天', deco: '研磨珠【１】,研磨珠【１】' },
              body: { equip: 'slot3', deco: '匠珠【３】' },
              arm: { equip: 'slot0', deco: null },
              waist: { equip: 'バンギスコイル', deco: null },
              leg: { equip: 'ユクモノハカマ・天', deco: '匠珠【２】' } },
            { head: { equip: 'ユクモノカサ・天', deco: '匠珠【２】' },
              body: { equip: 'slot3', deco: '研磨珠【１】,研磨珠【１】,研磨珠【１】' },
              arm: { equip: 'slot0', deco: null },
              waist: { equip: 'バンギスコイル', deco: null },
              leg: { equip: 'ユクモノハカマ・天', deco: '研磨珠【１】,研磨珠【１】' } },
            { head: { equip: 'ユクモノカサ・天', deco: '匠珠【２】' },
              body: { equip: 'slot3', deco: '研磨珠【１】,研磨珠【１】,研磨珠【１】' },
              arm: { equip: 'slot0', deco: null },
              waist: { equip: 'バンギスコイル', deco: null },
              leg: { equip: 'ユクモノハカマ・天', deco: '匠珠【２】' } },
            { head: { equip: 'ユクモノカサ・天', deco: '匠珠【２】' },
              body: { equip: 'slot3', deco: '匠珠【２】,研磨珠【１】' },
              arm: { equip: 'slot0', deco: null },
              waist: { equip: 'バンギスコイル', deco: null },
              leg: { equip: 'ユクモノハカマ・天', deco: '研磨珠【１】,研磨珠【１】' } },
            { head: { equip: 'ユクモノカサ・天', deco: '匠珠【２】' },
              body: { equip: 'slot3', deco: '匠珠【２】,研磨珠【１】' },
              arm: { equip: 'slot0', deco: null },
              waist: { equip: 'バンギスコイル', deco: null },
              leg: { equip: 'ユクモノハカマ・天', deco: '匠珠【２】' } },
            { head: { equip: 'ユクモノカサ・天', deco: '匠珠【２】' },
              body: { equip: 'slot3', deco: '匠珠【３】' },
              arm: { equip: 'slot0', deco: null },
              waist: { equip: 'バンギスコイル', deco: null },
              leg: { equip: 'ユクモノハカマ・天', deco: '研磨珠【１】,研磨珠【１】' } },
            { head: { equip: 'ユクモノカサ・天', deco: '匠珠【２】' },
              body: { equip: 'slot3', deco: '匠珠【３】' },
              arm: { equip: 'slot0', deco: null },
              waist: { equip: 'バンギスコイル', deco: null },
              leg: { equip: 'ユクモノハカマ・天', deco: '匠珠【２】' } } ];
    QUnit.deepEqual(got, exp, 'combSetList');
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
           test(this.QUnit, this._, this.simu.DecoCombinator, this.myapp);
       }
);
