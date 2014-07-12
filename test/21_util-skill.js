(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', '../lib/util/skill.js', './lib/driver-myapp.js' ];
define(deps, function (QUnit, Skill, myapp) {

QUnit.module('21_util-skill', {
    setup: function () {
        myapp.initialize();
    }
});

QUnit.test('Skill', function () {
    QUnit.strictEqual(typeof Skill, 'object', 'is object');
});

QUnit.test('contains', function () {
    var got, equip;

    equip = myapp.model.Equip.get('body', 'ブレイブベスト,0,0').simuData();
    got = Skill.contains(equip.skillComb, '乗り');
    QUnit.ok(got, "'乗り'");
    got = Skill.contains(equip.skillComb, [ '乗り' ]);
    QUnit.ok(got, "[ '乗り' ]");

    equip = myapp.model.Equip.get('body', 'レウスメイル,0,1').simuData();
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

QUnit.test('merge', function () {
    var got, exp;

    var skillList = [ { a: 1, b: -1 }, { c: 1, d: -1 } ];
    got = Skill.merge(skillList);
    exp = { a: 1, c: 1, b: -1, d: -1 };
    QUnit.deepEqual(got, exp, 'merge(list)');
    exp = [ { a: 1, b: -1 }, { c: 1, d: -1 } ];
    QUnit.deepEqual(skillList, exp, 'merge(list): STABLE');

    got = Skill.merge([ { a: 1 } ]);
    exp = { a: 1 };
    QUnit.deepEqual(got, exp, 'merge(list): single');

    got = Skill.merge([ { a: 1, b: -1 }, { a: 1 } ]);
    exp = { a: 2, b: -1 };
    QUnit.deepEqual(got, exp, 'merge(list): add');
    got = Skill.merge([ { a: 1, b: -1 }, { b: -1 } ]);
    exp = { a: 1, b: -2 };
    QUnit.deepEqual(got, exp, 'merge(list): remove');

    got = Skill.merge({ a: 1, b: -1 }, { c: 1, d: -1 });
    exp = { a: 1, c: 1, b: -1, d: -1 };
    QUnit.deepEqual(got, exp, 'merge(args)');
    got = Skill.merge({ a: 1, b: -1 }, { a: 1 });
    exp = { a: 2, b: -1 };
    QUnit.deepEqual(got, exp, 'merge(args): add');
    got = Skill.merge({ a: 1, b: -1 }, { b: -1 });
    exp = { a: 1, b: -2 };
    QUnit.deepEqual(got, exp, 'merge(args): remove');

    got = Skill.merge();
    QUnit.deepEqual(got, null, 'nothing in');
    got = Skill.merge(undefined);
    QUnit.deepEqual(got, {}, 'undefined');
    got = Skill.merge(null);
    QUnit.deepEqual(got, {}, 'null');
    got = Skill.merge([]);
    QUnit.deepEqual(got, {}, '[]');

    got = Skill.merge({ a: 1 }, undefined);
    QUnit.deepEqual(got, { a: 1 }, 'skill, undefined');
    got = Skill.merge({ a: 1 }, null);
    QUnit.deepEqual(got, { a: 1 }, 'skill, null');
    got = Skill.merge({ a: 1 }, {});
    QUnit.deepEqual(got, { a: 1 }, 'skill, {}');
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
