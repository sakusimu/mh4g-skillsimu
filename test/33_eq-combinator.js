(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', '../lib/equip/combinator.js',
             '../lib/util/comb.js', './lib/driver-myapp.js' ];
define(deps, function (QUnit, Combinator, Util, myapp) {

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
           test(this.QUnit, this.simu.Equip.Combinator, this.simu.Util.Comb, this.myapp);
       }
);
