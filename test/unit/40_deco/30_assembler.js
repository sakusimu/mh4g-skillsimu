'use strict';
var assert = require('power-assert'),
    _ = require('underscore'),
    Assembler = require('../../../lib/deco/assembler.js'),
    Normalizer = require('../../../lib/deco/normalizer.js'),
    Combinator = require('../../../lib/deco/combinator.js'),
    myapp = require('../../../test/lib/driver-myapp.js');

describe('40_deco/30_assembler', function () {
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

        var omas = [ myapp.oma([ '龍の護石',3,'匠',4,'氷耐性',-5 ]) ];

        it('torsoUp, weaponSlot, oma', function () {
            // 装備に胴系統倍化、武器スロ、お守りがある場合
            var skills = [ '斬れ味レベル+1', '高級耳栓' ];
            var equipSet = {
                head  : myapp.equip('head', 'ユクモノカサ・天'),  // スロ2
                body  : myapp.equip('body', '三眼の首飾り'),      // スロ3
                arm   : myapp.equip('arm', 'ユクモノコテ・天'),   // スロ2
                waist : myapp.equip('waist', 'バンギスコイル'),   // 胴系統倍化
                leg   : myapp.equip('leg', 'ユクモノハカマ・天'), // スロ2
                weapon: { name: 'slot2' },
                oma   : omas[0]
            };
            var normalized = n.normalize(skills, equipSet);
            var decombSets = c.combine(skills, normalized);
            var assems     = a.assemble(decombSets);
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
            var equipSet = {
                head  : myapp.equip('head', '三眼のピアス'),
                body  : myapp.equip('body', '三眼の首飾り'),
                arm   : myapp.equip('arm', '三眼の腕輪'),
                waist : myapp.equip('waist', '三眼の腰飾り'),
                leg   : myapp.equip('leg', '三眼の足輪'),
                weapon: { name: 'slot3' },
                oma   : omas[0]
            };
            var normalized = n.normalize(skills, equipSet);
            var decombSets = c.combine(skills, normalized);
            var assems     = a.assemble(decombSets);
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
    });
});
