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
