'use strict';
var assert = require('power-assert'),
    Skill = require('../../../lib/util/skill.js'),
    myapp = require('../../../test/lib/driver-myapp.js');

describe('20_util/01_skill', function () {
    var got, exp;

    beforeEach(function () {
        myapp.initialize();
    });

    it('Skill', function () {
        assert(typeof Skill === 'object', 'is object');
    });

    it('compact', function () {
        got = Skill.compact([ 'a' ], { a: 1, b: 2 });
        exp = { a: 1 };
        assert.deepEqual(got, exp, "[ 'a' ], { a: 1, b: 2 }");
        got = Skill.compact([ 'b' ], { a: 1 });
        exp = { b: 0 };
        assert.deepEqual(got, exp, "[ 'b' ], { a: 1 }");
        got = Skill.compact([ 'a', 'c' ], { a: 1, b: 2 });
        exp = { a: 1, c: 0 };
        assert.deepEqual(got, exp, "[ 'a', 'c' ], { a: 1, b: 2 }");

        got = Skill.compact([ 'a', 'c' ], { b: 1, c: -1 });
        exp = { a: 0, c: -1 };
        assert.deepEqual(got, exp, "[ 'a', 'c' ], { b: 1, c: -1 }");

        got = Skill.compact([ 'a' ], {});
        exp = { a: 0 };
        assert.deepEqual(got, exp, "[ 'a' ], {}");
        got = Skill.compact([ 'a' ], null);
        exp = { 'a': 0 };
        assert.deepEqual(got, exp, "[ 'a' ], null");

        got = Skill.compact([], { a: 1, b: 2 });
        exp = {};
        assert.deepEqual(got, exp, "[], { a: 1, b: 2 }");
        got = Skill.compact(null, { a: 1, b: 2 });
        exp = {};
        assert.deepEqual(got, exp, "null, { a: 1, b: 2 }");
        got = Skill.compact(null, null);
        exp = {};
        assert.deepEqual(got, exp, 'null, null');

        got = Skill.compact([ 'a' ], { a: 1, b: 2, '胴系統倍化': 1 });
        exp = { a: 1, '胴系統倍化': 1 };
        assert.deepEqual(got, exp, 'torso up 1');
        got = Skill.compact([ 'a' ], { '胴系統倍化': 1 });
        exp = { a: 0, '胴系統倍化': 1 };
        assert.deepEqual(got, exp, 'torso up 2');
        got = Skill.compact([], { '胴系統倍化': 1 });
        exp = { '胴系統倍化': 1 };
        assert.deepEqual(got, exp, 'torso up 3');

        got = Skill.compact([ 'a' ], [ { a: 1, b: 2 }, { a: 2, b: 1 } ]);
        exp = [ { a: 1 }, { a: 2 } ];
        assert.deepEqual(got, exp, 'list');
        got = Skill.compact([ 'b' ], [ { a: 1 }, null ]);
        exp = [ { b: 0 }, { b: 0 } ];
        assert.deepEqual(got, exp, 'list: null');
        got = Skill.compact([ 'a', 'c' ], [ { a: 1, b: 2 }, { '胴系統倍化': 1 } ]);
        exp = [ { a: 1, c: 0 }, { a: 0, c: 0, '胴系統倍化': 1 } ];
        assert.deepEqual(got, exp, 'list: torso up');
        got = Skill.compact([ 'a' ], []);
        exp = [ { a: 0 } ];
        assert.deepEqual(got, exp, 'list: empty list');
    });

    it('contains', function () {
        var equip;

        equip = myapp.equip('body', 'ブレイブベスト');
        got = Skill.contains(equip.skillComb, '乗り');
        assert(got, "'乗り'");
        got = Skill.contains(equip.skillComb, [ '乗り' ]);
        assert(got, "[ '乗り' ]");

        equip = myapp.equip('body', 'レウスメイル');
        got = Skill.contains(equip.skillComb, [ '攻撃', '火属性攻撃' ]);
        assert(got, "[ '攻撃', '火属性攻撃' ]");
        got = Skill.contains(equip.skillComb, [ '攻撃', '匠' ]);
        assert(got, "[ '攻撃', '匠' ]");
        got = Skill.contains(equip.skillComb, [ '達人', '匠' ]);
        assert(!got, "[ '達人', '匠' ]");
    });

    it('get', function () {
        got = Skill.get('攻撃力UP【小】');

        assert(got.name === '攻撃力UP【小】', 'name');
        assert(got.tree === '攻撃', 'tree');
        assert(got.point === 10, 'point');

        got = Skill.get('攻撃');
        assert(got === null, 'not found');
        got = Skill.get();
        assert(got === null, 'nothing in');
        got = Skill.get(undefined);
        assert(got === null, 'undefined');
        got = Skill.get(null);
        assert(got === null, 'null');
        got = Skill.get('');
        assert(got === null, 'empty string');
    });

    it('isEqual', function () {
        var a, b, count = 1;

        a = { a: 1 }; b = { a: 1 };
        assert(Skill.isEqual(a, b), 'case 1-' + count++);
        a = { a: 1 }; b = { a: 2 };
        assert(!Skill.isEqual(a, b), 'case 1-' + count++);
        a = { a: 1 }; b = { a: 0 };
        assert(!Skill.isEqual(a, b), 'case 1-' + count++);

        count = 1;
        a = { a: 1, b: 0 }; b = { a: 1, b: 0 };
        assert(Skill.isEqual(a, b), 'case 2-' + count++);
        a = { a: 1, b: 1 }; b = { a: 1, b: 2 };
        assert(!Skill.isEqual(a, b), 'case 2-' + count++);
        a = { a: 1, b: 1 }; b = { a: 1, b: 0 };
        assert(!Skill.isEqual(a, b), 'case 2-' + count++);

        count = 1;
        a = { a: 3, b: 2, c: 1, d: 0 }; b = { a: 3, b: 2, c: 1, d: 0 };
        assert(Skill.isEqual(a, b), 'case 3-' + count++);
        a = { a: 3, b: 2, c: 1, d: 0 }; b = { a: 3, b: 2, c: 2, d: 0 };
        assert(!Skill.isEqual(a, b), 'case 3-' + count++);

        // 同じプロパティでないと正しい結果が返らない
        count = 1;
        a = { a: 1 }; b = { b: 1 };
        assert(!Skill.isEqual(a, b), 'case 4-' + count++);
        a = { a: 1 }; b = { a: 1, b: 1 };
        assert(Skill.isEqual(a, b), 'case 4-' + count++);
    });

    it('join', function () {
        var combs = [ { a: 1, b: -1 }, { c: 1, d: -1 } ];
        got = Skill.join(combs);
        exp = { a: 1, c: 1, b: -1, d: -1 };
        assert.deepEqual(got, exp, 'join');
        got = combs;
        exp = [ { a: 1, b: -1 }, { c: 1, d: -1 } ];
        assert.deepEqual(got, exp, 'join: STABLE');

        got = Skill.join([ { a: 1 } ]);
        exp = { a: 1 };
        assert.deepEqual(got, exp, 'single');
        got = Skill.join([ null ]);
        exp = {};
        assert.deepEqual(got, exp, 'single: null');

        got = Skill.join([ { a: 1, b: -1 }, { a: 1 } ]);
        exp = { a: 2, b: -1 };
        assert.deepEqual(got, exp, 'add');
        got = Skill.join([ { a: 1, b: -1 }, { b: -1 } ]);
        exp = { a: 1, b: -2 };
        assert.deepEqual(got, exp, 'remove');

        got = Skill.join([ { a: 1, '胴系統倍化': 1 }, { a: 1 } ]);
        exp = { a: 2, '胴系統倍化': 1 };
        assert.deepEqual(got, exp, 'torso up 1');
        got = Skill.join([ { a: 1, b: -1 }, { '胴系統倍化': 1 } ]);
        exp = { a: 1, b: -1, '胴系統倍化': 1 };
        assert.deepEqual(got, exp, 'torso up 2');
        got = Skill.join([ { a: 1, '胴系統倍化': 1 }, { '胴系統倍化': 1 } ]);
        exp = { a: 1, '胴系統倍化': 1 };
        assert.deepEqual(got, exp, 'torso up 3');

        got = Skill.join([ { a: 1 }, undefined ]);
        exp = { a: 1 };
        assert.deepEqual(got, exp, 'within undefined');
        got = Skill.join([ { a: 1 }, null ]);
        exp = { a: 1 };
        assert.deepEqual(got, exp, 'within null');
        got = Skill.join([ { a: 1 }, {} ]);
        exp = { a: 1 };
        assert.deepEqual(got, exp, 'within {}');

        got = Skill.join();
        assert.deepEqual(got, {}, 'nothing in');
        got = Skill.join(undefined);
        assert.deepEqual(got, {}, 'undefined');
        got = Skill.join(null);
        assert.deepEqual(got, {}, 'null');
        got = Skill.join([]);
        assert.deepEqual(got, {}, '[]');
    });

    it('merge', function () {
        got = Skill.merge({ a: 1, b: -1 }, { a: 1 });
        exp = { a: 2, b: -1 };
        assert.deepEqual(got, exp, 'add');
        got = Skill.merge({ a: 1, b: -1 }, { b: -1 });
        exp = { a: 1, b: -2 };
        assert.deepEqual(got, exp, 'remove');
    });

    it('sum', function () {
        got = Skill.sum({ a: 1, b: 1 });
        exp = 2;
        assert(got === exp, "{ a: 1, b: 1 }");

        got = Skill.sum({ a: 3, b: 1 });
        exp = 4;
        assert(got === exp, "{ a: 3, b: 1 }");
        got = Skill.sum({ a: 1, b: 2 });
        exp = 3;
        assert(got === exp, "{ a: 1, b: 2 }");
        got = Skill.sum({ a: -3, b: 1 });
        exp = -2;
        assert(got === exp, "{ a: -3, b: 1 }");
        got = Skill.sum({ a: 1, b: -2 });
        exp = -1;
        assert(got === exp, "{ a: 1, b: -2 }");

        got = Skill.sum({ a: 0, b: 0 });
        exp = 0;
        assert(got === exp, "{ a: 0, b: 0 }");
        got = Skill.sum({ a: 1, b: 0 });
        exp = 1;
        assert(got === exp, "{ a: 1, b: 0 }");
        got = Skill.sum({ a: 0, b: 1 });
        exp = 1;
        assert(got === exp, "{ a: 0, b: 1 }");

        got = Skill.sum({ a: 1, b: 1, 'c': 1, 'd': 1, 'e': 1 });
        exp = 5;
        assert(got === exp, 'many');

        got = Skill.sum({ a: 1, b: 1, '胴系統倍化': 1, 'c': 1 });
        exp = 3;
        assert(got === exp, 'torso up');

        got = Skill.sum();
        assert(got === 0, 'nothing in');
        got = Skill.sum(undefined);
        assert(got === 0, 'undefined');
        got = Skill.sum(null);
        assert(got === 0, 'null');
        got = Skill.sum({});
        assert(got === 0, '{}');
        got = Skill.sum([]);
        assert(got === 0, '[]');
    });

    it('trees', function () {
        got = Skill.trees([ '攻撃力UP【大】', '斬れ味レベル+1', '耳栓' ]);
        exp = [ '攻撃', '匠', '聴覚保護' ];
        assert.deepEqual(got, exp, "[ '攻撃力UP【大】', '斬れ味レベル+1', '耳栓' ]");

        try { Skill.trees([ '攻撃大' ]); } catch (e) { got = e.message; }
        assert(got === '攻撃大 is not found');
    });

    it('unify', function () {
        var setOrList;

        setOrList = {
            head: { skillComb: { a: 1 } },
            body: { skillComb: { a: 1, b: 1 } },
            arm: { skillComb: { b: 1 } },
            waist: { skillComb: { '胴系統倍化': 1 } },
            leg: { skillComb: { c: 1 } },
            weapon: {},
            oma: null
        };
        got = Skill.unify(setOrList);
        exp = { a: 3, b: 3, c: 1 };
        assert.deepEqual(got, exp, '_unifySet');

        setOrList = {
            head: { skillComb: { a: 1 } },
            body: null,
            arm: { skillComb: { b: 1 } },
            waist: { skillComb: { '胴系統倍化': 1 } },
            leg: { skillComb: { c: 1 } },
            weapon: {},
            oma: null
        };
        got = Skill.unify(setOrList);
        exp = { a: 1, b: 1, c: 1 };
        assert.deepEqual(got, exp, '_unifySet: body is null');

        setOrList = [
            { skillComb: { a: 1, b: 1 } },
            { skillComb: { a: 1 } },
            { skillComb: { b: 1 } },
            { skillComb: { '胴系統倍化': 1 } },
            { skillComb: { c: 1 } },
            {},
            null
        ];
        got = Skill.unify(setOrList);
        exp = { a: 3, b: 3, c: 1};
        assert.deepEqual(got, exp, '_unifyList');

        setOrList = [
            null,
            { skillComb: { a: 1 } },
            { skillComb: { b: 1 } },
            { skillComb: { '胴系統倍化': 1 } },
            { skillComb: { c: 1 } },
            {},
            null
        ];
        got = Skill.unify(setOrList);
        exp = { a: 1, b: 1, c: 1 };
        assert.deepEqual(got, exp, '_unifyList: body is null');
    });
});
