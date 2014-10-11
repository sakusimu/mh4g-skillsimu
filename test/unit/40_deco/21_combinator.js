'use strict';
var assert = require('power-assert'),
    Combinator = require('../../../lib/deco/combinator.js'),
    util = require('../../../lib/util.js'),
    myapp = require('../../../test/lib/driver-myapp.js');

describe('40_deco/21_combinator', function () {
    var got, exp;

    beforeEach(function () {
        myapp.initialize();
    });

    describe('_combineTorsoUp', function () {
        var c = new Combinator();

        it('combine', function () {
            var skillNames = [ '攻撃力UP【大】', '業物' ];
            var bulksSet = {
                head: [
                    { skillComb: { '攻撃': 0, '斬れ味': 1 }, decos: [ '0,1' ], slot: 1 } ],
                body: [
                    { skillComb: { '攻撃': 3, '斬れ味': 0 }, decos: [ '3,0' ], slot: 2 } ],
                arm: [
                    { skillComb: { '攻撃': 1, '斬れ味': 0 }, decos: [ '1,0' ], slot: 1 },
                    { skillComb: { '攻撃': 0, '斬れ味': 1 }, decos: [ '0,1' ], slot: 1 } ],
                waist: [
                    { skillComb: { '攻撃': 2, '斬れ味': 0 }, decos: [ '2,0' ], slot: 2 },
                    { skillComb: { '攻撃': 3, '斬れ味': 0 }, decos: [ '3,0' ], slot: 2 },
                    { skillComb: { '攻撃': 1, '斬れ味': 1 }, decos: [ '1,1' ], slot: 2 },
                    { skillComb: { '攻撃': 0, '斬れ味': 2 }, decos: [ '0,2' ], slot: 2 } ],
                leg: [
                    { skillComb: { '胴系統倍加': 1 }, decos: [ 'torsoUp' ], slot: 0 } ],
                oma: [
                    { skillComb: { '攻撃': 0, '斬れ味': 1 }, decos: [ '0,1' ], slot: 1 } ]
            };
            var equipSC = { '攻撃': 13, '斬れ味': 6 };
            var borderLine = new util.BorderLine(skillNames, bulksSet, equipSC);
            var comb = {
                decombs: [
                    { head : bulksSet.head[0],
                      body : bulksSet.body[0],
                      arm  : bulksSet.arm[0],
                      waist: bulksSet.waist[3] },
                    { head : bulksSet.head[0],
                      body : bulksSet.body[0],
                      arm  : bulksSet.arm[1],
                      waist: bulksSet.waist[2] }
                ],
                sumSC: { '攻撃': 4, '斬れ味': 3 }
            };
            var bulk = bulksSet.leg[0];
            got = c._combineTorsoUp(comb, bulk, borderLine, 'leg');
            exp = [
                {
                    decombs: [
                        { head : bulksSet.head[0],
                          body : bulksSet.body[0],
                          arm  : bulksSet.arm[0],
                          waist: bulksSet.waist[3],
                          leg  : bulksSet.leg[0] }
                    ],
                    sumSC: { '攻撃': 7, '斬れ味': 3 }
                },
                {
                    decombs: [
                        { head : bulksSet.head[0],
                          body : bulksSet.body[0],
                          arm  : bulksSet.arm[1],
                          waist: bulksSet.waist[2],
                          leg  : bulksSet.leg[0] }
                    ],
                    sumSC: { '攻撃': 7, '斬れ味': 3 }
                }
            ];
            assert.deepEqual(got, exp, 'combine');
        });
    });

    describe('_combineDeco', function () {
        var c = new Combinator(),
            skillNames = [ '攻撃力UP【大】', '業物' ];

        it('combine waist (done: body, head, arm, waist)', function () {
            // body, head, arm まで終わってて、これから waist を処理するところ
            var bulksSet = {
                head: [
                    { skillComb: { '攻撃': 0, '斬れ味': 1 }, decos: [ '0,1' ], slot: 1 },
                    { skillComb: { '攻撃': 3, '斬れ味': 0 }, decos: [ '3,0' ], slot: 2 } ],
                body: [
                    { skillComb: { '攻撃': 0, '斬れ味': 1 }, decos: [ '0,1' ], slot: 1 },
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
            var comb = {
                decombs: [
                    { head: bulksSet.head[0],
                      body: bulksSet.body[1],
                      arm : bulksSet.arm[0] },
                    { head: bulksSet.head[1],
                      body: bulksSet.body[0],
                      arm : bulksSet.arm[0] }
                ],
                sumSC: { '攻撃': 3, '斬れ味': 2 }
            };
            var bulks = bulksSet.waist;
            got = c._combineDeco(comb, bulks, borderLine, 'waist');
            exp = [ // 結果の waist は、合計が 2 で斬れ味に 1 以上のものになる
                {
                    decombs: [
                        { head : bulksSet.head[0],
                          body : bulksSet.body[1],
                          arm  : bulksSet.arm[0],
                          waist: bulksSet.waist[2] },
                        { head : bulksSet.head[1],
                          body : bulksSet.body[0],
                          arm  : bulksSet.arm[0],
                          waist: bulksSet.waist[2] }
                    ],
                    sumSC: { '攻撃': 4, '斬れ味': 3 }
                },
                {
                    decombs: [
                        { head : bulksSet.head[0],
                          body : bulksSet.body[1],
                          arm  : bulksSet.arm[0],
                          waist: bulksSet.waist[3] },
                        { head : bulksSet.head[1],
                          body : bulksSet.body[0],
                          arm  : bulksSet.arm[0],
                          waist: bulksSet.waist[3] }
                    ],
                    sumSC: { '攻撃': 3, '斬れ味': 4 }
                }
            ];
            assert.deepEqual(got, exp);
        });

        it('not skip slot3', function () {
            // スロ2で見つかってもスロ3も見つける
            var bulksSet = {
                head: [
                    { skillComb: { '攻撃': 0, '斬れ味': 1 }, decos: [ '0,1' ], slot: 1 } ],
                body: [
                    { skillComb: { '攻撃': 3, '斬れ味': 0 }, decos: [ '3,0' ], slot: 2 } ],
                arm: [
                    { skillComb: { '攻撃': 0, '斬れ味': 1 }, decos: [ '0,1' ], slot: 1 } ],
                waist: [
                    { skillComb: { '攻撃': 0, '斬れ味': 2 }, decos: [ '0,2' ], slot: 2 },
                    { skillComb: { '攻撃': 1, '斬れ味': 2 }, decos: [ '1,2' ], slot: 3 } ],
                leg: [
                    { skillComb: { '攻撃': 3, '斬れ味': 0 }, decos: [ '3,0' ], slot: 2 } ],
                oma: [
                    { skillComb: { '攻撃': 1, '斬れ味': 0 }, decos: [ '1,0' ], slot: 1 },
                    { skillComb: { '攻撃': 0, '斬れ味': 1 }, decos: [ '0,1' ], slot: 1 } ]
            };
            var equipSC = { '攻撃': 13, '斬れ味': 6 };
            var borderLine = new util.BorderLine(skillNames, bulksSet, equipSC);
            var comb = {
                decombs: [
                    { head: bulksSet.head[0],
                      body: bulksSet.body[0],
                      arm : bulksSet.arm[0] }
                ],
                sumSC: { '攻撃': 3, '斬れ味': 2 }
            };
            var bulks = bulksSet.waist;
            got = c._combineDeco(comb, bulks, borderLine, 'waist');
            exp = [
                {
                    decombs: [
                        { head : bulksSet.head[0],
                          body : bulksSet.body[0],
                          arm  : bulksSet.arm[0],
                          waist: bulksSet.waist[0] }
                    ],
                    sumSC: { '攻撃': 3, '斬れ味': 4 }
                },
                {
                    decombs: [
                        { head : bulksSet.head[0],
                          body : bulksSet.body[0],
                          arm  : bulksSet.arm[0],
                          waist: bulksSet.waist[1] }
                    ],
                    sumSC: { '攻撃': 4, '斬れ味': 4 }
                }
            ];
            assert.deepEqual(got, exp);
        });

        it('torsoUp', function () {
            var bulksSet = {
                head: [
                    { skillComb: { '胴系統倍加': 1 }, decos: [ 'torsoUp' ], slot: 0 } ],
                body: [
                    { skillComb: { '攻撃': 3, '斬れ味': 1 }, decos: [ '3,1' ], slot: 3 } ],
                arm: [
                    { skillComb: { '攻撃': 0, '斬れ味': 2 }, decos: [ '0,2' ], slot: 2 } ],
                waist: [
                    { skillComb: { '攻撃': 3, '斬れ味': 1 }, decos: [ '1,3' ], slot: 3 } ],
                leg: [
                    { skillComb: { '攻撃': 0, '斬れ味': 0 }, decos: [ '0,0' ], slot: 0 },
                    { skillComb: { '胴系統倍加': 1 }, decos: [ 'torsoUp' ], slot: 0 },
                    { skillComb: { '攻撃': 1, '斬れ味': 1 }, decos: [ '1,1' ], slot: 2 },
                    { skillComb: { '攻撃': 3, '斬れ味': 0 }, decos: [ '3,0' ], slot: 2 },
                    { skillComb: { '攻撃': 3, '斬れ味': 1 }, decos: [ '3,1' ], slot: 3 } ],
                oma: [
                    { skillComb: { '攻撃': 1, '斬れ味': 1 }, decos: [ '1,1' ], slot: 1 } ]
            };
            var equipSC = { '攻撃': 7, '斬れ味': 4 };
            var borderLine = new util.BorderLine(skillNames, bulksSet, equipSC);
            var comb = {
                decombs: [
                    { head : bulksSet.head[0],
                      body : bulksSet.body[0],
                      arm  : bulksSet.arm[0],
                      waist: bulksSet.waist[0] }
                ],
                sumSC: { '攻撃': 9, '斬れ味': 4 }
            };
            var bulks = bulksSet.leg;
            got = c._combineDeco(comb, bulks, borderLine, 'leg');
            exp = [
                {
                    decombs: [
                        { head : bulksSet.head[0],
                          body : bulksSet.body[0],
                          arm  : bulksSet.arm[0],
                          waist: bulksSet.waist[0],
                          leg  : bulksSet.leg[1] }
                    ],
                    sumSC: { '攻撃': 12, '斬れ味': 5 }
                },
                {
                    decombs: [
                        { head : bulksSet.head[0],
                          body : bulksSet.body[0],
                          arm  : bulksSet.arm[0],
                          waist: bulksSet.waist[0],
                          leg  : bulksSet.leg[4] }
                    ],
                    sumSC: { '攻撃': 12, '斬れ味': 5 }
                }
            ];
            assert.deepEqual(got, exp);
        });

        it('combine body (done: none)', function () {
            var bulksSet = {
                head: [
                    { skillComb: { '攻撃': 0, '斬れ味': 1 }, decos: [ '0,1' ], slot: 1 } ],
                body: [
                    { skillComb: { '攻撃': 2, '斬れ味': 0 }, decos: [ '2,0' ], slot: 2 },
                    { skillComb: { '攻撃': 3, '斬れ味': 0 }, decos: [ '3,0' ], slot: 2 },
                    { skillComb: { '攻撃': 1, '斬れ味': 1 }, decos: [ '1,1' ], slot: 2 },
                    { skillComb: { '攻撃': 0, '斬れ味': 2 }, decos: [ '0,2' ], slot: 2 } ],
                arm: [
                    { skillComb: { '攻撃': 0, '斬れ味': 1 }, decos: [ '0,1' ], slot: 1 } ],
                waist: [
                    { skillComb: { '攻撃': 3, '斬れ味': 0 }, decos: [ '3,0' ], slot: 2 } ],
                leg: [
                    { skillComb: { '攻撃': 3, '斬れ味': 0 }, decos: [ '3,0' ], slot: 2 } ],
                oma: [
                    { skillComb: { '攻撃': 1, '斬れ味': 0 }, decos: [ '1,0' ], slot: 1 },
                    { skillComb: { '攻撃': 0, '斬れ味': 1 }, decos: [ '0,1' ], slot: 1 } ]
            };
            var equipSC = { '攻撃': 13, '斬れ味': 6 };
            var borderLine = new util.BorderLine(skillNames, bulksSet, equipSC);
            var comb = { decombs: [], sumSC: 0 };
            var bulks = bulksSet.body;
            got = c._combineDeco(comb, bulks, borderLine, 'body');
            exp = [
                {
                    decombs: [
                        { body : bulksSet.body[2] }
                    ],
                    sumSC: { '攻撃': 1, '斬れ味': 1 }
                },
                {
                    decombs: [
                        { body : bulksSet.body[3] }
                    ],
                    sumSC: { '攻撃': 0, '斬れ味': 2 }
                }
            ];
            assert.deepEqual(got, exp);
        });

        it('already activates', function () {
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
            var comb = { decombs: [], sumSC: {} };
            var bulks = bulksSet.body;
            got = c._combineDeco(comb, bulks, borderLine, 'body');
            exp = [
                {
                    decombs: [
                        { body: bulksSet.body[0] }
                    ],
                    sumSC: { '攻撃': 3, '斬れ味': 0 }
                }
            ];
            assert.deepEqual(got, exp);
        });

        it('bulks is null', function () {
            var bulksSet = {
                head: [
                    { skillComb: { '攻撃': 0, '斬れ味': 1 }, decos: [ '0,1' ], slot: 1 } ],
                body: [
                    { skillComb: { '攻撃': 3, '斬れ味': 0 }, decos: [ '3,0' ], slot: 2 } ],
                arm: [
                    { skillComb: { '攻撃': 0, '斬れ味': 1 }, decos: [ '0,1' ], slot: 1 } ],
                waist: [
                    { skillComb: { '攻撃': 0, '斬れ味': 2 }, decos: [ '0,2' ], slot: 2 } ],
                leg: [
                    { skillComb: { '攻撃': 3, '斬れ味': 0 }, decos: [ '3,0' ], slot: 2 } ],
                oma: [
                    { skillComb: { '攻撃': 1, '斬れ味': 0 }, decos: [ '1,0' ], slot: 1 },
                    { skillComb: { '攻撃': 0, '斬れ味': 1 }, decos: [ '0,1' ], slot: 1 } ]
            };
            var equipSC = { '攻撃': 13, '斬れ味': 6 };
            var borderLine = new util.BorderLine(skillNames, bulksSet, equipSC);
            var comb = {
                decombs: [
                    { head : bulksSet.head[0],
                      body : bulksSet.body[0],
                      arm  : bulksSet.arm[0],
                      waist: bulksSet.waist[0],
                      leg  : bulksSet.leg[0] }
                ],
                sumSC: { '攻撃': 6, '斬れ味': 4 }
            };
            var bulks = bulksSet.weapon;
            got = c._combineDeco(comb, bulks, borderLine, 'weapon');
            exp = [
                {
                    decombs: [
                        { head : bulksSet.head[0],
                          body : bulksSet.body[0],
                          arm  : bulksSet.arm[0],
                          waist: bulksSet.waist[0],
                          leg  : bulksSet.leg[0],
                          weapon: { decos: [], slot: 0, skillComb: {} } }
                    ],
                    sumSC: { '攻撃': 6, '斬れ味': 4 }
                }
            ];
            assert.deepEqual(got, exp);
        });
    });

    describe('_compress', function () {
        var c = new Combinator();

        it('compress', function () {
            var combs = [
                { decombs: [ 'decomb1' ], sumSC: { a: 2, b: 0 } },
                { decombs: [ 'decomb1' ], sumSC: { a: 0, b: 2 } },
                { decombs: [ 'decomb2' ], sumSC: { a: 2, b: 0 } },
                { decombs: [ 'decomb2' ], sumSC: { a: 0, b: 1 } }
            ];
            got = c._compress(combs);
            exp = [
                { decombs: [ 'decomb1', 'decomb2' ], sumSC: { a: 2, b: 0 } },
                { decombs: [ 'decomb1' ], sumSC: { a: 0, b: 2 } },
                { decombs: [ 'decomb2' ], sumSC: { a: 0, b: 1 } }
            ];
            assert.deepEqual(got, exp);
        });

        it('within null', function () {
            var combs = [
                { decombs: [], sumSC: null },
                { decombs: [], sumSC: { a: 1 } }
            ];
            got = c._compress(combs);
            exp = [
                { decombs: [], sumSC: null },
                { decombs: [], sumSC: { a: 1 } }
            ];
            assert.deepEqual(got, exp);
        });
    });

    describe('_filter', function () {
        var c = new Combinator();

        it('filter', function () {
            var combs = [
                { sumSC: { '攻撃': 12, '斬れ味': 4 } },
                { sumSC: { '攻撃': 12, '斬れ味': 5 } },
                { sumSC: { '攻撃': 12, '斬れ味': 6 } }
            ];
            var goal = { '攻撃': 12, '斬れ味': 5 };
            got = c._filter(combs, goal);
            exp = [
                { sumSC: { '攻撃': 12, '斬れ味': 5 } },
                { sumSC: { '攻撃': 12, '斬れ味': 6 } }
            ];
            assert.deepEqual(got, exp);
        });

        it('already activates', function () {
            var combs = [ { decombs: [], sumSC: {} } ];
            var goal = { '攻撃': 0, '斬れ味': 0 };
            got = c._filter(combs, goal);
            exp = [ { decombs: [], sumSC: {} } ];
            assert.deepEqual(got, exp);
        });
    });
});
