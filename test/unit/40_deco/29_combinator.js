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
                var names = decomb ? decomb.names : [];
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
            var equipSet = {
                head  : myapp.equip('head', 'ミヅハ【烏帽子】'),  // スロ1
                body  : myapp.equip('body', 'エクスゼロメイル'),  // スロ1
                arm   : myapp.equip('arm', 'EXレックスアーム'),   // スロ2
                waist : myapp.equip('waist', 'クシャナアンダ'),   // スロ3
                leg   : myapp.equip('leg', 'ゾディアスグリーヴ'), // スロ3
                weapon: null,
                oma   : null
            };
            var normalized = n.normalize(skills, equipSet);
            var decombSets = c.combine(skills, normalized);
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
            var equipSet = {
                head  : myapp.equip('head', 'ユクモノカサ・天'),
                body  : myapp.equip('body', 'ユクモノドウギ・天'),
                arm   : myapp.equip('arm', 'ユクモノコテ・天'),
                waist : myapp.equip('waist', 'ユクモノオビ・天'),
                leg   : myapp.equip('leg', 'ユクモノハカマ・天'),
                weapon: null,
                oma   : omas[0]
            };
            var normalized = n.normalize(skills, equipSet);
            var decombSets = c.combine(skills, normalized);
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
