'use strict';
var assert = require('power-assert'),
    _ = require('underscore'),
    dutil = require('../../../lib/util/deco.js'),
    data = require('../../../lib/data.js'),
    myapp = require('../../../test/lib/driver-myapp.js');

describe('20_util/02_deco', function () {
    var got, exp;

    beforeEach(function () {
        myapp.initialize();
    });

    it('require', function () {
        assert(typeof dutil === 'object', 'is object');
    });

    it('filter', function () {
        var kireaji = [ '斬鉄珠【１】', '斬鉄珠【３】' ],
            kougeki = [ '攻撃珠【１】', '攻撃珠【２】', '攻撃珠【３】' ],
            takumi  = [ '匠珠【２】', '匠珠【３】' ];

        got = dutil.filter([ '斬れ味' ]);
        got = _.pluck(got, 'name').sort();
        exp = kireaji.sort();
        assert.deepEqual(got, exp, "[ '斬れ味' ]");

        // 斬れ味と攻撃で両方とれてるか
        got = dutil.filter([ '斬れ味', '攻撃' ]);
        got = _.pluck(got, 'name').sort();
        exp = kireaji.concat(kougeki).sort();
        assert.deepEqual(got, exp, "[ '斬れ味', '攻撃' ]");

        // 斬れ味と匠みたくプラスマイナスが反発する場合でも両方とれてるか
        got = dutil.filter([ '斬れ味', '匠' ]);
        got = _.pluck(got, 'name').sort();
        exp = kireaji.concat(takumi).sort();
        assert.deepEqual(got, exp, "[ '斬れ味', '匠' ]");

        // 存在しないスキル系統
        got = dutil.filter([ 'hoge' ]);
        exp = [];
        assert.deepEqual(got, exp, 'none skillTrees');

        got = dutil.filter();
        assert.deepEqual(got, [], 'nothing in');
        got = dutil.filter(undefined);
        assert.deepEqual(got, [], 'undefined');
        got = dutil.filter(null);
        assert.deepEqual(got, [], 'null');
        got = dutil.filter('');
        assert.deepEqual(got, [], 'empty string');
    });

    it('_rcomb1', function () {
        got = dutil._rcomb1([ 'a', 'b', 'c' ]);
        exp = [
            [ 'a' ], [ 'b' ], [ 'c' ]
        ];
        assert.deepEqual(got, exp, "[ 'a', 'b', 'c' ]");

        got = dutil._rcomb1([]);
        exp = [];
        assert.deepEqual(got, exp, '[]');
    });

    it('_rcomb2', function () {
        got = dutil._rcomb2([ 'a', 'b', 'c' ]);
        exp = [
            [ 'a', 'a' ], [ 'a', 'b' ], [ 'a', 'c' ],
            [ 'b', 'b' ], [ 'b', 'c' ],
            [ 'c', 'c' ]
        ];
        assert.deepEqual(got, exp, "[ 'a', 'b', 'c' ]");

        got = dutil._rcomb2([]);
        exp = [];
        assert.deepEqual(got, exp, '[]');
    });

    it('_rcomb3', function () {
        got = dutil._rcomb3([ 'a', 'b', 'c' ]);
        exp = [
            [ 'a', 'a', 'a' ], [ 'a', 'a', 'b' ], [ 'a', 'a', 'c' ],
            [ 'a', 'b', 'b' ], [ 'a', 'b', 'c' ], [ 'a', 'c', 'c' ],
            [ 'b', 'b', 'b' ], [ 'b', 'b', 'c' ], [ 'b', 'c', 'c' ],
            [ 'c', 'c', 'c' ]
        ];
        assert.deepEqual(got, exp, "[ 'a', 'b', 'c' ]");

        got = dutil._rcomb3([]);
        exp = [];
        assert.deepEqual(got, exp, '[]');
    });

    it('_groupBySlot', function () {
        var decos;

        var name = function (decosList) {
            var ret = {};
            _.each(decosList, function (decos, slot) {
                ret[slot] = _.pluck(decos, 'name');
            });
            return ret;
        };

        decos = dutil.filter([ '攻撃' ]);
        got = dutil._groupBySlot(decos);
        got = name(got);
        exp = {
            '1': [ '攻撃珠【１】' ],
            '2': [ '攻撃珠【２】' ],
            '3': [ '攻撃珠【３】' ]
        };
        assert.deepEqual(got, exp, '攻撃');

        decos = dutil.filter([ '攻撃', '達人' ]);
        got = dutil._groupBySlot(decos);
        got = name(got);
        exp = {
            '1': [ '攻撃珠【１】', '達人珠【１】' ],
            '2': [ '攻撃珠【２】', '達人珠【２】' ],
            '3': [ '攻撃珠【３】', '達人珠【３】' ]
        };
        assert.deepEqual(got, exp, '攻撃, 達人');

        decos = dutil.filter([ '攻撃', '匠' ]);
        got = dutil._groupBySlot(decos);
        got = name(got);
        exp = {
            '1': [ '攻撃珠【１】' ],
            '2': [ '攻撃珠【２】', '匠珠【２】' ],
            '3': [ '攻撃珠【３】', '匠珠【３】' ]
        };
        assert.deepEqual(got, exp, '攻撃, 匠');

        got = dutil._groupBySlot();
        exp = { '1': [], '2': [], '3': [] };
        assert.deepEqual(got, exp, 'nothing in');
        got = dutil._groupBySlot(undefined);
        assert.deepEqual(got, exp, 'undefined');
        got = dutil._groupBySlot(null);
        assert.deepEqual(got, exp, 'null');
        got = dutil._groupBySlot([]);
        assert.deepEqual(got, exp, '[]');
    });

    describe('combs', function () {
        var name = function (decoCombs) {
            return _.map(decoCombs, function (decosList) {
                return _.map(decosList, function (decos) {
                    return _.map(decos, function (deco) { return deco.name; });
                });
            });
        };

        it('combs', function () {
            got = dutil.combs([ '攻撃', '匠' ]);
            got = name(got);
            exp = [
                [],
                [ [ '攻撃珠【１】' ] ],
                [ [ '攻撃珠【１】', '攻撃珠【１】' ],
                  [ '攻撃珠【２】' ], [ '匠珠【２】' ] ],
                [ [ '攻撃珠【１】', '攻撃珠【１】', '攻撃珠【１】' ],
                  [ '攻撃珠【２】', '攻撃珠【１】' ],
                  [ '匠珠【２】', '攻撃珠【１】' ],
                  [ '攻撃珠【３】' ], [ '匠珠【３】' ] ]
            ];
            assert.deepEqual(got, exp, "[ '攻撃', '匠' ]");
        });

        it('decos are 1, 2, 3 slots', function () {
            // どちらも1, 2, 3スロある場合
            got = dutil.combs([ '攻撃', '達人' ]);
            got = name(got);
            exp = [
                [],
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
                  [ '攻撃珠【３】' ], [ '達人珠【３】' ] ]
            ];
            assert.deepEqual(got, exp, "[ '攻撃', '達人' ]");
        });

        it('1 slot only', function () {
            // 採取や高速収集みたく1スロしかない場合
            got = dutil.combs([ '採取', '高速収集' ]);
            got = name(got);
            exp = [
                [],
                [ [ '採取珠【１】' ], [ '速集珠【１】' ] ],
                [ [ '採取珠【１】', '採取珠【１】' ],
                  [ '採取珠【１】', '速集珠【１】' ],
                  [ '速集珠【１】', '速集珠【１】' ] ],
                [ [ '採取珠【１】', '採取珠【１】', '採取珠【１】' ],
                  [ '採取珠【１】', '採取珠【１】', '速集珠【１】' ],
                  [ '採取珠【１】', '速集珠【１】', '速集珠【１】' ],
                  [ '速集珠【１】', '速集珠【１】', '速集珠【１】' ] ]
            ];
            assert.deepEqual(got, exp, "[ '採取', '高速収集' ]");
        });

        it('torsoUp', function () {
            // 胴系統倍加が含まれている場合
            got = dutil.combs([ '攻撃', '胴系統倍加' ]);
            got = name(got);
            exp = [
                [],
                [ [ '攻撃珠【１】' ] ],
                [ [ '攻撃珠【１】', '攻撃珠【１】' ], [ '攻撃珠【２】' ] ],
                [ [ '攻撃珠【１】', '攻撃珠【１】', '攻撃珠【１】' ],
                  [ '攻撃珠【２】', '攻撃珠【１】' ],
                  [ '攻撃珠【３】' ] ]
            ];
            assert.deepEqual(got, exp, "[ '攻撃', '胴系統倍加' ]");
        });

        it('no 3 slot', function () {
            // 3スロを除いた装飾品が対象の場合
            var no3slot = _.filter(data.decos, function (deco) {
                return !deco.name.match(/【３】$/);
            });
            data.decos = no3slot;
            got = dutil.combs([ '攻撃', '斬れ味' ]);
            got = name(got);
            exp = [
                [],
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
                  [ '攻撃珠【２】', '斬鉄珠【１】' ] ]
            ];
            assert.deepEqual(got, exp, 'no 3 slot');
        });

        it('no 1 slot', function () {
            // 1スロを除いた装飾品が対象の場合
            var no1slot = _.filter(data.decos, function (deco) {
                return !deco.name.match(/【１】$/);
            });
            data.decos = no1slot;
            got = dutil.combs([ '攻撃', '匠' ]);
            got = name(got);
            exp = [
                [],
                [],
                [ [ '攻撃珠【２】' ], [ '匠珠【２】' ] ],
                [ [ '攻撃珠【２】' ], [ '匠珠【２】' ],
                  [ '攻撃珠【３】' ], [ '匠珠【３】' ] ]
            ];
            assert.deepEqual(got, exp, 'no 1 slot');
        });

        it('none deco', function () {
            data.decos = []; // 装飾品なし
            got = dutil.combs([ '攻撃', '斬れ味' ]);
            exp = [ [], [], [], [] ];
            assert.deepEqual(got, exp, 'none deco');
        });

        it('null or etc', function () {
            got = dutil.combs();
            assert.deepEqual(got, [], 'nothing in');
            got = dutil.combs(undefined);
            assert.deepEqual(got, [], 'undefined');
            got = dutil.combs(null);
            assert.deepEqual(got, [], 'null');
            got = dutil.combs([]);
            assert.deepEqual(got, [], '[]');
        });

    });

    describe('skillCombs', function () {
        it('skillCombs', function () {
            got = dutil.skillCombs([ '攻撃', '匠' ]);
            exp = [
                [],
                [ { '攻撃': 1, '防御': -1 } ],
                [ { '攻撃': 2, '防御': -2 },
                  { '攻撃': 3, '防御': -1 },
                  { '匠': 1, '斬れ味': -1 } ],
                [ { '攻撃': 3, '防御': -3 },
                  { '攻撃': 4, '防御': -2 },
                  { '匠': 1, '斬れ味': -1, '攻撃': 1, '防御': -1 },
                  { '攻撃': 5, '防御': -1 },
                  { '匠': 2, '斬れ味': -2 } ]
            ];
            assert.deepEqual(got, exp, "[ '攻撃', '斬れ味' ]");
        });

        it('decos are 1, 2, 3 slots', function () {
            // どちらも1, 2, 3スロある場合
            got = dutil.skillCombs([ '攻撃', '達人' ]);
            exp = [
                [],
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
                  { '達人': 5, '龍耐性': -1 } ]
            ];
            assert.deepEqual(got, exp, "[ '攻撃', '達人' ]");
        });

        it('conflict skills', function () {
            // 斬れ味と匠みたくプラスマイナスが反発するポイントの場合
            got = dutil.skillCombs([ '斬れ味', '匠' ]);
            exp = [
                [],
                [ { '斬れ味': 1, '匠': -1 } ],
                [ { '斬れ味': 2, '匠': -2 }, { '匠': 1, '斬れ味': -1 } ],
                [ { '斬れ味': 3, '匠': -3 },
                  { '匠': 0, '斬れ味': 0 },
                  { '匠': 2, '斬れ味': -2 },
                  { '斬れ味': 4, '匠': -2 } ]
            ];
            assert.deepEqual(got, exp, "[ '斬れ味', '匠' ]");
        });

        it('1 slot only', function () {
            // 採取や高速収集みたく1スロしかない場合
            got = dutil.skillCombs([ '採取', '高速収集' ]);
            exp = [
                [],
                [ { '採取': 2 }, { '高速収集': 2 } ],
                [ { '採取': 4 }, { '採取': 2, '高速収集': 2 }, { '高速収集': 4 } ],
                [ { '採取': 6 },
                  { '採取': 4, '高速収集': 2 },
                  { '採取': 2, '高速収集': 4 },
                  { '高速収集': 6 } ]
            ];
            assert.deepEqual(got, exp, "[ '採取', '高速収集' ]");
        });

        it('none deco', function () {
            data.decos = []; // 装飾品なし
            got = dutil.skillCombs([ '攻撃', '斬れ味' ]);
            exp = [ [], [], [], [] ];
            assert.deepEqual(got, exp, 'none deco');
        });

        it('null or etc', function () {
            got = dutil.skillCombs();
            assert.deepEqual(got, [], 'nothing in');
            got = dutil.skillCombs(undefined);
            assert.deepEqual(got, [], 'undefined');
            got = dutil.skillCombs(null);
            assert.deepEqual(got, [], 'null');
            got = dutil.skillCombs([]);
            assert.deepEqual(got, [], '[]');
        });
    });
});
