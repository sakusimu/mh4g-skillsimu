(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', 'underscore',
             '../lib/deco.js', '../lib/data.js', './lib/driver-myapp.js' ];
define(deps, function (QUnit, _, Deco, data, myapp) {

QUnit.module('20_deco');

myapp.setup();

QUnit.test('Deco', function () {
    QUnit.strictEqual(typeof Deco, 'object', 'is object');
});

QUnit.test('filter', function () {
    var got, exp,
        name   = function (deco) { return deco.name; },
        sorter = function (str) { return str; };

    var kireaji = [ '斬鉄珠【１】', '斬鉄珠【３】' ];
    var kougeki = [ '攻撃珠【１】', '攻撃珠【２】', '攻撃珠【３】' ];
    var takumi  = [ '匠珠【２】', '匠珠【３】' ];

    got = Deco.filter([ '斬れ味' ]);
    got = _.chain(got).map(name).sortBy(sorter).value();
    exp = _.chain(kireaji).sortBy(sorter).value();
    QUnit.deepEqual(got, exp, "[ '斬れ味' ]");

    // 斬れ味と攻撃で両方とれてるか
    got = Deco.filter([ '斬れ味', '攻撃' ]);
    got = _.chain(got).map(name).sortBy(sorter).value();
    exp = _.chain(kireaji.concat(kougeki)).uniq().sortBy(sorter).value();
    QUnit.deepEqual(got, exp, "[ '斬れ味', '攻撃' ]");

    // 斬れ味と匠みたくプラスマイナスが反発する場合でも両方とれてるか
    got = Deco.filter([ '斬れ味', '匠' ]);
    got = _.chain(got).map(name).sortBy(sorter).value();
    exp = _.chain(kireaji.concat(takumi)).uniq().sortBy(sorter).value();
    QUnit.deepEqual(got, exp, "[ '斬れ味', '匠' ]");

    // 存在しないスキル系統
    got = Deco.filter([ 'hoge' ]);
    exp = [];
    QUnit.deepEqual(got, exp, 'none skillTrees');

    got = Deco.filter();
    QUnit.deepEqual(got, [], 'nothing in');
    got = Deco.filter(undefined);
    QUnit.deepEqual(got, [], 'undefined');
    got = Deco.filter(null);
    QUnit.deepEqual(got, [], 'null');
    got = Deco.filter('');
    QUnit.deepEqual(got, [], 'empty string');
});

QUnit.test('_rcomb1', function () {
    var got, exp;

    got = Deco._rcomb1([ 'a', 'b', 'c' ]);
    exp = [ [ 'a' ], [ 'b' ], [ 'c' ] ];
    QUnit.deepEqual(got, exp, "[ 'a', 'b', 'c' ]");

    got = Deco._rcomb1([]);
    exp = [];
    QUnit.deepEqual(got, exp, '[]');
});

QUnit.test('_rcomb2', function () {
    var got, exp;

    got = Deco._rcomb2([ 'a', 'b', 'c' ]);
    exp = [ [ 'a', 'a' ], [ 'a', 'b' ], [ 'a', 'c' ],
            [ 'b', 'b' ], [ 'b', 'c' ],
            [ 'c', 'c' ] ];
    QUnit.deepEqual(got, exp, "[ 'a', 'b', 'c' ]");

    got = Deco._rcomb2([]);
    exp = [];
    QUnit.deepEqual(got, exp, '[]');
});

QUnit.test('_rcomb3', function () {
    var got, exp;

    got = Deco._rcomb3([ 'a', 'b', 'c' ]);
    exp = [ [ 'a', 'a', 'a' ], [ 'a', 'a', 'b' ], [ 'a', 'a', 'c' ],
            [ 'a', 'b', 'b' ], [ 'a', 'b', 'c' ], [ 'a', 'c', 'c' ],
            [ 'b', 'b', 'b' ], [ 'b', 'b', 'c' ], [ 'b', 'c', 'c' ],
            [ 'c', 'c', 'c' ] ];
    QUnit.deepEqual(got, exp, "[ 'a', 'b', 'c' ]");

    got = Deco._rcomb3([]);
    exp = [];
    QUnit.deepEqual(got, exp, '[]');
});

QUnit.test('_groupBySlot', function () {
    var name = function (decosList) {
        var ret = {};
        _.each(decosList, function (decos, slot) {
            ret[slot] = _.map(decos, function (deco) { return deco.name; });
        });
        return ret;
    };

    var got, exp, decos;

    decos = Deco.filter([ '攻撃' ]);
    if (decos.length !== 3) throw new Error('error: deos.length=' + decos.length);

    got = Deco._groupBySlot(decos);
    exp = { '1': [ '攻撃珠【１】' ],
            '2': [ '攻撃珠【２】' ],
            '3': [ '攻撃珠【３】' ] };
    QUnit.deepEqual(name(got), exp, '攻撃');

    decos = Deco.filter([ '攻撃', '達人' ]);
    if (decos.length !== 6) throw new Error('error: deos.length=' + decos.length);

    got = Deco._groupBySlot(decos);
    exp = { '1': [ '攻撃珠【１】', '達人珠【１】' ],
            '2': [ '攻撃珠【２】', '達人珠【２】' ],
            '3': [ '攻撃珠【３】', '達人珠【３】' ] };
    QUnit.deepEqual(name(got), exp, '攻撃, 達人');

    decos = Deco.filter([ '攻撃', '匠' ]);
    if (decos.length !== 5) throw new Error('error: deos.length=' + decos.length);

    got = Deco._groupBySlot(decos);
    exp = { '1': [ '攻撃珠【１】' ],
            '2': [ '攻撃珠【２】', '匠珠【２】' ],
            '3': [ '攻撃珠【３】', '匠珠【３】' ] };
    QUnit.deepEqual(name(got), exp, '攻撃, 匠');

    got = Deco._groupBySlot();
    exp = { '1': [], '2': [], '3': [] };
    QUnit.deepEqual(got, exp, 'nothing in');
    got = Deco._groupBySlot(undefined);
    QUnit.deepEqual(got, exp, 'undefined');
    got = Deco._groupBySlot(null);
    QUnit.deepEqual(got, exp, 'null');
    got = Deco._groupBySlot([]);
    QUnit.deepEqual(got, exp, '[]');
});

QUnit.test('combs: 1', function () {
    var name = function (decoCombs) {
        return _.map(decoCombs, function (decosList) {
            return _.map(decosList, function (decos) {
                return _.map(decos, function (deco) { return deco.name; });
            });
        });
    };

    var got, exp;

    got = Deco.combs([ '攻撃', '匠' ]);
    exp = [ [],
            [ [ '攻撃珠【１】' ] ],
            [ [ '攻撃珠【１】', '攻撃珠【１】' ],
              [ '攻撃珠【２】' ], [ '匠珠【２】' ] ],
            [ [ '攻撃珠【１】', '攻撃珠【１】', '攻撃珠【１】' ],
              [ '攻撃珠【２】', '攻撃珠【１】' ],
              [ '匠珠【２】', '攻撃珠【１】' ],
              [ '攻撃珠【３】' ], [ '匠珠【３】' ] ] ];
    QUnit.deepEqual(name(got), exp, "[ '攻撃', '匠' ]");

    // どちらも1, 2, 3スロある場合
    got = Deco.combs([ '攻撃', '達人' ]);
    exp = [ [],
            [ [ '攻撃珠【１】' ], [ '達人珠【１】' ] ],
            [ [ '攻撃珠【１】', '攻撃珠【１】' ],
              [ '攻撃珠【１】', '達人珠【１】' ],
              [ '達人珠【１】', '達人珠【１】' ],
              [ '攻撃珠【２】' ], [ '達人珠【２】' ] ],
            [ [ '攻撃珠【１】', '攻撃珠【１】', '攻撃珠【１】' ],
              [ '攻撃珠【１】', '攻撃珠【１】', '達人珠【１】' ],
              [ '攻撃珠【１】', '達人珠【１】', '達人珠【１】' ],
              [ '達人珠【１】', '達人珠【１】', '達人珠【１】' ],
              [ '攻撃珠【２】', '攻撃珠【１】' ],
              [ '攻撃珠【２】', '達人珠【１】' ],
              [ '達人珠【２】', '攻撃珠【１】' ],
              [ '達人珠【２】', '達人珠【１】' ],
              [ '攻撃珠【３】' ], [ '達人珠【３】' ] ] ];
    QUnit.deepEqual(name(got), exp, "[ '攻撃', '達人' ]");

    // 採取や高速収集みたく1スロしかない場合
    got = Deco.combs([ '採取', '高速収集' ]);
    exp = [ [],
            [ [ '採取珠【１】' ], [ '速集珠【１】' ] ],
            [ [ '採取珠【１】', '採取珠【１】' ],
              [ '採取珠【１】', '速集珠【１】' ],
              [ '速集珠【１】', '速集珠【１】' ] ],
            [ [ '採取珠【１】', '採取珠【１】', '採取珠【１】' ],
              [ '採取珠【１】', '採取珠【１】', '速集珠【１】' ],
              [ '採取珠【１】', '速集珠【１】', '速集珠【１】' ],
              [ '速集珠【１】', '速集珠【１】', '速集珠【１】' ] ] ];
    QUnit.deepEqual(name(got), exp, "[ '採取', '高速収集' ]");

    // 胴系統倍化が含まれている場合
    got = Deco.combs([ '攻撃', '胴系統倍化' ]);
    exp = [ [],
            [ [ '攻撃珠【１】' ] ],
            [ [ '攻撃珠【１】', '攻撃珠【１】' ], [ '攻撃珠【２】' ] ],
            [ [ '攻撃珠【１】', '攻撃珠【１】', '攻撃珠【１】' ],
              [ '攻撃珠【２】', '攻撃珠【１】' ],
              [ '攻撃珠【３】' ] ] ];
    QUnit.deepEqual(name(got), exp, "[ '攻撃', '胴系統倍化' ]");

    got = Deco.combs();
    QUnit.deepEqual(got, [], 'nothing in');
    got = Deco.combs(undefined);
    QUnit.deepEqual(got, [], 'undefined');
    got = Deco.combs(null);
    QUnit.deepEqual(got, [], 'null');
    got = Deco.combs([]);
    QUnit.deepEqual(got, [], '[]');
});

QUnit.test('combs: 2', function () {
    var name = function (decoCombs) {
        return _.map(decoCombs, function (decosList) {
            return _.map(decosList, function (decos) {
                return _.map(decos, function (deco) { return deco.name; });
            });
        });
    };

    var got, exp,
        orgDecos = data.decos;

    // 3スロを除いた装飾品が対象の場合
    var no3slot = _.filter(orgDecos, function (deco) {
        return !deco.name.match(/【３】$/);
    });
    if (no3slot.length !== 157) throw new Error('error: no3slot.length=' + no3slot.length);

    data.decos = no3slot;
    got = Deco.combs([ '攻撃', '斬れ味' ]);
    exp = [ [],
            [ [ '攻撃珠【１】' ], [ '斬鉄珠【１】' ] ],
            [ [ '攻撃珠【１】', '攻撃珠【１】' ],
              [ '攻撃珠【１】', '斬鉄珠【１】' ],
              [ '斬鉄珠【１】', '斬鉄珠【１】' ],
              [ '攻撃珠【２】' ] ],
            [ [ '攻撃珠【１】', '攻撃珠【１】', '攻撃珠【１】' ],
              [ '攻撃珠【１】', '攻撃珠【１】', '斬鉄珠【１】' ],
              [ '攻撃珠【１】', '斬鉄珠【１】', '斬鉄珠【１】' ],
              [ '斬鉄珠【１】', '斬鉄珠【１】', '斬鉄珠【１】' ],
              [ '攻撃珠【２】', '攻撃珠【１】' ],
              [ '攻撃珠【２】', '斬鉄珠【１】' ] ] ];
    QUnit.deepEqual(name(got), exp, 'no 3 slot');

    // 1スロを除いた装飾品が対象の場合
    var no1slot = _.filter(orgDecos, function (deco) {
        return !deco.name.match(/【１】$/);
    });
    if (no1slot.length !== 63) throw new Error('error: no1slot.length=' + no1slot.length);

    data.decos = no1slot;
    got = Deco.combs([ '攻撃', '匠' ]);
    exp = [ [],
            [],
            [ [ '攻撃珠【２】' ], [ '匠珠【２】' ] ],
            [ [ '攻撃珠【２】' ], [ '匠珠【２】' ],
              [ '攻撃珠【３】' ], [ '匠珠【３】' ] ] ];
    QUnit.deepEqual(name(got), exp, 'no 1 slot');

    // 装飾品なしの場合
    data.decos = [];
    got = Deco.combs([ '攻撃', '斬れ味' ]);
    exp = [ [], [], [], [] ];
    QUnit.deepEqual(got, exp, 'none deco');

    myapp.initialize(); // いじったデータを戻しておく
});

QUnit.test('skillCombs', function () {
    var got, exp;

    got = Deco.skillCombs([ '攻撃', '匠' ]);
    exp = [ [],
            [ { '攻撃': 1, '防御': -1 } ],
            [ { '攻撃': 2, '防御': -2 },
              { '攻撃': 3, '防御': -1 },
              { '匠': 1, '斬れ味': -1 } ],
            [ { '攻撃': 3, '防御': -3 },
              { '攻撃': 4, '防御': -2 },
              { '匠': 1, '斬れ味': -1, '攻撃': 1, '防御': -1 },
              { '攻撃': 5, '防御': -1 },
              { '匠': 2, '斬れ味': -2 } ] ];
    QUnit.deepEqual(got, exp, "[ '攻撃', '斬れ味' ]");

    // どちらも1, 2, 3スロある場合
    got = Deco.skillCombs([ '攻撃', '達人' ]);
    exp = [ [],
            [ { '攻撃': 1, '防御': -1 }, { '達人': 1, '龍耐性': -1 } ],
            [ { '攻撃': 2, '防御': -2 },
              { '攻撃': 1, '防御': -1, '達人': 1, '龍耐性': -1 },
              { '達人': 2, '龍耐性': -2 },
              { '攻撃': 3, '防御': -1 },
              { '達人': 3, '龍耐性': -1 } ],
            [ { '攻撃': 3, '防御': -3 },
              { '攻撃': 2, '防御': -2, '達人': 1, '龍耐性': -1 },
              { '攻撃': 1, '防御': -1, '達人': 2, '龍耐性': -2 },
              { '達人': 3, '龍耐性': -3 },
              { '攻撃': 4, '防御': -2 },
              { '攻撃': 3, '防御': -1, '達人': 1, '龍耐性': -1 },
              { '達人': 3, '龍耐性': -1, '攻撃': 1, '防御': -1 },
              { '達人': 4, '龍耐性': -2 },
              { '攻撃': 5, '防御': -1 },
              { '達人': 5, '龍耐性': -1 } ] ];
    QUnit.deepEqual(got, exp, "[ '攻撃', '達人' ]");

    // 斬れ味と匠みたくプラスマイナスが反発するポイントの場合
    got = Deco.skillCombs([ '斬れ味', '匠' ]);
    exp = [ [],
            [ { '斬れ味': 1, '匠': -1 } ],
            [ { '斬れ味': 2, '匠': -2 }, { '匠': 1, '斬れ味': -1 } ],
            [ { '斬れ味': 3, '匠': -3 },
              { '匠': 0, '斬れ味': 0 },
              { '匠': 2, '斬れ味': -2 },
              { '斬れ味': 4, '匠': -2 } ] ];
    QUnit.deepEqual(got, exp, "[ '斬れ味', '匠' ]");

    // 採取や高速収集みたく1スロしかない場合
    got = Deco.skillCombs([ '採取', '高速収集' ]);
    exp = [ [],
            [ { '採取': 2 }, { '高速収集': 2 } ],
            [ { '採取': 4 }, { '採取': 2, '高速収集': 2 }, { '高速収集': 4 } ],
            [ { '採取': 6 },
              { '採取': 4, '高速収集': 2 },
              { '採取': 2, '高速収集': 4 },
              { '高速収集': 6 } ] ];
    QUnit.deepEqual(got, exp, "[ '採取', '高速収集' ]");

    // 装飾品なしの場合
    data.decos = [];
    got = Deco.skillCombs([ '攻撃', '斬れ味' ]);
    exp = [ [], [], [], [] ];
    QUnit.deepEqual(got, exp, 'none deco');

    got = Deco.skillCombs();
    QUnit.deepEqual(got, [], 'nothing in');
    got = Deco.skillCombs(undefined);
    QUnit.deepEqual(got, [], 'undefined');
    got = Deco.skillCombs(null);
    QUnit.deepEqual(got, [], 'null');
    got = Deco.skillCombs([]);
    QUnit.deepEqual(got, [], '[]');

    myapp.initialize();
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
           test(this.QUnit, this._, this.simu.Deco, this.simu.data, this.myapp);
       }
);
