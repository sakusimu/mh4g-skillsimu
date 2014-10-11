'use strict';
var assert = require('power-assert'),
    Normalizer = require('../../../lib/deco/normalizer.js'),
    util = require('../../../lib/util.js'),
    myapp = require('../../../test/lib/driver-myapp.js');

describe('40_deco/10_normalizer', function () {
    var got, exp;

    beforeEach(function () {
        myapp.initialize();
    });

    it('require', function () {
        assert(typeof Normalizer === 'function', 'is function');
    });

    it('new', function () {
        got = new Normalizer();
        assert(typeof got === 'object', 'is object');
        assert(typeof got.initialize === 'function', 'has initialize()');
    });

    describe('_normalize1', function () {
        var n = new Normalizer();

        it('slot0', function () {
            var decoCombsBySlot = util.deco.combs([ '研ぎ師' ]);
            var equip = { name: 'slot0', slot: 0, skillComb: { '攻撃': 1, '斬れ味': 1 } };
            got = n._normalize1(decoCombsBySlot, equip);
            exp = [ { decos: [], slot: 0, skillComb: {} } ];
            assert.deepEqual(got, exp);
        });

        it("slot1: [ '研ぎ師' ]", function () {
            var decoCombsBySlot = util.deco.combs([ '研ぎ師' ]);
            var equip = { name: 'slot1', slot: 1, skillComb: { '攻撃': 1, '斬れ味': 1 } };
            got = n._normalize1(decoCombsBySlot, equip);
            exp = [
                { decos: [], slot: 0, skillComb: {} },
                { decos: [ '研磨珠【１】' ], slot: 1, skillComb: { '研ぎ師': 2 } }
            ];
            assert.deepEqual(got, exp);
        });

        it("slot1: [ '匠' ]", function () {
            var decoCombsBySlot = util.deco.combs([ '匠' ]);
            var equip = { name: 'slot1', slot: 1, skillComb: { '攻撃': 1, '斬れ味': 1 } };
            got = n._normalize1(decoCombsBySlot, equip);
            exp = [ { decos: [], slot: 0, skillComb: {} } ];
            assert.deepEqual(got, exp);
        });

        it("slot3: [ '匠', '研ぎ師' ]", function () {
            var decoCombsBySlot = util.deco.combs([ '匠', '研ぎ師' ]);
            var equip = { name: 'slot3', slot: 3, skillComb: { '攻撃': 1, '斬れ味': 1 } };
            got = n._normalize1(decoCombsBySlot, equip);
            exp = [
                { decos: [], slot: 0, skillComb: {} },
                { decos: [ '研磨珠【１】' ], slot: 1, skillComb: { '研ぎ師': 2 } },
                { decos: [ '研磨珠【１】', '研磨珠【１】' ],
                  slot: 2, skillComb: { '研ぎ師': 4 } },
                { decos: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '斬れ味': -1 } },
                { decos: [ '研磨珠【１】', '研磨珠【１】', '研磨珠【１】' ],
                  slot: 3, skillComb: { '研ぎ師': 6 } },
                { decos: [ '匠珠【２】', '研磨珠【１】' ],
                  slot: 3, skillComb: { '匠': 1, '斬れ味': -1, '研ぎ師': 2 } },
                { decos: [ '匠珠【３】' ], slot: 3, skillComb: { '匠': 2, '斬れ味': -2 } }
            ];
            assert.deepEqual(got, exp);
        });

        it("slot3: [ '匠' ]", function () {
            var decoCombsBySlot = util.deco.combs([ '匠' ]);
            var equip = { name: 'slot3', slot: 3, skillComb: { '攻撃': 1, '斬れ味': 1 } };
            got = n._normalize1(decoCombsBySlot, equip);
            exp = [
                { decos: [], slot: 0, skillComb: {} },
                { decos: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '斬れ味': -1 } },
                { decos: [ '匠珠【２】' ], slot: 3, skillComb: { '匠': 1, '斬れ味': -1 } },
                { decos: [ '匠珠【３】' ], slot: 3, skillComb: { '匠': 2, '斬れ味': -2 } }
            ];
            assert.deepEqual(got, exp);
        });

        it('torsoUp', function () {
            var decoCombsBySlot = util.deco.combs([ '匠' ]);
            var equip = { name: 'torsoUp', slot: 0, skillComb: { '胴系統倍加': 1 } };
            got = n._normalize1(decoCombsBySlot, equip);
            exp = [ { decos: [], slot: 0, skillComb: { '胴系統倍加': 1 } } ];
            assert.deepEqual(got, exp);
        });

        it("equip is null", function () {
            var decoCombsBySlot = util.deco.combs([ '匠' ]);
            got = n._normalize1(decoCombsBySlot, null);
            exp = [];
            assert.deepEqual(got, exp);
        });

        it('equip.skillComb is {}', function () {
            var decoCombsBySlot = util.deco.combs([ '匠' ]);
            var equip = { name: 'slot3', slot: 3, skillComb: {} };
            got = n._normalize1(decoCombsBySlot, equip);
            exp = [
                { decos: [], slot: 0, skillComb: {} },
                { decos: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '斬れ味': -1 } },
                { decos: [ '匠珠【２】' ], slot: 3, skillComb: { '匠': 1, '斬れ味': -1 } },
                { decos: [ '匠珠【３】' ], slot: 3, skillComb: { '匠': 2, '斬れ味': -2 } }
            ];
            assert.deepEqual(got, exp);
        });
    });

    describe('_normalizer2', function () {
        var n = new Normalizer();

        it('normalize', function () {
            var bulks = [
                { decos: [], slot: 0, skillComb: {} },
                { decos: [ '研磨珠【１】' ], slot: 1, skillComb: { '研ぎ師': 2 } },
                { decos: [ '研磨珠【１】', '研磨珠【１】' ],
                  slot: 2, skillComb: { '研ぎ師': 4 } },
                { decos: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '斬れ味': -1 } },
                { decos: [ '研磨珠【１】', '研磨珠【１】', '研磨珠【１】' ],
                  slot: 3, skillComb: { '研ぎ師': 6 } },
                { decos: [ '匠珠【２】', '研磨珠【１】' ],
                  slot: 3, skillComb: { '匠': 1, '斬れ味': -1, '研ぎ師': 2 } },
                { decos: [ '匠珠【３】' ], slot: 3, skillComb: { '匠': 2, '斬れ味': -2 } }
            ];
            got = n._normalize2(bulks, [ '匠', '研ぎ師' ]);
            exp = [
                { decos: [], slot: 0, skillComb: { '匠': 0, '研ぎ師': 0 } },
                { decos: [ '研磨珠【１】' ], slot: 1, skillComb: { '匠': 0, '研ぎ師': 2 } },
                { decos: [ '研磨珠【１】', '研磨珠【１】' ],
                  slot: 2, skillComb: { '匠': 0, '研ぎ師': 4 } },
                { decos: [ '匠珠【２】' ], slot: 2, skillComb: { '匠': 1, '研ぎ師': 0 } },
                { decos: [ '研磨珠【１】', '研磨珠【１】', '研磨珠【１】' ],
                  slot: 3, skillComb: { '匠': 0, '研ぎ師': 6 } },
                { decos: [ '匠珠【２】', '研磨珠【１】' ],
                  slot: 3, skillComb: { '匠': 1, '研ぎ師': 2 } },
                { decos: [ '匠珠【３】' ], slot: 3, skillComb: { '匠': 2, '研ぎ師': 0 } }
            ];
            assert.deepEqual(got, exp);
        });
    });
});
