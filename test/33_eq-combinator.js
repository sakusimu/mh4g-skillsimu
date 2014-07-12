(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', '../lib/equip/combinator.js', './lib/driver-myapp.js' ];
define(deps, function (QUnit, Combinator, myapp) {

QUnit.module('33_eq-combinator', {
    setup: function () {
        myapp.initialize();
    }
});

QUnit.test('Combinator', function () {
    QUnit.strictEqual(typeof Combinator, 'function', 'is function');
});

QUnit.test('new', function () {
    var got, exp;

    var c = new Combinator();
    QUnit.strictEqual(typeof c, 'object', 'is object');
    QUnit.strictEqual(typeof c.initialize, 'function', 'has initialize()');

    got = c.parts;
    exp = [ 'body', 'head', 'arm', 'waist', 'leg', 'weapon', 'oma' ];
    QUnit.deepEqual(got, exp, 'parts');
});

QUnit.test('goal', function () {
    var got, exp,
        c = Combinator;

    got = c.goal([ '攻撃力UP【大】', '業物' ]);
    exp = { '攻撃': 20, '斬れ味': 10 };
    QUnit.deepEqual(got, exp, "[ '攻撃力UP【大】', '業物' ]");

    got = c.goal([ 'なまくら' ]);
    exp = { '斬れ味': -10 };
    QUnit.deepEqual(got, exp, "[ 'なまくら' ]");

    got = c.goal();
    QUnit.strictEqual(got, null, "nothing in");
    got = c.goal(undefined);
    QUnit.strictEqual(got, null, "undefined");
    got = c.goal(null);
    QUnit.strictEqual(got, null, "null");
    got = c.goal(null);
    QUnit.strictEqual(got, null, "null");
});

QUnit.test('_sort', function () {
    var got, exp, norCombs,
        c = new Combinator();

    norCombs = [ { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ 'b32' ] },
                 { skillComb: { '攻撃': 5, '斬れ味': 0 }, equips: [ 'b50' ] },
                 { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] },
                 { skillComb: { '攻撃': 0, '斬れ味': 1 }, equips: [ 'b01' ] },
                 { skillComb: { '攻撃': 0, '斬れ味': 6 }, equips: [ 'b06' ] },
                 { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ 'b13' ] },
                 { skillComb: { '攻撃': 6, '斬れ味': 6 }, equips: [ 'b66' ] },
                 { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ 'b10' ] },
                 { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ 'b41' ] } ];
    got = c._sort(norCombs);
    exp = [ { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] },
            { skillComb: { '攻撃': 6, '斬れ味': 6 }, equips: [ 'b66' ] },
            { skillComb: { '攻撃': 0, '斬れ味': 6 }, equips: [ 'b06' ] },
            { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ 'b32' ] },
            { skillComb: { '攻撃': 5, '斬れ味': 0 }, equips: [ 'b50' ] },
            { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ 'b41' ] },
            { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ 'b13' ] },
            { skillComb: { '攻撃': 0, '斬れ味': 1 }, equips: [ 'b01' ] },
            { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ 'b10' ] } ];
    QUnit.deepEqual(got, exp, "sort");

    // 合計が 0 やマイナスがあっても正しくソートできるか
    norCombs = [ { skillComb: { '攻撃': 0, '斬れ味': 1 }, equips: [ 'b01' ] },
                 { skillComb: { '攻撃': -2, '斬れ味': 2 }, equips: [ 'b-2-2' ] },
                 { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] },
                 { skillComb: { '攻撃': 1, '斬れ味': -3 }, equips: [ 'b1-3' ] },
                 { skillComb: { '攻撃': -1, '斬れ味': 1 }, equips: [ 'b-11' ] },
                 { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ 'b10' ] } ];
    got = c._sort(norCombs);
    exp = [ { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] },
            { skillComb: { '攻撃': 0, '斬れ味': 1 }, equips: [ 'b01' ] },
            { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ 'b10' ] },
            { skillComb: { '攻撃': -2, '斬れ味': 2 }, equips: [ 'b-2-2' ] },
            { skillComb: { '攻撃': -1, '斬れ味': 1 }, equips: [ 'b-11' ] },
            { skillComb: { '攻撃': 1, '斬れ味': -3 }, equips: [ 'b1-3' ] } ];
    QUnit.deepEqual(got, exp, "0 and minus");

    // 胴系統倍化
    norCombs =
        [ { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ 'l32' ] },
          { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] },
          { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ 'l13' ] },
          { skillComb: { '胴系統倍化': 1 }, equips: [ 'l=b' ] },
          { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ 'l41' ] } ];
    got = c._sort(norCombs);
    exp = [ { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] },
            { skillComb: { '胴系統倍化': 1 }, equips: [ 'l=b' ] },
            { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ 'l32' ] },
            { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ 'l41' ] },
            { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ 'l13' ] } ];
    QUnit.deepEqual(got, exp, "doubling");
});

QUnit.test('_calcMaxSkillPoints', function () {
    var got, exp, norCombsSet,
        c = new Combinator();

    norCombsSet =
        { head:
           [ { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ 'h10' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ 'h02' ] } ],
          body:
           [ { skillComb: { '攻撃': 2, '斬れ味': 3 }, equips: [ 'b23' ] } ],
          arm:
           [ { skillComb: { '攻撃': 3, '斬れ味': 3 }, equips: [ 'a34' ] } ],
          waist:
           [ { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ 'w45' ] } ],
          leg:
           [ { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ 'l32' ] },
             { skillComb: { '攻撃': 5, '斬れ味': 0 }, equips: [ 'l50' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 6 }, equips: [ 'l06' ] },
             { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ 'l13' ] },
             { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ 'l41' ] } ] };
    got = c._calcMaxSkillPoints(norCombsSet);
    exp = { '攻撃': { head: 1, body: 2, arm: 3, waist: 3, leg: 5 },
            '斬れ味': { head: 2, body: 3, arm: 3, waist: 2, leg: 6 } };
    QUnit.deepEqual(got, exp, 'calc');

    // 胴系統倍化
    norCombsSet =
        { head:
           [ { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ 'h10' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ 'h02' ] },
             { skillComb: { '胴系統倍化': 1 }, equips: [ 'h=b' ] } ],
          body:
           [ { skillComb: { '攻撃': 2, '斬れ味': 3 }, equips: [ 'b23' ] } ],
          arm:
           [ { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ 'a10' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ 'a02' ] },
             { skillComb: { '攻撃': 5, '斬れ味': 0 }, equips: [ 'a50' ] },
             { skillComb: { '胴系統倍化': 1 }, equips: [ 'a=b' ] } ],
          waist:
           [ { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ 'w10' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ 'w02' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 0, '胴系統倍化': 1 }, equips: [ 'w=b' ] } ],
          leg:
           [ { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ 'l10' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ 'l02' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ 'l04' ] },
             { skillComb: { '胴系統倍化': 1 }, equips: [ 'l=b' ] } ],
          weapon:
           [ { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ 'wpn' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 1 }, equips: [ 'wpn' ] } ],
          oma:
           [ { skillComb: { '攻撃': 3, '斬れ味': 0 }, equips: [ 'wpn' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ 'wpn' ] } ] };
    got = c._calcMaxSkillPoints(norCombsSet);
    exp = { '攻撃': { head: 2, body: 2, arm: 5, waist: 2, leg: 2, weapon: 1, oma: 3 },
            '斬れ味': { head: 3, body: 3, arm: 3, waist: 3, leg: 4, weapon: 1, oma: 2 } };
    QUnit.deepEqual(got, exp, 'doubling');

    // 武器スロ＆お守り
    norCombsSet =
        { head:
           [ { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ 'h10' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ 'h02' ] } ],
          body:
           [ { skillComb: { '攻撃': 2, '斬れ味': 3 }, equips: [ 'b23' ] } ],
          arm:
           [ { skillComb: { '攻撃': 3, '斬れ味': 3 }, equips: [ 'a34' ] } ],
          waist:
           [ { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ 'w45' ] } ],
          leg:
           [ { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ 'l32' ] },
             { skillComb: { '攻撃': 5, '斬れ味': 0 }, equips: [ 'l50' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 6 }, equips: [ 'l06' ] },
             { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ 'l13' ] },
             { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ 'l41' ] } ],
          weapon:
           [ { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ 'wpn' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 1 }, equips: [ 'wpn' ] } ],
          oma:
           [ { skillComb: { '攻撃': 3, '斬れ味': 0 }, equips: [ 'wpn' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ 'wpn' ] } ] };
    got = c._calcMaxSkillPoints(norCombsSet);
    exp = { '攻撃': { head: 1, body: 2, arm: 3, waist: 3, leg: 5, weapon: 1, oma: 3 },
            '斬れ味': { head: 2, body: 3, arm: 3, waist: 2, leg: 6, weapon: 1, oma: 2 } };
    QUnit.deepEqual(got, exp, 'weapon & oma');

    got = c._calcMaxSkillPoints();
    QUnit.deepEqual(got, null, 'nothing in');
    got = c._calcMaxSkillPoints(undefined);
    QUnit.deepEqual(got, null, 'undefined');
    got = c._calcMaxSkillPoints(null);
    QUnit.deepEqual(got, null, 'null');
});

QUnit.test('_calcMaxSumPoints', function () {
    var got, exp, norCombsSet,
        c = new Combinator();

    norCombsSet =
        { head:
           [ { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ 'h10' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ 'h02' ] } ],
          body:
           [ { skillComb: { '攻撃': 2, '斬れ味': 3 }, equips: [ 'b23' ] } ],
          arm:
           [ { skillComb: { '攻撃': 3, '斬れ味': 3 }, equips: [ 'a34' ] } ],
          waist:
           [ { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ 'w45' ] } ],
          leg:
           [ { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ 'l32' ] },
             { skillComb: { '攻撃': 5, '斬れ味': 0 }, equips: [ 'l50' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 6 }, equips: [ 'l06' ] },
             { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ 'l13' ] },
             { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ 'l41' ] } ] };
    got = c._calcMaxSumPoints(norCombsSet);
    exp = { head: 2, body: 5, arm: 6, waist: 5, leg: 6 };
    QUnit.deepEqual(got, exp, 'calc');

    // 胴系統倍化
    norCombsSet =
        { head:
           [ { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ 'h10' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ 'h02' ] },
             { skillComb: { '胴系統倍化': 1 }, equips: [ 'h=b' ] } ],
          body:
           [ { skillComb: { '攻撃': 2, '斬れ味': 3 }, equips: [ 'b23' ] } ],
          arm:
           [ { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ 'a10' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ 'a02' ] },
             { skillComb: { '攻撃': 5, '斬れ味': 0 }, equips: [ 'a50' ] },
             { skillComb: { '胴系統倍化': 1 }, equips: [ 'a=b' ] } ],
          waist:
           [ { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ 'w10' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ 'w02' ] } ],
          leg:
           [ { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ 'l10' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ 'l02' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 6 }, equips: [ 'l04' ] },
             { skillComb: { '胴系統倍化': 1 }, equips: [ 'l=b' ] } ],
          weapon:
           [ { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ 'wpn' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 1 }, equips: [ 'wpn' ] } ] };
    got = c._calcMaxSumPoints(norCombsSet);
    exp = { head: 5, body: 5, arm: 5, waist: 2, leg: 6, weapon: 1 };
    QUnit.deepEqual(got, exp, 'dupli');

    // 武器スロ＆お守り
    norCombsSet =
        { head:
           [ { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ 'h10' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ 'h02' ] } ],
          body:
           [ { skillComb: { '攻撃': 2, '斬れ味': 3 }, equips: [ 'b23' ] } ],
          arm:
           [ { skillComb: { '攻撃': 3, '斬れ味': 3 }, equips: [ 'a34' ] } ],
          waist:
           [ { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ 'w45' ] } ],
          leg:
           [ { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ 'l32' ] },
             { skillComb: { '攻撃': 5, '斬れ味': 0 }, equips: [ 'l50' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 6 }, equips: [ 'l06' ] },
             { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ 'l13' ] },
             { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ 'l41' ] } ],
          weapon:
           [ { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ 'wpn' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 1 }, equips: [ 'wpn' ] } ],
          oma:
           [ { skillComb: { '攻撃': 3, '斬れ味': 0 }, equips: [ 'oma' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ 'oma' ] } ] };
    got = c._calcMaxSumPoints(norCombsSet);
    exp = { head: 2, body: 5, arm: 6, waist: 5, leg: 6, weapon: 1, oma: 3 };
    QUnit.deepEqual(got, exp, 'weapon & oma');
});

QUnit.test('_calcBorderLine', function () {
    var got, exp, norCombsSet, goal,
        c = new Combinator();

    norCombsSet =
        { head:
           [ { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ 'h32' ] },
             { skillComb: { '攻撃': 6, '斬れ味': 0 }, equips: [ 'h60' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ 'h04' ] },
             { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ 'h13' ] },
             { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ 'h41' ] } ],
          body:
           [ { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ 'b21' ] } ],
          arm:
           [ { skillComb: { '攻撃': 2, '斬れ味': 2 }, equips: [ 'a32' ] } ],
          waist:
           [ { skillComb: { '攻撃': 2, '斬れ味': 2 }, equips: [ 'w43' ] } ],
          leg:
           [ { skillComb: { '攻撃': 2, '斬れ味': 3 }, equips: [ 'l54' ] } ] };
    goal = Combinator.goal([ '攻撃力UP【大】', '業物' ]);
    got = c._calcBorderLine(norCombsSet, goal);
    exp = { body: { '攻撃': 8, '斬れ味': -1 },
            head: { '攻撃': 14, '斬れ味': 3 },
             arm: { '攻撃': 16, '斬れ味': 5 },
           waist: { '攻撃': 18, '斬れ味': 7 },
             leg: { '攻撃': 20, '斬れ味': 10 },
          weapon: { '攻撃': 20, '斬れ味': 10 },
             oma: { '攻撃': 20, '斬れ味': 10 },
             sum: { body: 11, head: 17, arm: 21, waist: 25, leg: 30, weapon: 30, oma: 30 } };
    QUnit.deepEqual(got, exp, 'calc');

    // 胴系統倍化
    norCombsSet =
        { head:
           [ { skillComb: { '攻撃': 2, '斬れ味': 0 }, equips: [ 'h20' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 1 }, equips: [ 'h01' ] },
             { skillComb: { '胴系統倍化': 1 }, equips: [ 'h=b' ] } ],
          body:
           [ { skillComb: { '攻撃': 4, '斬れ味': 2 }, equips: [ 'b42' ] } ],
          arm:
           [ { skillComb: { '攻撃': 3, '斬れ味': 3 }, equips: [ 'a33' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ 'a04' ] },
             { skillComb: { '攻撃': 5, '斬れ味': 0 }, equips: [ 'a50' ] },
             { skillComb: { '胴系統倍化': 1 }, equips: [ 'a=b' ] } ],
          waist:
           [ { skillComb: { '攻撃': 5, '斬れ味': 1 }, equips: [ 'w51' ] },
             { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ 'w32' ] } ],
          leg:
           [ { skillComb: { '攻撃': 5, '斬れ味': 0 }, equips: [ 'l50' ] },
             { skillComb: { '攻撃': 3, '斬れ味': 3 }, equips: [ 'l33' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ 'l04' ] },
             { skillComb: { '胴系統倍化': 1 }, equips: [ 'l=b' ] } ] };
    goal = Combinator.goal([ '攻撃力UP【大】', '業物' ]);
    got = c._calcBorderLine(norCombsSet, goal);
    exp = { body: { '攻撃': 1, '斬れ味': -2 },
            head: { '攻撃': 5, '斬れ味': 0 },
             arm: { '攻撃': 10, '斬れ味': 4 },
           waist: { '攻撃': 15, '斬れ味': 6 },
             leg: { '攻撃': 20, '斬れ味': 10 },
          weapon: { '攻撃': 20, '斬れ味': 10 },
             oma: { '攻撃': 20, '斬れ味': 10 },
             sum: { body: 6, head: 12, arm: 18, waist: 24, leg: 30, weapon: 30, oma: 30 } };
    QUnit.deepEqual(got, exp, 'doubling');

    // 武器スロあり
    norCombsSet =
        { head:
           [ { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ 'h32' ] },
             { skillComb: { '攻撃': 6, '斬れ味': 0 }, equips: [ 'h60' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ 'h04' ] },
             { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ 'h13' ] },
             { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ 'h41' ] } ],
          body:
           [ { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ 'b21' ] } ],
          arm:
           [ { skillComb: { '攻撃': 2, '斬れ味': 2 }, equips: [ 'a32' ] } ],
          waist:
           [ { skillComb: { '攻撃': 2, '斬れ味': 2 }, equips: [ 'w43' ] } ],
          leg:
           [ { skillComb: { '攻撃': 2, '斬れ味': 3 }, equips: [ 'l54' ] } ],
          weapon:
           [ { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ 'wpn' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 1 }, equips: [ 'wpn' ] } ] };
    goal = Combinator.goal([ '攻撃力UP【大】', '業物' ]);
    got = c._calcBorderLine(norCombsSet, goal);
    exp = { body: { '攻撃': 7, '斬れ味': -2 },
            head: { '攻撃': 13, '斬れ味': 2 },
             arm: { '攻撃': 15, '斬れ味': 4 },
           waist: { '攻撃': 17, '斬れ味': 6 },
             leg: { '攻撃': 19, '斬れ味': 9 },
          weapon: { '攻撃': 20, '斬れ味': 10 },
             oma: { '攻撃': 20, '斬れ味': 10 },
             sum: { body: 10, head: 16, arm: 20, waist: 24, leg: 29, weapon: 30, oma: 30 } };
    QUnit.deepEqual(got, exp, 'weaponSlot');

    // お守りあり
    norCombsSet =
        { head:
           [ { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ 'h32' ] },
             { skillComb: { '攻撃': 6, '斬れ味': 0 }, equips: [ 'h60' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ 'h04' ] },
             { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ 'h13' ] },
             { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ 'h41' ] } ],
          body:
           [ { skillComb: { '攻撃': 2, '斬れ味': 1 }, equips: [ 'b21' ] } ],
          arm:
           [ { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ 'a32' ] } ],
          waist:
           [ { skillComb: { '攻撃': 2, '斬れ味': 3 }, equips: [ 'w43' ] } ],
          leg:
           [ { skillComb: { '攻撃': 1, '斬れ味': 2 }, equips: [ 'l54' ] } ],
          oma:
           [ { skillComb: { '攻撃': 4, '斬れ味': 0 }, equips: [ 'oma' ] },
             { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ 'oma' ] } ] };
    goal = Combinator.goal([ '攻撃力UP【大】', '業物' ]);
    got = c._calcBorderLine(norCombsSet, goal);
    exp = { body: { '攻撃': 4, '斬れ味': -3 },
            head: { '攻撃': 10, '斬れ味': 1 },
             arm: { '攻撃': 13, '斬れ味': 3 },
           waist: { '攻撃': 15, '斬れ味': 6 },
             leg: { '攻撃': 16, '斬れ味': 8 },
          weapon: { '攻撃': 16, '斬れ味': 8 },
             oma: { '攻撃': 20, '斬れ味': 10 },
             sum: { body: 7, head: 13, arm: 18, waist: 23, leg: 26, weapon: 26, oma: 30 } };
    QUnit.deepEqual(got, exp, 'oma');
});

QUnit.test('_isBeyondMaxSkill', function () {
    var got, mergedComb, skillComb, borderLine,
        c = new Combinator();

    // case 1
    mergedComb = { '攻撃': 5, '匠': 3, '聴覚保護': 1 };
    skillComb  = { '攻撃': 2, '匠': 1, '聴覚保護': 1 };
    borderLine = { waist: { '攻撃': 6, '匠': 4, '聴覚保護': 2 },
                   sum: { waist: 12 } };
    got = c._isBeyondMaxSkill(mergedComb, skillComb, borderLine, 'waist');
    QUnit.equal(got, true, 'case 1');

    // case 2: borderLine と同じ値
    mergedComb = { '攻撃': 5, '匠': 3, '聴覚保護': 1 };
    skillComb  = { '攻撃': 1, '匠': 1, '聴覚保護': 1 };
    borderLine = { waist: { '攻撃': 6, '匠': 4, '聴覚保護': 2 },
                   sum: { waist: 12 } };
    got = c._isBeyondMaxSkill(mergedComb, skillComb, borderLine, 'waist');
    QUnit.equal(got, true, 'case 2');

    // case 3: borderLine.waist をこえなくてアウト
    mergedComb = { '攻撃': 5, '匠': 3, '聴覚保護': 1 };
    skillComb  = { '攻撃': 2, '匠': 1, '聴覚保護': 0 };
    borderLine = { waist: { '攻撃': 6, '匠': 4, '聴覚保護': 2 },
                   sum: { waist: 12 } };
    got = c._isBeyondMaxSkill(mergedComb, skillComb, borderLine, 'waist');
    QUnit.equal(got, false, 'case 3');
});

QUnit.test('_isBeyondMaxSum', function () {
    var got, mergedComb, skillComb, borderLine,
        c = new Combinator();

    // case 1
    mergedComb = { '攻撃': 5, '匠': 3, '聴覚保護': 1 };
    skillComb  = { '攻撃': 2, '匠': 1, '聴覚保護': 1 };
    borderLine = { waist: { '攻撃': 6, '匠': 4, '聴覚保護': 2 },
                   sum: { waist: 12 } };
    got = c._isBeyondMaxSum(mergedComb, skillComb, borderLine, 'waist');
    QUnit.equal(got, true, 'case 1');

    // case 2: borderLine と同じ値
    mergedComb = { '攻撃': 5, '匠': 3, '聴覚保護': 1 };
    skillComb  = { '攻撃': 1, '匠': 1, '聴覚保護': 1 };
    borderLine = { waist: { '攻撃': 6, '匠': 4, '聴覚保護': 2 },
                   sum: { waist: 12 } };
    got = c._isBeyondMaxSum(mergedComb, skillComb, borderLine, 'waist');
    QUnit.equal(got, true, 'case 2');

    // case 3: borderLine.sum.body をこえなくてアウト
    mergedComb = {};
    skillComb  = { '攻撃': 1, '匠': 1, '聴覚保護': 1 };
    borderLine = { body: { '攻撃': 1, '匠': 1, '聴覚保護': 1 },
                   sum: { body: 5 } };
    got = c._isBeyondMaxSum(mergedComb, skillComb, borderLine, 'body');
    QUnit.equal(got, false, 'case 3');
});

QUnit.test('_combine', function () {
    var got, exp,
        set, combs, borderLine,
        c = new Combinator();

    // body, head, arm まで終わってて、これから waist を処理するところ。
    // borderLine を上回るポイントとなる組み合わせを求める。
    set = [ { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, equips: [ 'b500' ] },
            { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, equips: [ 'h030' ] },
            { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, equips: [ 'a001' ] } ];
    combs = [ { skillComb: { '攻撃': 4, '匠': 0, '聴覚保護': 0 }, equips: [ 'w400' ] },
              { skillComb: { '攻撃': 3, '匠': 1, '聴覚保護': 0 }, equips: [ 'w310' ] },
              { skillComb: { '攻撃': 3, '匠': 0, '聴覚保護': 1 }, equips: [ 'w301' ] },
              { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, equips: [ 'w211' ] },
              { skillComb: { '攻撃': 0, '匠': 4, '聴覚保護': 0 }, equips: [ 'w040' ] },
              { skillComb: { '攻撃': 1, '匠': 3, '聴覚保護': 0 }, equips: [ 'w130' ] },
              { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 1 }, equips: [ 'w031' ] },
              { skillComb: { '攻撃': 1, '匠': 2, '聴覚保護': 1 }, equips: [ 'w121' ] },
              { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 4 }, equips: [ 'w004' ] },
              { skillComb: { '攻撃': 1, '匠': 0, '聴覚保護': 3 }, equips: [ 'w103' ] },
              { skillComb: { '攻撃': 0, '匠': 1, '聴覚保護': 3 }, equips: [ 'w013' ] },
              { skillComb: { '攻撃': 1, '匠': 1, '聴覚保護': 2 }, equips: [ 'w112' ] } ];
    borderLine = { waist: { '攻撃': 6, '匠': 4, '聴覚保護': 2 },
                   sum: { waist: 12 } };
    got = c._combine(set, combs, borderLine, 'waist');
    exp = [ [ { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, equips: [ 'b500' ] },
              { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, equips: [ 'h030' ] },
              { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, equips: [ 'a001' ] },
              { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, equips: [ 'w211' ] } ],
            [ { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, equips: [ 'b500' ] },
              { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, equips: [ 'h030' ] },
              { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, equips: [ 'a001' ] },
              { skillComb: { '攻撃': 1, '匠': 2, '聴覚保護': 1 }, equips: [ 'w121' ] } ],
            [ { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, equips: [ 'b500' ] },
              { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, equips: [ 'h030' ] },
              { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, equips: [ 'a001' ] },
              { skillComb: { '攻撃': 1, '匠': 1, '聴覚保護': 2 }, equips: [ 'w112' ] } ] ];
    QUnit.deepEqual(got, exp, 'combine waist (done: body, head, arm)');

    // combs がソートされていないとちゃんと動かない
    set = [ { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, equips: [ 'b500' ] },
            { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, equips: [ 'h030' ] },
            { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, equips: [ 'a001' ] } ];
    combs = [ { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, equips: [ 'w001' ] },
              { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, equips: [ 'w211' ] } ];
    borderLine = { waist: { '攻撃': 6, '匠': 4, '聴覚保護': 2 },
                   sum: { waist: 12 } };
    got = c._combine(set, combs, borderLine, 'waist');
    exp = [];
    QUnit.deepEqual(got, exp, 'combine waist (not sort)');

    // slot0 は先にあってもOK
    set = [ { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, equips: [ 'b500' ] },
            { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, equips: [ 'h030' ] },
            { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, equips: [ 'a001' ] } ];
    combs = [ { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 0 }, equips: [ 'slot0' ] },
              { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, equips: [ 'w211' ] } ];
    borderLine = { waist: { '攻撃': 6, '匠': 4, '聴覚保護': 2 },
                   sum: { waist: 12 } };
    got = c._combine(set, combs, borderLine, 'waist');
    exp = [ [ { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, equips: [ 'b500' ] },
              { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, equips: [ 'h030' ] },
              { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, equips: [ 'a001' ] },
              { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, equips: [ 'w211' ] } ] ];
    QUnit.deepEqual(got, exp, 'combine waist (slot0)');

    // 胴系統倍化も先にあってもOK
    set = [ { skillComb: { '攻撃': 4, '斬れ味': 2 }, equips: [ 'b42' ] },
            { skillComb: { '胴系統倍化': 1 }, equips: [ 'h=b' ] },
            { skillComb: { '攻撃': 3, '斬れ味': 3 }, equips: [ 'a33' ] },
            { skillComb: { '攻撃': 5, '斬れ味': 1 }, equips: [ 'w51' ] } ];
    combs = [ { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] },
              { skillComb: { '胴系統倍化': 1 }, equips: [ 'l=b' ] },
              { skillComb: { '攻撃': 3, '斬れ味': 3 }, equips: [ 'l33' ] },
              { skillComb: { '攻撃': 5, '斬れ味': 0 }, equips: [ 'l50' ] },
              { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ 'l04' ] } ];
    borderLine = { leg: { '攻撃': 20, '斬れ味': 10 },
                   sum: { leg: 30 } };
    got = c._combine(set, combs, borderLine, 'leg');
    exp = [ [ { skillComb: { '攻撃': 4, '斬れ味': 2 }, equips: [ 'b42' ] },
              { skillComb: { '胴系統倍化': 1 }, equips: [ 'h=b' ] },
              { skillComb: { '攻撃': 3, '斬れ味': 3 }, equips: [ 'a33' ] },
              { skillComb: { '攻撃': 5, '斬れ味': 1 }, equips: [ 'w51' ] },
              { skillComb: { '胴系統倍化': 1 }, equips: [ 'l=b' ] } ] ];
    QUnit.deepEqual(got, exp, 'combine leg (dupli)');

    // これからスタートするところ(body を調べる)
    set = [];
    combs = [ { skillComb: { '攻撃': 4, '匠': 0, '聴覚保護': 0 }, equips: [ 'b400' ] },
              { skillComb: { '攻撃': 3, '匠': 1, '聴覚保護': 0 }, equips: [ 'b310' ] },
              { skillComb: { '攻撃': 3, '匠': 0, '聴覚保護': 1 }, equips: [ 'b301' ] },
              { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, equips: [ 'b211' ] },
              { skillComb: { '攻撃': 0, '匠': 4, '聴覚保護': 0 }, equips: [ 'b040' ] },
              { skillComb: { '攻撃': 1, '匠': 3, '聴覚保護': 0 }, equips: [ 'b130' ] },
              { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 1 }, equips: [ 'b031' ] },
              { skillComb: { '攻撃': 1, '匠': 2, '聴覚保護': 1 }, equips: [ 'b121' ] },
              { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 4 }, equips: [ 'b004' ] },
              { skillComb: { '攻撃': 1, '匠': 0, '聴覚保護': 3 }, equips: [ 'b103' ] },
              { skillComb: { '攻撃': 0, '匠': 1, '聴覚保護': 3 }, equips: [ 'b013' ] },
              { skillComb: { '攻撃': 1, '匠': 1, '聴覚保護': 2 }, equips: [ 'b112' ] } ];
    borderLine = { body: { '攻撃': 1, '匠': 1, '聴覚保護': 1 },
                   sum: { body: 3 } };
    got = c._combine(set, combs, borderLine, 'body');
    exp = [ [ { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, equips: [ 'b211' ] } ],
            [ { skillComb: { '攻撃': 1, '匠': 2, '聴覚保護': 1 }, equips: [ 'b121' ] } ],
            [ { skillComb: { '攻撃': 1, '匠': 1, '聴覚保護': 2 }, equips: [ 'b112' ] } ] ];
    QUnit.deepEqual(got, exp, 'combine body (done: none)');

    got = c._combine(null, combs, borderLine, 'body');
    QUnit.deepEqual(got, exp, 'null');
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
           test(this.QUnit, this.simu.Equip.Combinator, this.myapp);
       }
);
