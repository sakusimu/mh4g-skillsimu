'use strict';
var assert = require('power-assert'),
    Normalizer = require('../../../lib/deco/normalizer.js'),
    Deco = require('../../../lib/util/deco.js'),
    myapp = require('../../../test/lib/driver-myapp.js');

describe('40_deco/10_normalizer', function () {
    var got, exp;

    beforeEach(function () {
        myapp.initialize();
    });

    it('Normalizer', function () {
        assert(typeof Normalizer === 'function', 'is function');
    });

    it('new', function () {
        got = new Normalizer();
        assert(typeof got === 'object', 'is object');
        assert(typeof got.initialize === 'function', 'has initialize()');
    });

    describe('_normalizeEquip', function () {
        var n = new Normalizer();

        it('_normalizeEquip', function () {
            var equipSet = {
                head : myapp.equip('head', 'ユクモノカサ・天'), // 匠+2, 研ぎ師+3
                body : myapp.equip('body', '三眼の首飾り'),
                arm  : myapp.equip('arm', 'ユクモノコテ・天'),  // 匠+1, 研ぎ師+3
                waist: myapp.equip('waist', 'バンギスコイル'),
                leg  : myapp.equip('leg', 'ユクモノハカマ・天') // 匠+1, 研ぎ師+1
            };
            got = n._normalizeEquip(equipSet);
            exp = {
                body: {
                    name: '三眼の首飾り', slot: 3, skillComb: {} },
                head: {
                    name: 'ユクモノカサ・天',
                    slot: 2, skillComb: { '匠': 2, '研ぎ師': 3, '回復量': 1, '加護': 1 } },
                arm: {
                    name: 'ユクモノコテ・天',
                    slot: 2, skillComb: { '匠': 1, '研ぎ師': 3, '回復量': 2, '加護': 3 } },
                waist: {
                    name: 'バンギスコイル', slot: 0, skillComb: { '胴系統倍化': 1 } },
                leg: {
                    name: 'ユクモノハカマ・天',
                    slot: 2, skillComb: { '匠': 1, '研ぎ師': 1, '回復量': 2, '加護': 2 } },
                weapon: null,
                oma   : null
            };
            assert.deepEqual(got, exp);
        });

        it('slotN, torsoUp, weapon, oma', function () {
            var omas = [ myapp.oma([ '龍の護石',3,'匠',4,'氷耐性',-5 ]) ];
            var equipSet = {
                head  : myapp.equip('head', 'ユクモノカサ・天'),
                body  : { name: 'slot3' },
                arm   : { name: 'slot0' },
                waist : { name: '胴系統倍化' },
                leg   : myapp.equip('leg', 'ユクモノハカマ・天'),
                weapon: { name: 'slot2' },
                oma   : omas[0]
            };
            got = n._normalizeEquip(equipSet);
            exp = {
                body: {
                    name: 'slot3', slot: 3, skillComb: {} },
                head: {
                    name: 'ユクモノカサ・天',
                    slot: 2, skillComb: { '匠': 2, '研ぎ師': 3, '回復量': 1, '加護': 1 } },
                arm: {
                    name: 'slot0', slot: 0, skillComb: {} },
                waist: {
                    name: '胴系統倍化', slot: 0, skillComb: { '胴系統倍化': 1 } },
                leg: {
                    name: 'ユクモノハカマ・天',
                    slot: 2, skillComb: { '匠': 1, '研ぎ師': 1, '回復量': 2, '加護': 2 } },
                weapon: {
                    name: 'slot2', slot: 2, skillComb: {} },
                oma: {
                    name: '龍の護石(スロ3,匠+4,氷耐性-5)',
                    slot: 3, skillComb: { '匠': 4, '氷耐性': -5 } }
            };
            assert.deepEqual(got, exp);
        });

        it('empty equipSet', function () {
            var equipSet = {};
            got = n._normalizeEquip(equipSet);
            exp = {
                body  : null,
                head  : null,
                arm   : null,
                waist : null,
                leg   : null,
                weapon: null,
                oma   : null
            };
            assert.deepEqual(got, exp);
        });
    });

    describe('_makeDecombs', function () {
        var n = new Normalizer();

        it('slot0', function () {
            var decoCombsBySlot = Deco.combs([ '研ぎ師' ]);
            got = n._makeDecombs(decoCombsBySlot, 0);
            exp = [];
            assert.deepEqual(got, exp);
        });

        it("slot1: [ '研ぎ師' ]", function () {
            var decoCombsBySlot = Deco.combs([ '研ぎ師' ]);
            got = n._makeDecombs(decoCombsBySlot, 1);
            exp = [
                { names: [], slot: 0, skillComb: {} },
                { names: [ '研磨珠【１】' ], slot: 1, skillComb: { '研ぎ師': 2 } }
            ];
            assert.deepEqual(got, exp);
        });

        it("slot1: [ '匠' ]", function () {
            var decoCombsBySlot = Deco.combs([ '匠' ]);
            got = n._makeDecombs(decoCombsBySlot, 1);
            exp = [ { names: [], slot: 0, skillComb: {} } ];
            assert.deepEqual(got, exp);
        });

        it("slot3: [ '匠', '研ぎ師' ]", function () {
            var decoCombsBySlot = Deco.combs([ '匠', '研ぎ師' ]);
            got = n._makeDecombs(decoCombsBySlot, 3);
            exp = [
                { names: [], slot: 0, skillComb: {} },
                { names: [ '研磨珠【１】' ], slot: 1, skillComb: { '研ぎ師': 2 } },
                { names: [ '研磨珠【１】', '研磨珠【１】' ],
                  slot: 2, skillComb: { '研ぎ師': 4 } },
                { names: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '斬れ味': -1 } },
                { names: [ '研磨珠【１】', '研磨珠【１】', '研磨珠【１】' ],
                  slot: 3, skillComb: { '研ぎ師': 6 } },
                { names: [ '匠珠【２】', '研磨珠【１】' ],
                  slot: 3, skillComb: { '匠': 1, '斬れ味': -1, '研ぎ師': 2 } },
                { names: [ '匠珠【３】' ], slot: 3, skillComb: { '匠': 2, '斬れ味': -2 } }
            ];
            assert.deepEqual(got, exp);
        });

        it("slot3: [ '匠' ]", function () {
            var decoCombsBySlot = Deco.combs([ '匠' ]);
            got = n._makeDecombs(decoCombsBySlot, 3);
            exp = [
                { names: [], slot: 0, skillComb: {} },
                { names: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '斬れ味': -1 } },
                { names: [ '匠珠【２】' ], slot: 3, skillComb: { '匠': 1, '斬れ味': -1 } },
                { names: [ '匠珠【３】' ], slot: 3, skillComb: { '匠': 2, '斬れ味': -2 } }
            ];
            assert.deepEqual(got, exp);
        });
    });

    describe('normalize', function () {
        var n = new Normalizer();

        it('normalize', function () {
            var equipSet = {
                head : myapp.equip('head', 'ユクモノカサ・天'), // 匠+2, 研ぎ師+3
                body : myapp.equip('body', '三眼の首飾り'),
                arm  : myapp.equip('arm', 'ユクモノコテ・天'),  // 匠+1, 研ぎ師+3
                waist: myapp.equip('waist', 'バンギスコイル'),
                leg  : myapp.equip('leg', 'ユクモノハカマ・天') // 匠+1, 研ぎ師+1
            };
            var normalized = n.normalize([ '斬れ味レベル+1', '砥石使用高速化' ], equipSet);
            got = normalized.decombsSet;
            exp = {
                head: [
                    { names: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } },
                    { names: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } },
                    { names: [ '研磨珠【１】', '研磨珠【１】' ],
                      slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } },
                    { names: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } } ],
                body: [
                    { names: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } },
                    { names: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } },
                    { names: [ '研磨珠【１】', '研磨珠【１】' ],
                      slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } },
                    { names: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } },
                    { names: [ '研磨珠【１】', '研磨珠【１】', '研磨珠【１】' ],
                      slot: 3, skillComb: { '匠': 0, '研ぎ師': 6 } },
                    { names: [ '匠珠【２】', '研磨珠【１】' ],
                      slot: 3, skillComb: { '匠': 1, '研ぎ師': 2 } },
                    { names: [ '匠珠【３】' ], slot: 3, skillComb: { '匠': 2, '研ぎ師': 0 } } ],
                arm: [
                    { names: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } },
                    { names: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } },
                    { names: [ '研磨珠【１】', '研磨珠【１】' ],
                      slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } },
                    { names: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } } ],
                waist: [
                    { names: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0, '胴系統倍化': 1 } } ],
                leg: [
                    { names: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } },
                    { names: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } },
                    { names: [ '研磨珠【１】', '研磨珠【１】' ],
                      slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } },
                    { names: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } } ],
                weapon: [],
                oma: []
            };
            assert.deepEqual(got, exp);
        });

        it('slotN, torsoUp, weapon, oma', function () {
            var omas = [ myapp.oma([ '龍の護石',3,'匠',4,'氷耐性',-5 ]) ];
            var equipSet = {
                head  : myapp.equip('head', 'ユクモノカサ・天'),
                body  : { name: 'slot3' },
                arm   : { name: 'slot0' },
                waist : { name: '胴系統倍化' },
                leg   : myapp.equip('leg', 'ユクモノハカマ・天'),
                weapon: { name: 'slot2' },
                oma   : omas[0]
            };
            var normalized = n.normalize([ '斬れ味レベル+1', '砥石使用高速化' ], equipSet);
            got = normalized.decombsSet;
            exp = {
                head: [
                    { names: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } },
                    { names: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } },
                    { names: [ '研磨珠【１】', '研磨珠【１】' ],
                      slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } },
                    { names: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } } ],
                body: [
                    { names: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } },
                    { names: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } },
                    { names: [ '研磨珠【１】', '研磨珠【１】' ],
                      slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } },
                    { names: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } },
                    { names: [ '研磨珠【１】', '研磨珠【１】', '研磨珠【１】' ],
                      slot: 3, skillComb: { '匠': 0, '研ぎ師': 6 } },
                    { names: [ '匠珠【２】', '研磨珠【１】' ],
                      slot: 3, skillComb: { '匠': 1, '研ぎ師': 2 } },
                    { names: [ '匠珠【３】' ], slot: 3, skillComb: { '匠': 2, '研ぎ師': 0 } } ],
                arm: [],
                waist: [
                    { names: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0, '胴系統倍化': 1 } } ],
                leg: [
                    { names: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } },
                    { names: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } },
                    { names: [ '研磨珠【１】', '研磨珠【１】' ],
                      slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } },
                    { names: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } } ],
                weapon: [
                    { names: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } },
                    { names: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } },
                    { names: [ '研磨珠【１】', '研磨珠【１】' ],
                      slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } },
                    { names: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } } ],
                oma: [
                    { names: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } },
                    { names: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } },
                    { names: [ '研磨珠【１】', '研磨珠【１】' ],
                      slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } },
                    { names: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } },
                    { names: [ '研磨珠【１】', '研磨珠【１】', '研磨珠【１】' ],
                      slot: 3, skillComb: { '匠': 0, '研ぎ師': 6 } },
                    { names: [ '匠珠【２】', '研磨珠【１】' ],
                      slot: 3, skillComb: { '匠': 1, '研ぎ師': 2 } },
                    { names: [ '匠珠【３】' ], slot: 3, skillComb: { '匠': 2, '研ぎ師': 0 } } ]
            };
            assert.deepEqual(got, exp);
        });

        it('null or etc', function () {
            got = n.normalize();
            assert.deepEqual(got, null, 'nothing in');
            got = n.normalize(undefined);
            assert.deepEqual(got, null, 'undefined');
            got = n.normalize(null);
            assert.deepEqual(got, null, 'null');
            got = n.normalize([]);
            assert.deepEqual(got, null, '[]');

            got = n.normalize([ '攻撃力UP【大】' ]);
            assert.deepEqual(got, null, 'skillNames only');
            got = n.normalize([ '攻撃力UP【大】' ], undefined);
            assert.deepEqual(got, null, 'skillNames, undefined');
            got = n.normalize([ '攻撃力UP【大】' ], null);
            assert.deepEqual(got, null, 'skillNames, null');
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
            assert.deepEqual(got, exp, 'skillNames, {}');
        });
    });
});
