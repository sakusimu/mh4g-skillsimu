'use strict';
var assert = require('power-assert'),
    Combinator = require('../../../lib/equip/combinator.js'),
    myapp = require('../../../test/lib/driver-myapp.js');

describe('30_equip/20_combinator', function () {
    var got, exp;

    beforeEach(function () {
        myapp.initialize();
    });

    it('require', function () {
        assert(typeof Combinator === 'function', 'is function');
    });

    it('new', function () {
        var c = new Combinator();
        assert(typeof c === 'object', 'is object');
        assert(typeof c.initialize === 'function', 'has initialize()');
    });

    describe('_sortBulks', function () {
        var c = new Combinator();

        it('sort', function () {
            var bulks = [
                { skillComb: { '攻撃': 3, '斬れ味': 2 } },
                { skillComb: { '攻撃': 0, '斬れ味': 0 } },
                { skillComb: { '攻撃': 0, '斬れ味': 1 } },
                { skillComb: { '攻撃': -2, '斬れ味': 2 } },
                { skillComb: { '攻撃': 0, '斬れ味': 6 } },
                { skillComb: { '攻撃': 5, '斬れ味': 0 } },
                { skillComb: { '攻撃': 1, '斬れ味': 3 } },
                { skillComb: { '攻撃': 6, '斬れ味': 6 } },
                { skillComb: { '攻撃': 1, '斬れ味': -3 } },
                { skillComb: { '攻撃': 1, '斬れ味': 0 } },
                { skillComb: { '攻撃': 4, '斬れ味': 1 } }
            ];
            got = c._sortBulks(bulks);
            exp = [
                { skillComb: { '攻撃': 6, '斬れ味': 6 } },
                { skillComb: { '攻撃': 0, '斬れ味': 6 } },
                { skillComb: { '攻撃': 3, '斬れ味': 2 } },
                { skillComb: { '攻撃': 5, '斬れ味': 0 } },
                { skillComb: { '攻撃': 4, '斬れ味': 1 } },
                { skillComb: { '攻撃': 1, '斬れ味': 3 } },
                { skillComb: { '攻撃': 0, '斬れ味': 1 } },
                { skillComb: { '攻撃': 1, '斬れ味': 0 } },
                { skillComb: { '攻撃': 0, '斬れ味': 0 } },
                { skillComb: { '攻撃': -2, '斬れ味': 2 } },
                { skillComb: { '攻撃': 1, '斬れ味': -3 } }
            ];
            assert.deepEqual(got, exp);
        });

        it('torsoUp', function () {
            var bulks = [
                { skillComb: { '攻撃': 3, '斬れ味': 2 } },
                { skillComb: { '攻撃': 0, '斬れ味': 0 } },
                { skillComb: { '攻撃': 1, '斬れ味': 3 } },
                { skillComb: { '胴系統倍加': 1 } },
                { skillComb: { '攻撃': 4, '斬れ味': 1 } }
            ];
            got = c._sortBulks(bulks);
            exp = [
                { skillComb: { '胴系統倍加': 1 } },
                { skillComb: { '攻撃': 3, '斬れ味': 2 } },
                { skillComb: { '攻撃': 4, '斬れ味': 1 } },
                { skillComb: { '攻撃': 1, '斬れ味': 3 } },
                { skillComb: { '攻撃': 0, '斬れ味': 0 } }
            ];
            assert.deepEqual(got, exp);
        });
    });

    describe('_makeBulksSetWithSlot0', function () {
        var c = new Combinator();

        it('make', function () {
            var bulks = c._sortBulks([
                { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ '3,2' ] },
                { skillComb: { '攻撃': 5, '斬れ味': 0 }, equips: [ '5,0' ] },
                { skillComb: { '攻撃': 0, '斬れ味': 1 }, equips: [ '0,1' ] },
                { skillComb: { '攻撃': 0, '斬れ味': 6 }, equips: [ '0,6' ] },
                { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] },
                { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ '1,0' ] },
                { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ '4,1' ] }
            ]);
            var sp0 = [
                { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ '0,0' ] }
            ];
            var torsoUp = [
                { skillComb: { '胴系統倍加': 1 }, equips: [ 'torsoUp' ] }
            ];

            var bulksSet = {
                head : bulks,
                body : bulks.concat(sp0),
                arm  : bulks,
                waist: bulks.concat(sp0),
                leg  : torsoUp.concat(bulks),
                // weapon: undefined
                oma  : null
            };

            got = c._makeBulksSetWithSp0(bulksSet);
            exp = [
                { head : bulks,
                  body : sp0,
                  arm  : bulks,
                  waist: bulks.concat(sp0),
                  leg  : torsoUp.concat(bulks),
                  weapon: null, oma: null },
                { head : bulks,
                  body : bulks.concat(sp0),
                  arm  : bulks,
                  waist: sp0,
                  leg  : torsoUp.concat(bulks),
                  weapon: null, oma: null }
            ];
            assert.deepEqual(got, exp);
        });
    });

    describe('_newComb', function () {
        var c = new Combinator();

        it('new', function () {
            var comb = {
                eqcombs: [
                    { head : [ 'head1' ],
                      body : [ 'body1' ],
                      bodySC: { '攻撃': 1, '斬れ味': 0 } },
                    { head : [ 'head2' ],
                      body : [ 'body2' ],
                      bodySC: { '攻撃': 0, '斬れ味': 1 } }
                ],
                sumSC: { '攻撃': 1, '斬れ味': 1 }
            };
            var bulk = { skillComb: { '攻撃': 1, '斬れ味': 1 }, equips: [ 'arm1' ] };
            got = c._newComb(comb, bulk, 'arm');
            exp = {
                eqcombs: [
                    { head : [ 'head1' ],
                      body : [ 'body1' ],
                      arm  : [ 'arm1' ],
                      bodySC: { '攻撃': 1, '斬れ味': 0 } },
                    { head : [ 'head2' ],
                      body : [ 'body2' ],
                      arm  : [ 'arm1' ],
                      bodySC: { '攻撃': 0, '斬れ味': 1 } }
                ],
                sumSC: { '攻撃': 2, '斬れ味': 2 }
            };
            assert.deepEqual(got, exp, 'new comb');

            got = comb;
            exp = {
                eqcombs: [
                    { head : [ 'head1' ],
                      body : [ 'body1' ],
                      bodySC: { '攻撃': 1, '斬れ味': 0 } },
                    { head : [ 'head2' ],
                      body : [ 'body2' ],
                      bodySC: { '攻撃': 0, '斬れ味': 1 } }
                ],
                sumSC: { '攻撃': 1, '斬れ味': 1 }
            };
            assert.deepEqual(got, exp, 'stable');
        });

        it('bulk is null', function () {
            var comb = {
                eqcombs: [
                    { head : [ 'head1' ],
                      body : [ 'body1' ],
                      bodySC: { '攻撃': 1, '斬れ味': 0 } },
                    { head : [ 'head2' ],
                      body : [ 'body2' ],
                      bodySC: { '攻撃': 0, '斬れ味': 1 } }
                ],
                sumSC: { '攻撃': 1, '斬れ味': 1 }
            };
            got = c._newComb(comb, null, 'arm');
            exp = {
                eqcombs: [
                    { head : [ 'head1' ],
                      body : [ 'body1' ],
                      arm  : [],
                      bodySC: { '攻撃': 1, '斬れ味': 0 } },
                    { head : [ 'head2' ],
                      body : [ 'body2' ],
                      arm  : [],
                      bodySC: { '攻撃': 0, '斬れ味': 1 } }
                ],
                sumSC: { '攻撃': 1, '斬れ味': 1 }
            };
            assert.deepEqual(got, exp);
        });

        it('comb is null', function () {
            var bulk = { skillComb: { '攻撃': 1, '斬れ味': 1 }, equips: [ 'body1' ] };
            got = c._newComb(null, bulk, 'body');
            exp = {
                eqcombs: [
                    { body : [ 'body1' ],
                      bodySC: { '攻撃': 1, '斬れ味': 1 } }
                ],
                sumSC: { '攻撃': 1, '斬れ味': 1 }
            };
            assert.deepEqual(got, exp);
        });
    });
});
