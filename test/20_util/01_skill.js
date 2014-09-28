(function (define) {
'use strict';
var deps = [ '../lib/test-helper.js', '../../lib/util/skill.js', '../lib/driver-myapp.js' ];
define(deps, function (QUnit, Skill, myapp) {

QUnit.module('20_util/01_skill', {
    setup: function () {
        myapp.initialize();
    }
});

QUnit.test('Skill', function () {
    QUnit.strictEqual(typeof Skill, 'object', 'is object');
});

QUnit.test('compact', function () {
    var got, exp;

    got = Skill.compact([ 'a' ], { a: 1, b: 2 });
    exp = { a: 1 };
    QUnit.deepEqual(got, exp, "[ 'a' ], { a: 1, b: 2 }");
    got = Skill.compact([ 'b' ], { a: 1 });
    exp = { b: 0 };
    QUnit.deepEqual(got, exp, "[ 'b' ], { a: 1 }");
    got = Skill.compact([ 'a', 'c' ], { a: 1, b: 2 });
    exp = { a: 1, c: 0 };
    QUnit.deepEqual(got, exp, "[ 'a', 'c' ], { a: 1, b: 2 }");

    got = Skill.compact([ 'a', 'c' ], { b: 1, c: -1 });
    exp = { a: 0, c: -1 };
    QUnit.deepEqual(got, exp, "[ 'a', 'c' ], { b: 1, c: -1 }");

    got = Skill.compact([ 'a' ], {});
    exp = { a: 0 };
    QUnit.deepEqual(got, exp, "[ 'a' ], {}");
    got = Skill.compact([ 'a' ], null);
    exp = { 'a': 0 };
    QUnit.deepEqual(got, exp, "[ 'a' ], null");

    got = Skill.compact([], { a: 1, b: 2 });
    exp = {};
    QUnit.deepEqual(got, exp, "[], { a: 1, b: 2 }");
    got = Skill.compact(null, { a: 1, b: 2 });
    exp = {};
    QUnit.deepEqual(got, exp, "null, { a: 1, b: 2 }");
    got = Skill.compact(null, null);
    exp = {};
    QUnit.deepEqual(got, exp, 'null, null');

    got = Skill.compact([ 'a' ], { a: 1, b: 2, '胴系統倍化': 1 });
    exp = { a: 1, '胴系統倍化': 1 };
    QUnit.deepEqual(got, exp, 'torso up 1');
    got = Skill.compact([ 'a' ], { '胴系統倍化': 1 });
    exp = { a: 0, '胴系統倍化': 1 };
    QUnit.deepEqual(got, exp, 'torso up 2');
    got = Skill.compact([], { '胴系統倍化': 1 });
    exp = { '胴系統倍化': 1 };
    QUnit.deepEqual(got, exp, 'torso up 3');

    got = Skill.compact([ 'a' ], [ { a: 1, b: 2 }, { a: 2, b: 1 } ]);
    exp = [ { a: 1 }, { a: 2 } ];
    QUnit.deepEqual(got, exp, 'list');
    got = Skill.compact([ 'b' ], [ { a: 1 }, null ]);
    exp = [ { b: 0 }, { b: 0 } ];
    QUnit.deepEqual(got, exp, 'list: null');
    got = Skill.compact([ 'a', 'c' ], [ { a: 1, b: 2 }, { '胴系統倍化': 1 } ]);
    exp = [ { a: 1, c: 0 }, { a: 0, c: 0, '胴系統倍化': 1 } ];
    QUnit.deepEqual(got, exp, 'list: torso up');
    got = Skill.compact([ 'a' ], []);
    exp = [ { a: 0 } ];
    QUnit.deepEqual(got, exp, 'list: empty list');

});

QUnit.test('contains', function () {
    var got, equip;

    equip = myapp.equip('body', 'ブレイブベスト');
    got = Skill.contains(equip.skillComb, '乗り');
    QUnit.ok(got, "'乗り'");
    got = Skill.contains(equip.skillComb, [ '乗り' ]);
    QUnit.ok(got, "[ '乗り' ]");

    equip = myapp.equip('body', 'レウスメイル');
    got = Skill.contains(equip.skillComb, [ '攻撃', '火属性攻撃' ]);
    QUnit.ok(got, "[ '攻撃', '火属性攻撃' ]");
    got = Skill.contains(equip.skillComb, [ '攻撃', '匠' ]);
    QUnit.ok(got, "[ '攻撃', '匠' ]");
    got = Skill.contains(equip.skillComb, [ '達人', '匠' ]);
    QUnit.ok(!got, "[ '達人', '匠' ]");
});

QUnit.test('get', function () {
    var got;

    got = Skill.get('攻撃力UP【小】');

    QUnit.strictEqual(got.name, '攻撃力UP【小】', 'name');
    QUnit.strictEqual(got.tree, '攻撃', 'tree');
    QUnit.strictEqual(got.point, 10, 'point');

    got = Skill.get('攻撃');
    QUnit.strictEqual(got, null, 'not found');
    got = Skill.get();
    QUnit.strictEqual(got, null, 'nothing in');
    got = Skill.get(undefined);
    QUnit.strictEqual(got, null, 'undefined');
    got = Skill.get(null);
    QUnit.strictEqual(got, null, 'null');
    got = Skill.get('');
    QUnit.strictEqual(got, null, 'empty string');
});

QUnit.test('isEqual', function () {
    var a, b, count = 1;

    a = { a: 1 }; b = { a: 1 };
    QUnit.ok(Skill.isEqual(a, b), 'case 1-' + count++);
    a = { a: 1 }; b = { a: 2 };
    QUnit.ok(!Skill.isEqual(a, b), 'case 1-' + count++);
    a = { a: 1 }; b = { a: 0 };
    QUnit.ok(!Skill.isEqual(a, b), 'case 1-' + count++);

    count = 1;
    a = { a: 1, b: 0 }; b = { a: 1, b: 0 };
    QUnit.ok(Skill.isEqual(a, b), 'case 2-' + count++);
    a = { a: 1, b: 1 }; b = { a: 1, b: 2 };
    QUnit.ok(!Skill.isEqual(a, b), 'case 2-' + count++);
    a = { a: 1, b: 1 }; b = { a: 1, b: 0 };
    QUnit.ok(!Skill.isEqual(a, b), 'case 2-' + count++);

    count = 1;
    a = { a: 3, b: 2, c: 1, d: 0 }; b = { a: 3, b: 2, c: 1, d: 0 };
    QUnit.ok(Skill.isEqual(a, b), 'case 3-' + count++);
    a = { a: 3, b: 2, c: 1, d: 0 }; b = { a: 3, b: 2, c: 2, d: 0 };
    QUnit.ok(!Skill.isEqual(a, b), 'case 3-' + count++);

    // 同じプロパティでないと正しい結果が返らない
    count = 1;
    a = { a: 1 }; b = { b: 1 };
    QUnit.ok(!Skill.isEqual(a, b), 'case 4-' + count++);
    a = { a: 1 }; b = { a: 1, b: 1 };
    QUnit.ok(Skill.isEqual(a, b), 'case 4-' + count++);
});

QUnit.test('join', function () {
    var got, exp;

    var combs = [ { a: 1, b: -1 }, { c: 1, d: -1 } ];
    got = Skill.join(combs);
    exp = { a: 1, c: 1, b: -1, d: -1 };
    QUnit.deepEqual(got, exp, 'join');
    got = combs;
    exp = [ { a: 1, b: -1 }, { c: 1, d: -1 } ];
    QUnit.deepEqual(got, exp, 'join: STABLE');

    got = Skill.join([ { a: 1 } ]);
    exp = { a: 1 };
    QUnit.deepEqual(got, exp, 'single');
    got = Skill.join([ null ]);
    exp = {};
    QUnit.deepEqual(got, exp, 'single: null');

    got = Skill.join([ { a: 1, b: -1 }, { a: 1 } ]);
    exp = { a: 2, b: -1 };
    QUnit.deepEqual(got, exp, 'add');
    got = Skill.join([ { a: 1, b: -1 }, { b: -1 } ]);
    exp = { a: 1, b: -2 };
    QUnit.deepEqual(got, exp, 'remove');

    got = Skill.join([ { a: 1, '胴系統倍化': 1 }, { a: 1 } ]);
    exp = { a: 2, '胴系統倍化': 1 };
    QUnit.deepEqual(got, exp, 'torso up 1');
    got = Skill.join([ { a: 1, b: -1 }, { '胴系統倍化': 1 } ]);
    exp = { a: 1, b: -1, '胴系統倍化': 1 };
    QUnit.deepEqual(got, exp, 'torso up 2');
    got = Skill.join([ { a: 1, '胴系統倍化': 1 }, { '胴系統倍化': 1 } ]);
    exp = { a: 1, '胴系統倍化': 1 };
    QUnit.deepEqual(got, exp, 'torso up 3');

    got = Skill.join([ { a: 1 }, undefined ]);
    exp = { a: 1 };
    QUnit.deepEqual(got, exp, 'within undefined');
    got = Skill.join([ { a: 1 }, null ]);
    exp = { a: 1 };
    QUnit.deepEqual(got, exp, 'within null');
    got = Skill.join([ { a: 1 }, {} ]);
    exp = { a: 1 };
    QUnit.deepEqual(got, exp, 'within {}');

    got = Skill.join();
    QUnit.deepEqual(got, {}, 'nothing in');
    got = Skill.join(undefined);
    QUnit.deepEqual(got, {}, 'undefined');
    got = Skill.join(null);
    QUnit.deepEqual(got, {}, 'null');
    got = Skill.join([]);
    QUnit.deepEqual(got, {}, '[]');
});

QUnit.test('merge', function () {
    var got, exp;

    got = Skill.merge({ a: 1, b: -1 }, { a: 1 });
    exp = { a: 2, b: -1 };
    QUnit.deepEqual(got, exp, 'add');
    got = Skill.merge({ a: 1, b: -1 }, { b: -1 });
    exp = { a: 1, b: -2 };
    QUnit.deepEqual(got, exp, 'remove');
});

QUnit.test('sum', function () {
    var got, exp;

    got = Skill.sum({ a: 1, b: 1 });
    exp = 2;
    QUnit.strictEqual(got, exp, "{ a: 1, b: 1 }");

    got = Skill.sum({ a: 3, b: 1 });
    exp = 4;
    QUnit.strictEqual(got, exp, "{ a: 3, b: 1 }");
    got = Skill.sum({ a: 1, b: 2 });
    exp = 3;
    QUnit.strictEqual(got, exp, "{ a: 1, b: 2 }");
    got = Skill.sum({ a: -3, b: 1 });
    exp = -2;
    QUnit.strictEqual(got, exp, "{ a: -3, b: 1 }");
    got = Skill.sum({ a: 1, b: -2 });
    exp = -1;
    QUnit.strictEqual(got, exp, "{ a: 1, b: -2 }");

    got = Skill.sum({ a: 0, b: 0 });
    exp = 0;
    QUnit.strictEqual(got, exp, "{ a: 0, b: 0 }");
    got = Skill.sum({ a: 1, b: 0 });
    exp = 1;
    QUnit.strictEqual(got, exp, "{ a: 1, b: 0 }");
    got = Skill.sum({ a: 0, b: 1 });
    exp = 1;
    QUnit.strictEqual(got, exp, "{ a: 0, b: 1 }");

    got = Skill.sum({ a: 1, b: 1, 'c': 1, 'd': 1, 'e': 1 });
    exp = 5;
    QUnit.strictEqual(got, exp, 'many');

    got = Skill.sum({ a: 1, b: 1, '胴系統倍化': 1, 'c': 1 });
    exp = 3;
    QUnit.strictEqual(got, exp, 'torso up');

    got = Skill.sum();
    QUnit.strictEqual(got, 0, 'nothing in');
    got = Skill.sum(undefined);
    QUnit.strictEqual(got, 0, 'undefined');
    got = Skill.sum(null);
    QUnit.strictEqual(got, 0, 'null');
    got = Skill.sum({});
    QUnit.strictEqual(got, 0, '{}');
    got = Skill.sum([]);
    QUnit.strictEqual(got, 0, '[]');
});

QUnit.test('trees', function () {
    var got, exp;

    got = Skill.trees([ '攻撃力UP【大】', '斬れ味レベル+1', '耳栓' ]);
    exp = [ '攻撃', '匠', '聴覚保護' ];
    QUnit.deepEqual(got, exp, "[ '攻撃力UP【大】', '斬れ味レベル+1', '耳栓' ]");

    var fn = function () { Skill.trees([ '攻撃大' ]); };
    QUnit.throws(fn, '攻撃大 is not found', 'not found');
});

QUnit.test('unify', function () {
    var got, exp, setOrList;

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
    QUnit.deepEqual(got, exp, '_unifySet');

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
    QUnit.deepEqual(got, exp, '_unifySet: body is null');

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
    QUnit.deepEqual(got, exp, '_unifyList');

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
    QUnit.deepEqual(got, exp, '_unifyList: body is null');
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
           test(this.QUnit, this.simu.Util.Skill, this.myapp);
       }
);
