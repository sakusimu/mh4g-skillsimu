'use strict';
var assert = require('power-assert'),
    sutil = require('../../../lib/util/skill.js'),
    myapp = require('../../../test/lib/driver-myapp.js');

describe('20_util/01_skill', function () {
    var got, exp;

    beforeEach(function () {
        myapp.initialize();
    });

    it('require', function () {
        assert(typeof sutil === 'object', 'is object');
    });

    it('compact', function () {
        got = sutil.compact([ 'a' ], { a: 1, b: 2 });
        exp = { a: 1 };
        assert.deepEqual(got, exp, "[ 'a' ], { a: 1, b: 2 }");
        got = sutil.compact([ 'b' ], { a: 1 });
        exp = { b: 0 };
        assert.deepEqual(got, exp, "[ 'b' ], { a: 1 }");
        got = sutil.compact([ 'a', 'c' ], { a: 1, b: 2 });
        exp = { a: 1, c: 0 };
        assert.deepEqual(got, exp, "[ 'a', 'c' ], { a: 1, b: 2 }");

        got = sutil.compact([ 'a', 'c' ], { b: 1, c: -1 });
        exp = { a: 0, c: -1 };
        assert.deepEqual(got, exp, "[ 'a', 'c' ], { b: 1, c: -1 }");

        got = sutil.compact([ 'a' ], {});
        exp = { a: 0 };
        assert.deepEqual(got, exp, "[ 'a' ], {}");
        got = sutil.compact([ 'a' ], null);
        exp = { 'a': 0 };
        assert.deepEqual(got, exp, "[ 'a' ], null");

        got = sutil.compact([], { a: 1, b: 2 });
        exp = {};
        assert.deepEqual(got, exp, "[], { a: 1, b: 2 }");
        got = sutil.compact(null, { a: 1, b: 2 });
        exp = {};
        assert.deepEqual(got, exp, "null, { a: 1, b: 2 }");
        got = sutil.compact(null, null);
        exp = {};
        assert.deepEqual(got, exp, 'null, null');

        got = sutil.compact([ 'a' ], { a: 1, b: 2, '胴系統倍加': 1 });
        exp = { a: 1, '胴系統倍加': 1 };
        assert.deepEqual(got, exp, 'torso up 1');
        got = sutil.compact([ 'a' ], { '胴系統倍加': 1 });
        exp = { a: 0, '胴系統倍加': 1 };
        assert.deepEqual(got, exp, 'torso up 2');
        got = sutil.compact([], { '胴系統倍加': 1 });
        exp = { '胴系統倍加': 1 };
        assert.deepEqual(got, exp, 'torso up 3');

        got = sutil.compact([ 'a' ], [ { a: 1, b: 2 }, { a: 2, b: 1 } ]);
        exp = [ { a: 1 }, { a: 2 } ];
        assert.deepEqual(got, exp, 'list');
        got = sutil.compact([ 'b' ], [ { a: 1 }, null ]);
        exp = [ { b: 0 }, { b: 0 } ];
        assert.deepEqual(got, exp, 'list: null');
        got = sutil.compact([ 'a', 'c' ], [ { a: 1, b: 2 }, { '胴系統倍加': 1 } ]);
        exp = [ { a: 1, c: 0 }, { a: 0, c: 0, '胴系統倍加': 1 } ];
        assert.deepEqual(got, exp, 'list: torso up');
        got = sutil.compact([ 'a' ], []);
        exp = [ { a: 0 } ];
        assert.deepEqual(got, exp, 'list: empty list');
    });

    it('contains', function () {
        var equip;

        equip = myapp.equip('body', 'ブレイブベスト');
        got = sutil.contains(equip.skillComb, '乗り');
        assert(got, "'乗り'");
        got = sutil.contains(equip.skillComb, [ '乗り' ]);
        assert(got, "[ '乗り' ]");

        equip = myapp.equip('body', 'レウスメイル');
        got = sutil.contains(equip.skillComb, [ '攻撃', '火属性攻撃' ]);
        assert(got, "[ '攻撃', '火属性攻撃' ]");
        got = sutil.contains(equip.skillComb, [ '攻撃', '匠' ]);
        assert(got, "[ '攻撃', '匠' ]");
        got = sutil.contains(equip.skillComb, [ '達人', '匠' ]);
        assert(!got, "[ '達人', '匠' ]");
    });

    it('get', function () {
        got = sutil.get('攻撃力UP【小】');

        assert(got.name === '攻撃力UP【小】', 'name');
        assert(got.tree === '攻撃', 'tree');
        assert(got.point === 10, 'point');

        got = sutil.get('攻撃');
        assert(got === null, 'not found');
        got = sutil.get();
        assert(got === null, 'nothing in');
        got = sutil.get(undefined);
        assert(got === null, 'undefined');
        got = sutil.get(null);
        assert(got === null, 'null');
        got = sutil.get('');
        assert(got === null, 'empty string');
    });

    it('isEqual', function () {
        var a, b, count = 1;

        a = { a: 1 }; b = { a: 1 };
        assert(sutil.isEqual(a, b), 'case 1-' + count++);
        a = { a: 1 }; b = { a: 2 };
        assert(!sutil.isEqual(a, b), 'case 1-' + count++);
        a = { a: 1 }; b = { a: 0 };
        assert(!sutil.isEqual(a, b), 'case 1-' + count++);

        count = 1;
        a = { a: 1, b: 0 }; b = { a: 1, b: 0 };
        assert(sutil.isEqual(a, b), 'case 2-' + count++);
        a = { a: 1, b: 1 }; b = { a: 1, b: 2 };
        assert(!sutil.isEqual(a, b), 'case 2-' + count++);
        a = { a: 1, b: 1 }; b = { a: 1, b: 0 };
        assert(!sutil.isEqual(a, b), 'case 2-' + count++);

        count = 1;
        a = { a: 3, b: 2, c: 1, d: 0 }; b = { a: 3, b: 2, c: 1, d: 0 };
        assert(sutil.isEqual(a, b), 'case 3-' + count++);
        a = { a: 3, b: 2, c: 1, d: 0 }; b = { a: 3, b: 2, c: 2, d: 0 };
        assert(!sutil.isEqual(a, b), 'case 3-' + count++);

        // 同じプロパティでないと正しい結果が返らない
        count = 1;
        a = { a: 1 }; b = { b: 1 };
        assert(!sutil.isEqual(a, b), 'case 4-' + count++);
        a = { a: 1 }; b = { a: 1, b: 1 };
        assert(sutil.isEqual(a, b), 'case 4-' + count++);
    });

    it('join', function () {
        var combs = [ { a: 1, b: -1 }, { c: 1, d: -1 } ];
        got = sutil.join(combs);
        exp = { a: 1, c: 1, b: -1, d: -1 };
        assert.deepEqual(got, exp, 'join');
        got = combs;
        exp = [ { a: 1, b: -1 }, { c: 1, d: -1 } ];
        assert.deepEqual(got, exp, 'join: STABLE');

        got = sutil.join([ { a: 1 } ]);
        exp = { a: 1 };
        assert.deepEqual(got, exp, 'single');
        got = sutil.join([ null ]);
        exp = {};
        assert.deepEqual(got, exp, 'single: null');

        got = sutil.join([ { a: 1, b: -1 }, { a: 1 } ]);
        exp = { a: 2, b: -1 };
        assert.deepEqual(got, exp, 'add');
        got = sutil.join([ { a: 1, b: -1 }, { b: -1 } ]);
        exp = { a: 1, b: -2 };
        assert.deepEqual(got, exp, 'remove');

        got = sutil.join([ { a: 1, '胴系統倍加': 1 }, { a: 1 } ]);
        exp = { a: 2, '胴系統倍加': 1 };
        assert.deepEqual(got, exp, 'torso up 1');
        got = sutil.join([ { a: 1, b: -1 }, { '胴系統倍加': 1 } ]);
        exp = { a: 1, b: -1, '胴系統倍加': 1 };
        assert.deepEqual(got, exp, 'torso up 2');
        got = sutil.join([ { a: 1, '胴系統倍加': 1 }, { '胴系統倍加': 1 } ]);
        exp = { a: 1, '胴系統倍加': 1 };
        assert.deepEqual(got, exp, 'torso up 3');

        got = sutil.join([ { a: 1 }, undefined ]);
        exp = { a: 1 };
        assert.deepEqual(got, exp, 'within undefined');
        got = sutil.join([ { a: 1 }, null ]);
        exp = { a: 1 };
        assert.deepEqual(got, exp, 'within null');
        got = sutil.join([ { a: 1 }, {} ]);
        exp = { a: 1 };
        assert.deepEqual(got, exp, 'within {}');

        got = sutil.join();
        assert.deepEqual(got, {}, 'nothing in');
        got = sutil.join(undefined);
        assert.deepEqual(got, {}, 'undefined');
        got = sutil.join(null);
        assert.deepEqual(got, {}, 'null');
        got = sutil.join([]);
        assert.deepEqual(got, {}, '[]');
    });

    it('merge', function () {
        got = sutil.merge({ a: 1, b: -1 }, { a: 1 });
        exp = { a: 2, b: -1 };
        assert.deepEqual(got, exp, 'add');
        got = sutil.merge({ a: 1, b: -1 }, { b: -1 });
        exp = { a: 1, b: -2 };
        assert.deepEqual(got, exp, 'remove');
    });

    it('sum', function () {
        got = sutil.sum({ a: 1, b: 1 });
        exp = 2;
        assert(got === exp, "{ a: 1, b: 1 }");

        got = sutil.sum({ a: 3, b: 1 });
        exp = 4;
        assert(got === exp, "{ a: 3, b: 1 }");
        got = sutil.sum({ a: 1, b: 2 });
        exp = 3;
        assert(got === exp, "{ a: 1, b: 2 }");
        got = sutil.sum({ a: -3, b: 1 });
        exp = -2;
        assert(got === exp, "{ a: -3, b: 1 }");
        got = sutil.sum({ a: 1, b: -2 });
        exp = -1;
        assert(got === exp, "{ a: 1, b: -2 }");

        got = sutil.sum({ a: 0, b: 0 });
        exp = 0;
        assert(got === exp, "{ a: 0, b: 0 }");
        got = sutil.sum({ a: 1, b: 0 });
        exp = 1;
        assert(got === exp, "{ a: 1, b: 0 }");
        got = sutil.sum({ a: 0, b: 1 });
        exp = 1;
        assert(got === exp, "{ a: 0, b: 1 }");

        got = sutil.sum({ a: 1, b: 1, 'c': 1, 'd': 1, 'e': 1 });
        exp = 5;
        assert(got === exp, 'many');

        got = sutil.sum({ a: 1, b: 1, '胴系統倍加': 1, 'c': 1 });
        exp = 3;
        assert(got === exp, 'torso up');

        got = sutil.sum();
        assert(got === 0, 'nothing in');
        got = sutil.sum(undefined);
        assert(got === 0, 'undefined');
        got = sutil.sum(null);
        assert(got === 0, 'null');
        got = sutil.sum({});
        assert(got === 0, '{}');
        got = sutil.sum([]);
        assert(got === 0, '[]');
    });

    it('trees', function () {
        got = sutil.trees([ '攻撃力UP【大】', '斬れ味レベル+1', '耳栓' ]);
        exp = [ '攻撃', '匠', '聴覚保護' ];
        assert.deepEqual(got, exp, "[ '攻撃力UP【大】', '斬れ味レベル+1', '耳栓' ]");

        try { sutil.trees([ '攻撃大' ]); } catch (e) { got = e.message; }
        assert(got === '攻撃大 is not found');
    });

    it('unify', function () {
        var set, list;

        set = {
            head: { skillComb: { a: 1 } },
            body: { skillComb: { a: 1, b: 1 } },
            arm: { skillComb: { b: 1 } },
            waist: { skillComb: { '胴系統倍加': 1 } },
            leg: { skillComb: { c: 1 } },
            weapon: {},
            oma: null
        };
        got = sutil.unify(set);
        exp = { a: 3, b: 3, c: 1 };
        assert.deepEqual(got, exp, 'set');

        set = {
            head: { skillComb: { a: 1 } },
            body: null,
            arm: { skillComb: { b: 1 } },
            waist: { skillComb: { '胴系統倍加': 1 } },
            leg: { skillComb: { c: 1 } },
            weapon: {},
            oma: null
        };
        got = sutil.unify(set);
        exp = { a: 1, b: 1, c: 1 };
        assert.deepEqual(got, exp, 'set: body is null');

        list = [
            { skillComb: { a: 1, b: 1 } },
            { skillComb: { a: 1 } },
            { skillComb: { b: 1 } },
            { skillComb: { '胴系統倍加': 1 } },
            { skillComb: { c: 1 } },
            {},
            null
        ];
        got = sutil.unify(list);
        exp = { a: 3, b: 3, c: 1};
        assert.deepEqual(got, exp, 'list');

        list = [
            null,
            { skillComb: { a: 1 } },
            { skillComb: { b: 1 } },
            { skillComb: { '胴系統倍加': 1 } },
            { skillComb: { c: 1 } },
            {},
            null
        ];
        got = sutil.unify(list);
        exp = { a: 1, b: 1, c: 1 };
        assert.deepEqual(got, exp, 'list: body is null');
    });
});
