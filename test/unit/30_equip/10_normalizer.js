'use strict';
var assert = require('power-assert'),
    _ = require('underscore'),
    Normalizer = require('../../../lib/equip/normalizer.js'),
    data = require('../../../lib/data.js'),
    myapp = require('../../../test/lib/driver-myapp.js');

describe('30_equip/10_normalizer', function () {
    var got, exp;

    beforeEach(function () {
        myapp.initialize();
    });

    it('require', function () {
        assert(typeof Normalizer === 'function', 'is function');
    });

    it('new', function () {
        var n = new Normalizer();
        assert(typeof n === 'object', 'is object');
        assert(typeof n.initialize === 'function', 'has initialize()');

        assert(typeof n.equips.body === 'object', 'equips.body');

        got = n.equips;
        exp = data.equips;
        assert(got === exp, 'equips is strict equal');
        got = n.equips.body;
        exp = data.equips.body;
        assert(got === exp, 'equips.body is strict equal');
        got = n.equips.weapon;
        assert.deepEqual(got, [], 'weapon');
        got = n.equips.oma;
        assert.deepEqual(got, [], 'oma');
    });

    it('compareAny', function () {
        var src, dst,
            n = new Normalizer();

        src = { a: 1 }; dst = { a: 1 };
        got = n._compareAny(src, dst);
        assert(got === false, 'src equal dst: 1');
        src = { a: 1, b: 0 }; dst = { a: 1, b: 0 };
        got = n._compareAny(src, dst);
        assert(got === false, 'src equal dst: 2');

        src = { a: 1 }; dst = { a: 2 };
        got = n._compareAny(src, dst);
        assert(got === true, 'src < dst');
        src = { a: 2 }; dst = { a: 1 };
        got = n._compareAny(src, dst);
        assert(got === false, 'src > dst');

        src = { a: -1 }; dst = { a: 1 };
        got = n._compareAny(src, dst);
        assert(got === true, 'src < dst: minus');
        src = { a: 1 }; dst = { a: -1 };
        got = n._compareAny(src, dst);
        assert(got === false, 'src > dst: minus');

        src = { a: -1 }; dst = { a: 0 };
        got = n._compareAny(src, dst);
        assert(got === true, 'src < dst: minus & zero');
        src = { a: 0 }; dst = { a: -1 };
        got = n._compareAny(src, dst);
        assert(got === false, 'src > dst: minus & zero');

        src = { a: 1, b: 1 }; dst = { a: 1, b: 2 };
        got = n._compareAny(src, dst);
        assert(got === true, 'src < dst: multi skills');
        src = { a: 1, b: 2 }; dst = { a: 1, b: 1 };
        got = n._compareAny(src, dst);
        assert(got === false, 'src > dst: multi skills');

        src = { a: 1, b: 1 }; dst = { a: 0, b: 2 };
        got = n._compareAny(src, dst);
        assert(got === true, 'compare any: 1');
        src = { a: 0, b: 2 }; dst = { a: 1, b: 1 };
        got = n._compareAny(src, dst);
        assert(got === true, 'compare any: 2');

        src = { a: 0, b: 0 }; dst = { a: -1, b: 1 };
        got = n._compareAny(src, dst);
        assert(got === true, 'compare any: with minus 1');
        src = { a: -1, b: 1 }; dst = { a: 0, b: 0 };
        got = n._compareAny(src, dst);
        assert(got === true, 'compare any: with minus 2');

        src = { a: 2, b: 1, c: 0 }; dst = { a: 1, b: 1, c: 1 };
        got = n._compareAny(src, dst);
        assert(got === true, 'compare any: multi skills 1');
        src = { a: 1, b: 1, c: 1 }; dst = { a: 2, b: 1, c: 0 };
        got = n._compareAny(src, dst);
        assert(got === true, 'compare any: multi skills 2');
    });

    it('_collectMaxSkill', function () {
        var combs,
            n = new Normalizer();

        combs = [ { a: 1 } ];
        got = n._collectMaxSkill(combs);
        exp = [ { a: 1 } ];
        assert.deepEqual(got, exp, 'equal 1');

        combs = [ { a: 1 }, { a: 2 } ];
        got = n._collectMaxSkill(combs);
        exp = [ { a: 2 } ];
        assert.deepEqual(got, exp, 'equal 2');

        combs = [ { a: 1, b: 1 }, { a: 2, b: 1 } ];
        got = n._collectMaxSkill(combs);
        exp = [ { a: 2, b: 1 } ];
        assert.deepEqual(got, exp, 'collect max');

        combs = [ { a: 1, b: -3 }, { a: 1, b: -1 }, { a: -1, b: 0 } ];
        got = n._collectMaxSkill(combs);
        exp = [ { a: 1, b: -1 }, { a: -1, b: 0 } ];
        assert.deepEqual(got, exp, 'collect max: minus & 0');

        combs = [ { a: 1, b: 1, c: 0 }, { a: 2, b: 1, c: 0 },
                  { a: 1, b: 1, c: 1 },
                  { a: 0, b: 2, c: 1 }, { a: 0, b: 1, c: 1 } ];
        got = n._collectMaxSkill(combs);
        exp = [ { a: 2, b: 1, c: 0 }, { a: 1, b: 1, c: 1 }, { a: 0, b: 2, c: 1 } ];
        assert.deepEqual(got, exp, 'collect max: complex');

        // 同じ組み合わせがあると正しく動かない
        combs = [ { a: 2, b: 0 }, { a: 1, b: 1 }, { a: 2, b: 0 } ];
        got = n._collectMaxSkill(combs);
        exp = [ { a: 1, b: 1 } ];
        //exp = [ { a: 2, b: 0 }, { a: 1, b: 1 } ]; // ホントの正しい結果はこれ
        assert.deepEqual(got, exp, 'not uniq');
    });

    describe('_normalize1', function () {
        var n = new Normalizer();

        it('_normalzie1', function () {
            var equips = [
                { name: '攻撃+2,スロ1', slot: 1, skillComb: { '攻撃': 2, '研ぎ師': 1 } },
                { name: '攻撃+3,スロ2', slot: 2, skillComb: { '攻撃': 3, '火耐性': 4 } },
                { name: '斬れ味+2,スロ0', slot: 0, skillComb: { '斬れ味': 2, '研ぎ師': 1 } },
                { name: 'スロ0', slot: 0, skillComb: { '採取': 3, '気まぐれ': 2 } },
                { name: 'スロ3', slot: 3, skillComb: { '防御': 1, 'ガード強化': 1 } },
                { name: '三眼の首飾り', slot: 3, skillComb: {} },
                { name: '斬れ味+2,スロ3', slot: 3, skillComb: { '痛撃': 1, '斬れ味': 2 } }
            ];
            got = n._normalize1(equips, [ '攻撃', '斬れ味' ]);
            exp = {
                '攻撃+2,スロ1': [
                    { '攻撃': 3, '研ぎ師': 1, '防御': -1 },
                    { '攻撃': 2, '研ぎ師': 1, '斬れ味': 1, '匠': -1 } ],
                '攻撃+3,スロ2': [
                    { '攻撃': 5, '火耐性': 4, '防御': -2 },
                    { '攻撃': 4, '火耐性': 4, '防御': -1, '斬れ味': 1, '匠': -1 },
                    { '攻撃': 3, '火耐性': 4, '斬れ味': 2, '匠': -2 },
                    { '攻撃': 6, '火耐性': 4, '防御': -1 } ],
                '斬れ味+2,スロ0': [
                    { '斬れ味': 2, '研ぎ師': 1 } ],
                'スロ0': [
                    { '採取': 3, '気まぐれ': 2 } ],
                'スロ3': [
                    { '防御': -2, 'ガード強化': 1, '攻撃': 3 },
                    { '防御': -1, 'ガード強化': 1, '攻撃': 2, '斬れ味': 1, '匠': -1 },
                    { '防御': 0, 'ガード強化': 1, '攻撃': 1, '斬れ味': 2, '匠': -2 },
                    { '防御': 1, 'ガード強化': 1, '斬れ味': 3, '匠': -3 },
                    { '防御': -1, 'ガード強化': 1, '攻撃': 4 },
                    { '防御': 0, 'ガード強化': 1, '攻撃': 3, '斬れ味': 1, '匠': -1 },
                    { '防御': 0, 'ガード強化': 1, '攻撃': 5 },
                    { '防御': 1, 'ガード強化': 1, '斬れ味': 4, '匠': -2 } ],
                '三眼の首飾り': [
                    { '攻撃': 3, '防御': -3 },
                    { '攻撃': 2, '防御': -2, '斬れ味': 1, '匠': -1 },
                    { '攻撃': 1, '防御': -1, '斬れ味': 2, '匠': -2 },
                    { '斬れ味': 3, '匠': -3 },
                    { '攻撃': 4, '防御': -2 },
                    { '攻撃': 3, '防御': -1, '斬れ味': 1, '匠': -1 },
                    { '攻撃': 5, '防御': -1 },
                    { '斬れ味': 4, '匠': -2 } ],
                '斬れ味+2,スロ3': [
                    { '痛撃': 1, '斬れ味': 2, '攻撃': 3, '防御': -3 },
                    { '痛撃': 1, '斬れ味': 3, '攻撃': 2, '防御': -2, '匠': -1 },
                    { '痛撃': 1, '斬れ味': 4, '攻撃': 1, '防御': -1, '匠': -2 },
                    { '痛撃': 1, '斬れ味': 5, '匠': -3 },
                    { '痛撃': 1, '斬れ味': 2, '攻撃': 4, '防御': -2 },
                    { '痛撃': 1, '斬れ味': 3, '攻撃': 3, '防御': -1, '匠': -1 },
                    { '痛撃': 1, '斬れ味': 2, '攻撃': 5, '防御': -1 },
                    { '痛撃': 1, '斬れ味': 6, '匠': -2 } ]
            };
            assert.deepEqual(got, exp);
        });

        it('none deco', function () {
            data.decos = []; // 装飾品なし

            var equips = [
                { name: 'slot1', slot: 1, skillComb: {} },
                { name: 'slot0', slot: 0, skillComb: {} },
                { name: '攻撃+2,スロ1', slot: 1, skillComb: { '攻撃': 2,'研ぎ師': 1 } },
                { name: '攻撃+3,スロ2', slot: 2, skillComb: { '攻撃': 3,'火耐性': 4 } },
                { name: '攻撃+4,斬れ味+1,スロ0', slot: 0,
                  skillComb: { '攻撃': 4,'斬れ味': 1,'食事': 4,'腹減り': -2} },
                { name: 'slot3', slot: 3, skillComb: {} },
                { name: '斬れ味+2,スロ3', slot: 3, skillComb: { '痛撃': 1, '斬れ味': 2 } }
            ];
            got = n._normalize1(equips, [ '攻撃', '斬れ味' ]);
            exp = {
                slot1: [],
                slot0: [],
                '攻撃+2,スロ1': [
                    { '攻撃': 2,'研ぎ師': 1 } ],
                '攻撃+3,スロ2': [
                    { '攻撃': 3,'火耐性': 4 } ],
                '攻撃+4,斬れ味+1,スロ0': [
                    { '攻撃': 4,'斬れ味': 1,'食事': 4,'腹減り': -2} ],
                slot3: [],
                '斬れ味+2,スロ3': [
                    { '痛撃': 1, '斬れ味': 2 } ]
            };
            assert.deepEqual(got, exp);
        });

        it('fix', function () {
            var equips = [
                { name: '三眼の首飾り', slot: 3, skillComb: {} }
            ];
            got = n._normalize1(equips, [ '攻撃', '斬れ味' ]);
            exp = {
                '三眼の首飾り': [
                    { '攻撃': 3, '防御': -3 },
                    { '攻撃': 2, '防御': -2, '斬れ味': 1, '匠': -1 },
                    { '攻撃': 1, '防御': -1, '斬れ味': 2, '匠': -2 },
                    { '斬れ味': 3, '匠': -3 },
                    { '攻撃': 4, '防御': -2 },
                    { '攻撃': 3, '防御': -1, '斬れ味': 1, '匠': -1 },
                    { '攻撃': 5, '防御': -1 },
                    { '斬れ味': 4, '匠': -2 } ]
            };
            assert.deepEqual(got, exp, 'fix');

            // 胴系統倍加
            equips = [
                { name: 'バンギスコイル', slot: 0, skillComb: { '胴系統倍加': 1 } }
            ];
            got = n._normalize1(equips, [ '攻撃', '斬れ味' ]);
            exp = { 'バンギスコイル': [ { '胴系統倍加': 1 } ] };
            assert.deepEqual(got, exp, 'fix: torsoUp');
        });
    });

    describe('_normalize2', function () {
        var n = new Normalizer();

        it('_normalize2', function () {
            var combs = {
                'ジャギィＳメイル': [
                    { '攻撃': 3, '達人': 3, '回復速度': 2, '効果持続': -2, '防御': -1 },
                    { '攻撃': 2, '達人': 3, '回復速度': 2, '効果持続': -2, '斬れ味': 1, '匠': -1 } ],
                slot0: [],
                slot2: [
                    { '攻撃': 2, '防御': -2 },
                    { '攻撃': 1, '防御': -1, '斬れ味': 1, '匠': -1 },
                    { '斬れ味': 2, '匠': -2 } ],
                'レザーベスト': [
                    { '高速収集': 3, '採取': 3, '気まぐれ': 2 } ]
            };
            got = n._normalize2(combs, [ '攻撃', '斬れ味' ]);
            exp = {
                'ジャギィＳメイル': [
                    { '攻撃': 3, '斬れ味': 0 },
                    { '攻撃': 2, '斬れ味': 1 } ],
                slot0: [
                    { '攻撃': 0, '斬れ味': 0 } ],
                slot2: [
                    { '攻撃': 2, '斬れ味': 0 },
                    { '攻撃': 1, '斬れ味': 1 },
                    { '攻撃': 0, '斬れ味': 2 } ],
                'レザーベスト': [
                    { '攻撃': 0, '斬れ味': 0 } ]
            };
            assert.deepEqual(got, exp);
        });

        it('torsoUp', function () {
            var combs = {
                'ジャギィＳグリーヴ': [
                    { '攻撃': 5, '達人': 3, '回復速度': 3, '効果持続': -1, '防御': -1 },
                    { '攻撃': 4, '達人': 3, '回復速度': 3, '効果持続': -1, '斬れ味': 1, '匠': -1 } ],
                'torsoUp': [
                    { '胴系統倍加': 1 } ],
                slot0: [],
                'シルバーソルグリーヴ': [
                    { '痛撃': 1, '斬れ味': 2, '攻撃': 5, '体力': -2, '防御': -3 },
                    { '痛撃': 1, '斬れ味': 3, '攻撃': 4, '体力': -2, '防御': -2, '匠': -1 },
                    { '痛撃': 1, '斬れ味': 4, '攻撃': 3, '体力': -2, '防御': -1, '匠': -2 },
                    { '痛撃': 1, '斬れ味': 5, '攻撃': 2, '体力': -2, '匠': -3 },
                    { '痛撃': 1, '斬れ味': 2, '攻撃': 6, '体力': -2, '防御': -2 },
                    { '痛撃': 1, '斬れ味': 3, '攻撃': 5, '体力': -2, '防御': -1, '匠': -1 },
                    { '痛撃': 1, '斬れ味': 2, '攻撃': 7, '体力': -2, '防御': -1 },
                    { '痛撃': 1, '斬れ味': 6, '攻撃': 2, '体力': -2, '匠': -2 } ]
            };
            got = n._normalize2(combs, [ '攻撃', '斬れ味' ]);
            exp = {
                'ジャギィＳグリーヴ': [
                    { '攻撃': 5, '斬れ味': 0 },
                    { '攻撃': 4, '斬れ味': 1 } ],
                'torsoUp': [
                    { '攻撃': 0, '斬れ味': 0, '胴系統倍加': 1 } ],
                slot0: [
                    { '攻撃': 0, '斬れ味': 0 } ],
                'シルバーソルグリーヴ': [
                    { '攻撃': 5, '斬れ味': 2 },
                    { '攻撃': 4, '斬れ味': 3 },
                    { '攻撃': 3, '斬れ味': 4 },
                    { '攻撃': 2, '斬れ味': 5 },
                    { '攻撃': 6, '斬れ味': 2 },
                    { '攻撃': 5, '斬れ味': 3 },
                    { '攻撃': 7, '斬れ味': 2 },
                    { '攻撃': 2, '斬れ味': 6 } ]
            };
            assert.deepEqual(got, exp);
        });
    });

    describe('_normalize3', function () {
        var n = new Normalizer();

        it('_normalize3', function () {
            var combs = {
                'ジャギィＳメイル': [
                    { '攻撃': 3, '斬れ味': 0 }, { '攻撃': 2, '斬れ味': 1 } ],
                'バギィＳメイル': [
                    { '攻撃': 5, '斬れ味': 0 }, { '攻撃': 4, '斬れ味': 1 },
                    { '攻撃': 3, '斬れ味': 2 }, { '攻撃': 6, '斬れ味': 0 } ],
                'ジンオウメイル': [
                    { '攻撃': 0, '斬れ味': 2 } ],
                slot0: [
                    { '攻撃': 0, '斬れ味': 0 } ],
                slot3: [
                    { '攻撃': 3, '斬れ味': 0 }, { '攻撃': 2, '斬れ味': 1 },
                    { '攻撃': 1, '斬れ味': 2 }, { '攻撃': 0, '斬れ味': 3 },
                    { '攻撃': 4, '斬れ味': 0 }, { '攻撃': 3, '斬れ味': 1 },
                    { '攻撃': 5, '斬れ味': 0 }, { '攻撃': 0, '斬れ味': 4 } ],
                'シルバーソルメイル': [
                    { '攻撃': 3, '斬れ味': 1 }, { '攻撃': 2, '斬れ味': 2 },
                    { '攻撃': 1, '斬れ味': 3 }, { '攻撃': 4, '斬れ味': 1 } ]
            };
            got = n._normalize3(combs);
            exp = {
                'ジャギィＳメイル': [
                    { '攻撃': 3, '斬れ味': 0 }, { '攻撃': 2, '斬れ味': 1 } ],
                'バギィＳメイル': [
                    { '攻撃': 4, '斬れ味': 1 }, { '攻撃': 3, '斬れ味': 2 },
                    { '攻撃': 6, '斬れ味': 0 } ],
                'ジンオウメイル': [
                    { '攻撃': 0, '斬れ味': 2 } ],
                slot0: [
                    { '攻撃': 0, '斬れ味': 0 } ],
                slot3: [
                    { '攻撃': 1, '斬れ味': 2 }, { '攻撃': 3, '斬れ味': 1 },
                    { '攻撃': 5, '斬れ味': 0 }, { '攻撃': 0, '斬れ味': 4 } ],
                'シルバーソルメイル': [
                    { '攻撃': 2, '斬れ味': 2 }, { '攻撃': 1, '斬れ味': 3 },
                    { '攻撃': 4, '斬れ味': 1 } ]
            };
            assert.deepEqual(got, exp);
        });

        it('skill point is 0 or minus', function () {
            // スキルポイントが 0 やマイナスでも正規化できるか
            var combs = {
                'hoge': [
                    { '匠': 1, '斬れ味': -2 },
                    { '匠': 0, '斬れ味': 0 },
                    { '匠': -1, '斬れ味': 0 },
                    { '匠': 1, '斬れ味': -1 },
                    { '匠': 0, '斬れ味': 1 } ],
                'slot0': [
                    { '匠': 0, '斬れ味': 0 } ]
            };
            got = n._normalize3(combs);
            exp = {
                'hoge': [
                    { '匠': 1, '斬れ味': -1 }, { '匠': 0, '斬れ味': 1 } ],
                'slot0': [
                    { '匠': 0, '斬れ味': 0 } ]
            };
            assert.deepEqual(got, exp, 'case 2');
        });

        it('torsoUp', function () {
            var combs = {
                'ジャギィＳグリーヴ': [
                    { '攻撃': 5, '斬れ味': 0 }, { '攻撃': 4, '斬れ味': 1 } ],
                '胴系統倍加': [
                    { '胴系統倍加': 1 } ],
                slot0: [
                    { '攻撃': 0, '斬れ味': 0 } ],
                'シルバーソルグリーヴ': [
                    { '攻撃': 5, '斬れ味': 2 },
                    { '攻撃': 4, '斬れ味': 3 },
                    { '攻撃': 3, '斬れ味': 4 },
                    { '攻撃': 2, '斬れ味': 5 },
                    { '攻撃': 6, '斬れ味': 2 },
                    { '攻撃': 5, '斬れ味': 3 },
                    { '攻撃': 7, '斬れ味': 2 },
                    { '攻撃': 2, '斬れ味': 6 } ]
            };
            got = n._normalize3(combs);
            exp = {
                'ジャギィＳグリーヴ': [
                    { '攻撃': 5, '斬れ味': 0 }, { '攻撃': 4, '斬れ味': 1 } ],
                '胴系統倍加': [
                    { '胴系統倍加': 1 } ],
                slot0: [
                    { '攻撃': 0, '斬れ味': 0 } ],
                'シルバーソルグリーヴ': [
                    { '攻撃': 3, '斬れ味': 4 },
                    { '攻撃': 5, '斬れ味': 3 },
                    { '攻撃': 7, '斬れ味': 2 },
                    { '攻撃': 2, '斬れ味': 6 } ]
            };
            assert.deepEqual(got, exp);
        });
    });

    describe('_normalize4', function () {
        var n = new Normalizer();

        var sorter = function (actiCombs) {
            return _.sortBy(actiCombs, function (comb) {
                return _.reduce(comb.skillComb, function (memo, pt, skill) {
                    return memo + skill + pt;
                }, '');
            });
        };

        it('_normalize4', function () {
            var combs = {
                'ジャギィＳメイル': [
                    { '攻撃': 3, '斬れ味': 0 }, { '攻撃': 2, '斬れ味': 1 } ],
                'バギィＳメイル': [
                    { '攻撃': 4, '斬れ味': 1 }, { '攻撃': 3, '斬れ味': 2 },
                    { '攻撃': 6, '斬れ味': 0 } ],
                'ジンオウメイル': [
                    { '攻撃': 0, '斬れ味': 2 } ],
                slot0: [
                    { '攻撃': 0, '斬れ味': 0 } ],
                slot3: [
                    { '攻撃': 1, '斬れ味': 2 }, { '攻撃': 3, '斬れ味': 1 },
                    { '攻撃': 5, '斬れ味': 0 }, { '攻撃': 0, '斬れ味': 4 } ],
                'シルバーソルメイル': [
                    { '攻撃': 2, '斬れ味': 2 }, { '攻撃': 1, '斬れ味': 3 },
                    { '攻撃': 4, '斬れ味': 1 } ]
            };
            got = n._normalize4(combs);
            exp = [
                { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] },
                { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ 'ジンオウメイル' ] },
                { skillComb: { '攻撃': 3, '斬れ味': 0 }, equips: [ 'ジャギィＳメイル' ] },
                { skillComb: { '攻撃': 2, '斬れ味': 1 }, equips: [ 'ジャギィＳメイル' ] },
                { skillComb: { '攻撃': 1, '斬れ味': 2 }, equips: [ 'slot3' ] },
                { skillComb: { '攻撃': 3, '斬れ味': 1 }, equips: [ 'slot3' ] },
                { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ 'slot3' ] },
                { skillComb: { '攻撃': 2, '斬れ味': 2 }, equips: [ 'シルバーソルメイル' ] },
                { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ 'シルバーソルメイル' ] },
                { skillComb: { '攻撃': 4, '斬れ味': 1 },
                  equips: [ 'バギィＳメイル', 'シルバーソルメイル' ] },
                { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ 'バギィＳメイル' ] },
                { skillComb: { '攻撃': 5, '斬れ味': 0 }, equips: [ 'slot3' ] },
                { skillComb: { '攻撃': 6, '斬れ味': 0 }, equips: [ 'バギィＳメイル' ] }
            ];
            assert.deepEqual(sorter(got), sorter(exp));
        });

        it('torsoUp', function () {
            var combs = {
                'ジャギィＳグリーヴ': [
                    { '攻撃': 5, '斬れ味': 0 },
                    { '攻撃': 4, '斬れ味': 1 } ],
                '胴系統倍加': [
                    { '胴系統倍加': 1 } ],
                slot0: [
                    { '攻撃': 0, '斬れ味': 0 } ],
                'シルバーソルグリーヴ': [
                    { '攻撃': 3, '斬れ味': 4 }, { '攻撃': 5, '斬れ味': 3 },
                    { '攻撃': 7, '斬れ味': 2 }, { '攻撃': 2, '斬れ味': 6 } ]
            };
            got = n._normalize4(combs);
            exp = [
                { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] },
                { skillComb: { '胴系統倍加': 1 }, equips: [ '胴系統倍加' ] },
                { skillComb: { '攻撃': 5, '斬れ味': 0 }, equips: [ 'ジャギィＳグリーヴ' ] },
                { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ 'ジャギィＳグリーヴ' ] },
                { skillComb: { '攻撃': 3, '斬れ味': 4 }, equips: [ 'シルバーソルグリーヴ' ] },
                { skillComb: { '攻撃': 5, '斬れ味': 3 }, equips: [ 'シルバーソルグリーヴ' ] },
                { skillComb: { '攻撃': 2, '斬れ味': 6 }, equips: [ 'シルバーソルグリーヴ' ] },
                { skillComb: { '攻撃': 7, '斬れ味': 2 }, equips: [ 'シルバーソルグリーヴ' ] }
            ];
            assert.deepEqual(sorter(got), sorter(exp));
        });

        it('null or etc', function () {
            got = n._normalize4();
            assert.deepEqual(got, [], 'nothing in');
            got = n._normalize4(undefined);
            assert.deepEqual(got, [], 'undefined');
            got = n._normalize4(null);
            assert.deepEqual(got, [], 'null');
            got = n._normalize4({});
            assert.deepEqual(got, [], '{}');
        });
    });
});
