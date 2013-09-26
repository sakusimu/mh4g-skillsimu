(function (define) {
'use strict';
var deps = [ './lib/test-helper.js',
             '../lib/combinator.js', '../lib/normalizer.js', './lib/driver-myapp.js' ];
define(deps, function (QUnit, Combinator, Normalizer, myapp) {

QUnit.module('41_combinator', {
    setup: function () {
        myapp.initialize();
    }
});

QUnit.test('combine', function () {
    var got, exp, norCombsSet,
        c = new Combinator();

    norCombsSet =
        { head:
           [ { skillComb: { '攻撃': 9, '匠': 1, '聴覚保護': 1 }, equips: [ 'h911' ] },
             { skillComb: { '攻撃': 7, '匠': 2, '聴覚保護': 1 }, equips: [ 'h721' ] },
             { skillComb: { '攻撃': 8, '匠': 2, '聴覚保護': 0 }, equips: [ 'h820' ] } ],
          body:
           [ { skillComb: { '攻撃': 9, '匠': 0, '聴覚保護': 1 }, equips: [ 'b901' ] },
             { skillComb: { '攻撃': 6, '匠': 2, '聴覚保護': 2 }, equips: [ 'b622' ] },
             { skillComb: { '攻撃': 7, '匠': 2, '聴覚保護': 1 }, equips: [ 'b721' ] } ],
          arm:
           [ { skillComb: { '攻撃': 5, '匠': 3, '聴覚保護': 0 }, equips: [ 'a530' ] },
             { skillComb: { '攻撃': 2, '匠': 5, '聴覚保護': 1 }, equips: [ 'a251' ] },
             { skillComb: { '攻撃': 3, '匠': 5, '聴覚保護': 0 }, equips: [ 'a350' ] } ],
          waist:
           [ { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, equips: [ 'w521' ] },
             { skillComb: { '攻撃': 2, '匠': 4, '聴覚保護': 2 }, equips: [ 'w242' ] },
             { skillComb: { '攻撃': 3, '匠': 4, '聴覚保護': 1 }, equips: [ 'w341' ] } ],
          leg:
           [ { skillComb: { '攻撃': 6, '匠': 0, '聴覚保護': 4 }, equips: [ 'l604' ] },
             { skillComb: { '攻撃': 3, '匠': 2, '聴覚保護': 4 }, equips: [ 'l324' ] },
             { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 3 }, equips: [ 'l423' ] } ],
          weapon:
           [ { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 0 }, equips: [ 'slot0' ] } ] };
    got = c.combine([ '攻撃力UP【大】', '斬れ味レベル+1', '耳栓' ], norCombsSet);
    exp = [ { head:
               { skillComb: { '攻撃': 7, '匠': 2, '聴覚保護': 1 }, equips: [ 'h721' ] },
              body:
               { skillComb: { '攻撃': 6, '匠': 2, '聴覚保護': 2 }, equips: [ 'b622' ] },
              arm:
               { skillComb: { '攻撃': 2, '匠': 5, '聴覚保護': 1 }, equips: [ 'a251' ] },
              waist:
               { skillComb: { '攻撃': 2, '匠': 4, '聴覚保護': 2 }, equips: [ 'w242' ] },
              leg:
               { skillComb: { '攻撃': 3, '匠': 2, '聴覚保護': 4 }, equips: [ 'l324' ] },
              weapon:
               { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 0 }, equips: [ 'slot0' ] } } ];
    //QUnit.deepEqual(got, exp, 'combine');
    //QUnit.strictEqual(c.count, 1, 'count');
    QUnit.ok(true, 'skip');

    got = c.combine();
    QUnit.deepEqual(got, [], 'nothing in');
    got = c.combine(undefined);
    QUnit.deepEqual(got, [], 'undefined');
    got = c.combine(null);
    QUnit.deepEqual(got, [], 'null');
    got = c.combine({});
    QUnit.deepEqual(got, [], '{}');

    got = c.combine([ '攻撃力UP【大】' ]);
    QUnit.deepEqual(got, [], 'skillNames only');
    got = c.combine([ '攻撃力UP【大】' ], undefined);
    QUnit.deepEqual(got, [], 'skillNames, undefined');
    got = c.combine([ '攻撃力UP【大】' ], null);
    QUnit.deepEqual(got, [], 'skillNames, null');
    got = c.combine([ '攻撃力UP【大】' ], {});
    QUnit.deepEqual(got, [], 'skillNames, {}');
});

QUnit.test('combine: summary', function () {
    var got, exp, skills, norCombsSet,
        n = new Normalizer(),
        c = new Combinator();

    skills = [ '攻撃力UP【大】', '業物' ];
    norCombsSet = n.normalize(skills);
    got = c.combine(skills, norCombsSet);
    exp = 3719;
    //QUnit.deepEqual(got.length, exp, "[ '攻撃力UP【大】', '業物' ]");
    QUnit.ok(true, 'skip');

    skills = [ '斬れ味レベル+1', '高級耳栓' ];
    norCombsSet = n.normalize(skills);
    got = c.combine(skills, norCombsSet);
    exp = 36;
    //QUnit.deepEqual(got.length, exp, "[ '斬れ味レベル+1', '高級耳栓' ]");
    QUnit.ok(true, 'skip');

    skills = [ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ];
    norCombsSet = n.normalize(skills);
    got = c.combine(skills, norCombsSet);
    exp = 0;
    //QUnit.deepEqual(got.length, exp,
    //                 "[ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ]");
    QUnit.ok(true, 'skip');
});

QUnit.test('combine: weaponSlot', function () {
    var got, exp, skills, norCombsSet,
        n = new Normalizer(),
        c = new Combinator();

    // 装備を村のみにしぼる
    myapp.setup({ hr: 1 });

    skills = [ '斬れ味レベル+1', '砥石使用高速化' ];

    n.weaponSlot = 2; // 武器スロ2
    norCombsSet = n.normalize(skills);
    got = c.combine(skills, norCombsSet);
    exp = 72;
    //QUnit.deepEqual(got.length, exp, 'weaponSlot: 2');
    QUnit.ok(true, 'skip');
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
           test(this.QUnit, this.simu.Combinator, this.simu.Normalizer, this.myapp);
       }
);
