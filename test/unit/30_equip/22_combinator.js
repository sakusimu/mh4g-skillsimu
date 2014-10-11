'use strict';
var assert = require('power-assert'),
    Combinator = require('../../../lib/equip/combinator.js'),
    myapp = require('../../../test/lib/driver-myapp.js');

describe('30_equip/22_combinator', function () {
    var got, exp;

    beforeEach(function () {
        myapp.initialize();
    });

    describe('_combine', function () {
        var c = new Combinator();

        it('combine', function () {
            var skillNames = [ '攻撃力UP【大】', '斬れ味レベル+1', '耳栓' ];
            var bulksSet = {
                body: [
                    { skillComb: { '攻撃': 7, '匠': 0, '聴覚保護': 1 }, equips: [ '7,0,1' ] },
                    { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 2 }, equips: [ '4,2,2' ] },
                    { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, equips: [ '5,2,1' ] } ],
                head: [
                    { skillComb: { '攻撃': 7, '匠': 1, '聴覚保護': 1 }, equips: [ '7,1,1' ] },
                    { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, equips: [ '5,2,1' ] },
                    { skillComb: { '攻撃': 6, '匠': 2, '聴覚保護': 0 }, equips: [ '6,2,0' ] } ],
                arm: [
                    { skillComb: { '攻撃': 6, '匠': 2, '聴覚保護': 0 }, equips: [ '6,2,0' ] },
                    { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 }, equips: [ '3,3,1' ] },
                    { skillComb: { '攻撃': 4, '匠': 3, '聴覚保護': 0 }, equips: [ '4,3,0' ] } ],
                waist: [
                    { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, equips: [ '5,2,1' ] },
                    { skillComb: { '攻撃': 2, '匠': 3, '聴覚保護': 2 }, equips: [ '2,3,2' ] },
                    { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 }, equips: [ '3,3,1' ] } ],
                leg: [
                    { skillComb: { '攻撃': 6, '匠': 0, '聴覚保護': 4 }, equips: [ '6,0,4' ] },
                    { skillComb: { '攻撃': 3, '匠': 2, '聴覚保護': 4 }, equips: [ '3,2,4' ] },
                    { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 3 }, equips: [ '4,2,3' ] } ]
            };
            got = c._combine(skillNames, bulksSet);
            exp = [
                {
                    eqcombs: [
                        { body  : [ '4,2,2' ],
                          head  : [ '5,2,1' ],
                          arm   : [ '3,3,1' ],
                          waist : [ '2,3,2' ],
                          leg   : [ '6,0,4' ],
                          weapon: [],
                          oma   : [],
                          bodySC: { '攻撃': 4, '匠': 2, '聴覚保護': 2 } }
                    ],
                    sumSC: { '攻撃': 20, '匠': 10, '聴覚保護': 10 }
                }
            ];
            assert.deepEqual(got, exp);
        });

        it('body is [] and torsoUp', function () {
            var skillNames = [ '攻撃力UP【大】', '斬れ味レベル+1', '耳栓' ];
            var bulksSet = {
                body: [],
                head: [
                    { skillComb: { '攻撃': 7, '匠': 1, '聴覚保護': 1 }, equips: [ '7,1,1' ] },
                    { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, equips: [ '5,2,1' ] },
                    { skillComb: { '攻撃': 6, '匠': 2, '聴覚保護': 0 }, equips: [ '6,2,0' ] } ],
                arm: [
                    { skillComb: { '攻撃': 6, '匠': 2, '聴覚保護': 0 }, equips: [ '6,2,0' ] },
                    { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 }, equips: [ '3,3,1' ] },
                    { skillComb: { '攻撃': 4, '匠': 3, '聴覚保護': 0 }, equips: [ '4,3,0' ] } ],
                waist: [
                    { skillComb: { '胴系統倍加': 1 }, equips: [ 'torsoUp' ] } ],
                leg: [
                    { skillComb: { '攻撃': 7, '匠': 0, '聴覚保護': 1 }, equips: [ '7,0,1' ] },
                    { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 2 }, equips: [ '4,2,2' ] },
                    { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, equips: [ '5,2,1' ] } ],
                weapon: [
                    { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, equips: [ '5,2,1' ] },
                    { skillComb: { '攻撃': 2, '匠': 3, '聴覚保護': 2 }, equips: [ '2,3,2' ] },
                    { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 }, equips: [ '3,3,1' ] } ],
                oma: [
                    { skillComb: { '攻撃': 6, '匠': 0, '聴覚保護': 4 }, equips: [ '6,0,4' ] },
                    { skillComb: { '攻撃': 3, '匠': 2, '聴覚保護': 4 }, equips: [ '3,2,4' ] },
                    { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 3 }, equips: [ '4,2,3' ] } ]
            };
            got = c._combine(skillNames, bulksSet);
            exp = [
                {
                    eqcombs: [
                        { body  : [],
                          head  : [ '5,2,1' ],
                          arm   : [ '3,3,1' ],
                          waist : [ 'torsoUp' ],
                          leg   : [ '4,2,2' ],
                          weapon: [ '2,3,2' ],
                          oma   : [ '6,0,4' ],
                          bodySC: {} }
                    ],
                    sumSC: { '攻撃': 20, '匠': 10, '聴覚保護': 10 }
                }
            ];
            assert.deepEqual(got, exp);
        });
    });

    describe('_combineUsedSp0', function () {
        var c = new Combinator();

        it('combine', function () {
            var skillNames = [ '攻撃力UP【大】', '業物' ];
            var bulksSet = {
                head: [
                    { skillComb: { '攻撃': 4, '斬れ味': 2 }, equips: [ '4,2' ] },
                    { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ '0,0' ] } ],
                body: [
                    { skillComb: { '攻撃': 8, '斬れ味': 0 }, equips: [ '8,0' ] },
                    { skillComb: { '攻撃': 6, '斬れ味': 2 }, equips: [ '6,2' ] } ],
                arm: [
                    { skillComb: { '攻撃': 4, '斬れ味': 2 }, equips: [ '4,2' ] },
                    { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ '0,0' ] } ],
                waist: [
                    { skillComb: { '攻撃': 8, '斬れ味': 0 }, equips: [ '8,0' ] },
                    { skillComb: { '攻撃': 6, '斬れ味': 2 }, equips: [ '6,2' ] } ],
                leg: [
                    { skillComb: { '攻撃': 4, '斬れ味': 4 }, equips: [ '4,4' ] },
                    { skillComb: { '攻撃': 5, '斬れ味': 3 }, equips: [ '5,3' ] } ]
            };
            got = c._combineUsedSp0(skillNames, bulksSet);
            exp = [
                {
                    eqcombs: [
                        { body  : [ '6,2' ],
                          head  : [ '0,0' ],
                          arm   : [ '4,2' ],
                          waist : [ '6,2' ],
                          leg   : [ '4,4' ],
                          weapon: [],
                          oma   : [],
                          bodySC: { '攻撃': 6, '斬れ味': 2 } }
                    ],
                    sumSC: { '攻撃': 20, '斬れ味': 10 }
                }
                // 先に頭にポイント 0 を使った組み合わせが見つかるので↓は出てこない
                //{
                //    eqcombs: [
                //        { body  : [ '6,2' ],
                //          head  : [ '4,2' ],
                //          arm   : [ '0,0' ],
                //          waist : [ '6,2' ],
                //          leg   : [ '4,4' ],
                //          weapon: [],
                //          oma   : [],
                //          bodySC: { '攻撃': 6, '斬れ味': 2 } }
                //    ],
                //    sumSC: { '攻撃': 20, '斬れ味': 10 }
                //}
            ];
            assert.deepEqual(got, exp);
        });
    });

    describe('_brushUp', function () {
        var c = new Combinator();

        it('brush up', function () {
            var combs = [
                {
                    eqcombs: [
                        { head  : [ 'head1' ],
                          body  : [ 'body1' ],
                          arm   : [ 'arm1' ],
                          waist : [ 'waist1' ],
                          leg   : [ 'leg1' ],
                          weapon: [ 'weapon1' ],
                          oma   : [ 'oma1' ],
                          bodySC: { '攻撃': 1, '斬れ味': 1 } },
                        { head  : [ 'head2' ],
                          body  : [ 'body2' ],
                          arm   : [ 'arm2' ],
                          waist : [ 'waist2' ],
                          leg   : [ 'leg2' ],
                          //weapon: undefined,
                          oma   : null,
                          bodySC: {} }
                    ],
                    sumSC: {}
                },
                {
                    eqcombs: [
                        { head  : [ 'head3' ],
                          body  : [ 'body3' ],
                          arm   : [ 'arm3' ],
                          waist : [ 'waist3' ],
                          leg   : [ 'leg3' ],
                          weapon: [ 'weapon3' ],
                          oma   : [ 'oma3' ],
                          bodySC: {} }
                    ],
                    sumSC: {}
                }
            ];
            got = c._brushUp(combs);
            exp = [
                { head  : [ 'head1' ],
                  body  : [ 'body1' ],
                  arm   : [ 'arm1' ],
                  waist : [ 'waist1' ],
                  leg   : [ 'leg1' ],
                  weapon: [ 'weapon1' ],
                  oma   : [ 'oma1' ] },
                { head  : [ 'head2' ],
                  body  : [ 'body2' ],
                  arm   : [ 'arm2' ],
                  waist : [ 'waist2' ],
                  leg   : [ 'leg2' ],
                  weapon: [],
                  oma   : [] },
                { head  : [ 'head3' ],
                  body  : [ 'body3' ],
                  arm   : [ 'arm3' ],
                  waist : [ 'waist3' ],
                  leg   : [ 'leg3' ],
                  weapon: [ 'weapon3' ],
                  oma   : [ 'oma3' ] }
            ];
            assert.deepEqual(got, exp);
        });
    });
});
