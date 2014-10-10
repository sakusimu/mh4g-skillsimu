'use strict';
var assert = require('power-assert'),
    Combinator = require('../../../lib/deco/combinator.js'),
    myapp = require('../../../test/lib/driver-myapp.js');

describe('40_deco/20_combinator', function () {
    var got, exp;

    beforeEach(function () {
        myapp.initialize();
    });

    it('require', function () {
        assert(typeof Combinator === 'function', 'is function');
    });

    it('new', function () {
        got = new Combinator();
        assert(typeof got === 'object', 'is object');
        assert(typeof got.initialize === 'function', 'has initialize()');
    });

    describe('_newComb', function () {
        var c = new Combinator();

        it('new', function () {
            var comb = {
                decombs: [
                    { head : { decos: [ '斬鉄珠【１】' ], slot: 1,
                               skillComb: { '攻撃': 0, '斬れ味': 1 } },
                      body : { decos: [ '攻撃珠【１】' ], slot: 1,
                               skillComb: { '攻撃': 1, '斬れ味': 0 } } },
                    { head : { decos: [ '攻撃珠【１】' ], slot: 1,
                               skillComb: { '攻撃': 1, '斬れ味': 0 } },
                      body : { decos: [ '斬鉄珠【１】' ], slot: 1,
                               skillComb: { '攻撃': 0, '斬れ味': 1 } } }
                ],
                sumSC: { '攻撃': 1, '斬れ味': 1 }
            };
            var bulk = {
                skillComb: { '攻撃': 1, '斬れ味': 1 },
                decos: [ '攻撃珠【１】', '斬鉄珠【１】' ],
                slot: 2
            };
            got = c._newComb(comb, bulk, 'arm');
            exp = {
                decombs: [
                    { head : { decos: [ '斬鉄珠【１】' ], slot: 1,
                               skillComb: { '攻撃': 0, '斬れ味': 1 } },
                      body : { decos: [ '攻撃珠【１】' ], slot: 1,
                               skillComb: { '攻撃': 1, '斬れ味': 0 } },
                      arm  : { decos: [ '攻撃珠【１】', '斬鉄珠【１】' ], slot: 2,
                               skillComb: { '攻撃': 1, '斬れ味': 1 } } },
                    { head : { decos: [ '攻撃珠【１】' ], slot: 1,
                               skillComb: { '攻撃': 1, '斬れ味': 0 } },
                      body : { decos: [ '斬鉄珠【１】' ], slot: 1,
                               skillComb: { '攻撃': 0, '斬れ味': 1 } },
                      arm  : { decos: [ '攻撃珠【１】', '斬鉄珠【１】' ], slot: 2,
                               skillComb: { '攻撃': 1, '斬れ味': 1 } } }
                ],
                sumSC: { '攻撃': 2, '斬れ味': 2 }
            };
            assert.deepEqual(got, exp, 'new comb');

            got = comb;
            exp = {
                decombs: [
                    { head : { decos: [ '斬鉄珠【１】' ], slot: 1,
                               skillComb: { '攻撃': 0, '斬れ味': 1 } },
                      body : { decos: [ '攻撃珠【１】' ], slot: 1,
                               skillComb: { '攻撃': 1, '斬れ味': 0 } } },
                    { head : { decos: [ '攻撃珠【１】' ], slot: 1,
                               skillComb: { '攻撃': 1, '斬れ味': 0 } },
                      body : { decos: [ '斬鉄珠【１】' ], slot: 1,
                               skillComb: { '攻撃': 0, '斬れ味': 1 } } }
                ],
                sumSC: { '攻撃': 1, '斬れ味': 1 }
            };
            assert.deepEqual(got, exp, 'stable');
        });

        it('bulk is null', function () {
            var comb = {
                decombs: [
                    { head : { decos: [ '斬鉄珠【１】' ], slot: 1,
                               skillComb: { '攻撃': 0, '斬れ味': 1 } },
                      body : { decos: [ '攻撃珠【１】' ], slot: 1,
                               skillComb: { '攻撃': 1, '斬れ味': 0 } } },
                    { head : { decos: [ '攻撃珠【１】' ], slot: 1,
                               skillComb: { '攻撃': 1, '斬れ味': 0 } },
                      body : { decos: [ '斬鉄珠【１】' ], slot: 1,
                               skillComb: { '攻撃': 0, '斬れ味': 1 } } }
                ],
                sumSC: { '攻撃': 1, '斬れ味': 1 }
            };
            got = c._newComb(comb, null, 'arm');
            exp = {
                decombs: [
                    { head : { decos: [ '斬鉄珠【１】' ], slot: 1,
                               skillComb: { '攻撃': 0, '斬れ味': 1 } },
                      body : { decos: [ '攻撃珠【１】' ], slot: 1,
                               skillComb: { '攻撃': 1, '斬れ味': 0 } },
                      arm  : { decos: [], slot: 0, skillComb: {} } },
                    { head : { decos: [ '攻撃珠【１】' ], slot: 1,
                               skillComb: { '攻撃': 1, '斬れ味': 0 } },
                      body : { decos: [ '斬鉄珠【１】' ], slot: 1,
                               skillComb: { '攻撃': 0, '斬れ味': 1 } },
                      arm  : { decos: [], slot: 0, skillComb: {} } }
                ],
                sumSC: { '攻撃': 1, '斬れ味': 1 }
            };
            assert.deepEqual(got, exp);
        });

        it('comb is null', function () {
            var bulk = {
                skillComb: { '攻撃': 1, '斬れ味': 1 },
                decos: [ '攻撃珠【１】', '斬鉄珠【１】' ],
                slot: 2
            };
            got = c._newComb(null, bulk, 'body');
            exp = {
                decombs: [
                    { body : { decos: [ '攻撃珠【１】', '斬鉄珠【１】' ], slot: 2,
                               skillComb: { '攻撃': 1, '斬れ味': 1 } } }
                ],
                sumSC: { '攻撃': 1, '斬れ味': 1 }
            };
            assert.deepEqual(got, exp);
        });
    });
});
