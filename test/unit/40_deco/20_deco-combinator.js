'use strict';
var assert = require('power-assert'),
    Combinator = require('../../../lib/deco/combinator.js'),
    Comb = require('../../../lib/util/comb.js'),
    myapp = require('../../../test/lib/driver-myapp.js');

describe('40_deco/20_combinator', function () {
    var got, exp;

    beforeEach(function () {
        myapp.initialize();
    });

    it('Combinator', function () {
        assert(typeof Combinator === 'function', 'is function');
    });

    it('new', function () {
        got = new Combinator();
        assert(typeof got === 'object', 'is object');
        assert(typeof got.initialize === 'function', 'has initialize()');
    });

    describe('_combineDecomb', function () {
        var c = new Combinator();

        it('combine waist (done: body, head, arm)', function () {
            // body, head, arm まで終わってて、これから waist を処理するところ。
            // borderLine を上回るポイントとなる組み合わせを求める。
            var decombSet = {
                body : { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, slot: 3 },
                head : { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, slot: 2 },
                arm  : { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, slot: 1 },
                cache: { '攻撃': 5, '匠': 3, '聴覚保護': 1 }
            };
            var decombs = [
                { skillComb: { '攻撃': 4, '匠': 0, '聴覚保護': 0 }, slot: 2 },
                { skillComb: { '攻撃': 3, '匠': 1, '聴覚保護': 0 }, slot: 2 },
                { skillComb: { '攻撃': 3, '匠': 0, '聴覚保護': 1 }, slot: 2 },
                { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, slot: 2 },
                { skillComb: { '攻撃': 0, '匠': 4, '聴覚保護': 0 }, slot: 2 },
                { skillComb: { '攻撃': 1, '匠': 3, '聴覚保護': 0 }, slot: 2 },
                { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 1 }, slot: 2 },
                { skillComb: { '攻撃': 1, '匠': 2, '聴覚保護': 1 }, slot: 2 },
                { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 4 }, slot: 2 },
                { skillComb: { '攻撃': 1, '匠': 0, '聴覚保護': 3 }, slot: 2 },
                { skillComb: { '攻撃': 0, '匠': 1, '聴覚保護': 3 }, slot: 2 },
                { skillComb: { '攻撃': 1, '匠': 1, '聴覚保護': 2 }, slot: 2 }
            ];
            var borderLine = {
                waist: { '攻撃': 6, '匠': 4, '聴覚保護': 2 },
                sum: { waist: 12 },
                goal: { '攻撃': 20, '匠': 10, '聴覚保護': 10 }
            };
            got = c._combineDecomb(decombSet, decombs, borderLine, 'waist');
            exp = [
                { body : { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, slot: 3 },
                  head : { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, slot: 2 },
                  arm  : { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, slot: 1 },
                  waist: { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, slot: 2 },
                  cache: { '攻撃': 7, '匠': 4, '聴覚保護': 2 } },
                { body : { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, slot: 3 },
                  head : { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, slot: 2 },
                  arm  : { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, slot: 1 },
                  waist: { skillComb: { '攻撃': 1, '匠': 2, '聴覚保護': 1 }, slot: 2 },
                  cache: { '攻撃': 6, '匠': 5, '聴覚保護': 2 } },
                { body : { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, slot: 3 },
                  head : { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, slot: 2 },
                  arm  : { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, slot: 1 },
                  waist: { skillComb: { '攻撃': 1, '匠': 1, '聴覚保護': 2 }, slot: 2 },
                  cache: { '攻撃': 6, '匠': 4, '聴覚保護': 3 } }
            ];
            assert.deepEqual(got, exp);
        });

        it('not skip slot3', function () {
            // スロ2で見つかってもスロ3も見つける
            var decombSet = {
                body : { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, slot: 3 },
                head : { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, slot: 2 },
                arm  : { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, slot: 1 },
                cache: { '攻撃': 5, '匠': 3, '聴覚保護': 1 }
            };
            var decombs = [
                { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, slot: 2 },
                { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 2 }, slot: 3 }
            ];
            var borderLine = {
                waist: { '攻撃': 6, '匠': 4, '聴覚保護': 2 },
                sum: { waist: 12 },
                goal: { '攻撃': 20, '匠': 10, '聴覚保護': 10 }
            };
            got = c._combineDecomb(decombSet, decombs, borderLine, 'waist');
            exp = [
                { body : { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, slot: 3 },
                  head : { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, slot: 2 },
                  arm  : { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, slot: 1 },
                  waist: { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, slot: 2 },
                  cache: { '攻撃': 7, '匠': 4, '聴覚保護': 2 } },
                { body : { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, slot: 3 },
                  head : { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, slot: 2 },
                  arm  : { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, slot: 1 },
                  waist: { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 2 }, slot: 3 },
                  cache: { '攻撃': 7, '匠': 4, '聴覚保護': 3 } }
            ];
            assert.deepEqual(got, exp);
        });

        it('skip slot3 if skill activate', function () {
            // スキルが発動する場合、スロ2で見つかったらスロ3は無視
            var decombSet = {
                body : { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, slot: 3 },
                head : { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, slot: 2 },
                arm  : { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, slot: 1 },
                cache: { '攻撃': 5, '匠': 3, '聴覚保護': 1 } };
            var decombs = [
                { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, slot: 2 },
                { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 2 }, slot: 3 }
            ];
            var borderLine = {
                waist: { '攻撃': 6, '匠': 4, '聴覚保護': 2 },
                sum: { waist: 12 },
                goal: { '攻撃': 7, '匠': 4, '聴覚保護': 2 }
            };
            got = c._combineDecomb(decombSet, decombs, borderLine, 'waist');
            exp = [
                { body : { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, slot: 3 },
                  head : { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, slot: 2 },
                  arm  : { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, slot: 1 },
                  waist: { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, slot: 2 },
                  cache: { '攻撃': 7, '匠': 4, '聴覚保護': 2 },
                  activates: true }
            ];
            assert.deepEqual(got, exp);
        });

        it('torsoUp', function () {
            // 胴系統倍化があってもOK
            var decombSet = {
                body : { skillComb: { '攻撃': 2, '斬れ味': 1 }, slot: 3 },
                head : { skillComb: { '胴系統倍化': 1 }, slot: 0 },
                arm  : { skillComb: { '攻撃': 1, '斬れ味': 2 }, slot: 1 },
                waist: { skillComb: { '攻撃': 3, '斬れ味': 1 }, slot: 2 },
                cache: { '攻撃': 8, '斬れ味': 5 }
            };
            var decombs = [
                { skillComb: { '攻撃': 0, '斬れ味': 0 }, slot: 0 },
                { skillComb: { '胴系統倍化': 1 }, slot: 0 },
                { skillComb: { '攻撃': 1, '斬れ味': 1 }, slot: 1 },
                { skillComb: { '攻撃': 2, '斬れ味': 0 }, slot: 2 },
                { skillComb: { '攻撃': 2, '斬れ味': 1 }, slot: 3 }
            ];
            var borderLine = {
                leg: { '攻撃': 10, '斬れ味': 6 },
                sum: { leg: 16 },
                goal: { '攻撃': 20, '斬れ味': 10 }
            };
            got = c._combineDecomb(decombSet, decombs, borderLine, 'leg');
            exp = [
                { body : { skillComb: { '攻撃': 2, '斬れ味': 1 }, slot: 3 },
                  head : { skillComb: { '胴系統倍化': 1 }, slot: 0 },
                  arm  : { skillComb: { '攻撃': 1, '斬れ味': 2 }, slot: 1 },
                  waist: { skillComb: { '攻撃': 3, '斬れ味': 1 }, slot: 2 },
                  leg  : { skillComb: { '胴系統倍化': 1 }, slot: 0 },
                  cache: { '攻撃': 10, '斬れ味': 6 } },
                { body : { skillComb: { '攻撃': 2, '斬れ味': 1 }, slot: 3 },
                  head : { skillComb: { '胴系統倍化': 1 }, slot: 0 },
                  arm  : { skillComb: { '攻撃': 1, '斬れ味': 2 }, slot: 1 },
                  waist: { skillComb: { '攻撃': 3, '斬れ味': 1 }, slot: 2 },
                  leg  : { skillComb: { '攻撃': 2, '斬れ味': 1 }, slot: 3 },
                  cache: { '攻撃': 10, '斬れ味': 6 } }
            ];
            assert.deepEqual(got, exp);
        });

        it('torsoUp (activates)', function () {
            // 胴系統倍化があってもOK(スキル発動)
            var decombSet = {
                body : { skillComb: { '攻撃': 4, '斬れ味': 2 }, slot: 3 },
                head : { skillComb: { '胴系統倍化': 1 }, slot: 0 },
                arm  : { skillComb: { '攻撃': 3, '斬れ味': 3 }, slot: 1 },
                waist: { skillComb: { '攻撃': 5, '斬れ味': 1 }, slot: 2 },
                cache: { '攻撃': 16, '斬れ味': 8 }
            };
            var decombs = [
                { skillComb: { '攻撃': 0, '斬れ味': 0 }, slot: 0 },
                { skillComb: { '胴系統倍化': 1 }, slot: 0 },
                { skillComb: { '攻撃': 3, '斬れ味': 3 }, slot: 1 },
                { skillComb: { '攻撃': 5, '斬れ味': 0 }, slot: 2 },
                { skillComb: { '攻撃': 4, '斬れ味': 2 }, slot: 3 }
            ];
            var borderLine = {
                leg: { '攻撃': 20, '斬れ味': 10 },
                sum: { leg: 30 },
                goal: { '攻撃': 20, '斬れ味': 10 }
            };
            got = c._combineDecomb(decombSet, decombs, borderLine, 'leg');
            exp = [
                { body : { skillComb: { '攻撃': 4, '斬れ味': 2 }, slot: 3 },
                  head : { skillComb: { '胴系統倍化': 1 }, slot: 0 },
                  arm  : { skillComb: { '攻撃': 3, '斬れ味': 3 }, slot: 1 },
                  waist: { skillComb: { '攻撃': 5, '斬れ味': 1 }, slot: 2 },
                  leg  : { skillComb: { '胴系統倍化': 1 }, slot: 0 },
                  cache: { '攻撃': 20, '斬れ味': 10 },
                  activates: true }
            ];
            assert.deepEqual(got, exp);
        });

        it('combine body (done: none)', function () {
            // これからスタートするところ(body を調べる)
            var decombSet = {};
            var decombs = [
                { skillComb: { '攻撃': 4, '匠': 0, '聴覚保護': 0 }, slot: 2 },
                { skillComb: { '攻撃': 3, '匠': 1, '聴覚保護': 0 }, slot: 2 },
                { skillComb: { '攻撃': 3, '匠': 0, '聴覚保護': 1 }, slot: 2 },
                { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, slot: 2 },
                { skillComb: { '攻撃': 0, '匠': 4, '聴覚保護': 0 }, slot: 2 },
                { skillComb: { '攻撃': 1, '匠': 3, '聴覚保護': 0 }, slot: 2 },
                { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 1 }, slot: 2 },
                { skillComb: { '攻撃': 1, '匠': 2, '聴覚保護': 1 }, slot: 2 },
                { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 4 }, slot: 2 },
                { skillComb: { '攻撃': 1, '匠': 0, '聴覚保護': 3 }, slot: 2 },
                { skillComb: { '攻撃': 0, '匠': 1, '聴覚保護': 3 }, slot: 2 },
                { skillComb: { '攻撃': 1, '匠': 1, '聴覚保護': 2 }, slot: 2 }
            ];
            var borderLine = {
                body: { '攻撃': 1, '匠': 1, '聴覚保護': 1 },
                sum: { body: 3 },
                goal: { '攻撃': 20, '匠': 10, '聴覚保護': 10 }
            };
            got = c._combineDecomb(decombSet, decombs, borderLine, 'body');
            exp = [
                { body : { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, slot: 2 },
                  cache: { '攻撃': 2, '匠': 1, '聴覚保護': 1 } },
                { body : { skillComb: { '攻撃': 1, '匠': 2, '聴覚保護': 1 }, slot: 2 },
                  cache: { '攻撃': 1, '匠': 2, '聴覚保護': 1 } },
                { body : { skillComb: { '攻撃': 1, '匠': 1, '聴覚保護': 2 }, slot: 2 },
                  cache: { '攻撃': 1, '匠': 1, '聴覚保護': 2 } }
            ];
            assert.deepEqual(got, exp);
        });

        it('already goal', function () {
            // 既に borderLine.goal を満たしている
            var decombSet = {
                body : { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, slot: 3 },
                head : { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, slot: 2 },
                arm  : { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, slot: 1 },
                cache: { '攻撃': 20, '匠': 10, '聴覚保護': 10 }
            };
            var decombs = [
                { skillComb: { '攻撃': 1, '匠': 1, '聴覚保護': 1 }, slot: 1 },
                { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, slot: 2 },
                { skillComb: { '攻撃': 3, '匠': 1, '聴覚保護': 1 }, slot: 3 }
            ];
            var borderLine = {
                waist: { '攻撃': 4, '匠': 2, '聴覚保護': 1 },
                sum: { waist: 7 },
                goal: { '攻撃': 20, '匠': 10, '聴覚保護': 10 }
            };
            got = c._combineDecomb(decombSet, decombs, borderLine, 'waist');
            exp = [
                { body : { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, slot: 3 },
                  head : { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, slot: 2 },
                  arm  : { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, slot: 1 },
                  waist: { skillComb: { '攻撃': 1, '匠': 1, '聴覚保護': 1 }, slot: 1 },
                  cache: { '攻撃': 21, '匠': 11, '聴覚保護': 11 },
                  activates: true }
            ];
            assert.deepEqual(got, exp);
        });

        it('decombSet is null', function () {
            var decombSet = null;
            var decombs = [
                { skillComb: { '攻撃': 1, '匠': 1, '聴覚保護': 1 }, slot: 1 },
                { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, slot: 2 },
                { skillComb: { '攻撃': 3, '匠': 1, '聴覚保護': 1 }, slot: 3 }
            ];
            var borderLine = {
                waist: { '攻撃': 2, '匠': 1, '聴覚保護': 1 },
                sum: { body: 4 },
                goal: { '攻撃': 20, '匠': 10, '聴覚保護': 10 }
            };
            got = c._combineDecomb(decombSet, decombs, borderLine, 'body');
            exp = [
                { body : { skillComb: { '攻撃': 2, '匠': 1, '聴覚保護': 1 }, slot: 2 },
                  cache: { '攻撃': 2, '匠': 1, '聴覚保護': 1 } },
                { body : { skillComb: { '攻撃': 3, '匠': 1, '聴覚保護': 1 }, slot: 3 },
                  cache: { '攻撃': 3, '匠': 1, '聴覚保護': 1 } }
            ];
            assert.deepEqual(got, exp);
        });

        it('decombs is []', function () {
            var decombSet = {
                body : { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, slot: 3 },
                head : { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, slot: 2 },
                arm  : { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, slot: 1 },
                cache: { '攻撃': 5, '匠': 3, '聴覚保護': 1 }
            };
            var decombs = [];
            var borderLine = {
                waist: { '攻撃': 6, '匠': 4, '聴覚保護': 2 },
                sum: { waist: 12 },
                goal: { '攻撃': 20, '匠': 10, '聴覚保護': 10 }
            };
            got = c._combineDecomb(decombSet, decombs, borderLine, 'waist');
            exp = [
                { body : { skillComb: { '攻撃': 5, '匠': 0, '聴覚保護': 0 }, slot: 3 },
                  head : { skillComb: { '攻撃': 0, '匠': 3, '聴覚保護': 0 }, slot: 2 },
                  arm  : { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 1 }, slot: 1 },
                  waist: null,
                  cache: { '攻撃': 5, '匠': 3, '聴覚保護': 1 } }
            ];
            assert.deepEqual(got, exp);
        });
    });

    it('_removeOverlap', function () {
        var c = new Combinator();

        var decombSets = [
            // a1*3, a3*2, b2*2
            { body  : { names: [ 'a3' ] },
              head  : { names: [ 'a1' ] },
              arm   : { names: [ 'a1', 'a1' ] },
              waist : { names: [] },
              leg   : { names: [ 'b2' ] },
              weapon: { names: [ 'b2' ] },
              oma   : { names: [ 'a3' ] } },
            // a1*3, a3*2, b2*2
            { body  : { names: [ 'a3' ] },
              head  : { names: [ 'a1' ] },
              arm   : { names: [ 'a1', 'a1' ] },
              waist : null,
              leg   : { names: [ 'b2' ] },
              weapon: { names: [ 'b2' ] },
              oma   : { names: [ 'a3' ] } },
            // a1*3, a3*2, b2*2
            { body  : { names: [ 'a3' ] },
              head  : { names: [ 'a1' ] },
              arm   : { names: [ 'b2' ] },
              waist : { names: [] },
              leg   : { names: [ 'a1', 'a1' ] },
              weapon: { names: [ 'b2' ] },
              oma: { names: [ 'a3' ] } },
            // a1*2, a2*1, a3*2, b2*2
            { body  : { names: [ 'a3' ] },
              head  : { names: [ 'a1' ] },
              arm   : { names: [ 'a1', 'a2' ] },
              waist : { names: [] },
              leg   : { names: [ 'b2' ] },
              weapon: { names: [ 'b2' ] },
              oma   : { names: [ 'a3' ] } }
        ];
        got = c._removeOverlap(decombSets);
        exp = [
            // a1*3, a3*2, b2*2
            { body  : { names: [ 'a3' ] },
              head  : { names: [ 'a1' ] },
              arm   : { names: [ 'a1', 'a1' ] },
              waist : { names: [] },
              leg   : { names: [ 'b2' ] },
              weapon: { names: [ 'b2' ] },
              oma   : { names: [ 'a3' ] } },
            // a1*2, a2*1, a3*2, b2*2
            { body  : { names: [ 'a3' ] },
              head  : { names: [ 'a1' ] },
              arm   : { names: [ 'a1', 'a2' ] },
              waist : { names: [] },
              leg   : { names: [ 'b2' ] },
              weapon: { names: [ 'b2' ] },
              oma   : { names: [ 'a3' ] } }
        ];
        assert.deepEqual(got, exp, 'remove');
    });

    it('_calcTotalSlot', function () {
        var c = new Combinator();
        
        var equipSet = {
            body  : { name: 'body', slot: 1 },
            head  : { name: 'head', slot: 2 },
            arm   : { name: 'arm', slot: 3 },
            waist : { name: 'waist', slot: 0 },
            leg   : { name: 'leg', slot: 2 },
            weapon: null,
            oma   : { name: 'oma', slot: 3 }
        };
        got = c._calcTotalSlot(equipSet);
        exp = 11;
        assert(got === exp);
    });

    it('_groupByFreeSlot', function () {
        var c = new Combinator();

        var decombsSets = [
            { body  : { slot: 1 },
              head  : { slot: 2 },
              arm   : { slot: 3 },
              waist : { slot: 1 },
              leg   : { slot: 2 },
              weapon: null,
              oma   : { slot: 3 } },
            { body : { slot: 0 },
              head : { slot: 3 },
              arm  : { slot: 3 },
              waist: { slot: 0 },
              // weapon がない
              leg  : { slot: 3 },
              oma  : { slot: 3 } },
            { body  : { slot: 2 },
              head  : { slot: 2 },
              arm   : { slot: 2 },
              waist : { slot: 2 },
              leg   : { slot: 2 },
              weapon: { slot: 2 },
              oma   : { slot: 2 } }
        ];
        got = c._groupByFreeSlot(decombsSets, 15);
        exp = {
            3: [
                { body  : { slot: 1 },
                  head  : { slot: 2 },
                  arm   : { slot: 3 },
                  waist : { slot: 1 },
                  leg   : { slot: 2 },
                  weapon: null,
                  oma   : { slot: 3 } },
                { body : { slot: 0 },
                  head : { slot: 3 },
                  arm  : { slot: 3 },
                  waist: { slot: 0 },
                  // weapon がない
                  leg  : { slot: 3 },
                  oma  : { slot: 3 } }
            ],
            1: [
                { body  : { slot: 2 },
                  head  : { slot: 2 },
                  arm   : { slot: 2 },
                  waist : { slot: 2 },
                  leg   : { slot: 2 },
                  weapon: { slot: 2 },
                  oma   : { slot: 2 } }
            ]
        };
        assert.deepEqual(got, exp, 'group by');
    });

    describe('_getJustActivated', function () {
        var c = new Combinator();

        it('just activates', function () {
            var goal = { '匠': 6, '聴覚保護': 10 };
            var decombsSets = [
                // { '匠': 6, '聴覚保護': 10 }
                { body  : { skillComb: { '匠': 1, '聴覚保護': 1 } },
                  head  : { skillComb: { '匠': 0, '聴覚保護': 4 } },
                  arm   : { skillComb: { '匠': 2, '聴覚保護': 0 } },
                  waist : { skillComb: { '匠': 1, '聴覚保護': 1 } },
                  leg   : { skillComb: { '匠': 0, '聴覚保護': 4 } },
                  weapon: null,
                  oma   : { skillComb: { '匠': 2, '聴覚保護': 0 } } },
                // { '匠': 6, '聴覚保護': 10 }
                { body : { skillComb: { '匠': 1, '聴覚保護': 1 } },
                  head : { skillComb: { '匠': 0, '聴覚保護': 4 } },
                  arm  : { skillComb: { '匠': 2, '聴覚保護': 0 } },
                  waist: { skillComb: { '胴系統倍化': 1 } },
                  leg  : { skillComb: { '匠': 0, '聴覚保護': 4 } },
                  // weapon がない
                  oma  : { skillComb: { '匠': 2, '聴覚保護': 0 } } },
                // { '匠': 7, '聴覚保護': 10 }
                { body  : { skillComb: { '匠': 1, '聴覚保護': 1 } },
                  head  : { skillComb: { '匠': 0, '聴覚保護': 4 } },
                  arm   : { skillComb: { '匠': 2, '聴覚保護': 0 } },
                  waist : { skillComb: { '胴系統倍化': 1 } },
                  leg   : { skillComb: { '匠': 0, '聴覚保護': 4 } },
                  weapon: { skillComb: { '匠': 1, '聴覚保護': 0 } },
                  oma   : { skillComb: { '匠': 2, '聴覚保護': 0 } } }
            ];
            got = c._getJustActivated(decombsSets, goal);
            exp = [ decombsSets[0], decombsSets[1] ];
            assert.deepEqual(got, exp);
        });

        it('goal within minus', function () {
            // 装備で匠のポイントがオーバーしている場合
            // 組み合わせ例
            //   女性、村のみ、武器スロなし
            //   ディアブロヘルム、ガルルガメイル、フィリアアーム、
            //   ガルルガフォールド、フィリアグリーヴ
            //   龍の護石(スロ3,匠+4,氷耐性-5)
            var goal = { '匠': -1, '聴覚保護': 10 };
            var decombsSets = [
                { body  : { skillComb: { '匠': 0, '聴覚保護': 0 } },
                  head  : { skillComb: { '匠': 0, '聴覚保護': 2 } },
                  arm   : { skillComb: { '匠': 0, '聴覚保護': 1 } },
                  waist : { skillComb: { '匠': 0, '聴覚保護': 2 } },
                  leg   : { skillComb: { '匠': 0, '聴覚保護': 2 } },
                  weapon: null,
                  oma   : { skillComb: { '匠': 0, '聴覚保護': 3 } } }
            ];
            got = c._getJustActivated(decombsSets, goal);
            exp = [ decombsSets[0] ];
            assert.deepEqual(got, exp);
        });

        it('decombsSet is []', function () {
            var goal = { 'なんでもいい': 10 };
            got = c._getJustActivated([], goal);
            exp = [];
            assert.deepEqual(got, exp);
        });
    });

    describe('_removePointOver', function () {
        var c = new Combinator();

        it('remove', function () {
            var goal = { '匠': 6, '聴覚保護': 10 };
            var decombsSets = [
                // スロ12, { '匠': 6, '聴覚保護': 10 }
                { body  : { slot: 2, skillComb: { '匠': 1, '聴覚保護': 1 } },
                  head  : { slot: 2, skillComb: { '匠': 0, '聴覚保護': 4 } },
                  arm  : { slot: 2, skillComb: { '匠': 2, '聴覚保護': 0 } },
                  waist : { slot: 2, skillComb: { '匠': 1, '聴覚保護': 1 } },
                  leg   : { slot: 2, skillComb: { '匠': 0, '聴覚保護': 4 } },
                  weapon: null,
                  oma   : { slot: 2, skillComb: { '匠': 2, '聴覚保護': 0 } } },
                // スロ11, { '匠': 6, '聴覚保護': 10 }
                { body : { slot: 1, skillComb: { '匠': 1, '聴覚保護': 1 } },
                  head : { slot: 2, skillComb: { '匠': 0, '聴覚保護': 4 } },
                  arm  : { slot: 3, skillComb: { '匠': 2, '聴覚保護': 0 } },
                  waist: { slot: 0, skillComb: { '胴系統倍化': 1 } },
                  leg  : { slot: 3, skillComb: { '匠': 0, '聴覚保護': 4 } },
                  // weapon がない
                  oma  : { slot: 2, skillComb: { '匠': 2, '聴覚保護': 0 } } },
                // スロ12, { '匠': 7, '聴覚保護': 10 }
                { body  : { slot: 1, skillComb: { '匠': 1, '聴覚保護': 1 } },
                  head  : { slot: 2, skillComb: { '匠': 0, '聴覚保護': 4 } },
                  arm   : { slot: 3, skillComb: { '匠': 2, '聴覚保護': 0 } },
                  waist : { slot: 0, skillComb: { '胴系統倍化': 1 } },
                  leg   : { slot: 1, skillComb: { '匠': 0, '聴覚保護': 4 } },
                  weapon: { slot: 2, skillComb: { '匠': 1, '聴覚保護': 0 } },
                  oma   : { slot: 3, skillComb: { '匠': 2, '聴覚保護': 0 } } }
            ];
            got = c._removePointOver(decombsSets, 12, goal);
            exp = [ decombsSets[1], decombsSets[0] ];
            assert.deepEqual(got, exp);
        });

        it('single comb & point over', function () {
            // ちょうどスキルが発動している組み合わせがない
            var goal = { '匠': 0, '聴覚保護': 13, '研ぎ師': 7 };
            var decombsSets = [
                // スロ14, { '匠': 0, '聴覚保護': 13, '研ぎ師': 8 }
                { body : null,
                  head : { slot: 2, skillComb: { '匠': 0, '聴覚保護': 1, '研ぎ師': 2 } },
                  arm  : { slot: 3, skillComb:  { '匠': 0, '聴覚保護': 0, '研ぎ師': 6 } },
                  waist: { slot: 3, skillComb: { '匠': 0, '聴覚保護': 4, '研ぎ師': 0 } },
                  leg  : { slot: 3, skillComb: { '匠': 0, '聴覚保護': 4, '研ぎ師': 0 } },
                  oma  : { slot: 3, skillComb: { '匠': 0, '聴覚保護': 4, '研ぎ師': 0 } } }
            ];
            got = c._removePointOver(decombsSets, 14, goal);
            exp = [ decombsSets[0] ];
            assert.deepEqual(got, exp);
        });

        it('decombsSets is []', function () {
            var goal = { 'なんでもいい': 10 };
            got = c._removePointOver([], 0, goal);
            exp = [];
            assert.deepEqual(got, exp);
        });
    });

    describe('_combine', function () {
        var c = new Combinator();

        it('combine', function () {
            var skillNames = [ '攻撃力UP【大】', '斬れ味レベル+1', '耳栓' ];
            var decombsSet = {
                body: [
                    { skillComb: { '攻撃': 7, '匠': 0, '聴覚保護': 1 }, slot: 2 },
                    { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 2 }, slot: 2 },
                    { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, slot: 2 } ],
                head: [
                    { skillComb: { '攻撃': 7, '匠': 1, '聴覚保護': 1 }, slot: 2 },
                    { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, slot: 2 },
                    { skillComb: { '攻撃': 6, '匠': 2, '聴覚保護': 0 }, slot: 2 } ],
                arm: [
                    { skillComb: { '攻撃': 6, '匠': 2, '聴覚保護': 0 }, slot: 2 },
                    { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 }, slot: 2 },
                    { skillComb: { '攻撃': 4, '匠': 3, '聴覚保護': 0 }, slot: 2 } ],
                waist: [
                    { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, slot: 2 },
                    { skillComb: { '攻撃': 2, '匠': 3, '聴覚保護': 2 }, slot: 2 },
                    { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 }, slot: 2 } ],
                leg: [
                    { skillComb: { '攻撃': 6, '匠': 0, '聴覚保護': 4 }, slot: 2 },
                    { skillComb: { '攻撃': 3, '匠': 2, '聴覚保護': 4 }, slot: 2 },
                    { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 3 }, slot: 2 } ]
            };
            var borderLine = Comb.calcBorderLine(decombsSet, skillNames);
            got = c._combine(decombsSet, borderLine);
            exp = [
                { body : { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 2 }, slot:2 },
                  head : { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, slot:2 },
                  arm  : { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 }, slot:2 },
                  waist: { skillComb: { '攻撃': 2, '匠': 3, '聴覚保護': 2 }, slot:2 },
                  leg  : { skillComb: { '攻撃': 6, '匠': 0, '聴覚保護': 4 }, slot:2 },
                  cache: { '攻撃': 20, '匠': 10, '聴覚保護': 10 },
                  activates: true }
            ];
            assert.deepEqual(got, exp);
        });

        it('body is [] and torsoUp', function () {
            // body が [] で胴系統倍化
            var skillNames = [ '攻撃力UP【大】', '斬れ味レベル+1', '耳栓' ];
            var decombsSet = {
                body: [],
                head: [
                    { skillComb: { '攻撃': 7, '匠': 1, '聴覚保護': 1 }, slot: 2 },
                    { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, slot: 2 },
                    { skillComb: { '攻撃': 6, '匠': 2, '聴覚保護': 0 }, slot: 2 } ],
                arm: [
                    { skillComb: { '攻撃': 6, '匠': 2, '聴覚保護': 0 }, slot: 2 },
                    { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 }, slot: 2 },
                    { skillComb: { '攻撃': 4, '匠': 3, '聴覚保護': 0 }, slot: 2 } ],
                waist: [
                    { skillComb: { '胴系統倍化': 1 }, slot: 0 } ],
                leg: [
                    { skillComb: { '攻撃': 7, '匠': 0, '聴覚保護': 1 }, slot: 2 },
                    { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 2 }, slot: 2 },
                    { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, slot: 2 } ],
                weapon: [
                    { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, slot: 2 },
                    { skillComb: { '攻撃': 2, '匠': 3, '聴覚保護': 2 }, slot: 2 },
                    { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 }, slot: 2 } ],
                oma: [
                    { skillComb: { '攻撃': 6, '匠': 0, '聴覚保護': 4 }, slot: 2 },
                    { skillComb: { '攻撃': 3, '匠': 2, '聴覚保護': 4 }, slot: 2 },
                    { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 3 }, slot: 2 } ]
            };
            var borderLine = Comb.calcBorderLine(decombsSet, skillNames);
            got = c._combine(decombsSet, borderLine);
            exp = [
                { body  : null,
                  head  : { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, slot: 2 },
                  arm   : { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 }, slot: 2 },
                  waist : { skillComb: { '胴系統倍化': 1 }, slot: 0 },
                  leg   : { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 2 }, slot: 2 },
                  weapon: { skillComb: { '攻撃': 2, '匠': 3, '聴覚保護': 2 }, slot: 2 },
                  oma   : { skillComb: { '攻撃': 6, '匠': 0, '聴覚保護': 4 }, slot: 2 },
                  cache: { '攻撃': 20, '匠': 10, '聴覚保護': 10 },
                  activates: true }
            ];
            assert.deepEqual(got, exp);
        });
    });
});
