'use strict';
var assert = require('power-assert'),
    BorderLine = require('../../../lib/util/border-line.js'),
    myapp = require('../../../test/lib/driver-myapp.js');

describe('20_util/06_border-line', function () {
    var got, exp;

    beforeEach(function () {
        myapp.initialize();
    });

    it('BorderLine', function () {
        assert(typeof BorderLine === 'function', 'is function');
    });

    it('new', function () {
        var bl = new BorderLine();
        assert(typeof bl === 'object', 'is object');
        assert(typeof bl.initialize === 'function', 'has initialize()');
    });

    it('_goal', function () {
        var bl = new BorderLine();

        got = bl._goal([ '攻撃力UP【大】', '業物' ]);
        exp = { '攻撃': 20, '斬れ味': 10 };
        assert.deepEqual(got, exp, "[ '攻撃力UP【大】', '業物' ]");

        got = bl._goal([ 'なまくら' ]);
        exp = { '斬れ味': -10 };
        assert.deepEqual(got, exp, "[ 'なまくら' ]");

        got = bl._goal();
        assert(got === null, 'nothing in');
        got = bl._goal(undefined);
        assert(got === null, 'undefined');
        got = bl._goal(null);
        assert(got === null, 'null');
        got = bl._goal(null);
        assert(got === null, 'null');

        try { bl._goal([ '攻撃大' ]); } catch (e) { got = e.message; }
        assert(got === 'skill not found: 攻撃大');
    });

    describe('_calcMaxEachSkillPoint', function () {
        var bl = new BorderLine();

        it('calc', function () {
            var bulksSet = {
                head: [
                    { skillComb: { 'a': 1, 'b': 0 } },
                    { skillComb: { 'a': 0, 'b': 1 } } ],
                body: [
                    { skillComb: { 'a': 1, 'b': 1 } } ],
                arm: [
                    { skillComb: { 'a': 1           } },
                    { skillComb: {         'b': 1 } } ],
                waist: [
                    { skillComb: { 'a': 1         } },
                    { skillComb: { 'a': 2         } } ],
                leg: [
                    { skillComb: { 'a': 3, 'b': 2 } },
                    { skillComb: { 'a': 5         } },
                    { skillComb: {         'b': 6 } },
                    { skillComb: { 'a': 1, 'b': 3 } },
                    { skillComb: { 'a': 4, 'b': 1 } } ],
                weapon: [
                    { skillComb: { 'a': 1         } } ],
                oma: [
                    { skillComb: {         'b': 1 } } ]
            };
            got = bl._calcMaxEachSkillPoint(bulksSet);
            exp = {
                'a': { head: 1, body: 1, arm: 1, waist: 2, leg: 5, weapon: 1, oma: 0 },
                'b': { head: 1, body: 1, arm: 1, waist: 0, leg: 6, weapon: 0, oma: 1 }
            };
            assert.deepEqual(got, exp);
        });

        it('within undefined, null, []', function () {
            var bulksSet = {
                head: [
                    { skillComb: { 'a': 1, 'b': 0 } },
                    { skillComb: { 'a': 0, 'b': 1 } } ],
                body: [
                    { skillComb: { 'a': 1, 'b': 1 } } ],
                arm: null,
                waist: [],
                weapon: [
                    { skillComb: { 'c': 1 } } ]
            };
            got = bl._calcMaxEachSkillPoint(bulksSet);
            exp = {
                'a': { head: 1, body: 1, arm: 0, waist: 0, leg: 0, weapon: 0, oma: 0 },
                'b': { head: 1, body: 1, arm: 0, waist: 0, leg: 0, weapon: 0, oma: 0 },
                'c': { head: 0, body: 0, arm: 0, waist: 0, leg: 0, weapon: 1, oma: 0 }
            };
            assert.deepEqual(got, exp);
        });

        it('torsoUp', function () {
            var bulksSet = {
                head: [
                    { skillComb: { 'a': 1, 'b': 0 } },
                    { skillComb: { 'a': 0, 'b': 1 } },
                    { skillComb: { '胴系統倍化': 1 } } ],
                body: [
                    { skillComb: { 'a': 2, 'b': 2 } } ],
                arm: [
                    { skillComb: { 'a': 1, 'b': 0 } },
                    { skillComb: {         'b': 2 } },
                    { skillComb: { 'a': 5, 'b': 0 } },
                    { skillComb: { '胴系統倍化': 1 } } ],
                waist: [
                    { skillComb: { 'a': 1, 'b': 0 } },
                    { skillComb: {         'b': 3 } },
                    // ↓胴系統倍化があるので、他のスキルのポイントは無視される
                    { skillComb: { 'a': 9, 'b': 0, '胴系統倍化': 1 } } ],
                leg: [
                    { skillComb: { '胴系統倍化': 1 } } ]
            };
            got = bl._calcMaxEachSkillPoint(bulksSet);
            exp = {
                'a': { head: 2, body: 2, arm: 5, waist: 2, leg: 2, weapon: 0, oma: 0 },
                'b': { head: 2, body: 2, arm: 2, waist: 3, leg: 2, weapon: 0, oma: 0 }
            };
            assert.deepEqual(got, exp);
        });

        it('torsoUp: body is null', function () {
            var bulksSet = {
                head: [
                    { skillComb: { 'a': 1, 'b': 0 } },
                    { skillComb: { 'a': 0, 'b': 1 } },
                    { skillComb: { '胴系統倍化': 1 } } ],
                body: null,
                arm: [
                    { skillComb: { 'a': 1, 'b': 0 } },
                    { skillComb: {         'b': 2 } },
                    { skillComb: { 'a': 5, 'b': 0 } },
                    { skillComb: { '胴系統倍化': 1 } } ],
                waist: [
                    { skillComb: { 'a': 1, 'b': 0 } },
                    { skillComb: {         'b': 3 } },
                    // ↓胴系統倍化があるので、他のスキルのポイントは無視される
                    { skillComb: { 'a': 9, 'b': 0, '胴系統倍化': 1 } } ],
                leg: [
                    { skillComb: { '胴系統倍化': 1 } } ]
            };
            got = bl._calcMaxEachSkillPoint(bulksSet);
            exp = {
                'a': { head: 1, body: 0, arm: 5, waist: 1, leg: 0, weapon: 0, oma: 0 },
                'b': { head: 1, body: 0, arm: 2, waist: 3, leg: 0, weapon: 0, oma: 0 }
            };
            assert.deepEqual(got, exp);
        });

        it('null or etc', function () {
            got = bl._calcMaxEachSkillPoint();
            assert.deepEqual(got, null, 'nothing in');
            got = bl._calcMaxEachSkillPoint(undefined);
            assert.deepEqual(got, null, 'undefined');
            got = bl._calcMaxEachSkillPoint(null);
            assert.deepEqual(got, null, 'null');
        });
    });

    describe('_calcMaxSumSkillPoint', function () {
        var bl = new BorderLine();

        it('calc', function () {
            var bulksSet = {
                head: [
                    { skillComb: { 'a': 1, 'b': 0 } },
                    { skillComb: { 'a': 0, 'b': 1 } } ],
                body: [
                    { skillComb: { 'a': 1, 'b': 1 } } ],
                arm: [
                    { skillComb: { 'a': 1           } },
                    { skillComb: {         'b': 1 } } ],
                waist: [
                    { skillComb: { 'a': 1         } },
                    { skillComb: { 'a': 2         } } ],
                leg: [
                    { skillComb: { 'a': 3, 'b': 2 } },
                    { skillComb: { 'a': 5         } },
                    { skillComb: {         'b': 6 } },
                    { skillComb: { 'a': 1, 'b': 3 } },
                    { skillComb: { 'a': 4, 'b': 1 } } ],
                weapon: [
                    { skillComb: { 'a': 1         } } ],
                oma: [
                    { skillComb: {         'b': 1 } } ]
            };
            got = bl._calcMaxSumSkillPoint(bulksSet);
            exp = { head: 1, body: 2, arm: 1, waist: 2, leg: 6, weapon: 1, oma: 1 };
            assert.deepEqual(got, exp);
        });

        it('within undefined, null, []', function () {
            var bulksSet = {
                head: [
                    { skillComb: { 'a': 1, 'b': 0 } },
                    { skillComb: { 'a': 0, 'b': 1 } } ],
                body: [
                    { skillComb: { 'a': 1, 'b': 1 } } ],
                arm: null,
                waist: [],
                weapon: [
                    { skillComb: { 'c': 1 } } ]
            };
            got = bl._calcMaxSumSkillPoint(bulksSet);
            exp = { head: 1, body: 2, arm: 0, waist: 0, leg: 0, weapon: 1, oma: 0 };
            assert.deepEqual(got, exp);
        });

        it('torsoUp', function () {
            var bulksSet = {
                head: [
                    { skillComb: { 'a': 1, 'b': 0 } },
                    { skillComb: { 'a': 0, 'b': 1 } },
                    { skillComb: { '胴系統倍化': 1 } } ],
                body: [
                    { skillComb: { 'a': 2, 'b': 2 } } ],
                arm: [
                    { skillComb: { 'a': 1, 'b': 0 } },
                    { skillComb: {         'b': 2 } },
                    { skillComb: { 'a': 5, 'b': 0 } },
                    { skillComb: { '胴系統倍化': 1 } } ],
                waist: [
                    { skillComb: { 'a': 1, 'b': 0 } },
                    { skillComb: {         'b': 3 } },
                    // ↓胴系統倍化があるので、他のスキルのポイントは無視される
                    { skillComb: { 'a': 9, 'b': 0, '胴系統倍化': 1 } } ],
                leg: [
                    { skillComb: { '胴系統倍化': 1 } } ]
            };
            got = bl._calcMaxSumSkillPoint(bulksSet);
            exp = { head: 4, body: 4, arm: 5, waist: 4, leg: 4, weapon: 0, oma: 0 };
            assert.deepEqual(got, exp);
        });

        it('torsoUp: body is null', function () {
            var bulksSet = {
                head: [
                    { skillComb: { 'a': 1, 'b': 0 } },
                    { skillComb: { 'a': 0, 'b': 1 } },
                    { skillComb: { '胴系統倍化': 1 } } ],
                body: null,
                arm: [
                    { skillComb: { 'a': 1, 'b': 0 } },
                    { skillComb: {         'b': 2 } },
                    { skillComb: { 'a': 5, 'b': 0 } },
                    { skillComb: { '胴系統倍化': 1 } } ],
                waist: [
                    { skillComb: { 'a': 1, 'b': 0 } },
                    { skillComb: {         'b': 3 } },
                    // ↓胴系統倍化があるので、他のスキルのポイントは無視される
                    { skillComb: { 'a': 9, 'b': 0, '胴系統倍化': 1 } } ],
                leg: [
                    { skillComb: { '胴系統倍化': 1 } } ]
            };
            got = bl._calcMaxSumSkillPoint(bulksSet);
            exp = { head: 1, body: 0, arm: 5, waist: 3, leg: 0, weapon: 0, oma: 0 };
            assert.deepEqual(got, exp);
        });

        it('null or etc', function () {
            got = bl._calcMaxSumSkillPoint();
            assert.deepEqual(got, null, 'nothing in');
            got = bl._calcMaxSumSkillPoint(undefined);
            assert.deepEqual(got, null, 'undefined');
            got = bl._calcMaxSumSkillPoint(null);
            assert.deepEqual(got, null, 'null');
        });
    });

    describe('calcEach & calcSum', function () {
        it('calc', function () {
            var bl, sc;

            var skillNames = [ '攻撃力UP【大】', '業物' ];
            var bulksSet = {
                head: [
                    { skillComb: { '攻撃': 5, '斬れ味': 1 } } ],
                body: [
                    { skillComb: { '攻撃': 1, '斬れ味': 3 } } ],
                arm: [
                    { skillComb: { '攻撃': 5, '斬れ味': 1 } } ],
                waist: [
                    { skillComb: { '攻撃': 1, '斬れ味': 3 } } ],
                leg: [
                    { skillComb: { '攻撃': 3, '斬れ味': 2 } },
                    { skillComb: { '攻撃': 6, '斬れ味': 0 } },
                    { skillComb: { '攻撃': 0, '斬れ味': 4 } },
                    { skillComb: { '攻撃': 1, '斬れ味': 3 } },
                    { skillComb: { '攻撃': 4, '斬れ味': 1 } } ],
                oma: [
                    { skillComb: { '攻撃': 4, '斬れ味': 0 } },
                    { skillComb: { '攻撃': 0, '斬れ味': 2 } } ]
            };
            bl = new BorderLine(skillNames, bulksSet);
            sc = { '攻撃': 5+1+5, '斬れ味': 1+3+1 };
            got = bl.calcEach('waist', sc);
            // 攻撃: 20 - (5+1+5) - (6+4), 斬れ味: 10 - (1+3+1) - (4+2)
            exp = { '攻撃': -1, '斬れ味': -1 };
            assert.deepEqual(got, exp, 'calcEach: waist');
            got = bl.calcSum('waist', sc);
            exp = 4; // 30 - (11 + 5) - 6 - 4
            assert(got === exp, 'calcSum: waist');

            sc = { '攻撃': 5+1+5+1, '斬れ味': 1+3+1+3 };
            got = bl.calcEach('leg', sc);
            // 攻撃: 20 - (5+1+5+1) - (4), 斬れ味: 10 - (1+3+1+3) - (2)
            exp = { '攻撃': 4, '斬れ味': 0 };
            assert.deepEqual(got, exp, 'calcEach: leg');
            got = bl.calcSum('leg', sc);
            exp = 6; // 30 - (12 + 8) - 4
            assert(got === exp, 'calcSum: leg');
        });

        it('within undefined, null, []', function () {
            var skillNames = [ '攻撃力UP【大】', '業物' ];
            var bulksSet = {
                head: [
                    { skillComb: { '攻撃': 8, '斬れ味': 4 } } ],
                body: [
                    { skillComb: { '攻撃': 6, '斬れ味': 6 } } ],
                // arm: undefined
                waist: [],
                leg: [
                    { skillComb: { '攻撃': 3, '斬れ味': 2 } },
                    { skillComb: { '攻撃': 6, '斬れ味': 0 } },
                    { skillComb: { '攻撃': 0, '斬れ味': 4 } },
                    { skillComb: { '攻撃': 1, '斬れ味': 3 } },
                    { skillComb: { '攻撃': 4, '斬れ味': 1 } } ]
            };
            var bl = new BorderLine(skillNames, bulksSet);
            var sc = { '攻撃': (8+6), '斬れ味': (4+6) };
            got = bl.calcEach('arm', sc);
            // 攻撃: 20 - (8+6) - (6), 斬れ味: 10 - (4+6) - (4)
            exp = { '攻撃': 0, '斬れ味': -4 };
            assert.deepEqual(got, exp, 'calcEach');
            got = bl.calcSum('arm', sc);
            exp = 0; // 30 - (14 + 10) - 6
            assert(got === exp, 'calcSum');
        });

        it('torsoUp', function () {
            var skillNames = [ '攻撃力UP【大】', '業物' ];
            var bulksSet = {
                head: [
                    { skillComb: { '胴系統倍化': 1 } } ],
                body: [
                    { skillComb: { '攻撃': 4, '斬れ味': 2 } } ],
                arm: [
                    { skillComb: { '攻撃': 3, '斬れ味': 3 } } ],
                waist: [
                    { skillComb: { '攻撃': 5, '斬れ味': 1 } },
                    { skillComb: { '攻撃': 3, '斬れ味': 2 } } ],
                leg: [
                    { skillComb: { '攻撃': 5, '斬れ味': 0 } },
                    { skillComb: { '攻撃': 3, '斬れ味': 3 } },
                    { skillComb: { '攻撃': 0, '斬れ味': 4 } },
                    { skillComb: { '胴系統倍化': 1 } } ]
            };
            var bl = new BorderLine(skillNames, bulksSet);
            var sc = { '攻撃': (4+4+3), '斬れ味': (2+2+3) };
            got = bl.calcEach('waist', sc);
            // 攻撃: 20 - (4+4+3) - (5), 斬れ味: 10 - (2+2+3) - (4)
            exp = { '攻撃': 4, '斬れ味': -1 };
            assert.deepEqual(got, exp, 'calcEach');
            got = bl.calcSum('waist', sc);
            exp = 6; // 30 - (11 + 7) - 6(胴系統倍化)
            assert(got === exp, 'calcSum');
        });

        it('torsoUp: body is null', function () {
            var skillNames = [ '攻撃力UP【大】', '業物' ];
            var bulksSet = {
                head: [
                    { skillComb: { '胴系統倍化': 1 } } ],
                body: null,
                arm: [
                    { skillComb: { '攻撃': 8, '斬れ味': 3 } } ],
                waist: [
                    { skillComb: { '攻撃': 4, '斬れ味': 2 } } ],
                leg: [
                    { skillComb: { '攻撃': 5, '斬れ味': 0 } },
                    { skillComb: { '攻撃': 4, '斬れ味': 2 } },
                    { skillComb: { '攻撃': 0, '斬れ味': 4 } },
                    { skillComb: { '胴系統倍化': 1 } } ],
                oma: [
                    { skillComb: { '攻撃': 4, '斬れ味': 3 } } ]
            };
            var bl = new BorderLine(skillNames, bulksSet);
            var sc = { '攻撃': (0+0+8), '斬れ味': (0+0+3) };
            got = bl.calcEach('waist', sc);
            // 攻撃: 20 - (8) - (5+4), 斬れ味: 10 - (3) - (4+3)
            exp = { '攻撃': 3, '斬れ味': 0 };
            assert.deepEqual(got, exp, 'calcEach');
            got = bl.calcSum('waist', sc);
            exp = 6; // 30 - (8 + 3) - (6 + 7)
            assert(got === exp, 'calcSum');
        });

        it('skillComb is null', function () {
            var skillNames = [ '攻撃力UP【大】', '業物' ];
            var bulksSet = {
                head: [
                    { skillComb: { '攻撃': 5, '斬れ味': 1 } } ],
                body: [
                    { skillComb: { '攻撃': 1, '斬れ味': 3 } } ],
                arm: [
                    { skillComb: { '攻撃': 5, '斬れ味': 1 } } ],
                waist: [
                    { skillComb: { '攻撃': 1, '斬れ味': 3 } } ],
                leg: [
                    { skillComb: { '攻撃': 3, '斬れ味': 2 } },
                    { skillComb: { '攻撃': 6, '斬れ味': 0 } },
                    { skillComb: { '攻撃': 0, '斬れ味': 4 } },
                    { skillComb: { '攻撃': 1, '斬れ味': 3 } },
                    { skillComb: { '攻撃': 4, '斬れ味': 1 } } ],
                oma: [
                    { skillComb: { '攻撃': 4, '斬れ味': 0 } },
                    { skillComb: { '攻撃': 0, '斬れ味': 2 } } ]
            };
            var bl = new BorderLine(skillNames, bulksSet);
            got = bl.calcEach('body', null);
            // 攻撃: 20 - (5+5+1+6+4), 斬れ味: 10 - (1+1+3+4+2)
            exp = { '攻撃': -1, '斬れ味': -1 };
            assert.deepEqual(got, exp, 'calcEach');
            got = bl.calcSum('body', null);
            exp = 4; // 30 - (11 + 5) - 6 - 4
            assert(got === exp, 'calcSum');
        });
    });
});
