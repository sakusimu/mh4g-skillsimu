(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', 'underscore',
             '../lib/deco/combinator.js', '../lib/deco/normalizer.js',
             './lib/driver-myapp.js' ];
define(deps, function (QUnit, _, Combinator, Normalizer, myapp) {

QUnit.module('42_deco-combinator', {
    setup: function () {
        myapp.initialize();
    }
});

QUnit.test('Combinator', function () {
    QUnit.strictEqual(typeof Combinator, 'function', 'is function');
});

QUnit.test('new', function () {
    var got;

    got = new Combinator();

    QUnit.strictEqual(typeof got, 'object', 'is object');
    QUnit.strictEqual(typeof got.initialize, 'function', 'has initialize()');
});

QUnit.test('_combine', function () {
    var got, exp,
        decombList, decombs, borderLine,
        c = new Combinator();

    // body, head, arm まで終わってて、これから waist を処理するところ。
    // borderLine を上回るポイントとなる組み合わせを求める。
    decombList = [
        { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, slot: 3, names: [ 'b500' ] },
        { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, slot: 2, names: [ 'h030' ] },
        { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, slot: 1, names: [ 'a001' ] }
    ];
    decombs = [
        { skillComb: { '攻撃': 4, '匠': 0, '聴覚保護': 0 }, slot: 2, names: [ 'w400' ] },
        { skillComb: { '攻撃': 3, '匠': 1, '聴覚保護': 0 }, slot: 2, names: [ 'w310' ] },
        { skillComb: { '攻撃': 3, '匠': 0, '聴覚保護': 1 }, slot: 2, names: [ 'w301' ] },
        { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, slot: 2, names: [ 'w211' ] },
        { skillComb: { '攻撃': 0, '匠': 4, '聴覚保護': 0 }, slot: 2, names: [ 'w040' ] },
        { skillComb: { '攻撃': 1, '匠': 3, '聴覚保護': 0 }, slot: 2, names: [ 'w130' ] },
        { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 1 }, slot: 2, names: [ 'w031' ] },
        { skillComb: { '攻撃': 1, '匠': 2, '聴覚保護': 1 }, slot: 2, names: [ 'w121' ] },
        { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 4 }, slot: 2, names: [ 'w004' ] },
        { skillComb: { '攻撃': 1, '匠': 0, '聴覚保護': 3 }, slot: 2, names: [ 'w103' ] },
        { skillComb: { '攻撃': 0, '匠': 1, '聴覚保護': 3 }, slot: 2, names: [ 'w013' ] },
        { skillComb: { '攻撃': 1, '匠': 1, '聴覚保護': 2 }, slot: 2, names: [ 'w112' ] }
    ];
    borderLine = { waist: { '攻撃': 6, '匠': 4, '聴覚保護': 2 },
                   sum: { waist: 12 },
                   goal: { '攻撃': 20, '匠': 10, '聴覚保護': 10 } };
    got = c._combine(decombList, decombs, borderLine, 'waist');
    exp = [
        [ { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, slot: 3, names: [ 'b500' ] },
          { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, slot: 2, names: [ 'h030' ] },
          { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, slot: 1, names: [ 'a001' ] },
          { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, slot: 2, names: [ 'w211' ] } ],
        [ { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, slot: 3, names: [ 'b500' ] },
          { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, slot: 2, names: [ 'h030' ] },
          { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, slot: 1, names: [ 'a001' ] },
          { skillComb: { '攻撃': 1, '匠': 2, '聴覚保護': 1 }, slot: 2, names: [ 'w121' ] } ],
        [ { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, slot: 3, names: [ 'b500' ] },
          { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, slot: 2, names: [ 'h030' ] },
          { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, slot: 1, names: [ 'a001' ] },
          { skillComb: { '攻撃': 1, '匠': 1, '聴覚保護': 2 }, slot: 2, names: [ 'w112' ] } ]
    ];
    QUnit.deepEqual(got, exp, 'combine waist (done: body, head, arm)');

    // スロ2で見つかってもスロ3も見つける
    decombList = [
        { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, slot: 3, names: [ 'b500' ] },
        { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, slot: 2, names: [ 'h030' ] },
        { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, slot: 1, names: [ 'a001' ] } ];
    decombs = [
        { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, slot: 2, names: [ 'w211' ] },
        { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 2 }, slot: 3, names: [ 'w212' ] }
    ];
    borderLine = { waist: { '攻撃': 6, '匠': 4, '聴覚保護': 2 },
                   sum: { waist: 12 },
                   goal: { '攻撃': 20, '匠': 10, '聴覚保護': 10 } };
    got = c._combine(decombList, decombs, borderLine, 'waist');
    exp = [
        [ { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, slot: 3, names: [ 'b500' ] },
          { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, slot: 2, names: [ 'h030' ] },
          { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, slot: 1, names: [ 'a001' ] },
          { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, slot: 2, names: [ 'w211' ] } ],
        [ { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, slot: 3, names: [ 'b500' ] },
          { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, slot: 2, names: [ 'h030' ] },
          { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, slot: 1, names: [ 'a001' ] },
          { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 2 }, slot: 3, names: [ 'w212' ] } ]
    ];
    QUnit.deepEqual(got, exp, 'combine waist (not skip slot3)');

    // 胴系統倍化があってもOK
    decombList = [ // '攻撃': 16, '斬れ味': 8
        { skillComb: { '攻撃': 4, '斬れ味': 2 }, slot: 3, names: [ 'b42' ] },
        { skillComb: { '胴系統倍化': 1 }, slot: 0, names: [ 'h=b' ] },
        { skillComb: { '攻撃': 3, '斬れ味': 3 }, slot: 1, names: [ 'a33' ] },
        { skillComb: { '攻撃': 5, '斬れ味': 1 }, slot: 2, names: [ 'w51' ] }
    ];
    decombs = [
        { skillComb: { '攻撃': 0, '斬れ味': 0 }, slot: 0, names: [ 'slot0' ] },
        { skillComb: { '胴系統倍化': 1 }, slot: 0, names: [ 'l=b' ] },
        { skillComb: { '攻撃': 3, '斬れ味': 3 }, slot: 1, names: [ 'l33' ] },
        { skillComb: { '攻撃': 5, '斬れ味': 0 }, slot: 2, names: [ 'l50' ] },
        { skillComb: { '攻撃': 4, '斬れ味': 2 }, slot: 3, names: [ 'l42' ] }
    ];
    borderLine = { leg: { '攻撃': 20, '斬れ味': 10 },
                   sum: { leg: 30 },
                   goal: { '攻撃': 20, '斬れ味': 10 } };
    got = c._combine(decombList, decombs, borderLine, 'leg');
    exp = [
        [ { skillComb: { '攻撃': 4, '斬れ味': 2 }, slot: 3, names: [ 'b42' ] },
          { skillComb: { '胴系統倍化': 1 }, slot: 0, names: [ 'h=b' ] },
          { skillComb: { '攻撃': 3, '斬れ味': 3 }, slot: 1, names: [ 'a33' ] },
          { skillComb: { '攻撃': 5, '斬れ味': 1 }, slot: 2, names: [ 'w51' ] },
          { skillComb: { '胴系統倍化': 1 }, slot: 0, names: [ 'l=b' ] } ],
        [ { skillComb: { '攻撃': 4, '斬れ味': 2 }, slot: 3, names: [ 'b42' ] },
          { skillComb: { '胴系統倍化': 1 }, slot: 0, names: [ 'h=b' ] },
          { skillComb: { '攻撃': 3, '斬れ味': 3 }, slot: 1, names: [ 'a33' ] },
          { skillComb: { '攻撃': 5, '斬れ味': 1 }, slot: 2, names: [ 'w51' ] },
          { skillComb: { '攻撃': 4, '斬れ味': 2 }, slot: 3, names: [ 'l42' ] } ]
    ];
    QUnit.deepEqual(got, exp, 'combine leg (torsoUp)');

    // これからスタートするところ(body を調べる)
    decombList = [];
    decombs = [
        { skillComb: { '攻撃': 4, '匠': 0, '聴覚保護': 0 }, slot: 2, names: [ 'b400' ] },
        { skillComb: { '攻撃': 3, '匠': 1, '聴覚保護': 0 }, slot: 2, names: [ 'b310' ] },
        { skillComb: { '攻撃': 3, '匠': 0, '聴覚保護': 1 }, slot: 2, names: [ 'b301' ] },
        { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, slot: 2, names: [ 'b211' ] },
        { skillComb: { '攻撃': 0, '匠': 4, '聴覚保護': 0 }, slot: 2, names: [ 'b040' ] },
        { skillComb: { '攻撃': 1, '匠': 3, '聴覚保護': 0 }, slot: 2, names: [ 'b130' ] },
        { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 1 }, slot: 2, names: [ 'b031' ] },
        { skillComb: { '攻撃': 1, '匠': 2, '聴覚保護': 1 }, slot: 2, names: [ 'b121' ] },
        { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 4 }, slot: 2, names: [ 'b004' ] },
        { skillComb: { '攻撃': 1, '匠': 0, '聴覚保護': 3 }, slot: 2, names: [ 'b103' ] },
        { skillComb: { '攻撃': 0, '匠': 1, '聴覚保護': 3 }, slot: 2, names: [ 'b013' ] },
        { skillComb: { '攻撃': 1, '匠': 1, '聴覚保護': 2 }, slot: 2, names: [ 'b112' ] }
    ];
    borderLine = { body: { '攻撃': 1, '匠': 1, '聴覚保護': 1 },
                   sum: { body: 3 },
                   goal: { '攻撃': 20, '匠': 10, '聴覚保護': 10 } };
    got = c._combine(decombList, decombs, borderLine, 'body');
    exp = [
        [ { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, slot: 2, names: [ 'b211' ] } ],
        [ { skillComb: { '攻撃': 1, '匠': 2, '聴覚保護': 1 }, slot: 2, names: [ 'b121' ] } ],
        [ { skillComb: { '攻撃': 1, '匠': 1, '聴覚保護': 2 }, slot: 2, names: [ 'b112' ] } ]
    ];
    QUnit.deepEqual(got, exp, 'combine body (done: none)');

    // 既に borderLine を満たしている
    decombList = [
        { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, slot: 3, names: [ 'b500' ] },
        { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, slot: 2, names: [ 'h030' ] },
        { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, slot: 1, names: [ 'a001' ] } ];
    decombs = [
        { skillComb: { '攻撃': 1, '匠': 1, '聴覚保護': 1 }, slot: 1, names: [ 'w111' ] },
        { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, slot: 2, names: [ 'w211' ] },
        { skillComb: { '攻撃': 3, '匠': 1, '聴覚保護': 1 }, slot: 3, names: [ 'w311' ] }
    ];
    borderLine = { waist: { '攻撃': 4, '匠': 2, '聴覚保護': 1 },
                   sum: { waist: 7 },
                   goal: { '攻撃': 20, '匠': 10, '聴覚保護': 10 } };
    got = c._combine(decombList, decombs, borderLine, 'waist');
    exp = [
        [ { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, slot: 3, names: [ 'b500' ] },
          { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, slot: 2, names: [ 'h030' ] },
          { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, slot: 1, names: [ 'a001' ] },
          { skillComb: { '攻撃': 1, '匠': 1, '聴覚保護': 1 }, slot: 1, names: [ 'w111' ] } ],
        [ { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, slot: 3, names: [ 'b500' ] },
          { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, slot: 2, names: [ 'h030' ] },
          { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, slot: 1, names: [ 'a001' ] },
          { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, slot: 2, names: [ 'w211' ] } ],
        [ { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, slot: 3, names: [ 'b500' ] },
          { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, slot: 2, names: [ 'h030' ] },
          { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, slot: 1, names: [ 'a001' ] },
          { skillComb: { '攻撃': 3, '匠': 1, '聴覚保護': 1 }, slot: 3, names: [ 'w311' ] } ]
    ];
    QUnit.deepEqual(got, exp, 'combine waist (already above)');

    // decombList が []
    decombList = [];
    decombs = [
        { skillComb: { '攻撃': 1, '匠': 1, '聴覚保護': 1 }, slot: 1, names: [ 'b111' ] },
        { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, slot: 2, names: [ 'b211' ] },
        { skillComb: { '攻撃': 3, '匠': 1, '聴覚保護': 1 }, slot: 3, names: [ 'b311' ] }
    ];
    borderLine = { waist: { '攻撃': 2, '匠': 1, '聴覚保護': 1 },
                   sum: { body: 4 },
                   goal: { '攻撃': 20, '匠': 10, '聴覚保護': 10 } };
    got = c._combine(decombList, decombs, borderLine, 'body');
    exp = [
        [ { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, slot: 2, names: [ 'b211' ] } ],
        [ { skillComb: { '攻撃': 3, '匠': 1, '聴覚保護': 1 }, slot: 3, names: [ 'b311' ] } ]
    ];
    QUnit.deepEqual(got, exp, 'decombList is null');

    // decombs が []
    decombList = [
        { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, slot: 3, names: [ 'b500' ] },
        { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, slot: 2, names: [ 'h030' ] },
        { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, slot: 1, names: [ 'a001' ] } ];
    decombs = [];
    borderLine = { waist: { '攻撃': 6, '匠': 4, '聴覚保護': 2 },
                   sum: { waist: 12 },
                   goal: { '攻撃': 20, '匠': 10, '聴覚保護': 10 } };
    got = c._combine(decombList, decombs, borderLine, 'waist');
    exp = [
        [ { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, slot: 3, names: [ 'b500' ] },
          { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, slot: 2, names: [ 'h030' ] },
          { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, slot: 1, names: [ 'a001' ] },
          null ]
    ];
    QUnit.deepEqual(got, exp, 'decombs is []');
});

QUnit.test('_removeOverlap', function () {
    var got, exp, deCombsSets,
        c = new Combinator();

    deCombsSets = [
        { // a1*3, a3*2, b2*2
            body: { names: [ 'a3' ] },
            head: { names: [ 'a1' ] },
             arm: { names: [ 'a1', 'a1' ] },
           waist: { names: [] },
             leg: { names: [ 'b2' ] },
          weapon: { names: [ 'b2' ] },
             oma: { names: [ 'a3' ] } },
        { // a1*3, a3*2, b2*2
            body: { names: [ 'a3' ] },
            head: { names: [ 'a1' ] },
             arm: { names: [ 'a1', 'a1' ] },
           waist: null,
             leg: { names: [ 'b2' ] },
          weapon: { names: [ 'b2' ] },
             oma: { names: [ 'a3' ] } },
        { // a1*3, a3*2, b2*2
            body: { names: [ 'a3' ] },
            head: { names: [ 'a1' ] },
             arm: { names: [ 'b2' ] },
           waist: { names: [] },
             leg: { names: [ 'a1', 'a1' ] },
          weapon: { names: [ 'b2' ] },
             oma: { names: [ 'a3' ] } },
        { // a1*2, a2*1, a3*2, b2*2
            body: { names: [ 'a3' ] },
            head: { names: [ 'a1' ] },
             arm: { names: [ 'a1', 'a2' ] },
           waist: { names: [] },
             leg: { names: [ 'b2' ] },
          weapon: { names: [ 'b2' ] },
             oma: { names: [ 'a3' ] } }
    ];
    got = c._removeOverlap(deCombsSets);
    exp = [
        { // a1*3, a3*2, b2*2
            body: { names: [ 'a3' ] },
            head: { names: [ 'a1' ] },
             arm: { names: [ 'a1', 'a1' ] },
           waist: { names: [] },
             leg: { names: [ 'b2' ] },
          weapon: { names: [ 'b2' ] },
             oma: { names: [ 'a3' ] } },
        { // a1*2, a2*1, a3*2, b2*2
            body: { names: [ 'a3' ] },
            head: { names: [ 'a1' ] },
             arm: { names: [ 'a1', 'a2' ] },
           waist: { names: [] },
             leg: { names: [ 'b2' ] },
          weapon: { names: [ 'b2' ] },
             oma: { names: [ 'a3' ] } }
    ];
    QUnit.deepEqual(got, exp, 'case 1');
});

QUnit.test('combine', function () {
    var got, exp, decombsSet,
        c = new Combinator();

    // スキルが発動するパターンを見つけられるかをテストしたいので names はテキトー
    decombsSet = {
        body:
        [ { skillComb: { '攻撃': 7, '匠': 0, '聴覚保護': 1 }, slot: 2, names: [ 'b701' ] },
          { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 2 }, slot: 2, names: [ 'b422' ] },
          { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, slot: 2, names: [ 'b521' ] } ]
      , head:
        [ { skillComb: { '攻撃': 7, '匠': 1, '聴覚保護': 1 }, slot: 2, names: [ 'h711' ] },
          { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, slot: 2, names: [ 'h521' ] },
          { skillComb: { '攻撃': 6, '匠': 2, '聴覚保護': 0 }, slot: 2, names: [ 'h620' ] } ]
      , arm:
        [ { skillComb: { '攻撃': 6, '匠': 2, '聴覚保護': 0 }, slot: 2, names: [ 'a620' ] },
          { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 }, slot: 2, names: [ 'a331' ] },
          { skillComb: { '攻撃': 4, '匠': 3, '聴覚保護': 0 }, slot: 2, names: [ 'a430' ] } ]
      , waist:
        [ { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, slot: 2, names: [ 'w521' ] },
          { skillComb: { '攻撃': 2, '匠': 3, '聴覚保護': 2 }, slot: 2, names: [ 'w232' ] },
          { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 }, slot: 2, names: [ 'w331' ] } ]
      , leg:
        [ { skillComb: { '攻撃': 6, '匠': 0, '聴覚保護': 4 }, slot: 2, names: [ 'l604' ] },
          { skillComb: { '攻撃': 3, '匠': 2, '聴覚保護': 4 }, slot: 2, names: [ 'l324' ] },
          { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 3 }, slot: 2, names: [ 'l423' ] } ]
    };

    got = c.combine([ '攻撃力UP【大】', '斬れ味レベル+1', '耳栓' ], decombsSet);
    exp = [
        { body:
          { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 2 }, slot: 2, names: [ 'b422' ] },
          head:
          { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, slot: 2, names: [ 'h521' ] },
          arm:
          { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 }, slot: 2, names: [ 'a331' ] },
          waist:
          { skillComb: { '攻撃': 2, '匠': 3, '聴覚保護': 2 }, slot: 2, names: [ 'w232' ] },
          leg:
          { skillComb: { '攻撃': 6, '匠': 0, '聴覚保護': 4 }, slot: 2, names: [ 'l604' ] },
          weapon: null,
          oma: null }
    ];
    QUnit.deepEqual(got, exp, 'combine');

    // body が []
    decombsSet = {
        body: []
      , head:
        [ { skillComb: { '攻撃': 7, '匠': 1, '聴覚保護': 1 }, slot: 2, names: [ 'h711' ] },
          { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, slot: 2, names: [ 'h521' ] },
          { skillComb: { '攻撃': 6, '匠': 2, '聴覚保護': 0 }, slot: 2, names: [ 'h620' ] } ]
      , arm:
        [ { skillComb: { '攻撃': 6, '匠': 2, '聴覚保護': 0 }, slot: 2, names: [ 'a620' ] },
          { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 }, slot: 2, names: [ 'a331' ] },
          { skillComb: { '攻撃': 4, '匠': 3, '聴覚保護': 0 }, slot: 2, names: [ 'a430' ] } ]
      , waist:
        [ { skillComb: { '胴系統倍化': 1 }, slot: 2, names: [ 'torusoUp' ] } ]
      , leg:
        [ { skillComb: { '攻撃': 7, '匠': 0, '聴覚保護': 1 }, slot: 2, names: [ 'b701' ] },
          { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 2 }, slot: 2, names: [ 'b422' ] },
          { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, slot: 2, names: [ 'b521' ] } ]
      , weapon:
        [ { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, slot: 2, names: [ 'w521' ] },
          { skillComb: { '攻撃': 2, '匠': 3, '聴覚保護': 2 }, slot: 2, names: [ 'w232' ] },
          { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 }, slot: 2, names: [ 'w331' ] } ]
      , oma:
        [ { skillComb: { '攻撃': 6, '匠': 0, '聴覚保護': 4 }, slot: 2, names: [ 'l604' ] },
          { skillComb: { '攻撃': 3, '匠': 2, '聴覚保護': 4 }, slot: 2, names: [ 'l324' ] },
          { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 3 }, slot: 2, names: [ 'l423' ] } ]
    };
    got = c.combine([ '攻撃力UP【大】', '斬れ味レベル+1', '耳栓' ], decombsSet);
    exp = [
        { body: null,
          head: 
          { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, slot: 2, names: [ 'h521' ] },
          arm: 
          { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 }, slot: 2, names: [ 'a331' ] },
          waist:
          { skillComb: { '胴系統倍化': 1 }, slot: 2, names: [ 'torusoUp' ] },
          leg: 
          { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 2 }, slot: 2, names: [ 'b422' ] },
          weapon: 
          { skillComb: { '攻撃': 2, '匠': 3, '聴覚保護': 2 }, slot: 2, names: [ 'w232' ] },
          oma: 
          { skillComb: { '攻撃': 6, '匠': 0, '聴覚保護': 4 }, slot: 2, names: [ 'l604' ] } }
    ];
    QUnit.deepEqual(got, exp, 'combine: body is []');

    got = c.combine();
    QUnit.deepEqual(got, [], 'nothing in');
    got = c.combine(undefined);
    QUnit.deepEqual(got, [], 'undefined');
    got = c.combine(null);
    QUnit.deepEqual(got, [], 'null');
    got = c.combine([]);
    QUnit.deepEqual(got, [], '[]');

    got = c.combine([ '攻撃力UP【大】' ]);
    QUnit.deepEqual(got, [], 'skillNames only');
    got = c.combine([ '攻撃力UP【大】' ], undefined);
    QUnit.deepEqual(got, [], 'skillNames, undefined');
    got = c.combine([ '攻撃力UP【大】' ], null);
    QUnit.deepEqual(got, [], 'skillNames, null');
    got = c.combine([ '攻撃力UP【大】' ], {});
    QUnit.deepEqual(got, [], 'skillNames, {}');
});

QUnit.test('combine: torsoUp & weaponSlot & oma', function () {
    var got, exp,
        n = new Normalizer(),
        c = new Combinator();

    // 頑シミュさんの装飾品検索の結果と比較しやすくする
    var simplify = function (decombSets) {
        return _.map(decombSets, function (decombSet) {
            var names = _.map(decombSet, function (decomb, part) {
                var names = decomb.names;
                if (part === 'body') names = _.map(names, function (n) { return n += '(胴)'; });
                return names;
            });
            names = _.flatten(names);
            return names.sort().join(',');
        });
    };

    var skills = [ '斬れ味レベル+1', '高級耳栓' ];

    // 装備に胴系統倍化、武器スロ、お守りがある場合
    var omas = [ [ '龍の護石',3,'匠',4,'氷耐性',-5 ] ];
    omas = myapp.model.Oma.createSimuData(omas);
    var equipSet = {
        head  : myapp.equips('head', 'ユクモノカサ・天')[0]  // スロ2
      , body  : myapp.equips('body', '三眼の首飾り')[0]      // スロ3
      , arm   : myapp.equips('arm', 'ユクモノコテ・天')[0]   // スロ2
      , waist : myapp.equips('waist', 'バンギスコイル')[0]   // 胴系統倍化
      , leg   : myapp.equips('leg', 'ユクモノハカマ・天')[0] // スロ2
      , weapon: { name: 'slot2' }
      , oma   : omas[0]
    };
    var decombsSet  = n.normalize(skills, equipSet);
    var decombsSets = c.combine(skills, decombsSet);
    got = simplify(decombsSets);
    exp = [
        '匠珠【３】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【３】(胴)',
        '匠珠【２】,匠珠【２】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【３】,防音珠【３】(胴)',
        '匠珠【３】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【３】(胴)',
        '匠珠【２】,匠珠【２】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【３】(胴)',
        '匠珠【２】,匠珠【２】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【１】,防音珠【３】,防音珠【３】(胴)'
    ];
    QUnit.deepEqual(got, exp, 'combine');
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
           test(this.QUnit, this._,
                this.simu.Deco.Combinator, this.simu.Deco.Normalizer, this.myapp);
       }
);
