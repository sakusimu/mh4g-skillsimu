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

QUnit.test('_combineTorsoUp', function () {
    var got, exp, comb, bulk,
        c = new Combinator();

    var skillNames = [ '攻撃力UP【大】', '業物' ];
    var bulksSet = {
        head: [
            { skillComb: { '攻撃': 1, '斬れ味': 3 } },
            { skillComb: { '攻撃': 2, '斬れ味': 3 } },
            { skillComb: { '攻撃': 0, '斬れ味': 4 } },
            { skillComb: { '攻撃': 4, '斬れ味': 0 } } ],
        body: [
            { skillComb: { '攻撃': 5, '斬れ味': 1 } },
            { skillComb: { '攻撃': 4, '斬れ味': 1 } },
            { skillComb: { '攻撃': 6, '斬れ味': 0 } } ],
        arm: [
            { skillComb: { '攻撃': 1, '斬れ味': 3 } },
            { skillComb: { '攻撃': 2, '斬れ味': 3 } },
            { skillComb: { '攻撃': 0, '斬れ味': 4 } },
            { skillComb: { '攻撃': 4, '斬れ味': 0 } } ],
        waist: [
            { skillComb: { '胴系統倍化': 1 } } ],
        leg: [
            { skillComb: { '胴系統倍化': 1 } } ],
        oma: [
            { skillComb: { '攻撃': 3, '斬れ味': 1 } },
            { skillComb: { '攻撃': 2, '斬れ味': 2 } } ]
    };
    var borderLine = new BorderLine(skillNames, bulksSet);

    comb = {
        eqcombs: [
            { head : [ '1,3' ],
              body : [ '5,1' ],
              arm  : [ '1,3' ],
              waist: [ 'torsoUp' ],
              bodySC: { '攻撃': 5, '斬れ味': 1 } },
            { head : [ '2,3' ],
              body : [ '4,1' ],
              arm  : [ '2,3' ],
              waist: [ 'torsoUp' ],
              bodySC: { '攻撃': 4, '斬れ味': 1 } },
            { head : [ '0,4' ],
              body : [ '6,0' ],
              arm  : [ '0,4' ],
              waist: [ 'torsoUp' ],
              bodySC: { '攻撃': 6, '斬れ味': 0 } }
        ],
        sumSC: { '攻撃': 12, '斬れ味': 8 }
    };
    bulk = { skillComb: { '胴系統倍化': 1 }, equips: [ 'torsoUp' ] };
    got = c._combineTorsoUp(comb, bulk, borderLine, 'leg');
    exp = [
        {
            eqcombs: [
                { head : [ '1,3' ],
                  body : [ '5,1' ],
                  arm  : [ '1,3' ],
                  waist: [ 'torsoUp' ],
                  leg  : [ 'torsoUp' ],
                  bodySC: { '攻撃': 5, '斬れ味': 1 } }
            ],
            sumSC: { '攻撃': 17, '斬れ味': 9 }
        },
        {
            eqcombs: [
                { head : [ '0,4' ],
                  body : [ '6,0' ],
                  arm  : [ '0,4' ],
                  waist: [ 'torsoUp' ],
                  leg  : [ 'torsoUp' ],
                  bodySC: { '攻撃': 6, '斬れ味': 0 } }
            ],
            sumSC: { '攻撃': 18, '斬れ味': 8 }
        }
    ];
    QUnit.deepEqual(got, exp, 'combine');
});

QUnit.test('_newComb', function () {
    var got, exp, comb, bulk,
        c = new Combinator();

    comb = {
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
    bulk = { skillComb: { '攻撃': 1, '斬れ味': 1 }, equips: [ 'arm1' ] };
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
    QUnit.deepEqual(got, exp, 'new');

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
    QUnit.deepEqual(got, exp, 'new: stable');

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
    QUnit.deepEqual(got, exp, 'new: bulk is null');

    bulk = { skillComb: { '攻撃': 1, '斬れ味': 1 }, equips: [ 'body1' ] };
    got = c._newComb(null, bulk, 'body');
    exp = {
        eqcombs: [
            { body : [ 'body1' ],
              bodySC: { '攻撃': 1, '斬れ味': 1 } }
        ],
        sumSC: { '攻撃': 1, '斬れ味': 1 }
    };
    QUnit.deepEqual(got, exp, 'new: comb is null');
});

QUnit.test('_combineEquip', function () {
    var got, exp,
        bulksSet, bulks, borderLine, comb,
        c = new Combinator();

    var skillNames = [ '攻撃力UP【大】', '業物' ];

    // body, head, arm, waist まで終わってて、これから leg を処理するところ。
    // borderLine を上回るポイントとなる組み合わせを求める。
    bulksSet = {
        head: [
            { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] } ],
        body: [
            { skillComb: { '攻撃': 5, '斬れ味': 1 }, equips: [ '5,1' ] } ],
        arm: [
            { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] } ],
        waist: [
            { skillComb: { '攻撃': 5, '斬れ味': 1 }, equips: [ '5,1' ] } ],
        leg: [
            { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ '3,2' ] },
            { skillComb: { '攻撃': 6, '斬れ味': 0 }, equips: [ '6,0' ] },
            { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ '0,4' ] },
            { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] },
            { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ '4,1' ] } ],
        oma: [
            { skillComb: { '攻撃': 4, '斬れ味': 0 }, equips: [ '4,0' ] },
            { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ '0,2' ] } ]
    };
    borderLine = new BorderLine(skillNames, bulksSet);
    comb = {
        eqcombs: [
            { head : [ '1,3' ],
              body : [ '5,1' ],
              arm  : [ '1,3' ],
              waist: [ '5,1' ],
              bodySC: { '攻撃': 5, '斬れ味': 1 }
            }
        ],
        sumSC: { '攻撃': 12, '斬れ味': 8 }
    };
    bulks = [
        { skillComb: { '攻撃': 6, '斬れ味': 0 }, equips: [ '6,0' ] },
        { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ '4,1' ] },
        { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ '3,2' ] },
        { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ '0,4' ] },
        { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] }
    ];
    got = c._combineEquip(comb, bulks, borderLine, 'leg');
    exp = [
        {
            eqcombs: [
                { head : [ '1,3' ],
                  body : [ '5,1' ],
                  arm  : [ '1,3' ],
                  waist: [ '5,1' ],
                  leg  : [ '6,0' ],
                  bodySC: { '攻撃': 5, '斬れ味': 1 } }
            ],
            sumSC: { '攻撃': 18, '斬れ味': 8 }
        }
    ];
    QUnit.deepEqual(got, exp, 'combine leg (done: body, head, arm, waist)');

    // bulks がソートされていないとちゃんと動かない
    bulks = [
        { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ '3,2' ] },
        { skillComb: { '攻撃': 6, '斬れ味': 0 }, equips: [ '6,0' ] },
        { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ '0,4' ] },
        { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] },
        { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ '4,1' ] }
    ];
    got = c._combineEquip(comb, bulks, borderLine, 'leg');
    exp = [];
    QUnit.deepEqual(got, exp, 'combine leg (not sort)');

    // 胴系統倍化は先にあってもOK
    bulksSet = {
        head: [
            { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] } ],
        body: [
            { skillComb: { '攻撃': 5, '斬れ味': 1 }, equips: [ '5,1' ] } ],
        arm: [
            { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] } ],
        waist: [
            { skillComb: { '胴系統倍化': 1 }, equips: [ 'torsoUp' ] } ],
        leg: [
            { skillComb: { '胴系統倍化': 1 }, equips: [ 'torsoUp' ] },
            { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ '3,2' ] },
            { skillComb: { '攻撃': 6, '斬れ味': 0 }, equips: [ '6,0' ] },
            { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ '0,4' ] },
            { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] },
            { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ '4,1' ] } ],
        oma: [
            { skillComb: { '攻撃': 4, '斬れ味': 0 }, equips: [ '4,0' ] },
            { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ '0,2' ] } ]
    };
    borderLine = new BorderLine(skillNames, bulksSet);
    comb = {
        eqcombs: [
            { head : [ '1,3' ],
              body : [ '5,1' ],
              arm  : [ '1,3' ],
              waist: [ 'torsoUp' ],
              bodySC: { '攻撃': 5, '斬れ味': 1 } }
        ],
        sumSC: { '攻撃': 12, '斬れ味': 8 }
    };
    bulks = [
        { skillComb: { '胴系統倍化': 1 }, equips: [ 'torsoUp' ] },
        { skillComb: { '攻撃': 6, '斬れ味': 0 }, equips: [ '6,0' ] },
        { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ '4,1' ] },
        { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ '3,2' ] },
        { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ '0,4' ] },
        { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] }
    ];
    got = c._combineEquip(comb, bulks, borderLine, 'leg');
    exp = [
        {
            eqcombs: [
                { head : [ '1,3' ],
                  body : [ '5,1' ],
                  arm  : [ '1,3' ],
                  waist: [ 'torsoUp' ],
                  leg  : [ 'torsoUp' ],
                  bodySC: { '攻撃': 5, '斬れ味': 1 } }
            ],
            sumSC: { '攻撃': 17, '斬れ味': 9 }
        },
        {
            eqcombs: [
                { head : [ '1,3' ],
                  body : [ '5,1' ],
                  arm  : [ '1,3' ],
                  waist: [ 'torsoUp' ],
                  leg  : [ '6,0' ],
                  bodySC: { '攻撃': 5, '斬れ味': 1 } }
            ],
            sumSC: { '攻撃': 18, '斬れ味': 8 }
        }
    ];
    QUnit.deepEqual(got, exp, 'combine leg (torsoUp)');

    // これからスタートするところ(body を調べる)
    bulksSet = {
        head: [
            { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] } ],
        body: [
            { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ '3,2' ] },
            { skillComb: { '攻撃': 6, '斬れ味': 0 }, equips: [ '6,0' ] },
            { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ '0,4' ] },
            { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] },
            { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ '4,1' ] } ],
        arm: [
            { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] } ],
        waist: [
            { skillComb: { '攻撃': 5, '斬れ味': 1 }, equips: [ '5,1' ] } ],
        leg: [
            { skillComb: { '攻撃': 5, '斬れ味': 1 }, equips: [ '5,1' ] } ],
        oma: [
            { skillComb: { '攻撃': 4, '斬れ味': 0 }, equips: [ '4,0' ] },
            { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ '0,2' ] } ]
    };
    borderLine = new BorderLine(skillNames, bulksSet);
    comb = { eqcombs: [], sumSC: 0 };
    bulks = [
        { skillComb: { '攻撃': 6, '斬れ味': 0 }, equips: [ '6,0' ] },
        { skillComb: { '攻撃': 4, '斬れ味': 1 }, equips: [ '4,1' ] },
        { skillComb: { '攻撃': 3, '斬れ味': 2 }, equips: [ '3,2' ] },
        { skillComb: { '攻撃': 0, '斬れ味': 4 }, equips: [ '0,4' ] },
        { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] }
    ];
    got = c._combineEquip(comb, bulks, borderLine, 'body');
    exp = [
        {
            eqcombs: [
                { body : [ '6,0' ],
                  bodySC: { '攻撃': 6, '斬れ味': 0 } }
            ],
            sumSC: { '攻撃': 6, '斬れ味': 0 }
        }
    ];
    QUnit.deepEqual(got, exp, 'combine body (done: none)');

    // bulks が []
    bulksSet = {
        head: [
            { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] } ],
        body: [
            { skillComb: { '攻撃': 5, '斬れ味': 1 }, equips: [ '5,1' ] } ],
        arm: [
            { skillComb: { '攻撃': 1, '斬れ味': 3 }, equips: [ '1,3' ] } ],
        waist: [
            { skillComb: { '攻撃': 5, '斬れ味': 1 }, equips: [ '5,1' ] } ],
        leg: [
            { skillComb: { '攻撃': 6, '斬れ味': 0 }, equips: [ '6,0' ] } ],
        oma: [
            { skillComb: { '攻撃': 4, '斬れ味': 0 }, equips: [ '4,0' ] },
            { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ '0,2' ] } ]
    };
    borderLine = new BorderLine(skillNames, bulksSet);
    comb = {
        eqcombs: [
            { head : [ '1,3' ],
              body : [ '5,1' ],
              arm  : [ '1,3' ],
              waist: [ '5,1' ],
              leg  : [ '6,0' ],
              bodySC: { '攻撃': 5, '斬れ味': 1 } }
        ],
        sumSC: { '攻撃': 18, '斬れ味': 8 }
    };
    got = c._combineEquip(comb, [], borderLine, 'weapon');
    exp = [
        {
            eqcombs: [
                { head : [ '1,3' ],
                  body : [ '5,1' ],
                  arm  : [ '1,3' ],
                  waist: [ '5,1' ],
                  leg  : [ '6,0' ],
                  weapon: [],
                  bodySC: { '攻撃': 5, '斬れ味': 1 } }
            ],
            sumSC: { '攻撃': 18, '斬れ味': 8 }
        }
    ];
    QUnit.deepEqual(got, exp, 'bulks is []');
});

QUnit.test('_combine', function () {
    var got, exp, bulksSet, skillNames,
        c = new Combinator();

    skillNames = [ '攻撃力UP【大】', '斬れ味レベル+1', '耳栓' ];
    bulksSet = {
        body: [
            { skillComb: { '攻撃': 7, '匠': 0, '聴覚保護': 1 }, equips: [ '7,0,1' ] },
            { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 2 }, equips: [ '4,2,2' ] },
            { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, equips: [ '5,2,1' ] } ],
        head: [
            { skillComb: { '攻撃': 7, '匠': 1, '聴覚保護': 1 }, equips: [ '7,1,1' ] },
            { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, equips: [ '5,2,1' ] },
            { skillComb: { '攻撃': 6, '匠': 2, '聴覚保護': 0 }, equips: [ '6,2,0' ] } ],
        arm: [
            { skillComb: { '攻撃': 6, '匠': 2, '聴覚保護': 0 }, equips: [ '6,2,0' ] },
            { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 }, equips: [ '3,3,1' ] },
            { skillComb: { '攻撃': 4, '匠': 3, '聴覚保護': 0 }, equips: [ '4,3,0' ] } ],
        waist: [
            { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, equips: [ '5,2,1' ] },
            { skillComb: { '攻撃': 2, '匠': 3, '聴覚保護': 2 }, equips: [ '2,3,2' ] },
            { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 }, equips: [ '3,3,1' ] } ],
        leg: [
            { skillComb: { '攻撃': 6, '匠': 0, '聴覚保護': 4 }, equips: [ '6,0,4' ] },
            { skillComb: { '攻撃': 3, '匠': 2, '聴覚保護': 4 }, equips: [ '3,2,4' ] },
            { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 3 }, equips: [ '4,2,3' ] } ]
    };
    got = c._combine(skillNames, bulksSet);
    exp = [
        {
            eqcombs: [
                { body  : [ '4,2,2' ],
                  head  : [ '5,2,1' ],
                  arm   : [ '3,3,1' ],
                  waist : [ '2,3,2' ],
                  leg   : [ '6,0,4' ],
                  weapon: [],
                  oma   : [],
                  bodySC: { '攻撃': 4, '匠': 2, '聴覚保護': 2 } }
            ],
            sumSC: { '攻撃': 20, '匠': 10, '聴覚保護': 10 }
        }
    ];
    QUnit.deepEqual(got, exp, 'combine');

    // body が [] で胴系統倍化
    skillNames = [ '攻撃力UP【大】', '斬れ味レベル+1', '耳栓' ];
    bulksSet = {
        body: [],
        head: [
            { skillComb: { '攻撃': 7, '匠': 1, '聴覚保護': 1 }, equips: [ '7,1,1' ] },
            { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, equips: [ '5,2,1' ] },
            { skillComb: { '攻撃': 6, '匠': 2, '聴覚保護': 0 }, equips: [ '6,2,0' ] } ],
        arm: [
            { skillComb: { '攻撃': 6, '匠': 2, '聴覚保護': 0 }, equips: [ '6,2,0' ] },
            { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 }, equips: [ '3,3,1' ] },
            { skillComb: { '攻撃': 4, '匠': 3, '聴覚保護': 0 }, equips: [ '4,3,0' ] } ],
        waist: [
            { skillComb: { '胴系統倍化': 1 }, equips: [ 'torsoUp' ] } ],
        leg: [
            { skillComb: { '攻撃': 7, '匠': 0, '聴覚保護': 1 }, equips: [ '7,0,1' ] },
            { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 2 }, equips: [ '4,2,2' ] },
            { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, equips: [ '5,2,1' ] } ],
        weapon: [
            { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, equips: [ '5,2,1' ] },
            { skillComb: { '攻撃': 2, '匠': 3, '聴覚保護': 2 }, equips: [ '2,3,2' ] },
            { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 }, equips: [ '3,3,1' ] } ],
        oma: [
            { skillComb: { '攻撃': 6, '匠': 0, '聴覚保護': 4 }, equips: [ '6,0,4' ] },
            { skillComb: { '攻撃': 3, '匠': 2, '聴覚保護': 4 }, equips: [ '3,2,4' ] },
            { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 3 }, equips: [ '4,2,3' ] } ]
    };
    got = c._combine(skillNames, bulksSet);
    exp = [
        {
            eqcombs: [
                { body  : [],
                  head  : [ '5,2,1' ],
                  arm   : [ '3,3,1' ],
                  waist : [ 'torsoUp' ],
                  leg   : [ '4,2,2' ],
                  weapon: [ '2,3,2' ],
                  oma   : [ '6,0,4' ],
                  bodySC: {} }
            ],
            sumSC: { '攻撃': 20, '匠': 10, '聴覚保護': 10 }
        }
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
        {
            eqcombs: [
                { body  : [ '6,2' ],
                  head  : [ 'slot0' ],
                  arm   : [ '4,2' ],
                  waist : [ '6,2' ],
                  leg   : [ '4,4' ],
                  weapon: [],
                  oma   : [],
                  bodySC: { '攻撃': 6, '斬れ味': 2 } }
            ],
            sumSC: { '攻撃': 20, '斬れ味': 10 }
        }
        // 先に頭に slot0 を使った組み合わせが見つかるので↓は出てこない
        //{
        //    eqcombs: [
        //        { body  : [ '6,2' ],
        //          head  : [ '4,2' ],
        //          arm   : [ 'slot0' ],
        //          waist : [ '6,2' ],
        //          leg   : [ '4,4' ],
        //          weapon: [],
        //          oma   : [],
        //          bodySC: { '攻撃': 6, '斬れ味': 2 } }
        //    ],
        //    sumSC: { '攻撃': 20, '斬れ味': 10 }
        //}
    ];
    QUnit.deepEqual(got, exp, 'combine');
});

QUnit.test('_compress', function () {
    var got, exp, combs,
        c = new Combinator();

    combs = [
        { eqcombs: [ 'eqcomb1' ], sumSC: { a: 2, b: 0 } },
        { eqcombs: [ 'eqcomb1' ], sumSC: { a: 0, b: 2 } },
        { eqcombs: [ 'eqcomb2' ], sumSC: { a: 2, b: 0 } },
        { eqcombs: [ 'eqcomb2' ], sumSC: { a: 0, b: 1 } }
    ];
    got = c._compress(combs);
    exp = [
        { eqcombs: [ 'eqcomb1', 'eqcomb2' ], sumSC: { a: 2, b: 0 } },
        { eqcombs: [ 'eqcomb1' ], sumSC: { a: 0, b: 2 } },
        { eqcombs: [ 'eqcomb2' ], sumSC: { a: 0, b: 1 } }
    ];
    QUnit.deepEqual(got, exp, 'compress');

    combs = [
        { eqcombs: [], sumSC: null },
        { eqcombs: [], sumSC: { a: 1 } }
    ];
    got = c._compress(combs);
    exp = [
        { eqcombs: [], sumSC: null },
        { eqcombs: [], sumSC: { a: 1 } }
    ];
    QUnit.deepEqual(got, exp, 'within null');
});

QUnit.test('_sortCombs', function () {
    var got, exp, combs,
        c = new Combinator();

    combs = [
        { sumSC: { a: 1, b: 0 } },
        { sumSC: { a: 0, b: 2 } },
        { sumSC: { a: 3, b: 0 } },
        { sumSC: { a: 1, b: 1 } },
        { sumSC: null },
        { sumSC: { a: 2, b: 0 } }
    ];
    got = c._sortCombs(combs);
    exp = [
        { sumSC: { a: 3, b: 0 } },
        { sumSC: { a: 0, b: 2 } },
        { sumSC: { a: 1, b: 1 } },
        { sumSC: { a: 2, b: 0 } },
        { sumSC: { a: 1, b: 0 } },
        { sumSC: null }
    ];
    QUnit.deepEqual(got, exp, 'sort');
});

QUnit.test('_brushUp', function () {
    var got, exp, combs,
        c = new Combinator();

    combs = [
        {
            eqcombs: [
                { head  : [ 'head1' ],
                  body  : [ 'body1' ],
                  arm   : [ 'arm1' ],
                  waist : [ 'waist1' ],
                  leg   : [ 'leg1' ],
                  weapon: [ 'weapon1' ],
                  oma   : [ 'oma1' ],
                  bodySC: { '攻撃': 1, '斬れ味': 1 } },
                { head  : [ 'head2' ],
                  body  : [ 'body2' ],
                  arm   : [ 'arm2' ],
                  waist : [ 'waist2' ],
                  leg   : [ 'leg2' ],
                  //weapon: undefined,
                  oma   : null,
                  bodySC: {} }
            ],
            sumSC: {}
        },
        {
            eqcombs: [
                { head  : [ 'head3' ],
                  body  : [ 'body3' ],
                  arm   : [ 'arm3' ],
                  waist : [ 'waist3' ],
                  leg   : [ 'leg3' ],
                  weapon: [ 'weapon3' ],
                  oma   : [ 'oma3' ],
                  bodySC: {} }
            ],
            sumSC: {}
        }
    ];
    got = c._brushUp(combs);
    exp = [
        { head  : [ 'head1' ],
          body  : [ 'body1' ],
          arm   : [ 'arm1' ],
          waist : [ 'waist1' ],
          leg   : [ 'leg1' ],
          weapon: [ 'weapon1' ],
          oma   : [ 'oma1' ] },
        { head  : [ 'head2' ],
          body  : [ 'body2' ],
          arm   : [ 'arm2' ],
          waist : [ 'waist2' ],
          leg   : [ 'leg2' ],
          weapon: [],
          oma   : [] },
        { head  : [ 'head3' ],
          body  : [ 'body3' ],
          arm   : [ 'arm3' ],
          waist : [ 'waist3' ],
          leg   : [ 'leg3' ],
          weapon: [ 'weapon3' ],
          oma   : [ 'oma3' ] }
    ];
    QUnit.deepEqual(got, exp, 'brush up');
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
