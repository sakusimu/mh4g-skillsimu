(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', '../lib/equip/combinator.js',
             '../lib/util/comb.js', '../lib/util/border-line.js', './lib/driver-myapp.js' ];
define(deps, function (QUnit, Combinator, Comb, BorderLine, myapp) {

QUnit.module('33_eq-combinator', {
    setup: function () {
        myapp.initialize();
    }
});

QUnit.test('Combinator', function () {
    QUnit.strictEqual(typeof Combinator, 'function', 'is function');
});

QUnit.test('new', function () {
    var c = new Combinator();
    QUnit.strictEqual(typeof c, 'object', 'is object');
    QUnit.strictEqual(typeof c.initialize, 'function', 'has initialize()');
});

QUnit.test('_sortBulks', function () {
    var got, exp, bulks,
        c = new Combinator();

    bulks = [
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
    QUnit.deepEqual(got, exp, "sort");

    // 胴系統倍化
    bulks = [
        { skillComb: { '攻撃': 3, '斬れ味': 2 } },
        { skillComb: { '攻撃': 0, '斬れ味': 0 } },
        { skillComb: { '攻撃': 1, '斬れ味': 3 } },
        { skillComb: { '胴系統倍化': 1 } },
        { skillComb: { '攻撃': 4, '斬れ味': 1 } }
    ];
    got = c._sortBulks(bulks);
    exp = [
        { skillComb: { '胴系統倍化': 1 } },
        { skillComb: { '攻撃': 3, '斬れ味': 2 } },
        { skillComb: { '攻撃': 4, '斬れ味': 1 } },
        { skillComb: { '攻撃': 1, '斬れ味': 3 } },
        { skillComb: { '攻撃': 0, '斬れ味': 0 } }
    ];
    QUnit.deepEqual(got, exp, "torsoUp");
});

QUnit.test('_makeBulksSetWithSlot0', function () {
    var got, exp, bulksSet,
        c = new Combinator();

    var bulks = [
        { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ '3,2' ] },
        { skillComb: { '攻撃': 5, '斬れ味': 0 }, equips: [ '5,0' ] },
        { skillComb: { '攻撃': 0, '斬れ味': 1 }, equips: [ '0,1' ] },
        { skillComb: { '攻撃': 0, '斬れ味': 6 }, equips: [ '0,6' ] },
        { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] },
        { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ '1,0' ] },
        { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ '4,1' ] }
    ];
    var slot0 = [
        { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] }
    ];

    bulksSet = {
        head : bulks,
        body : bulks.concat(slot0),
        arm  : bulks,
        waist: bulks.concat(slot0),
        leg  : bulks,
        // weapon: undefined
        oma  : null
    };
    got = c._makeBulksSetWithSlot0(bulksSet);
    exp = [
        { head : bulks,
          body : slot0,
          arm  : bulks,
          waist: bulks.concat(slot0),
          leg  : bulks,
          weapon: null, oma: null },
        { head : bulks,
          body : bulks.concat(slot0),
          arm  : bulks,
          waist: slot0,
          leg  : bulks,
          weapon: null, oma: null }
    ];
    QUnit.deepEqual(got, exp, 'make');
});

QUnit.test('_combineEquip', function () {
    var got, exp,
        bulksSet, bulks, borderLine, combSet,
        c = new Combinator();

    var skillNames = [ '攻撃力UP【大】', '業物' ];

    // body, head, arm, waist まで終わってて、これから leg を処理するところ。
    // borderLine を上回るポイントとなる組み合わせを求める。
    bulksSet = {
        head: [
            { skillComb: { '攻撃': 1, '斬れ味': 3 } } ],
        body: [
            { skillComb: { '攻撃': 5, '斬れ味': 1 } } ],
        arm: [
            { skillComb: { '攻撃': 1, '斬れ味': 3 } } ],
        waist: [
            { skillComb: { '攻撃': 5, '斬れ味': 1 } } ],
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
    borderLine = new BorderLine(skillNames, bulksSet);
    combSet = {
        head : { skillComb: { '攻撃': 1, '斬れ味': 3 } },
        body : { skillComb: { '攻撃': 5, '斬れ味': 1 } },
        arm  : { skillComb: { '攻撃': 1, '斬れ味': 3 } },
        waist: { skillComb: { '攻撃': 5, '斬れ味': 1 } },
        cache: { '攻撃': 12, '斬れ味': 8 }
    };
    bulks = [
        { skillComb: { '攻撃': 6, '斬れ味': 0 } },
        { skillComb: { '攻撃': 4, '斬れ味': 1 } },
        { skillComb: { '攻撃': 3, '斬れ味': 2 } },
        { skillComb: { '攻撃': 0, '斬れ味': 4 } },
        { skillComb: { '攻撃': 1, '斬れ味': 3 } }
    ];
    got = c._combineEquip(combSet, bulks, borderLine, 'leg');
    exp = [
        { head : { skillComb: { '攻撃': 1, '斬れ味': 3 } },
          body : { skillComb: { '攻撃': 5, '斬れ味': 1 } },
          arm  : { skillComb: { '攻撃': 1, '斬れ味': 3 } },
          waist: { skillComb: { '攻撃': 5, '斬れ味': 1 } },
          leg  : { skillComb: { '攻撃': 6, '斬れ味': 0 } },
          cache: { '攻撃': 18, '斬れ味': 8 } }
    ];
    QUnit.deepEqual(got, exp, 'combine leg (done: body, head, arm, waist)');

    // bulks がソートされていないとちゃんと動かない
    combSet = {
        head : { skillComb: { '攻撃': 1, '斬れ味': 3 } },
        body : { skillComb: { '攻撃': 5, '斬れ味': 1 } },
        arm  : { skillComb: { '攻撃': 1, '斬れ味': 3 } },
        waist: { skillComb: { '攻撃': 5, '斬れ味': 1 } },
        cache: { '攻撃': 12, '斬れ味': 8 }
    };
    bulks = [
        { skillComb: { '攻撃': 3, '斬れ味': 2 } },
        { skillComb: { '攻撃': 6, '斬れ味': 0 } },
        { skillComb: { '攻撃': 0, '斬れ味': 4 } },
        { skillComb: { '攻撃': 1, '斬れ味': 3 } },
        { skillComb: { '攻撃': 4, '斬れ味': 1 } }
    ];
    got = c._combineEquip(combSet, bulks, borderLine, 'leg');
    exp = [];
    QUnit.deepEqual(got, exp, 'combine leg (not sort)');

    // 胴系統倍化は先にあってもOK
    bulksSet = {
        head: [
            { skillComb: { '攻撃': 1, '斬れ味': 3 } } ],
        body: [
            { skillComb: { '攻撃': 5, '斬れ味': 1 } } ],
        arm: [
            { skillComb: { '攻撃': 1, '斬れ味': 3 } } ],
        waist: [
            { skillComb: { '胴系統倍化': 1 } } ],
        leg: [
            { skillComb: { '胴系統倍化': 1 } },
            { skillComb: { '攻撃': 3, '斬れ味': 2 } },
            { skillComb: { '攻撃': 6, '斬れ味': 0 } },
            { skillComb: { '攻撃': 0, '斬れ味': 4 } },
            { skillComb: { '攻撃': 1, '斬れ味': 3 } },
            { skillComb: { '攻撃': 4, '斬れ味': 1 } } ],
        oma: [
            { skillComb: { '攻撃': 4, '斬れ味': 0 } },
            { skillComb: { '攻撃': 0, '斬れ味': 2 } } ]
    };
    borderLine = new BorderLine(skillNames, bulksSet);
    combSet = {
        head : { skillComb: { '攻撃': 1, '斬れ味': 3 } },
        body : { skillComb: { '攻撃': 5, '斬れ味': 1 } },
        arm  : { skillComb: { '攻撃': 1, '斬れ味': 3 } },
        waist: { skillComb: { '胴系統倍化': 1 } },
        cache: { '攻撃': 12, '斬れ味': 8 }
    };
    bulks = [
        { skillComb: { '胴系統倍化': 1 } },
        { skillComb: { '攻撃': 6, '斬れ味': 0 } },
        { skillComb: { '攻撃': 4, '斬れ味': 1 } },
        { skillComb: { '攻撃': 3, '斬れ味': 2 } },
        { skillComb: { '攻撃': 0, '斬れ味': 4 } },
        { skillComb: { '攻撃': 1, '斬れ味': 3 } }
    ];
    got = c._combineEquip(combSet, bulks, borderLine, 'leg');
    exp = [
        { head : { skillComb: { '攻撃': 1, '斬れ味': 3 } },
          body : { skillComb: { '攻撃': 5, '斬れ味': 1 } },
          arm  : { skillComb: { '攻撃': 1, '斬れ味': 3 } },
          waist: { skillComb: { '胴系統倍化': 1 } },
          leg  : { skillComb: { '胴系統倍化': 1 } },
          cache: { '攻撃': 17, '斬れ味': 9 } },
        { head : { skillComb: { '攻撃': 1, '斬れ味': 3 } },
          body : { skillComb: { '攻撃': 5, '斬れ味': 1 } },
          arm  : { skillComb: { '攻撃': 1, '斬れ味': 3 } },
          waist: { skillComb: { '胴系統倍化': 1 } },
          leg  : { skillComb: { '攻撃': 6, '斬れ味': 0 } },
          cache: { '攻撃': 18, '斬れ味': 8 } }
    ];
    QUnit.deepEqual(got, exp, 'combine leg (torsoUp)');

    // これからスタートするところ(body を調べる)
    bulksSet = {
        head: [
            { skillComb: { '攻撃': 1, '斬れ味': 3 } } ],
        body: [
            { skillComb: { '攻撃': 3, '斬れ味': 2 } },
            { skillComb: { '攻撃': 6, '斬れ味': 0 } },
            { skillComb: { '攻撃': 0, '斬れ味': 4 } },
            { skillComb: { '攻撃': 1, '斬れ味': 3 } },
            { skillComb: { '攻撃': 4, '斬れ味': 1 } } ],
        arm: [
            { skillComb: { '攻撃': 1, '斬れ味': 3 } } ],
        waist: [
            { skillComb: { '攻撃': 5, '斬れ味': 1 } } ],
        leg: [
            { skillComb: { '攻撃': 5, '斬れ味': 1 } } ],
        oma: [
            { skillComb: { '攻撃': 4, '斬れ味': 0 } },
            { skillComb: { '攻撃': 0, '斬れ味': 2 } } ]
    };
    borderLine = new BorderLine(skillNames, bulksSet);
    combSet = {};
    bulks = [
        { skillComb: { '攻撃': 6, '斬れ味': 0 } },
        { skillComb: { '攻撃': 4, '斬れ味': 1 } },
        { skillComb: { '攻撃': 3, '斬れ味': 2 } },
        { skillComb: { '攻撃': 0, '斬れ味': 4 } },
        { skillComb: { '攻撃': 1, '斬れ味': 3 } }
    ];
    got = c._combineEquip(combSet, bulks, borderLine, 'body');
    exp = [
        { body : { skillComb: { '攻撃': 6, '斬れ味': 0 } },
          cache: { '攻撃': 6, '斬れ味': 0 } }
    ];
    QUnit.deepEqual(got, exp, 'combine body (done: none)');

    // combSet が null
    combSet = null;
    bulks = [
        { skillComb: { '攻撃': 6, '斬れ味': 0 } },
        { skillComb: { '攻撃': 4, '斬れ味': 1 } },
        { skillComb: { '攻撃': 3, '斬れ味': 2 } },
        { skillComb: { '攻撃': 0, '斬れ味': 4 } },
        { skillComb: { '攻撃': 1, '斬れ味': 3 } }
    ];
    got = c._combineEquip(combSet, bulks, borderLine, 'body');
    exp = [
        { body : { skillComb: { '攻撃': 6, '斬れ味': 0 } },
          cache: { '攻撃': 6, '斬れ味': 0 } }
    ];
    QUnit.deepEqual(got, exp, 'null');
});

QUnit.test('_combine', function () {
    var got, exp, bulksSet, skillNames,
        c = new Combinator();

    skillNames = [ '攻撃力UP【大】', '斬れ味レベル+1', '耳栓' ];
    bulksSet = {
        body: [
            { skillComb: { '攻撃': 7, '匠': 0, '聴覚保護': 1 } },
            { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 2 } },
            { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 } } ],
        head: [
            { skillComb: { '攻撃': 7, '匠': 1, '聴覚保護': 1 } },
            { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 } },
            { skillComb: { '攻撃': 6, '匠': 2, '聴覚保護': 0 } } ],
        arm: [
            { skillComb: { '攻撃': 6, '匠': 2, '聴覚保護': 0 } },
            { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 } },
            { skillComb: { '攻撃': 4, '匠': 3, '聴覚保護': 0 } } ],
        waist: [
            { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 } },
            { skillComb: { '攻撃': 2, '匠': 3, '聴覚保護': 2 } },
            { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 } } ],
        leg: [
            { skillComb: { '攻撃': 6, '匠': 0, '聴覚保護': 4 } },
            { skillComb: { '攻撃': 3, '匠': 2, '聴覚保護': 4 } },
            { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 3 } } ]
    };
    got = c._combine(skillNames, bulksSet);
    exp = [
        { body  : { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 2 } },
          head  : { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 } },
          arm   : { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 } },
          waist : { skillComb: { '攻撃': 2, '匠': 3, '聴覚保護': 2 } },
          leg   : { skillComb: { '攻撃': 6, '匠': 0, '聴覚保護': 4 } },
          weapon: null,
          oma   : null,
          cache : { '攻撃': 20, '匠': 10, '聴覚保護': 10 } }
    ];
    QUnit.deepEqual(got, exp, 'combine');

    // body が [] で胴系統倍化
    skillNames = [ '攻撃力UP【大】', '斬れ味レベル+1', '耳栓' ];
    bulksSet = {
        body: [],
        head: [
            { skillComb: { '攻撃': 7, '匠': 1, '聴覚保護': 1 } },
            { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 } },
            { skillComb: { '攻撃': 6, '匠': 2, '聴覚保護': 0 } } ],
        arm: [
            { skillComb: { '攻撃': 6, '匠': 2, '聴覚保護': 0 } },
            { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 } },
            { skillComb: { '攻撃': 4, '匠': 3, '聴覚保護': 0 } } ],
        waist: [
            { skillComb: { '胴系統倍化': 1 } } ],
        leg: [
            { skillComb: { '攻撃': 7, '匠': 0, '聴覚保護': 1 } },
            { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 2 } },
            { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 } } ],
        weapon: [
            { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 } },
            { skillComb: { '攻撃': 2, '匠': 3, '聴覚保護': 2 } },
            { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 } } ],
        oma: [
            { skillComb: { '攻撃': 6, '匠': 0, '聴覚保護': 4 } },
            { skillComb: { '攻撃': 3, '匠': 2, '聴覚保護': 4 } },
            { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 3 } } ]
    };
    got = c._combine(skillNames, bulksSet);
    exp = [
        { body  : null,
          head  : { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 } },
          arm   : { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 } },
          waist : { skillComb: { '胴系統倍化': 1 } },
          leg   : { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 2 } },
          weapon: { skillComb: { '攻撃': 2, '匠': 3, '聴覚保護': 2 } },
          oma   : { skillComb: { '攻撃': 6, '匠': 0, '聴覚保護': 4 } },
          cache : { '攻撃': 20, '匠': 10, '聴覚保護': 10 } }
    ];
    QUnit.deepEqual(got, exp, 'body is [] and torsoUp');
});

QUnit.test('_combineUsedSlot0', function () {
    var got, exp, bulksSet, skillNames,
        c = new Combinator();

    skillNames = [ '攻撃力UP【大】', '業物' ];
    bulksSet = {
        head: [
            { skillComb: { '攻撃': 4, '斬れ味': 2 }, equips: [ '4,2' ] },
            { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] } ],
        body: [
            { skillComb: { '攻撃': 8, '斬れ味': 0 }, equips: [ '8,0' ] },
            { skillComb: { '攻撃': 6, '斬れ味': 2 }, equips: [ '6,2' ] } ],
        arm: [
            { skillComb: { '攻撃': 4, '斬れ味': 2 }, equips: [ '4,2' ] },
            { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] } ],
        waist: [
            { skillComb: { '攻撃': 8, '斬れ味': 0 }, equips: [ '8,0' ] },
            { skillComb: { '攻撃': 6, '斬れ味': 2 }, equips: [ '6,2' ] } ],
        leg: [
            { skillComb: { '攻撃': 4, '斬れ味': 4 }, equips: [ '4,4' ] },
            { skillComb: { '攻撃': 5, '斬れ味': 3 }, equips: [ '5,3' ] } ]
    };
    got = c._combineUsedSlot0(skillNames, bulksSet);
    exp = [
        { body : { skillComb: { '攻撃': 6, '斬れ味': 2 }, equips: [ '6,2' ] },
          head : { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] },
          arm  : { skillComb: { '攻撃': 4, '斬れ味': 2 }, equips: [ '4,2' ] },
          waist: { skillComb: { '攻撃': 6, '斬れ味': 2 }, equips: [ '6,2' ] },
          leg  : { skillComb: { '攻撃': 4, '斬れ味': 4 }, equips: [ '4,4' ] },
          weapon: null, oma: null,
          cache: { '攻撃': 20, '斬れ味': 10 } }
        // 先に頭に slot0 を使った組み合わせが見つかるので↓は出てこない
        //{ body : { skillComb: { '攻撃': 6, '斬れ味': 2 }, equips: [ '6,2' ] },
        //  head : { skillComb: { '攻撃': 4, '斬れ味': 2 }, equips: [ '4,2' ] },
        //  arm  : { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] },
        //  waist: { skillComb: { '攻撃': 6, '斬れ味': 2 }, equips: [ '6,2' ] },
        //  leg  : { skillComb: { '攻撃': 4, '斬れ味': 4 }, equips: [ '4,4' ] },
        //  weapon: null, oma: null,
        //  cache: { '攻撃': 20, '斬れ味': 10 } }
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
           test(this.QUnit, this.simu.Equip.Combinator,
                this.simu.Util.Comb, this.simu.Util.BorderLine, this.myapp);
       }
);
