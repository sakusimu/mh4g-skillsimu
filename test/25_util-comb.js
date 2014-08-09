(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', '../lib/util/comb.js', './lib/driver-myapp.js' ];
define(deps, function (QUnit, Comb, myapp) {

QUnit.module('25_util-comb', {
    setup: function () {
        myapp.initialize();
    }
});

QUnit.test('Comb', function () {
    QUnit.strictEqual(typeof Comb, 'object', 'is object');
});

QUnit.test('parts', function () {
    var got, exp;

    got = Comb.parts;
    exp = [ 'body', 'head', 'arm', 'waist', 'leg', 'weapon', 'oma' ];
    QUnit.deepEqual(got, exp, 'parts');
});

QUnit.test('activates', function () {
    var got, goal, sc;

    sc   = { a: 20, b: 10 };
    goal = { a: 20, b: 10 };
    got = Comb.activates(sc, goal);
    QUnit.deepEqual(got, true, 'case 1');

    sc   = { a: 19, b: 10 };
    goal = { a: 20, b: 10 };
    got = Comb.activates(sc, goal);
    QUnit.deepEqual(got, false, 'case 2');

    sc   = { a: 21, b: 10 };
    goal = { a: 20, b: 10 };
    got = Comb.activates(sc, goal);
    QUnit.deepEqual(got, true, 'case 3');

    sc   = { a: 20 };
    goal = { a: 20, b: 10 };
    got = Comb.activates(sc, goal);
    QUnit.deepEqual(got, false, 'case 4');

    sc   = { a: 20, b: 10, '胴系統倍化': 1 };
    goal = { a: 20, b: 10 };
    got = Comb.activates(sc, goal);
    QUnit.deepEqual(got, true, 'torsoUp');

    sc   = {};
    goal = { a: 0, b: 0 };
    got = Comb.activates(sc, goal);
    QUnit.deepEqual(got, true, 'already activate');

    sc   = { a: 20, b: 10 };
    goal = null;
    var fn = function () { Comb.activates(sc, goal); };
    QUnit.throws(fn, /goal is required/, 'goal is required');
});

QUnit.test('justActivates', function () {
    var got, goal, sc;

    sc   = { a: 20, b: 10 };
    goal = { a: 20, b: 10 };
    got = Comb.justActivates(sc, goal);
    QUnit.deepEqual(got, true, 'case 1');

    sc   = { a: 19, b: 10 };
    goal = { a: 20, b: 10 };
    got = Comb.justActivates(sc, goal);
    QUnit.deepEqual(got, false, 'case 2');

    sc   = { a: 21, b: 10 };
    goal = { a: 20, b: 10 };
    got = Comb.justActivates(sc, goal);
    QUnit.deepEqual(got, false, 'case 3');

    sc   = { a: 20 };
    goal = { a: 20, b: 10 };
    got = Comb.justActivates(sc, goal);
    QUnit.deepEqual(got, false, 'case 4');

    sc   = { a: 20, b: 10, '胴系統倍化': 1 };
    goal = { a: 20, b: 10 };
    got = Comb.justActivates(sc, goal);
    QUnit.deepEqual(got, true, 'torsoUp');

    sc   = {};
    goal = { a: 0, b: 0 };
    got = Comb.justActivates(sc, goal);
    QUnit.deepEqual(got, true, 'already activate');

    sc   = { a: 20, b: 10 };
    goal = null;
    var fn = function () { Comb.justActivates(sc, goal); };
    QUnit.throws(fn, /goal is required/, 'goal is required');
});

QUnit.test('_calcMaxEachSkillPoint', function () {
    var got, exp, combsSet;

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
    got = Comb._calcMaxEachSkillPoint(combsSet);
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
    got = Comb._calcMaxEachSkillPoint(combsSet);
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
    got = Comb._calcMaxEachSkillPoint(combsSet);
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
    got = Comb._calcMaxEachSkillPoint(combsSet);
    exp = { 'a': { head: 1, body: 0, arm: 5, waist: 1, leg: 0, weapon: 0, oma: 0 },
            'b': { head: 1, body: 0, arm: 2, waist: 3, leg: 0, weapon: 0, oma: 0 } };
    QUnit.deepEqual(got, exp, 'torso up: body is null');

    got = Comb._calcMaxEachSkillPoint();
    QUnit.deepEqual(got, null, 'nothing in');
    got = Comb._calcMaxEachSkillPoint(undefined);
    QUnit.deepEqual(got, null, 'undefined');
    got = Comb._calcMaxEachSkillPoint(null);
    QUnit.deepEqual(got, null, 'null');
});

QUnit.test('_calcMaxSumSkillPoint', function () {
    var got, exp, combsSet;

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
    got = Comb._calcMaxSumSkillPoint(combsSet);
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
    got = Comb._calcMaxSumSkillPoint(combsSet);
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
    got = Comb._calcMaxSumSkillPoint(combsSet);
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
    got = Comb._calcMaxSumSkillPoint(combsSet);
    exp = { head: 1, body: 0, arm: 5, waist: 3, leg: 0, weapon: 0, oma: 0 };
    QUnit.deepEqual(got, exp, 'torso up: body is null');

    got = Comb._calcMaxSumSkillPoint();
    QUnit.deepEqual(got, null, 'nothing in');
    got = Comb._calcMaxSumSkillPoint(undefined);
    QUnit.deepEqual(got, null, 'undefined');
    got = Comb._calcMaxSumSkillPoint(null);
    QUnit.deepEqual(got, null, 'null');
});

QUnit.test('calcBorderLine', function () {
    var got, exp, combsSet;

    combsSet = {
        head: [
            { skillComb: { '攻撃': 3, '斬れ味': 2 } },
            { skillComb: { '攻撃': 6, '斬れ味': 0 } },
            { skillComb: { '攻撃': 0, '斬れ味': 4 } },
            { skillComb: { '攻撃': 1, '斬れ味': 3 } },
            { skillComb: { '攻撃': 4, '斬れ味': 1 } } ]
      , body: [
            { skillComb: { '攻撃': 2, '斬れ味': 1 } } ]
      , arm: [
            { skillComb: { '攻撃': 3, '斬れ味': 2 } } ]
      , waist: [
            { skillComb: { '攻撃': 2, '斬れ味': 3 } } ]
      , leg: [
            { skillComb: { '攻撃': 1, '斬れ味': 2 } } ]
      , oma: [
            { skillComb: { '攻撃': 4, '斬れ味': 0 } },
            { skillComb: { '攻撃': 0, '斬れ味': 2 } } ]
    };
    // {   '攻撃': { body: 2, head: 6, arm: 3, waist: 2, leg: 1, weapon: 0, oma: 4 },
    //   '斬れ味': { body: 1, head: 4, arm: 2, waist: 3, leg: 2, weapon: 0, oma: 2 } }
    // { body: 3, head: 6, arm: 5, waist: 5, leg: 3, weapon: 0, oma: 4 }
    got = Comb.calcBorderLine(combsSet, [ '攻撃力UP【大】', '業物' ]);
    exp = { body: { '攻撃': 4, '斬れ味': -3 },
            head: { '攻撃': 10, '斬れ味': 1 },
             arm: { '攻撃': 13, '斬れ味': 3 },
           waist: { '攻撃': 15, '斬れ味': 6 },
             leg: { '攻撃': 16, '斬れ味': 8 },
          weapon: { '攻撃': 16, '斬れ味': 8 },
             oma: { '攻撃': 20, '斬れ味': 10 },
             sum: { body: 7, head: 13, arm: 18, waist: 23, leg: 26, weapon: 26, oma: 30 },
            goal: { '攻撃': 20, '斬れ味': 10 } };
    QUnit.deepEqual(got, exp, 'calc');

    // undefined, null, [] を含む場合
    combsSet = {
        head: [
            { skillComb: { '攻撃': 3, '斬れ味': 2 } },
            { skillComb: { '攻撃': 6, '斬れ味': 0 } },
            { skillComb: { '攻撃': 0, '斬れ味': 4 } },
            { skillComb: { '攻撃': 1, '斬れ味': 3 } },
            { skillComb: { '攻撃': 4, '斬れ味': 1 } } ]
      , body: [
            { skillComb: { '攻撃': 7, '斬れ味': 6 } } ]
      , waist: []
      , leg: [
            { skillComb: { '攻撃': 5, '斬れ味': 4 } } ]
    };
    got = Comb.calcBorderLine(combsSet, [ '攻撃力UP【大】', '業物' ]);
    exp = { body: { '攻撃': 9, '斬れ味': 2 },
            head: { '攻撃': 15, '斬れ味': 6 },
             arm: { '攻撃': 15, '斬れ味': 6 },
           waist: { '攻撃': 15, '斬れ味': 6 },
             leg: { '攻撃': 20, '斬れ味': 10 },
          weapon: { '攻撃': 20, '斬れ味': 10 },
             oma: { '攻撃': 20, '斬れ味': 10 },
             sum: { body: 15, head: 21, arm: 21, waist: 21, leg: 30, weapon: 30, oma: 30 },
            goal: { '攻撃': 20, '斬れ味': 10 } };
    QUnit.deepEqual(got, exp, 'within: undefined, null, []');

    // 胴系統倍化
    combsSet = {
        head: [
            { skillComb: { '攻撃': 2, '斬れ味': 0 } },
            { skillComb: { '攻撃': 0, '斬れ味': 1 } },
            { skillComb: { '胴系統倍化': 1 } } ]
      , body: [
            { skillComb: { '攻撃': 4, '斬れ味': 2 } } ]
      , arm: [
            { skillComb: { '攻撃': 3, '斬れ味': 3 } },
            { skillComb: { '攻撃': 0, '斬れ味': 4 } },
            { skillComb: { '攻撃': 5, '斬れ味': 0 } },
            { skillComb: { '胴系統倍化': 1 } } ]
      , waist: [
            { skillComb: { '攻撃': 5, '斬れ味': 1 } },
            { skillComb: { '攻撃': 3, '斬れ味': 2 } } ]
      , leg: [
            { skillComb: { '攻撃': 5, '斬れ味': 0 } },
            { skillComb: { '攻撃': 3, '斬れ味': 3 } },
            { skillComb: { '攻撃': 0, '斬れ味': 4 } },
            { skillComb: { '胴系統倍化': 1 } } ]
    };
    got = Comb.calcBorderLine(combsSet, [ '攻撃力UP【大】', '業物' ]);
    exp = { body: { '攻撃': 1, '斬れ味': -2 },
            head: { '攻撃': 5, '斬れ味': 0 },
             arm: { '攻撃': 10, '斬れ味': 4 },
           waist: { '攻撃': 15, '斬れ味': 6 },
             leg: { '攻撃': 20, '斬れ味': 10 },
          weapon: { '攻撃': 20, '斬れ味': 10 },
             oma: { '攻撃': 20, '斬れ味': 10 },
             sum: { body: 6, head: 12, arm: 18, waist: 24, leg: 30, weapon: 30, oma: 30 },
            goal: { '攻撃': 20, '斬れ味': 10 } };
    QUnit.deepEqual(got, exp, 'torso up');

    // 胴系統倍化: body is null
    combsSet = {
        head: [
            { skillComb: { '攻撃': 2, '斬れ味': 0 } },
            { skillComb: { '攻撃': 0, '斬れ味': 1 } },
            { skillComb: { '胴系統倍化': 1 } } ]
      , body: null
      , arm: [
            { skillComb: { '攻撃': 3, '斬れ味': 3 } },
            { skillComb: { '攻撃': 0, '斬れ味': 4 } },
            { skillComb: { '攻撃': 5, '斬れ味': 0 } },
            { skillComb: { '胴系統倍化': 1 } } ]
      , waist: [
            { skillComb: { '攻撃': 5, '斬れ味': 1 } },
            { skillComb: { '攻撃': 3, '斬れ味': 2 } } ]
      , leg: [
            { skillComb: { '攻撃': 5, '斬れ味': 0 } },
            { skillComb: { '攻撃': 3, '斬れ味': 3 } },
            { skillComb: { '攻撃': 0, '斬れ味': 4 } },
            { skillComb: { '胴系統倍化': 1 } } ]
      , oma: [
            { skillComb: { '攻撃': 4, '斬れ味': 2 } } ]
    };
    // {   '攻撃': { body: 0, head: 2, arm: 5, waist: 5, leg: 5, weapon: 0, oma: 4 },
    //   '斬れ味': { body: 0, head: 1, arm: 4, waist: 2, leg: 4, weapon: 0, oma: 2 } }
    // { body: 0, head: 2, arm: 6, waist: 6, leg: 6, weapon: 6, oma: 6 }
    got = Comb.calcBorderLine(combsSet, [ '攻撃力UP【大】', '業物' ]);
    exp = { body: { '攻撃': -1, '斬れ味': -3 },
            head: { '攻撃': 1, '斬れ味': -2 },
             arm: { '攻撃': 6, '斬れ味': 2 },
           waist: { '攻撃': 11, '斬れ味': 4 },
             leg: { '攻撃': 16, '斬れ味': 8 },
          weapon: { '攻撃': 16, '斬れ味': 8 },
             oma: { '攻撃': 20, '斬れ味': 10 },
             sum: { body: 4, head: 6, arm: 12, waist: 18, leg: 24, weapon: 24, oma: 30 },
            goal: { '攻撃': 20, '斬れ味': 10 } };
    QUnit.deepEqual(got, exp, 'torso up: body is null');
});

QUnit.test('calcBorderLine: with subtracted', function () {
    var got, exp, combsSet, subtractedSet;

    var sangan = [
        { skillComb: { '匠': 0, '研ぎ師': 2 } },
        { skillComb: { '匠': 0, '研ぎ師': 4 } },
        { skillComb: { '匠': 1, '研ぎ師': 0 } },
        { skillComb: { '匠': 0, '研ぎ師': 6 } },
        { skillComb: { '匠': 1, '研ぎ師': 2 } },
        { skillComb: { '匠': 2, '研ぎ師': 0 } }
    ];

    subtractedSet = {
        oma: { skillComb: { '匠': 4 } }
    };
    combsSet = {
        head: sangan,
        body: sangan,
         arm: sangan,
       waist: sangan,
         leg: sangan,
         oma: sangan
    };
    got = Comb.calcBorderLine(combsSet, [ '斬れ味レベル+1', '砥石使用高速化' ], subtractedSet);
    exp = { body: { '匠': -4, '研ぎ師': -20 },
            head: { '匠': -2, '研ぎ師': -14 },
             arm: { '匠': 0, '研ぎ師': -8 },
           waist: { '匠': 2, '研ぎ師': -2 },
             leg: { '匠': 4, '研ぎ師': 4 },
          weapon: { '匠': 4, '研ぎ師': 4 },
             oma: { '匠': 6, '研ぎ師': 10 },
             sum: { body: -14, head: -8, arm: -2, waist: 4, leg: 10, weapon: 10, oma: 16 },
            goal: { '匠': 6, '研ぎ師': 10 } };
    QUnit.deepEqual(got, exp, 'calc');
});

QUnit.test('goal', function () {
    var got, exp;

    got = Comb.goal([ '攻撃力UP【大】', '業物' ]);
    exp = { '攻撃': 20, '斬れ味': 10 };
    QUnit.deepEqual(got, exp, "[ '攻撃力UP【大】', '業物' ]");

    got = Comb.goal([ 'なまくら' ]);
    exp = { '斬れ味': -10 };
    QUnit.deepEqual(got, exp, "[ 'なまくら' ]");

    got = Comb.goal();
    QUnit.strictEqual(got, null, 'nothing in');
    got = Comb.goal(undefined);
    QUnit.strictEqual(got, null, 'undefined');
    got = Comb.goal(null);
    QUnit.strictEqual(got, null, 'null');
    got = Comb.goal(null);
    QUnit.strictEqual(got, null, 'null');

    var fn = function () { Comb.goal([ '攻撃大' ]); };
    QUnit.throws(fn, /skill not found: 攻撃大/, 'not found');
});

QUnit.test('isOverMaxEachSkill', function () {
    var got, skillComb, borderLine;

    skillComb  = { a: 7, b: 4, c: 2 };
    borderLine = { arm: { a: 6, b: 4, c: 2 },
                   sum: { arm: 12 } };
    got = Comb.isOverMaxEachSkill(skillComb, borderLine, 'arm');
    QUnit.equal(got, true, 'over');

    skillComb  = { a: 6, b: 4, c: 2 };
    borderLine = { arm: { a: 6, b: 4, c: 2 },
                   sum: { arm: 12 } };
    got = Comb.isOverMaxEachSkill(skillComb, borderLine, 'arm');
    QUnit.equal(got, true, 'over: same');

    skillComb  = { a: 7, b: 4, c: 1 };
    borderLine = { arm: { a: 6, b: 4, c: 2 },
                   sum: { arm: 12 } };
    got = Comb.isOverMaxEachSkill(skillComb, borderLine, 'arm');
    QUnit.equal(got, false, 'not over');

    skillComb  = { a: 7, b: 4 };
    borderLine = { arm: { a: 6, b: 4, c: 2 },
                   sum: { arm: 12 } };
    got = Comb.isOverMaxEachSkill(skillComb, borderLine, 'arm');
    QUnit.equal(got, false, 'not over: no c');
});

QUnit.test('isOverMaxSumSkill', function () {
    var got, skillComb, borderLine;

    skillComb  = { a: 7, b: 4, c: 2 };
    borderLine = { arm: { a: 6, b: 4, c: 2 },
                   sum: { arm: 12 } };
    got = Comb.isOverMaxSumSkill(skillComb, borderLine, 'arm');
    QUnit.equal(got, true, 'over');

    skillComb  = { a: 6, b: 4, c: 2 };
    borderLine = { arm: { a: 6, b: 4, c: 2 },
                   sum: { arm: 12 } };
    got = Comb.isOverMaxSumSkill(skillComb, borderLine, 'arm');
    QUnit.equal(got, true, 'over: same');

    skillComb  = { a: 7, b: 4, c: 0 };
    borderLine = { arm: { a: 6, b: 4, c: 2 },
                   sum: { arm: 12 } };
    got = Comb.isOverMaxSumSkill(skillComb, borderLine, 'arm');
    QUnit.equal(got, false, 'not over');

    skillComb  = { a: 7, b: 4 };
    borderLine = { arm: { a: 6, b: 4, c: 2 },
                   sum: { arm: 12 } };
    got = Comb.isOverMaxSumSkill(skillComb, borderLine, 'arm');
    QUnit.equal(got, false, 'not over: no c');
});

QUnit.test('isOver', function () {
    var got, a, b;

    a = { a: 6, b: 4, c: 2 };
    b = { a: 7, b: 4, c: 2 };
    got = Comb.isOver(a, b);
    QUnit.equal(got, true, 'over');

    a = { a: 6, b: 4, c: 2 };
    b = { a: 6, b: 4, c: 2 };
    got = Comb.isOver(a, b);
    QUnit.equal(got, true, 'over: same');

    a = { a: 6, b: 4, c: 2 };
    b = { a: 7, b: 4, c: 1 };
    got = Comb.isOver(a, b);
    QUnit.equal(got, false, 'not over');

    a = { a: 6, b: 4, c: 2 };
    b = { a: 7, b: 4 };
    got = Comb.isOver(a, b);
    QUnit.equal(got, false, 'not over: no c');
});

QUnit.test('brushUp', function () {
    var got, exp, sets;

    sets = [ { body: 'comb1', cache: 'delete me' }, { body: 'comb2' } ];
    got = Comb.brushUp(sets);
    exp = [
        { body: 'comb1', head: null, arm: null, waist: null, leg: null,
          weapon: null, oma: null },
        { body: 'comb2', head: null, arm: null, waist: null, leg: null,
          weapon: null, oma: null }
    ];
    QUnit.deepEqual(got, exp, 'brush up');

    sets = [ {} ];
    got = Comb.brushUp(sets);
    exp = [
        { body: null, head: null, arm: null, waist: null, leg: null,
          weapon: null, oma: null }
    ];
    QUnit.deepEqual(got, exp, '[ {} ]');

    sets = [];
    got = Comb.brushUp(sets);
    exp = [];
    QUnit.deepEqual(got, exp, '[]');
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
           test(this.QUnit, this.simu.Util.Comb, this.myapp);
       }
);
