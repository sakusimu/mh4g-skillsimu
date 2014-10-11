'use strict';
var assert = require('power-assert'),
    Combinator = require('../../../lib/equip/combinator.js'),
    util = require('../../../lib/util.js'),
    myapp = require('../../../test/lib/driver-myapp.js');

describe('30_equip/21_combinator', function () {
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
                    { skillComb: { '攻撃': 1, '斬れ味': 3 } },
                    { skillComb: { '攻撃': 2, '斬れ味': 3 } },
                    { skillComb: { '攻撃': 0, '斬れ味': 4 } },
                    { skillComb: { '攻撃': 4, '斬れ味': 0 } } ],
                body: [
                    { skillComb: { '攻撃': 5, '斬れ味': 1 } },
                    { skillComb: { '攻撃': 4, '斬れ味': 1 } },
                    { skillComb: { '攻撃': 6, '斬れ味': 0 } } ],
                arm: [
                    { skillComb: { '攻撃': 1, '斬れ味': 3 } },
                    { skillComb: { '攻撃': 2, '斬れ味': 3 } },
                    { skillComb: { '攻撃': 0, '斬れ味': 4 } },
                    { skillComb: { '攻撃': 4, '斬れ味': 0 } } ],
                waist: [
                    { skillComb: { '胴系統倍加': 1 } } ],
                leg: [
                    { skillComb: { '胴系統倍加': 1 } } ],
                oma: [
                    { skillComb: { '攻撃': 3, '斬れ味': 1 } },
                    { skillComb: { '攻撃': 2, '斬れ味': 2 } } ]
            };
            var borderLine = new util.BorderLine(skillNames, bulksSet);

            var comb = {
                eqcombs: [
                    { head : [ '1,3' ],
                      body : [ '5,1' ],
                      arm  : [ '1,3' ],
                      waist: [ 'torsoUp' ],
                      bodySC: { '攻撃': 5, '斬れ味': 1 } },
                    { head : [ '2,3' ],
                      body : [ '4,1' ],
                      arm  : [ '2,3' ],
                      waist: [ 'torsoUp' ],
                      bodySC: { '攻撃': 4, '斬れ味': 1 } },
                    { head : [ '0,4' ],
                      body : [ '6,0' ],
                      arm  : [ '0,4' ],
                      waist: [ 'torsoUp' ],
                      bodySC: { '攻撃': 6, '斬れ味': 0 } }
                ],
                sumSC: { '攻撃': 12, '斬れ味': 8 }
            };
            var bulk = { skillComb: { '胴系統倍加': 1 }, equips: [ 'torsoUp' ] };
            got = c._combineTorsoUp(comb, bulk, borderLine, 'leg');
            exp = [
                {
                    eqcombs: [
                        { head : [ '1,3' ],
                          body : [ '5,1' ],
                          arm  : [ '1,3' ],
                          waist: [ 'torsoUp' ],
                          leg  : [ 'torsoUp' ],
                          bodySC: { '攻撃': 5, '斬れ味': 1 } }
                    ],
                    sumSC: { '攻撃': 17, '斬れ味': 9 }
                },
                {
                    eqcombs: [
                        { head : [ '0,4' ],
                          body : [ '6,0' ],
                          arm  : [ '0,4' ],
                          waist: [ 'torsoUp' ],
                          leg  : [ 'torsoUp' ],
                          bodySC: { '攻撃': 6, '斬れ味': 0 } }
                    ],
                    sumSC: { '攻撃': 18, '斬れ味': 8 }
                }
            ];
            assert.deepEqual(got, exp, 'combine');
        });
    });

    describe('_combineEquip', function () {
        var c = new Combinator(),
            skillNames = [ '攻撃力UP【大】', '業物' ];

        it('combine leg (done: body, head, arm, waist)', function () {
            // body, head, arm, waist まで終わってて、これから leg を処理するところ
            var bulksSet = {
                head: [
                    { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] } ],
                body: [
                    { skillComb: { '攻撃': 5, '斬れ味': 1 }, equips: [ '5,1' ] } ],
                arm: [
                    { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] } ],
                waist: [
                    { skillComb: { '攻撃': 5, '斬れ味': 1 }, equips: [ '5,1' ] } ],
                leg: [
                    { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ '3,2' ] },
                    { skillComb: { '攻撃': 6, '斬れ味': 0 }, equips: [ '6,0' ] },
                    { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ '0,4' ] },
                    { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] },
                    { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ '4,1' ] } ],
                oma: [
                    { skillComb: { '攻撃': 4, '斬れ味': 0 }, equips: [ '4,0' ] },
                    { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ '0,2' ] } ]
            };
            var borderLine = new util.BorderLine(skillNames, bulksSet);
            var comb = {
                eqcombs: [
                    { head : [ '1,3' ],
                      body : [ '5,1' ],
                      arm  : [ '1,3' ],
                      waist: [ '5,1' ],
                      bodySC: { '攻撃': 5, '斬れ味': 1 }
                    }
                ],
                sumSC: { '攻撃': 12, '斬れ味': 8 }
            };
            var bulks = [
                { skillComb: { '攻撃': 6, '斬れ味': 0 }, equips: [ '6,0' ] },
                { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ '4,1' ] },
                { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ '3,2' ] },
                { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ '0,4' ] },
                { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] }
            ];
            got = c._combineEquip(comb, bulks, borderLine, 'leg');
            exp = [
                {
                    eqcombs: [
                        { head : [ '1,3' ],
                          body : [ '5,1' ],
                          arm  : [ '1,3' ],
                          waist: [ '5,1' ],
                          leg  : [ '6,0' ],
                          bodySC: { '攻撃': 5, '斬れ味': 1 } }
                    ],
                    sumSC: { '攻撃': 18, '斬れ味': 8 }
                }
            ];
            assert.deepEqual(got, exp);

            // bulks がソートされていないとちゃんと動かない
            bulks = [
                { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ '3,2' ] },
                { skillComb: { '攻撃': 6, '斬れ味': 0 }, equips: [ '6,0' ] },
                { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ '0,4' ] },
                { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] },
                { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ '4,1' ] }
            ];
            got = c._combineEquip(comb, bulks, borderLine, 'leg');
            exp = [];
            assert.deepEqual(got, exp, 'not sort');
        });

        it('combine leg (torsoUp)', function () {
            var bulksSet = {
                head: [
                    { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] } ],
                body: [
                    { skillComb: { '攻撃': 5, '斬れ味': 1 }, equips: [ '5,1' ] } ],
                arm: [
                    { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] } ],
                waist: [
                    { skillComb: { '胴系統倍加': 1 }, equips: [ 'torsoUp' ] } ],
                leg: [
                    { skillComb: { '胴系統倍加': 1 }, equips: [ 'torsoUp' ] },
                    { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ '3,2' ] },
                    { skillComb: { '攻撃': 6, '斬れ味': 0 }, equips: [ '6,0' ] },
                    { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ '0,4' ] },
                    { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] },
                    { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ '4,1' ] } ],
                oma: [
                    { skillComb: { '攻撃': 4, '斬れ味': 0 }, equips: [ '4,0' ] },
                    { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ '0,2' ] } ]
            };
            var borderLine = new util.BorderLine(skillNames, bulksSet);
            var comb = {
                eqcombs: [
                    { head : [ '1,3' ],
                      body : [ '5,1' ],
                      arm  : [ '1,3' ],
                      waist: [ 'torsoUp' ],
                      bodySC: { '攻撃': 5, '斬れ味': 1 } }
                ],
                sumSC: { '攻撃': 12, '斬れ味': 8 }
            };
            // 胴系統倍加は先にあってもOK
            var bulks = [
                { skillComb: { '胴系統倍加': 1 }, equips: [ 'torsoUp' ] },
                { skillComb: { '攻撃': 6, '斬れ味': 0 }, equips: [ '6,0' ] },
                { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ '4,1' ] },
                { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ '3,2' ] },
                { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ '0,4' ] },
                { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] }
            ];
            got = c._combineEquip(comb, bulks, borderLine, 'leg');
            exp = [
                {
                    eqcombs: [
                        { head : [ '1,3' ],
                          body : [ '5,1' ],
                          arm  : [ '1,3' ],
                          waist: [ 'torsoUp' ],
                          leg  : [ 'torsoUp' ],
                          bodySC: { '攻撃': 5, '斬れ味': 1 } }
                    ],
                    sumSC: { '攻撃': 17, '斬れ味': 9 }
                },
                {
                    eqcombs: [
                        { head : [ '1,3' ],
                          body : [ '5,1' ],
                          arm  : [ '1,3' ],
                          waist: [ 'torsoUp' ],
                          leg  : [ '6,0' ],
                          bodySC: { '攻撃': 5, '斬れ味': 1 } }
                    ],
                    sumSC: { '攻撃': 18, '斬れ味': 8 }
                }
            ];
            assert.deepEqual(got, exp);
        });

        it('combine body (done: none)', function () {
            var bulksSet = {
                head: [
                    { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] } ],
                body: [
                    { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ '3,2' ] },
                    { skillComb: { '攻撃': 6, '斬れ味': 0 }, equips: [ '6,0' ] },
                    { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ '0,4' ] },
                    { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] },
                    { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ '4,1' ] } ],
                arm: [
                    { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] } ],
                waist: [
                    { skillComb: { '攻撃': 5, '斬れ味': 1 }, equips: [ '5,1' ] } ],
                leg: [
                    { skillComb: { '攻撃': 5, '斬れ味': 1 }, equips: [ '5,1' ] } ],
                oma: [
                    { skillComb: { '攻撃': 4, '斬れ味': 0 }, equips: [ '4,0' ] },
                    { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ '0,2' ] } ]
            };
            var borderLine = new util.BorderLine(skillNames, bulksSet);
            var comb = { eqcombs: [], sumSC: 0 };
            var bulks = [
                { skillComb: { '攻撃': 6, '斬れ味': 0 }, equips: [ '6,0' ] },
                { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ '4,1' ] },
                { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ '3,2' ] },
                { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ '0,4' ] },
                { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] }
            ];
            got = c._combineEquip(comb, bulks, borderLine, 'body');
            exp = [
                {
                    eqcombs: [
                        { body : [ '6,0' ],
                          bodySC: { '攻撃': 6, '斬れ味': 0 } }
                    ],
                    sumSC: { '攻撃': 6, '斬れ味': 0 }
                }
            ];
            assert.deepEqual(got, exp);
        });

        it('bulks is []', function () {
            var bulksSet = {
                head: [
                    { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] } ],
                body: [
                    { skillComb: { '攻撃': 5, '斬れ味': 1 }, equips: [ '5,1' ] } ],
                arm: [
                    { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] } ],
                waist: [
                    { skillComb: { '攻撃': 5, '斬れ味': 1 }, equips: [ '5,1' ] } ],
                leg: [
                    { skillComb: { '攻撃': 6, '斬れ味': 0 }, equips: [ '6,0' ] } ],
                oma: [
                    { skillComb: { '攻撃': 4, '斬れ味': 0 }, equips: [ '4,0' ] },
                    { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ '0,2' ] } ]
            };
            var borderLine = new util.BorderLine(skillNames, bulksSet);
            var comb = {
                eqcombs: [
                    { head : [ '1,3' ],
                      body : [ '5,1' ],
                      arm  : [ '1,3' ],
                      waist: [ '5,1' ],
                      leg  : [ '6,0' ],
                      bodySC: { '攻撃': 5, '斬れ味': 1 } }
                ],
                sumSC: { '攻撃': 18, '斬れ味': 8 }
            };
            got = c._combineEquip(comb, [], borderLine, 'weapon');
            exp = [
                {
                    eqcombs: [
                        { head : [ '1,3' ],
                          body : [ '5,1' ],
                          arm  : [ '1,3' ],
                          waist: [ '5,1' ],
                          leg  : [ '6,0' ],
                          weapon: [],
                          bodySC: { '攻撃': 5, '斬れ味': 1 } }
                    ],
                    sumSC: { '攻撃': 18, '斬れ味': 8 }
                }
            ];
            assert.deepEqual(got, exp);
        });
    });

    describe('_compress', function () {
        var c = new Combinator();

        it('compress', function () {
            var combs = [
                { eqcombs: [ 'eqcomb1' ], sumSC: { a: 2, b: 0 } },
                { eqcombs: [ 'eqcomb1' ], sumSC: { a: 0, b: 2 } },
                { eqcombs: [ 'eqcomb2' ], sumSC: { a: 2, b: 0 } },
                { eqcombs: [ 'eqcomb2' ], sumSC: { a: 0, b: 1 } }
            ];
            got = c._compress(combs);
            exp = [
                { eqcombs: [ 'eqcomb1', 'eqcomb2' ], sumSC: { a: 2, b: 0 } },
                { eqcombs: [ 'eqcomb1' ], sumSC: { a: 0, b: 2 } },
                { eqcombs: [ 'eqcomb2' ], sumSC: { a: 0, b: 1 } }
            ];
            assert.deepEqual(got, exp);
        });

        it('within null', function () {
            var combs = [
                { eqcombs: [], sumSC: null },
                { eqcombs: [], sumSC: { a: 1 } }
            ];
            got = c._compress(combs);
            exp = [
                { eqcombs: [], sumSC: null },
                { eqcombs: [], sumSC: { a: 1 } }
            ];
            assert.deepEqual(got, exp);
        });
    });

    describe('_sortCombs', function () {
        var c = new Combinator();

        it('sort', function () {
            var combs = [
                { sumSC: { a: 1, b: 0 } },
                { sumSC: { a: 0, b: 2 } },
                { sumSC: { a: 3, b: 0 } },
                { sumSC: { a: 1, b: 1 } },
                { sumSC: null },
                { sumSC: { a: 2, b: 0 } }
            ];
            got = c._sortCombs(combs);
            exp = [
                { sumSC: { a: 3, b: 0 } },
                { sumSC: { a: 0, b: 2 } },
                { sumSC: { a: 1, b: 1 } },
                { sumSC: { a: 2, b: 0 } },
                { sumSC: { a: 1, b: 0 } },
                { sumSC: null }
            ];
            assert.deepEqual(got, exp, 'sort');
        });
    });
});
