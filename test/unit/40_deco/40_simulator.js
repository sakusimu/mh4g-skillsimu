'use strict';
var assert = require('power-assert'),
    _ = require('underscore'),
    Simulator = require('../../../lib/deco/simulator.js'),
    myapp = require('../../../test/lib/driver-myapp.js');

describe('40_deco/40_simulator', function () {
    var got, exp;

    beforeEach(function () {
        myapp.initialize();
    });

    it('Simulator', function () {
        assert(typeof Simulator === 'function', 'is function');
    });

    it('new', function () {
        got = new Simulator();
        assert(typeof got === 'object', 'is object');
        assert(typeof got.initialize === 'function', 'has initialize()');
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

        var omas = [ myapp.oma([ '龍の護石',3,'匠',4,'氷耐性',-5 ]) ];

        it('torsoUp, weaponSlot, oma', function () {
            // 装備に胴系統倍化、武器スロ、お守りがある場合
            var equipSet = {
                head  : myapp.equip('head', 'ユクモノカサ・天'),  // スロ2
                body  : myapp.equip('body', '三眼の首飾り'),      // スロ3
                arm   : myapp.equip('arm', 'ユクモノコテ・天'),   // スロ2
                waist : myapp.equip('waist', 'バンギスコイル'),   // 胴系統倍化
                leg   : myapp.equip('leg', 'ユクモノハカマ・天'), // スロ2
                weapon: { name: 'slot2' },
                oma   : omas[0]
            };
            var assems = simu.simulate([ '斬れ味レベル+1', '高級耳栓' ], equipSet);
            var got = sorter(assems);
            var exp = [
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
            var equipSet = {
                head  : myapp.equip('head', '三眼のピアス'),
                body  : myapp.equip('body', '三眼の首飾り'),
                arm   : myapp.equip('arm', '三眼の腕輪'),
                waist : myapp.equip('waist', '三眼の腰飾り'),
                leg   : myapp.equip('leg', '三眼の足輪'),
                weapon: { name: 'slot3' },
                oma   : omas[0]
            };
            var assems = simu.simulate([ '斬れ味レベル+1', '砥石使用高速化' ], equipSet);
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
            var equipSet = {
                head  : myapp.equip('head', 'ガララキャップ'),  // スロ2
                body  : myapp.equip('body', 'レックスメイル'),  // スロ2
                arm   : myapp.equip('arm', 'ガルルガアーム'),   // スロ3
                waist : myapp.equip('waist', 'ゴアフォールド'), // スロ1
                leg   : myapp.equip('leg', 'アークグリーヴ'),   // スロ2
                weapon: { name: 'slot3' },
                oma   : omas[0]
            };
            var assems = simu.simulate(skills, equipSet);
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
