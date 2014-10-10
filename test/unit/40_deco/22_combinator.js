'use strict';
var assert = require('power-assert'),
    Combinator = require('../../../lib/deco/combinator.js'),
    util = require('../../../lib/util.js'),
    myapp = require('../../../test/lib/driver-myapp.js');

describe('40_deco/22_combinator', function () {
    var got, exp;

    beforeEach(function () {
        myapp.initialize();
    });

    describe('_combine', function () {
        var c = new Combinator();

        it('combine', function () {
            var skillNames = [ '攻撃力UP【大】', '業物' ];
            var bulksSet = {
                head: [
                    { skillComb: { '攻撃': 0, '斬れ味': 1 }, decos: [ '0,1' ], slot: 1 } ],
                body: [
                    { skillComb: { '攻撃': 3, '斬れ味': 0 }, decos: [ '3,0' ], slot: 2 } ],
                arm: [
                    { skillComb: { '攻撃': 0, '斬れ味': 1 }, decos: [ '0,1' ], slot: 1 } ],
                waist: [
                    { skillComb: { '攻撃': 2, '斬れ味': 0 }, decos: [ '2,0' ], slot: 2 },
                    { skillComb: { '攻撃': 3, '斬れ味': 0 }, decos: [ '3,0' ], slot: 2 },
                    { skillComb: { '攻撃': 1, '斬れ味': 1 }, decos: [ '1,1' ], slot: 2 },
                    { skillComb: { '攻撃': 0, '斬れ味': 2 }, decos: [ '0,2' ], slot: 2 } ],
                leg: [
                    { skillComb: { '攻撃': 3, '斬れ味': 0 }, decos: [ '3,0' ], slot: 2 } ],
                oma: [
                    { skillComb: { '攻撃': 1, '斬れ味': 0 }, decos: [ '1,0' ], slot: 1 },
                    { skillComb: { '攻撃': 0, '斬れ味': 1 }, decos: [ '0,1' ], slot: 1 } ]
            };
            var equipSC = { '攻撃': 13, '斬れ味': 6 };
            var borderLine = new util.BorderLine(skillNames, bulksSet, equipSC);
            got = c._combine(bulksSet, borderLine);
            exp = [
                {
                    decombs: [
                        { head  : bulksSet.head[0],
                          body  : bulksSet.body[0],
                          arm   : bulksSet.arm[0],
                          waist : bulksSet.waist[2],
                          leg   : bulksSet.leg[0],
                          weapon: { decos: [], slot: 0, skillComb: {} },
                          oma   : bulksSet.oma[1] },
                        { head  : bulksSet.head[0],
                          body  : bulksSet.body[0],
                          arm   : bulksSet.arm[0],
                          waist : bulksSet.waist[3],
                          leg   : bulksSet.leg[0],
                          weapon: { decos: [], slot: 0, skillComb: {} },
                          oma   : bulksSet.oma[0] }
                    ],
                    sumSC: { '攻撃': 7, '斬れ味': 4 }
                }
            ];
            assert.deepEqual(got, exp);
        });

        it('body is [] and torsoUp', function () {
            var skillNames = [ '攻撃力UP【大】', '業物' ];
            var bulksSet = {
                head: [
                    { skillComb: { '攻撃': 3, '斬れ味': 0 }, decos: [ '3,0' ], slot: 2 } ],
                body: [],
                arm: [
                    { skillComb: { '攻撃': 3, '斬れ味': 0 }, decos: [ '3,0' ], slot: 2 } ],
                waist: [
                    { skillComb: { '攻撃': 2, '斬れ味': 0 }, decos: [ '2,0' ], slot: 2 },
                    { skillComb: { '攻撃': 3, '斬れ味': 0 }, decos: [ '3,0' ], slot: 2 },
                    { skillComb: { '攻撃': 1, '斬れ味': 1 }, decos: [ '1,1' ], slot: 2 },
                    { skillComb: { '攻撃': 0, '斬れ味': 2 }, decos: [ '0,2' ], slot: 2 } ],
                leg: [
                    { skillComb: { '胴系統倍化': 1 }, decos: [ 'torsoUp' ], slot: 0 } ],
                weapon: [
                    { skillComb: { '攻撃': 0, '斬れ味': 2 }, decos: [ '0,2' ], slot: 2 } ],
                oma: [
                    { skillComb: { '攻撃': 1, '斬れ味': 0 }, decos: [ '1,0' ], slot: 1 },
                    { skillComb: { '攻撃': 0, '斬れ味': 1 }, decos: [ '0,1' ], slot: 1 } ]
            };
            var equipSC = { '攻撃': 13, '斬れ味': 6 };
            var borderLine = new util.BorderLine(skillNames, bulksSet, equipSC);
            got = c._combine(bulksSet, borderLine);
            exp = [
                {
                    decombs: [
                        { head  : bulksSet.head[0],
                          body  : { decos: [], slot: 0, skillComb: {} },
                          arm   : bulksSet.arm[0],
                          waist : bulksSet.waist[2],
                          leg   : bulksSet.leg[0],
                          weapon: bulksSet.weapon[0],
                          oma   : bulksSet.oma[1] },
                        { head  : bulksSet.head[0],
                          body  : { decos: [], slot: 0, skillComb: {} },
                          arm   : bulksSet.arm[0],
                          waist : bulksSet.waist[3],
                          leg   : bulksSet.leg[0],
                          weapon: bulksSet.weapon[0],
                          oma   : bulksSet.oma[0] }
                    ],
                    sumSC: { '攻撃': 7, '斬れ味': 4 }
                }
            ];
            assert.deepEqual(got, exp);
        });

        it('already activates', function () {
            var skillNames = [ '攻撃力UP【大】', '業物' ];
            var bulksSet = {
                head: [
                    { skillComb: { '攻撃': 0, '斬れ味': 1 }, decos: [ '0,1' ], slot: 1 } ],
                body: [
                    { skillComb: { '攻撃': 3, '斬れ味': 0 }, decos: [ '3,0' ], slot: 2 } ],
                arm: [
                    { skillComb: { '攻撃': 0, '斬れ味': 1 }, decos: [ '0,1' ], slot: 1 } ],
                waist: [
                    { skillComb: { '攻撃': 2, '斬れ味': 0 }, decos: [ '2,0' ], slot: 2 },
                    { skillComb: { '攻撃': 3, '斬れ味': 0 }, decos: [ '3,0' ], slot: 2 },
                    { skillComb: { '攻撃': 1, '斬れ味': 1 }, decos: [ '1,1' ], slot: 2 },
                    { skillComb: { '攻撃': 0, '斬れ味': 2 }, decos: [ '0,2' ], slot: 2 } ],
                leg: [
                    { skillComb: { '攻撃': 3, '斬れ味': 0 }, decos: [ '3,0' ], slot: 2 } ],
                oma: [
                    { skillComb: { '攻撃': 1, '斬れ味': 0 }, decos: [ '1,0' ], slot: 1 },
                    { skillComb: { '攻撃': 0, '斬れ味': 1 }, decos: [ '0,1' ], slot: 1 } ]
            };
            var equipSC = { '攻撃': 20, '斬れ味': 10 };
            var borderLine = new util.BorderLine(skillNames, bulksSet, equipSC);
            got = c._combine(bulksSet, borderLine);
            exp = [ { decombs: [], sumSC: {} } ];
            assert.deepEqual(got, exp);
        });
    });

    describe('_brushUp', function () {
        var c = new Combinator();

        it('brush up', function () {
            var combs = [
                {
                    decombs: [
                        { head  : { decos: [ 'a1' ] },
                          body  : { decos: [ 'a3' ] },
                          arm   : { decos: [ 'a1', 'a1' ] },
                          waist : { decos: [] },
                          leg   : { decos: [ 'b2' ] },
                          weapon: { decos: [ 'b2' ] },
                          oma   : { decos: [ 'a3' ] },
                          bodySC: { 'a': 9, 'b': 4 } },
                        { head  : { decos: [ 'a1' ] },
                          body  : { decos: [ 'a3' ] },
                          arm   : { decos: [ 'a1', 'a1' ] },
                          waist : { decos: [] },
                          leg   : { decos: [ 'b2' ] },
                          //weapon: undefined,
                          oma   : null,
                          bodySC: {} }
                    ],
                    sumSC: {}
                },
                {
                    decombs: [
                        { body  : { decos: [ 'a3' ] },
                          head  : { decos: [ 'a3' ] },
                          arm   : { decos: [ 'b2' ] },
                          waist : { decos: [] },
                          leg   : null,
                          weapon: { decos: [ 'b2' ] },
                          oma: { decos: [ 'a3' ] } }
                    ],
                    sumSC: {}
                }
            ];
            got = c._brushUp(combs);
            exp = [
                { head  : { decos: [ 'a1' ] },
                  body  : { decos: [ 'a3' ] },
                  arm   : { decos: [ 'a1', 'a1' ] },
                  waist : { decos: [] },
                  leg   : { decos: [ 'b2' ] },
                  weapon: { decos: [ 'b2' ] },
                  oma   : { decos: [ 'a3' ] } },
                { head  : { decos: [ 'a1' ] },
                  body  : { decos: [ 'a3' ] },
                  arm   : { decos: [ 'a1', 'a1' ] },
                  waist : { decos: [] },
                  leg   : { decos: [ 'b2' ] },
                  weapon: { decos: [], slot: 0, skillComb: {} },
                  oma   : { decos: [], slot: 0, skillComb: {} } },
                { body  : { decos: [ 'a3' ] },
                  head  : { decos: [ 'a3' ] },
                  arm   : { decos: [ 'b2' ] },
                  waist : { decos: [] },
                  leg   : { decos: [], slot: 0, skillComb: {} },
                  weapon: { decos: [ 'b2' ] },
                  oma: { decos: [ 'a3' ] } }
            ];
            assert.deepEqual(got, exp);
        });
    });

    describe('_removeOverlap', function () {
        var c = new Combinator();

        it('remove', function () {
            var decombs = [
                // a1*3, a3*2, b2*2
                { head  : { decos: [ 'a1' ] },
                  body  : { decos: [ 'a3' ] },
                  arm   : { decos: [ 'a1', 'a1' ] },
                  waist : { decos: [] },
                  leg   : { decos: [ 'b2' ] },
                  weapon: { decos: [ 'b2' ] },
                  oma   : { decos: [ 'a3' ] } },
                // a1*2, a2*1, a3*2, b2*2
                { body  : { decos: [ 'a3' ] },
                  head  : { decos: [ 'a1' ] },
                  arm   : { decos: [ 'a1', 'a2' ] },
                  waist : { decos: [] },
                  leg   : { decos: [ 'b2' ] },
                  weapon: { decos: [ 'b2' ] },
                  oma   : { decos: [ 'a3' ] } },
                // a1*3, a3*2, b2*2
                { body  : { decos: [ 'a3' ] },
                  head  : { decos: [ 'a1' ] },
                  arm   : { decos: [ 'a1', 'a1' ] },
                  waist : null,
                  leg   : { decos: [ 'b2' ] },
                  weapon: { decos: [ 'b2' ] },
                  oma   : { decos: [ 'a3' ] } },
                // a3*3, b2*2
                { body  : { decos: [ 'a3' ] },
                  head  : { decos: [ 'a3' ] },
                  arm   : { decos: [ 'b2' ] },
                  waist : { decos: [] },
                  leg   : null,
                  weapon: { decos: [ 'b2' ] },
                  oma: { decos: [ 'a3' ] } },
                // a1*3, a3*2, b2*2
                { body  : { decos: [ 'a3' ] },
                  head  : { decos: [ 'a1' ] },
                  arm   : { decos: [ 'b2' ] },
                  waist : { decos: [] },
                  leg   : { decos: [ 'a1', 'a1' ] },
                  weapon: { decos: [ 'b2' ] },
                  oma: { decos: [ 'a3' ] } }
            ];
            got = c._removeOverlap(decombs);
            exp = [
                // a1*3, a3*2, b2*2
                { head  : { decos: [ 'a1' ] },
                  body  : { decos: [ 'a3' ] },
                  arm   : { decos: [ 'a1', 'a1' ] },
                  waist : { decos: [] },
                  leg   : { decos: [ 'b2' ] },
                  weapon: { decos: [ 'b2' ] },
                  oma   : { decos: [ 'a3' ] } },
                // a1*2, a2*1, a3*2, b2*2
                { body  : { decos: [ 'a3' ] },
                  head  : { decos: [ 'a1' ] },
                  arm   : { decos: [ 'a1', 'a2' ] },
                  waist : { decos: [] },
                  leg   : { decos: [ 'b2' ] },
                  weapon: { decos: [ 'b2' ] },
                  oma   : { decos: [ 'a3' ] } },
                // a3*3, b2*2
                { body  : { decos: [ 'a3' ] },
                  head  : { decos: [ 'a3' ] },
                  arm   : { decos: [ 'b2' ] },
                  waist : { decos: [] },
                  leg   : null,
                  weapon: { decos: [ 'b2' ] },
                  oma: { decos: [ 'a3' ] } }
            ];
            assert.deepEqual(got, exp);
        });
    });

    describe('_calcTotalSlot', function () {
        var c = new Combinator();
        
        it('calc', function () {
            var equip = {
                body  : { name: 'body', slot: 1 },
                head  : { name: 'head', slot: 2 },
                arm   : { name: 'arm', slot: 3 },
                waist : { name: 'waist', slot: 0 },
                leg   : { name: 'leg', slot: 2 },
                weapon: null,
                oma   : { name: 'oma', slot: 3 }
            };
            got = c._calcTotalSlot(equip);
            exp = 11;
            assert(got === exp);
        });
    });

    describe('_groupByFreeSlot', function () {
        var c = new Combinator();

        it('group by', function () {
            var decombs = [
                { body  : { slot: 1 },
                  head  : { slot: 2 },
                  arm   : { slot: 3 },
                  waist : { slot: 1 },
                  leg   : { slot: 2 },
                  weapon: null,
                  oma   : { slot: 3 } },
                { body : { slot: 0 },
                  head : { slot: 3 },
                  arm  : { slot: 3 },
                  waist: { slot: 0 },
                  // weapon がない
                  leg  : { slot: 3 },
                  oma  : { slot: 3 } },
                { body  : { slot: 2 },
                  head  : { slot: 2 },
                  arm   : { slot: 2 },
                  waist : { slot: 2 },
                  leg   : { slot: 2 },
                  weapon: { slot: 2 },
                  oma   : { slot: 2 } }
            ];
            got = c._groupByFreeSlot(decombs, 15);
            exp = {
                3: [
                    { body  : { slot: 1 },
                      head  : { slot: 2 },
                      arm   : { slot: 3 },
                      waist : { slot: 1 },
                      leg   : { slot: 2 },
                      weapon: null,
                      oma   : { slot: 3 } },
                    { body : { slot: 0 },
                      head : { slot: 3 },
                      arm  : { slot: 3 },
                      waist: { slot: 0 },
                      // weapon がない
                      leg  : { slot: 3 },
                      oma  : { slot: 3 } }
                ],
                1: [
                    { body  : { slot: 2 },
                      head  : { slot: 2 },
                      arm   : { slot: 2 },
                      waist : { slot: 2 },
                      leg   : { slot: 2 },
                      weapon: { slot: 2 },
                      oma   : { slot: 2 } }
                ]
            };
            assert.deepEqual(got, exp);
        });
    });

    describe('_getJustActivated', function () {
        var c = new Combinator();

        it('just activates', function () {
            var goal = { '攻撃': 6, '斬れ味': 10 };
            var decombs = [
                // { '攻撃': 6, '斬れ味': 10 }
                { body  : { skillComb: { '攻撃': 1, '斬れ味': 1 } },
                  head  : { skillComb: { '攻撃': 0, '斬れ味': 4 } },
                  arm   : { skillComb: { '攻撃': 2, '斬れ味': 0 } },
                  waist : { skillComb: { '攻撃': 1, '斬れ味': 1 } },
                  leg   : { skillComb: { '攻撃': 0, '斬れ味': 4 } },
                  weapon: null,
                  oma   : { skillComb: { '攻撃': 2, '斬れ味': 0 } } },
                // { '攻撃': 6, '斬れ味': 10 }
                { body : { skillComb: { '攻撃': 1, '斬れ味': 1 } },
                  head : { skillComb: { '攻撃': 0, '斬れ味': 4 } },
                  arm  : { skillComb: { '攻撃': 2, '斬れ味': 0 } },
                  waist: { skillComb: { '胴系統倍化': 1 } },
                  leg  : { skillComb: { '攻撃': 0, '斬れ味': 4 } },
                  // weapon がない
                  oma  : { skillComb: { '攻撃': 2, '斬れ味': 0 } } },
                // { '攻撃': 7, '斬れ味': 10 }
                { body  : { skillComb: { '攻撃': 1, '斬れ味': 1 } },
                  head  : { skillComb: { '攻撃': 0, '斬れ味': 4 } },
                  arm   : { skillComb: { '攻撃': 2, '斬れ味': 0 } },
                  waist : { skillComb: { '胴系統倍化': 1 } },
                  leg   : { skillComb: { '攻撃': 0, '斬れ味': 4 } },
                  weapon: { skillComb: { '攻撃': 1, '斬れ味': 0 } },
                  oma   : { skillComb: { '攻撃': 2, '斬れ味': 0 } } }
            ];
            got = c._getJustActivated(decombs, goal);
            exp = [ decombs[0], decombs[1] ];
            assert.deepEqual(got, exp);
        });

        it('goal within minus', function () {
            // 装備で匠のポイントがオーバーしている場合
            // 組み合わせ例
            //   女性、村のみ、武器スロなし
            //   ディアブロヘルム、ガルルガメイル、フィリアアーム、
            //   ガルルガフォールド、フィリアグリーヴ
            //   龍の護石(スロ3,匠+4,氷耐性-5)
            var goal = { '匠': -1, '聴覚保護': 10 };
            var decombs = [
                { body  : { skillComb: { '匠': 0, '聴覚保護': 0 } },
                  head  : { skillComb: { '匠': 0, '聴覚保護': 2 } },
                  arm   : { skillComb: { '匠': 0, '聴覚保護': 1 } },
                  waist : { skillComb: { '匠': 0, '聴覚保護': 2 } },
                  leg   : { skillComb: { '匠': 0, '聴覚保護': 2 } },
                  weapon: null,
                  oma   : { skillComb: { '匠': 0, '聴覚保護': 3 } } }
            ];
            got = c._getJustActivated(decombs, goal);
            exp = [ decombs[0] ];
            assert.deepEqual(got, exp);
        });

        it('decombs is []', function () {
            var goal = { 'なんでもいい': 10 };
            got = c._getJustActivated([], goal);
            exp = [];
            assert.deepEqual(got, exp);
        });
    });

    describe('_removePointOver', function () {
        var c = new Combinator();

        it('remove', function () {
            var goal = { '攻撃': 6, '斬れ味': 10 };
            var decombs = [
                // スロ13, { '攻撃': 6, '斬れ味': 10 }
                { body  : { slot: 2, skillComb: { '攻撃': 1, '斬れ味': 1 } },
                  head  : { slot: 3, skillComb: { '攻撃': 0, '斬れ味': 4 } },
                  arm   : { slot: 2, skillComb: { '攻撃': 1, '斬れ味': 1 } },
                  waist : { slot: 3, skillComb: { '攻撃': 0, '斬れ味': 4 } },
                  leg   : { slot: 0, skillComb: { '攻撃': 0, '斬れ味': 0 } },
                  weapon: null,
                  oma   : { slot: 3, skillComb: { '攻撃': 4, '斬れ味': 0 } } },
                // スロ13, { '攻撃': 7, '斬れ味': 10 }
                { body  : { slot: 2, skillComb: { '攻撃': 1, '斬れ味': 1 } },
                  head  : { slot: 3, skillComb: { '攻撃': 0, '斬れ味': 4 } },
                  arm   : { slot: 2, skillComb: { '攻撃': 1, '斬れ味': 1 } },
                  waist : { slot: 3, skillComb: { '攻撃': 0, '斬れ味': 4 } },
                  leg   : { slot: 0, skillComb: { '攻撃': 0, '斬れ味': 0 } },
                  weapon: null,
                  oma   : { slot: 3, skillComb: { '攻撃': 5, '斬れ味': 0 } } },
                // スロ14, { '攻撃': 6, '斬れ味': 10 }
                { body  : { slot: 2, skillComb: { '攻撃': 1, '斬れ味': 1 } },
                  head  : { slot: 3, skillComb: { '攻撃': 0, '斬れ味': 4 } },
                  arm   : { slot: 2, skillComb: { '攻撃': 1, '斬れ味': 1 } },
                  waist : { slot: 3, skillComb: { '攻撃': 0, '斬れ味': 4 } },
                  leg   : { slot: 2, skillComb: { '攻撃': 2, '斬れ味': 0 } },
                  //weapon: undefined,
                  oma   : { slot: 2, skillComb: { '攻撃': 2, '斬れ味': 0 } } },
                // スロ14, { '攻撃': 7, '斬れ味': 10 }
                { body  : { slot: 2, skillComb: { '攻撃': 1, '斬れ味': 1 } },
                  head  : { slot: 3, skillComb: { '攻撃': 0, '斬れ味': 4 } },
                  arm   : { slot: 2, skillComb: { '攻撃': 1, '斬れ味': 1 } },
                  waist : { slot: 3, skillComb: { '攻撃': 0, '斬れ味': 4 } },
                  leg   : { slot: 2, skillComb: { '攻撃': 2, '斬れ味': 0 } },
                  weapon: null,
                  oma   : { slot: 2, skillComb: { '攻撃': 3, '斬れ味': 0 } } }
            ];
            got = c._removePointOver(decombs, 14, goal);
            exp = [ decombs[0], decombs[2] ];
            assert.deepEqual(got, exp);
        });

        it('single comb & point over', function () {
            // ちょうどスキルが発動している組み合わせがない
            var goal = { '攻撃': 6, '斬れ味': 10 };
            var decombs = [
                // スロ13, { '攻撃': 7, '斬れ味': 10 }
                { body  : { slot: 2, skillComb: { '攻撃': 1, '斬れ味': 1 } },
                  head  : { slot: 3, skillComb: { '攻撃': 0, '斬れ味': 4 } },
                  arm   : { slot: 2, skillComb: { '攻撃': 1, '斬れ味': 1 } },
                  waist : { slot: 3, skillComb: { '攻撃': 0, '斬れ味': 4 } },
                  leg   : { slot: 3, skillComb: { '攻撃': 5, '斬れ味': 0 } } }
            ];
            got = c._removePointOver(decombs, 13, goal);
            exp = [ decombs[0] ];
            assert.deepEqual(got, exp);
        });

        it('decombs is []', function () {
            var goal = { 'なんでもいい': 10 };
            got = c._removePointOver([], 0, goal);
            exp = [];
            assert.deepEqual(got, exp);
        });
    });
});
