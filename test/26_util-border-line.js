(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', '../lib/util/border-line.js', './lib/driver-myapp.js' ];
define(deps, function (QUnit, BorderLine, myapp) {

QUnit.module('26_util-border-line', {
    setup: function () {
        myapp.initialize();
    }
});

QUnit.test('BorderLine', function () {
    QUnit.strictEqual(typeof BorderLine, 'function', 'is function');
});

QUnit.test('new', function () {
    var bl = new BorderLine();
    QUnit.strictEqual(typeof bl, 'object', 'is object');
    QUnit.strictEqual(typeof bl.initialize, 'function', 'has initialize()');
});

QUnit.test('_goal', function () {
    var got, exp,
        bl = new BorderLine();

    got = bl._goal([ '攻撃力UP【大】', '業物' ]);
    exp = { '攻撃': 20, '斬れ味': 10 };
    QUnit.deepEqual(got, exp, "[ '攻撃力UP【大】', '業物' ]");

    got = bl._goal([ 'なまくら' ]);
    exp = { '斬れ味': -10 };
    QUnit.deepEqual(got, exp, "[ 'なまくら' ]");

    got = bl._goal();
    QUnit.strictEqual(got, null, 'nothing in');
    got = bl._goal(undefined);
    QUnit.strictEqual(got, null, 'undefined');
    got = bl._goal(null);
    QUnit.strictEqual(got, null, 'null');
    got = bl._goal(null);
    QUnit.strictEqual(got, null, 'null');

    var fn = function () { bl._goal([ '攻撃大' ]); };
    QUnit.throws(fn, /skill not found: 攻撃大/, 'not found');
});

QUnit.test('_calcMaxEachSkillPoint', function () {
    var got, exp, combsSet,
        bl = new BorderLine();

    combsSet = {
        head: [
            { skillComb: { 'a': 1, 'b': 0 } },
            { skillComb: { 'a': 0, 'b': 1 } } ]
      , body: [
            { skillComb: { 'a': 1, 'b': 1 } } ]
      , arm: [
            { skillComb: { 'a': 1           } },
            { skillComb: {         'b': 1 } } ]
      , waist: [
            { skillComb: { 'a': 1         } },
            { skillComb: { 'a': 2         } } ]
      , leg: [
            { skillComb: { 'a': 3, 'b': 2 } },
            { skillComb: { 'a': 5         } },
            { skillComb: {         'b': 6 } },
            { skillComb: { 'a': 1, 'b': 3 } },
            { skillComb: { 'a': 4, 'b': 1 } } ]
      , weapon: [
            { skillComb: { 'a': 1         } } ]
      , oma: [
            { skillComb: {         'b': 1 } } ]
    };
    got = bl._calcMaxEachSkillPoint(combsSet);
    exp = { 'a': { head: 1, body: 1, arm: 1, waist: 2, leg: 5, weapon: 1, oma: 0 },
            'b': { head: 1, body: 1, arm: 1, waist: 0, leg: 6, weapon: 0, oma: 1 } };
    QUnit.deepEqual(got, exp, 'calc');

    // undefined, null, [] を含む場合
    combsSet = {
        head: [
            { skillComb: { 'a': 1, 'b': 0 } },
            { skillComb: { 'a': 0, 'b': 1 } } ]
      , body: [
            { skillComb: { 'a': 1, 'b': 1 } } ]
      , arm: null
      , waist: []
      , weapon: [
            { skillComb: { 'c': 1 } } ]
    };
    got = bl._calcMaxEachSkillPoint(combsSet);
    exp = { 'a': { head: 1, body: 1, arm: 0, waist: 0, leg: 0, weapon: 0, oma: 0 },
            'b': { head: 1, body: 1, arm: 0, waist: 0, leg: 0, weapon: 0, oma: 0 },
            'c': { head: 0, body: 0, arm: 0, waist: 0, leg: 0, weapon: 1, oma: 0 } };
    QUnit.deepEqual(got, exp, 'within: undefined, null, []');

    // 胴系統倍化
    combsSet = {
        head: [
            { skillComb: { 'a': 1, 'b': 0 } },
            { skillComb: { 'a': 0, 'b': 1 } },
            { skillComb: { '胴系統倍化': 1 } } ]
      , body: [
            { skillComb: { 'a': 2, 'b': 2 } } ]
      , arm: [
            { skillComb: { 'a': 1, 'b': 0 } },
            { skillComb: {         'b': 2 } },
            { skillComb: { 'a': 5, 'b': 0 } },
            { skillComb: { '胴系統倍化': 1 } } ]
      , waist: [
            { skillComb: { 'a': 1, 'b': 0 } },
            { skillComb: {         'b': 3 } },
            // ↓胴系統倍化があるので、他のスキルのポイントは無視される
            { skillComb: { 'a': 9, 'b': 0, '胴系統倍化': 1 } } ]
      , leg: [
            { skillComb: { '胴系統倍化': 1 } } ]
    };
    got = bl._calcMaxEachSkillPoint(combsSet);
    exp = { 'a': { head: 2, body: 2, arm: 5, waist: 2, leg: 2, weapon: 0, oma: 0 },
            'b': { head: 2, body: 2, arm: 2, waist: 3, leg: 2, weapon: 0, oma: 0 } };
    QUnit.deepEqual(got, exp, 'torso up');

    // 胴系統倍化: body is null
    combsSet = {
        head: [
            { skillComb: { 'a': 1, 'b': 0 } },
            { skillComb: { 'a': 0, 'b': 1 } },
            { skillComb: { '胴系統倍化': 1 } } ]
      , body: null
      , arm: [
            { skillComb: { 'a': 1, 'b': 0 } },
            { skillComb: {         'b': 2 } },
            { skillComb: { 'a': 5, 'b': 0 } },
            { skillComb: { '胴系統倍化': 1 } } ]
      , waist: [
            { skillComb: { 'a': 1, 'b': 0 } },
            { skillComb: {         'b': 3 } },
            // ↓胴系統倍化があるので、他のスキルのポイントは無視される
            { skillComb: { 'a': 9, 'b': 0, '胴系統倍化': 1 } } ]
      , leg: [
            { skillComb: { '胴系統倍化': 1 } } ]
    };
    got = bl._calcMaxEachSkillPoint(combsSet);
    exp = { 'a': { head: 1, body: 0, arm: 5, waist: 1, leg: 0, weapon: 0, oma: 0 },
            'b': { head: 1, body: 0, arm: 2, waist: 3, leg: 0, weapon: 0, oma: 0 } };
    QUnit.deepEqual(got, exp, 'torso up: body is null');

    got = bl._calcMaxEachSkillPoint();
    QUnit.deepEqual(got, null, 'nothing in');
    got = bl._calcMaxEachSkillPoint(undefined);
    QUnit.deepEqual(got, null, 'undefined');
    got = bl._calcMaxEachSkillPoint(null);
    QUnit.deepEqual(got, null, 'null');
});

QUnit.test('_calcMaxSumSkillPoint', function () {
    var got, exp, combsSet,
        bl = new BorderLine();

    combsSet = {
        head: [
            { skillComb: { 'a': 1, 'b': 0 } },
            { skillComb: { 'a': 0, 'b': 1 } } ]
      , body: [
            { skillComb: { 'a': 1, 'b': 1 } } ]
      , arm: [
            { skillComb: { 'a': 1           } },
            { skillComb: {         'b': 1 } } ]
      , waist: [
            { skillComb: { 'a': 1         } },
            { skillComb: { 'a': 2         } } ]
      , leg: [
            { skillComb: { 'a': 3, 'b': 2 } },
            { skillComb: { 'a': 5         } },
            { skillComb: {         'b': 6 } },
            { skillComb: { 'a': 1, 'b': 3 } },
            { skillComb: { 'a': 4, 'b': 1 } } ]
      , weapon: [
            { skillComb: { 'a': 1         } } ]
      , oma: [
            { skillComb: {         'b': 1 } } ]
    };
    got = bl._calcMaxSumSkillPoint(combsSet);
    exp = { head: 1, body: 2, arm: 1, waist: 2, leg: 6, weapon: 1, oma: 1 };
    QUnit.deepEqual(got, exp, 'calc');

    // undefined, null, [] を含む場合
    combsSet = {
        head: [
            { skillComb: { 'a': 1, 'b': 0 } },
            { skillComb: { 'a': 0, 'b': 1 } } ]
      , body: [
            { skillComb: { 'a': 1, 'b': 1 } } ]
      , arm: null
      , waist: []
      , weapon: [
            { skillComb: { 'c': 1 } } ]
    };
    got = bl._calcMaxSumSkillPoint(combsSet);
    exp = { head: 1, body: 2, arm: 0, waist: 0, leg: 0, weapon: 1, oma: 0 };
    QUnit.deepEqual(got, exp, 'within: undefined, null, []');

    // 胴系統倍化
    combsSet = {
        head: [
            { skillComb: { 'a': 1, 'b': 0 } },
            { skillComb: { 'a': 0, 'b': 1 } },
            { skillComb: { '胴系統倍化': 1 } } ]
      , body: [
            { skillComb: { 'a': 2, 'b': 2 } } ]
      , arm: [
            { skillComb: { 'a': 1, 'b': 0 } },
            { skillComb: {         'b': 2 } },
            { skillComb: { 'a': 5, 'b': 0 } },
            { skillComb: { '胴系統倍化': 1 } } ]
      , waist: [
            { skillComb: { 'a': 1, 'b': 0 } },
            { skillComb: {         'b': 3 } },
            // ↓胴系統倍化があるので、他のスキルのポイントは無視される
            { skillComb: { 'a': 9, 'b': 0, '胴系統倍化': 1 } } ]
      , leg: [
            { skillComb: { '胴系統倍化': 1 } } ]
    };
    got = bl._calcMaxSumSkillPoint(combsSet);
    exp = { head: 4, body: 4, arm: 5, waist: 4, leg: 4, weapon: 0, oma: 0 };
    QUnit.deepEqual(got, exp, 'torso up');

    // 胴系統倍化: body is null
    combsSet = {
        head: [
            { skillComb: { 'a': 1, 'b': 0 } },
            { skillComb: { 'a': 0, 'b': 1 } },
            { skillComb: { '胴系統倍化': 1 } } ]
      , body: null
      , arm: [
            { skillComb: { 'a': 1, 'b': 0 } },
            { skillComb: {         'b': 2 } },
            { skillComb: { 'a': 5, 'b': 0 } },
            { skillComb: { '胴系統倍化': 1 } } ]
      , waist: [
            { skillComb: { 'a': 1, 'b': 0 } },
            { skillComb: {         'b': 3 } },
            // ↓胴系統倍化があるので、他のスキルのポイントは無視される
            { skillComb: { 'a': 9, 'b': 0, '胴系統倍化': 1 } } ]
      , leg: [
            { skillComb: { '胴系統倍化': 1 } } ]
    };
    got = bl._calcMaxSumSkillPoint(combsSet);
    exp = { head: 1, body: 0, arm: 5, waist: 3, leg: 0, weapon: 0, oma: 0 };
    QUnit.deepEqual(got, exp, 'torso up: body is null');

    got = bl._calcMaxSumSkillPoint();
    QUnit.deepEqual(got, null, 'nothing in');
    got = bl._calcMaxSumSkillPoint(undefined);
    QUnit.deepEqual(got, null, 'undefined');
    got = bl._calcMaxSumSkillPoint(null);
    QUnit.deepEqual(got, null, 'null');
});

QUnit.test('calc', function () {
    var got, exp, bl, combsSet, skillNames;

    skillNames = [ '攻撃力UP【大】', '業物' ];
    combsSet = {
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
    bl = new BorderLine(skillNames, combsSet);
    got = bl.calc('waist', { '攻撃': 5+1+5, '斬れ味': 1+3+1 });
    exp = {
        // 攻撃: 20 - (5+1+5) - (6+4), 斬れ味: 10 - (1+3+1) - (4+2)
        waist: { '攻撃': -1, '斬れ味': -1 },
        // 30 - (11 + 5) - 6 - 4
        sum: 4
    };
    QUnit.deepEqual(got, exp, 'calc waist');
    got = bl.calc('leg', { '攻撃': 5+1+5+1, '斬れ味': 1+3+1+3 });
    exp = {
        // 攻撃: 20 - (5+1+5+1) - (4), 斬れ味: 10 - (1+3+1+3) - (2)
        leg: { '攻撃': 4, '斬れ味': 0 },
        // 30 - (12 + 8) - 4
        sum: 6
    };
    QUnit.deepEqual(got, exp, 'calc leg');

    // undefined, null, [] を含む場合
    skillNames = [ '攻撃力UP【大】', '業物' ];
    combsSet = {
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
    bl = new BorderLine(skillNames, combsSet);
    got = bl.calc('arm', { '攻撃': (8+6), '斬れ味': (4+6) });
    exp = {
        // 攻撃: 20 - (8+6) - (6), 斬れ味: 10 - (4+6) - (4)
        arm: { '攻撃': 0, '斬れ味': -4 },
        // 30 - (14 + 10) - 6
        sum: 0
    };
    QUnit.deepEqual(got, exp, 'within: undefined, null, []');

    // 胴系統倍化
    skillNames = [ '攻撃力UP【大】', '業物' ];
    combsSet = {
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
    bl = new BorderLine(skillNames, combsSet);
    got = bl.calc('waist', { '攻撃': (4+4+3), '斬れ味': (2+2+3) });
    exp = {
        // 攻撃: 20 - (4+4+3) - (5), 斬れ味: 10 - (2+2+3) - (4)
        waist: { '攻撃': 4, '斬れ味': -1 },
        // 30 - (11 + 7) - 6(胴系統倍化)
        sum: 6
    };
    QUnit.deepEqual(got, exp, 'torso up');

    // 胴系統倍化: body is null
    skillNames = [ '攻撃力UP【大】', '業物' ];
    combsSet = {
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
    bl = new BorderLine(skillNames, combsSet);
    got = bl.calc('waist', { '攻撃': (0+0+8), '斬れ味': (0+0+3) });
    exp = {
        // 攻撃: 20 - (8) - (5+4), 斬れ味: 10 - (3) - (4+3)
        waist: { '攻撃': 3, '斬れ味': 0 },
        // 30 - (8 + 3) - (6 + 7)
        sum: 6
    };
    QUnit.deepEqual(got, exp, 'torso up: body is null');

    // skillComb が null
    skillNames = [ '攻撃力UP【大】', '業物' ];
    combsSet = {
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
    bl = new BorderLine(skillNames, combsSet);
    got = bl.calc('body', null);
    exp = {
        // 攻撃: 20 - (5+5+1+6+4), 斬れ味: 10 - (1+1+3+4+2)
        body: { '攻撃': -1, '斬れ味': -1 },
        // 30 - (11 + 5) - 6 - 4
        sum: 4
    };
    QUnit.deepEqual(got, exp, 'calc waist');

});

});
})(typeof define !== 'undefined' ?
   define :
   typeof module !== 'undefined' && module.exports ?
       function (deps, test) {
           var modules = [], len = deps.length;
           for (var i = 0; i < len; ++i) modules.push(require(deps[i]));
           test.apply(this, modules);
       } :
       function (deps, test) {
           test(this.QUnit, this.simu.Util.BorderLine, this.myapp);
       }
);
