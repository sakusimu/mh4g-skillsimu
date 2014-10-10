'use strict';
var assert = require('power-assert'),
    _ = require('underscore'),
    Simulator = require('../../../lib/deco.js'),
    myapp = require('../../../test/lib/driver-myapp.js');

describe('40_deco/simulator', function () {
    var got, exp;

    beforeEach(function () {
        myapp.initialize();
    });

    it('require', function () {
        assert(typeof Simulator === 'function', 'is function');
    });

    it('new', function () {
        var simu = new Simulator();
        assert(typeof simu === 'object', 'is object');
        assert(typeof simu.initialize === 'function', 'has initialize()');
    });

    describe('simulate', function () {
        var simu = new Simulator();

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

            var assems = simu.simulate([ '斬れ味レベル+1', '高級耳栓' ], equip);
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
                    rest   : [
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

            var assems = simu.simulate([ '斬れ味レベル+1', '砥石使用高速化' ], equip);
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

        it('1 hit', function () {
            // 1つだけ見つかるケース
            myapp.setup({ context: { hr: 1, vs: 6 } }); // 装備を村のみにしぼる
            var skills = [ '斬れ味レベル+1', '攻撃力UP【大】', '耳栓' ];
            var equip = {
                head  : { name: 'ガララキャップ', slot: 2,
                          skillComb: { '捕獲': 1, '聴覚保護': 4, '気まぐれ': -3, '麻痺': 1 } },
                body  : { name: 'レックスメイル', slot: 2,
                          skillComb: { '攻撃': 2, '研ぎ師': -2, '食いしん坊': 1 } },
                arm   : { name: 'ガルルガアーム', slot: 3,
                          skillComb: { '剣術': -1, '達人': 2, '聴覚保護': 2 } },
                waist : { name: 'ゴアフォールド', slot: 1,
                          skillComb: { '細菌学': 2, '匠': 3, '闘魂': 2, '火耐性': -3 } },
                leg   : { name: 'アークグリーヴ', slot: 2,
                          skillComb: { '匠': 3, '本気': 3, '火耐性': -3, '狂撃耐性': 1 } },
                weapon: { name: 'slot3', slot: 3, skillComb: {} },
                oma   : { name: '龍の護石(スロ3,匠+4,氷耐性-5)', slot: 3,
                          skillComb: { '匠': 4, '氷耐性': -5 } }
            };

            var assems = simu.simulate(skills, equip);
            got = sorter(assems);
            exp = [
                {
                    all: [
                        '防音珠【１】','防音珠【１】','防音珠【１】','防音珠【１】',
                        '攻撃珠【２】','攻撃珠【２】','攻撃珠【２】','攻撃珠【２】',
                        '攻撃珠【２】','攻撃珠【２】'],
                    torsoUp: [],
                    rest: [
                        '防音珠【１】','防音珠【１】','防音珠【１】','防音珠【１】',
                        '攻撃珠【２】','攻撃珠【２】','攻撃珠【２】','攻撃珠【２】',
                        '攻撃珠【２】','攻撃珠【２】']
                }
            ];
            assert.deepEqual(got, exp);
        });
    });
});
