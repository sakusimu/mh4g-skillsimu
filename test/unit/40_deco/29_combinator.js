'use strict';
var assert = require('power-assert'),
    _ = require('underscore'),
    Combinator = require('../../../lib/deco/combinator.js'),
    Normalizer = require('../../../lib/deco/normalizer.js'),
    myapp = require('../../../test/lib/driver-myapp.js');

describe('40_deco/29_combinator', function () {
    var got, exp;

    beforeEach(function () {
        myapp.initialize();
    });

    // 頑シミュさんの装飾品検索の結果と比較しやすくする
    var simplify = function (decombSets) {
        return _.map(decombSets, function (decombSet) {
            var torsoUp = _.some(decombSet, function (decomb) {
                if (decomb == null) return false;
                return decomb.skillComb['胴系統倍化'] ? true : false;
            });
            var names = _.map(decombSet, function (decomb, part) {
                var names = decomb ? decomb.decos : [];
                if (torsoUp && part === 'body')
                    names = _.map(names, function (n) { return n += '(胴)'; });
                return names;
            });
            names = _.flatten(names);
            return names.sort().join(',');
        });
    };

    describe('combine', function () {
        var n = new Normalizer(),
            c = new Combinator();

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

            var decombSets = c.combine(skills, bulksSet, equip);
            got = simplify(decombSets);
            exp = [
                '匠珠【３】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【３】(胴)',
                '匠珠【２】,匠珠【２】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【３】,防音珠【３】(胴)',
                '匠珠【２】,匠珠【２】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【３】(胴)'
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

            var decombSets = c.combine(skills, bulksSet, equip);
            got = simplify(decombSets);
            exp = [
                '匠珠【３】,匠珠【３】,匠珠【３】,研磨珠【１】,研磨珠【１】,研磨珠【１】,研磨珠【１】,研磨珠【１】',
                '匠珠【２】,匠珠【２】,匠珠【３】,匠珠【３】,研磨珠【１】,研磨珠【１】,研磨珠【１】,研磨珠【１】,研磨珠【１】'
            ];
            assert.deepEqual(got, exp);
        });

        it('slot3 appear later', function () {
            // 後半にスロ3が出てくるパターン(前半のスロ1は使わないスロとして処理できるか)
            var skills = [ '斬れ味レベル+1', '高級耳栓' ];
            var equip = {
                head : { name: 'ミヅハ【烏帽子】', slot: 1,
                         skillComb: { '匠': 1, '聴覚保護': 5, '風圧': 4, '耐暑': -2 } },
                body : { name: 'エクスゼロメイル', slot: 1,
                         skillComb: { '聴覚保護': 3, '研ぎ師': -2, '食事': 3 } },
                arm  : { name: 'EXレックスアーム', slot: 2,
                         skillComb: { '匠': 2, '聴覚保護': 2, '研ぎ師': -2, '食いしん坊': 2 } },
                waist: { name: 'クシャナアンダ', slot: 3,
                         skillComb: { '匠': 2, '溜め短縮': 2, '毒': -2 } },
                leg  : { name: 'ゾディアスグリーヴ', slot: 3,
                         skillComb: { '剣術': 1, '匠': 2, '乗り': -3 } },
                weapon: null,
                oma: null
            };
            var bulksSet = n.normalize(skills, equip);

            var decombSets = c.combine(skills, bulksSet, equip);
            got = simplify(decombSets);
            exp = [
                '匠珠【２】,匠珠【３】,防音珠【１】,防音珠【３】',
                '匠珠【２】,匠珠【３】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】'
            ];
            assert.deepEqual(got, exp);
        });

        it('already activate', function () {
            // 既にスキルが発動
            var skills = [ '斬れ味レベル+1' ];
            var equip = {
                head  : { name: 'ユクモノカサ・天', slot: 2,
                          skillComb: { '匠': 2, '研ぎ師': 3, '回復量': 1, '加護': 1 } },
                body  : { name: 'ユクモノドウギ・天', slot: 2,
                          skillComb: { '匠': 1, '研ぎ師': 1, '回復量': 2, '加護': 2 } },
                arm   : { name: 'ユクモノコテ・天', slot: 2,
                          skillComb: { '匠': 1, '研ぎ師': 3, '回復量': 2, '加護': 3 } },
                waist : { name: 'ユクモノオビ・天', slot: 2,
                          skillComb: { '匠': 1, '研ぎ師': 2, '回復量': 3, '加護': 2 } },
                leg   : { name: 'ユクモノハカマ・天', slot: 2,
                          skillComb: { '匠': 1, '研ぎ師': 1, '回復量': 2, '加護': 2 } },
                weapon: null,
                oma   : { name: '龍の護石(スロ3,匠+4,氷耐性-5)', slot: 3,
                          skillComb: { '匠': 4, '氷耐性': -5 } }
            };
            var bulksSet = n.normalize(skills, equip);

            var decombSets = c.combine(skills, bulksSet, equip);
            got = decombSets;
            exp = [
                { body: null, head: null, arm: null, waist: null, leg: null,
                  weapon: null, oma: null }
            ];
            assert.deepEqual(got, exp);
        });

        it('null or etc', function () {
            got = c.combine();
            assert.deepEqual(got, [], 'nothing in');
            got = c.combine(undefined);
            assert.deepEqual(got, [], 'undefined');
            got = c.combine(null);
            assert.deepEqual(got, [], 'null');
            got = c.combine([]);
            assert.deepEqual(got, [], '[]');

            got = c.combine([ '攻撃力UP【大】' ]);
            assert.deepEqual(got, [], 'skillNames only');
            got = c.combine([ '攻撃力UP【大】' ], undefined);
            assert.deepEqual(got, [], 'skillNames, undefined');
            got = c.combine([ '攻撃力UP【大】' ], null);
            assert.deepEqual(got, [], 'skillNames, null');
            got = c.combine([ '攻撃力UP【大】' ], {});
            assert.deepEqual(got, [], 'skillNames, {}');
        });
    });
});
