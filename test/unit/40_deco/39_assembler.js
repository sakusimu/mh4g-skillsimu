'use strict';
var assert = require('power-assert'),
    _ = require('underscore'),
    Assembler = require('../../../lib/deco/assembler.js'),
    Normalizer = require('../../../lib/deco/normalizer.js'),
    Combinator = require('../../../lib/deco/combinator.js'),
    myapp = require('../../../test/lib/driver-myapp.js');

describe('40_deco/39_assembler', function () {
    var got, exp;

    beforeEach(function () {
        myapp.initialize();
    });

    describe('assemble', function () {
        var n = new Normalizer(),
            c = new Combinator(),
            a = new Assembler();

        var sorter = function (assems) {
            return _.map(assems, function (assem) {
                var sorted = {};
                _.each(assem, function (decoNames, key) {
                    sorted[key] = decoNames.sort().reverse();
                });
                return sorted;
            });
        };

        it('torsoUp, weaponSlot, oma', function () {
            var skills = [ '斬れ味レベル+1', '高級耳栓' ];
            var equip = {
                head  : { name: 'ユクモノカサ・天', slot: 2,
                          skillComb: { '匠': 2, '研ぎ師': 3, '回復量': 1, '加護': 1 } },
                body  : { name: '三眼の首飾り', slot: 3, skillComb: {} },
                arm   : { name: 'ユクモノコテ・天', slot: 2,
                          skillComb: { '匠': 1, '研ぎ師': 3, '回復量': 2, '加護': 3 } },
                waist : { name: 'バンギスコイル', slot: 0, skillComb: { '胴系統倍化': 1 } },
                leg   : { name: 'ユクモノハカマ・天', slot: 2,
                          skillComb: { '匠': 1, '研ぎ師': 1, '回復量': 2, '加護': 2 } },
                weapon: { name: 'slot2', slot: 2, skillComb: {} },
                oma   : { name: '龍の護石(スロ3,匠+4,氷耐性-5)', slot: 3,
                          skillComb: { '匠': 4, '氷耐性': -5 } }
            };
            var bulksSet = n.normalize(skills, equip);
            var decombs = c.combine(skills, bulksSet, equip);

            var assems = a.assemble(decombs);
            got = sorter(assems);
            exp = [
                {
                    all: [
                        '防音珠【３】','防音珠【１】','防音珠【１】','防音珠【１】',
                        '防音珠【１】','防音珠【１】','防音珠【１】','防音珠【１】',
                        '匠珠【３】'],
                    torsoUp: ['防音珠【３】'],
                    rest: [
                        '防音珠【１】','防音珠【１】','防音珠【１】','防音珠【１】',
                        '防音珠【１】','防音珠【１】','防音珠【１】','匠珠【３】']
                },
                {
                    all: [
                        '防音珠【３】','防音珠【３】','防音珠【１】','防音珠【１】',
                        '防音珠【１】','匠珠【２】','匠珠【２】'],
                    torsoUp: ['防音珠【３】'],
                    rest: [
                        '防音珠【３】','防音珠【１】','防音珠【１】','防音珠【１】',
                        '匠珠【２】','匠珠【２】']
                },
                {
                    all: [
                        '防音珠【３】','防音珠【１】','防音珠【１】','防音珠【１】',
                        '防音珠【１】','防音珠【１】','防音珠【１】','防音珠【１】',
                        '匠珠【２】','匠珠【２】'],
                    torsoUp: ['防音珠【３】'],
                    rest: [
                        '防音珠【１】','防音珠【１】','防音珠【１】','防音珠【１】',
                        '防音珠【１】','防音珠【１】','防音珠【１】',
                        '匠珠【２】','匠珠【２】']
                }
            ];
            assert.deepEqual(got, exp);
        });

        it('all slot3', function () {
            // ALL三眼, 武器スロ3, お守り(匠4,スロ3)
            var skills = [ '斬れ味レベル+1', '砥石使用高速化' ];
            var equip = {
                head  : { name: '三眼のピアス', slot: 3, skillComb: {} },
                body  : { name: '三眼の首飾り', slot: 3, skillComb: {} },
                arm   : { name: '三眼の腕輪', slot: 3, skillComb: {} },
                waist : { name: '三眼の腰飾り', slot: 3, skillComb: {} },
                leg   : { name: '三眼の足輪', slot: 3, skillComb: {} },
                weapon: { name: 'slot3', slot: 3, skillComb: {} },
                oma   : { name: '龍の護石(スロ3,匠+4,氷耐性-5)', slot: 3,
                          skillComb: { '匠': 4, '氷耐性': -5 } }
            };
            var bulksSet = n.normalize(skills, equip);
            var decombs = c.combine(skills, bulksSet, equip);

            var assems = a.assemble(decombs);
            got = sorter(assems);
            exp = [
                {
                    all: [
                        '研磨珠【１】','研磨珠【１】','研磨珠【１】','研磨珠【１】',
                        '研磨珠【１】','匠珠【３】','匠珠【３】','匠珠【３】'],
                    torsoUp: [],
                    rest: [
                        '研磨珠【１】','研磨珠【１】','研磨珠【１】','研磨珠【１】',
                        '研磨珠【１】','匠珠【３】','匠珠【３】','匠珠【３】']
                },
                {
                    all: [
                        '研磨珠【１】','研磨珠【１】','研磨珠【１】','研磨珠【１】',
                        '研磨珠【１】','匠珠【３】','匠珠【３】','匠珠【２】','匠珠【２】'],
                    torsoUp: [],
                    rest: [
                        '研磨珠【１】','研磨珠【１】','研磨珠【１】','研磨珠【１】',
                        '研磨珠【１】','匠珠【３】','匠珠【３】','匠珠【２】','匠珠【２】']
                }
            ];
            assert.deepEqual(got, exp);
        });

        it('null or etc', function () {
            got = a.assemble();
            assert.deepEqual(got, [], 'nothing in');
            got = a.assemble(undefined);
            assert.deepEqual(got, [], 'undefined');
            got = a.assemble(null);
            assert.deepEqual(got, [], 'null');
            got = a.assemble([]);
            assert.deepEqual(got, [], '[]');
        });
    });
});
