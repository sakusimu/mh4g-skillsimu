'use strict';
var assert = require('power-assert'),
    Normalizer = require('../../../lib/deco/normalizer.js'),
    myapp = require('../../../test/lib/driver-myapp.js');

describe('40_deco/19_normalizer', function () {
    var got, exp;

    beforeEach(function () {
        myapp.initialize();
    });

    describe('normalize', function () {
        var n = new Normalizer();

        it('normalize', function () {
            var equip = {
                head : { name: 'ユクモノカサ・天', slot: 2,
                         skillComb: { '匠': 2, '研ぎ師': 3, '回復量': 1, '加護': 1 } },
                body : { name: '三眼の首飾り', slot: 3, skillComb: {} },
                arm  : { name: 'ユクモノコテ・天', slot: 2,
                         skillComb: { '匠': 1, '研ぎ師': 3, '回復量': 2, '加護': 3 } },
                waist: { name: 'バンギスコイル', slot: 0, skillComb: { '胴系統倍化': 1 } },
                leg  : { name: 'ユクモノハカマ・天', slot: 2,
                         skillComb: { '匠': 1, '研ぎ師': 1, '回復量': 2, '加護': 2 } }
            };
            got = n.normalize([ '斬れ味レベル+1', '砥石使用高速化' ], equip);
            exp = {
                head: [
                    { decos: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } },
                    { decos: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } },
                    { decos: [ '研磨珠【１】', '研磨珠【１】' ],
                      slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } },
                    { decos: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } } ],
                body: [
                    { decos: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } },
                    { decos: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } },
                    { decos: [ '研磨珠【１】', '研磨珠【１】' ],
                      slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } },
                    { decos: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } },
                    { decos: [ '研磨珠【１】', '研磨珠【１】', '研磨珠【１】' ],
                      slot: 3, skillComb: { '匠': 0, '研ぎ師': 6 } },
                    { decos: [ '匠珠【２】', '研磨珠【１】' ],
                      slot: 3, skillComb: { '匠': 1, '研ぎ師': 2 } },
                    { decos: [ '匠珠【３】' ], slot: 3, skillComb: { '匠': 2, '研ぎ師': 0 } } ],
                arm: [
                    { decos: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } },
                    { decos: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } },
                    { decos: [ '研磨珠【１】', '研磨珠【１】' ],
                      slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } },
                    { decos: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } } ],
                waist: [
                    { decos: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0, '胴系統倍化': 1 } } ],
                leg: [
                    { decos: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } },
                    { decos: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } },
                    { decos: [ '研磨珠【１】', '研磨珠【１】' ],
                      slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } },
                    { decos: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } } ],
                weapon: [],
                oma: []
            };
            assert.deepEqual(got, exp);
        });

        it('slotN, torsoUp, weapon, oma', function () {
            var equip = {
                head  : { name: 'ユクモノカサ・天', slot: 2,
                          skillComb: { '匠': 2, '研ぎ師': 3, '回復量': 1, '加護': 1 } },
                body  : { name: 'slot3', slot: 3, skillComb: {} },
                arm   : { name: 'slot0', slot: 0, skillComb: {} },
                waist : { name: '胴系統倍化', slot: 0, skillComb: { '胴系統倍化': 1 } },
                leg   : { name: 'ユクモノハカマ・天', slot: 2,
                          skillComb: { '匠': 1, '研ぎ師': 1, '回復量': 2, '加護': 2 } },
                weapon: { name: 'slot2', slot: 2, skillComb: {} },
                oma   : { name: '龍の護石(スロ3,匠+4,氷耐性-5)', slot: 3,
                          skillComb: { '匠': 4, '氷耐性': -5 } }
            };
            got = n.normalize([ '斬れ味レベル+1', '砥石使用高速化' ], equip);
            exp = {
                head: [
                    { decos: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } },
                    { decos: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } },
                    { decos: [ '研磨珠【１】', '研磨珠【１】' ],
                      slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } },
                    { decos: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } } ],
                body: [
                    { decos: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } },
                    { decos: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } },
                    { decos: [ '研磨珠【１】', '研磨珠【１】' ],
                      slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } },
                    { decos: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } },
                    { decos: [ '研磨珠【１】', '研磨珠【１】', '研磨珠【１】' ],
                      slot: 3, skillComb: { '匠': 0, '研ぎ師': 6 } },
                    { decos: [ '匠珠【２】', '研磨珠【１】' ],
                      slot: 3, skillComb: { '匠': 1, '研ぎ師': 2 } },
                    { decos: [ '匠珠【３】' ], slot: 3, skillComb: { '匠': 2, '研ぎ師': 0 } } ],
                arm: [
                    { decos: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } } ],
                waist: [
                    { decos: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0, '胴系統倍化': 1 } } ],
                leg: [
                    { decos: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } },
                    { decos: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } },
                    { decos: [ '研磨珠【１】', '研磨珠【１】' ],
                      slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } },
                    { decos: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } } ],
                weapon: [
                    { decos: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } },
                    { decos: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } },
                    { decos: [ '研磨珠【１】', '研磨珠【１】' ],
                      slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } },
                    { decos: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } } ],
                oma: [
                    { decos: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } },
                    { decos: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } },
                    { decos: [ '研磨珠【１】', '研磨珠【１】' ],
                      slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } },
                    { decos: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } },
                    { decos: [ '研磨珠【１】', '研磨珠【１】', '研磨珠【１】' ],
                      slot: 3, skillComb: { '匠': 0, '研ぎ師': 6 } },
                    { decos: [ '匠珠【２】', '研磨珠【１】' ],
                      slot: 3, skillComb: { '匠': 1, '研ぎ師': 2 } },
                    { decos: [ '匠珠【３】' ], slot: 3, skillComb: { '匠': 2, '研ぎ師': 0 } } ]
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
                head: [], body: [], arm: [], waist: [],leg: [], weapon: [], oma: []
            };
            assert.deepEqual(got, exp, 'skillNames, {}');
        });
    });
});
