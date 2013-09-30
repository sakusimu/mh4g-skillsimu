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
           [ { skillComb: { '攻撃': 7, '匠': 1, '聴覚保護': 1 }, equips: [ 'h711' ] },
             { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, equips: [ 'h521' ] },
             { skillComb: { '攻撃': 6, '匠': 2, '聴覚保護': 0 }, equips: [ 'h620' ] } ],
          body:
           [ { skillComb: { '攻撃': 7, '匠': 0, '聴覚保護': 1 }, equips: [ 'b701' ] },
             { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 2 }, equips: [ 'b422' ] },
             { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, equips: [ 'b521' ] } ],
          arm:
           [ { skillComb: { '攻撃': 6, '匠': 2, '聴覚保護': 0 }, equips: [ 'a620' ] },
             { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 }, equips: [ 'a331' ] },
             { skillComb: { '攻撃': 4, '匠': 3, '聴覚保護': 0 }, equips: [ 'a430' ] } ],
          waist:
           [ { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, equips: [ 'w521' ] },
             { skillComb: { '攻撃': 2, '匠': 3, '聴覚保護': 2 }, equips: [ 'w232' ] },
             { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 }, equips: [ 'w331' ] } ],
          leg:
           [ { skillComb: { '攻撃': 6, '匠': 0, '聴覚保護': 4 }, equips: [ 'l604' ] },
             { skillComb: { '攻撃': 3, '匠': 2, '聴覚保護': 4 }, equips: [ 'l324' ] },
             { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 3 }, equips: [ 'l423' ] } ],
          weapon:
           [ { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 0 }, equips: [ 'slot0' ] } ] };
    got = c.combine([ '攻撃力UP【大】', '斬れ味レベル+1', '耳栓' ], norCombsSet);
    exp = [ { head:
               { skillComb: { '攻撃': 5, '匠': 2, '聴覚保護': 1 }, equips: [ 'h521' ] },
              body:
               { skillComb: { '攻撃': 4, '匠': 2, '聴覚保護': 2 }, equips: [ 'b422' ] },
              arm:
               { skillComb: { '攻撃': 3, '匠': 3, '聴覚保護': 1 }, equips: [ 'a331' ] },
              waist:
               { skillComb: { '攻撃': 2, '匠': 3, '聴覚保護': 2 }, equips: [ 'w232' ] },
              leg:
               { skillComb: { '攻撃': 6, '匠': 0, '聴覚保護': 4 }, equips: [ 'l604' ] },
              weapon:
               { skillComb: { '攻撃': 0, '匠': 0, '聴覚保護': 0 }, equips: [ 'slot0' ] } } ];
    QUnit.deepEqual(got, exp, 'combine');
    QUnit.strictEqual(c.count, 1, 'count');

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
    exp = 15544;
    QUnit.deepEqual(got.length, exp, "[ '攻撃力UP【大】', '業物' ]");

    skills = [ '斬れ味レベル+1', '高級耳栓' ];
    norCombsSet = n.normalize(skills);
    got = c.combine(skills, norCombsSet);
    exp = 319;
    QUnit.deepEqual(got.length, exp, "[ '斬れ味レベル+1', '高級耳栓' ]");

    skills = [ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ];
    norCombsSet = n.normalize(skills);
    got = c.combine(skills, norCombsSet);
    exp = 0;
    QUnit.deepEqual(got.length, exp,
                    "[ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ]");
});

QUnit.test('combine: weaponSlot', function () {
    var got, exp, skills, norCombsSet,
        n = new Normalizer(),
        c = new Combinator();

    // 装備を村のみにしぼる
    myapp.setup({ hr: 1, vs: 6 });

    skills = [ '斬れ味レベル+1', '集中' ];

    n.weaponSlot = 2; // 武器スロ2
    norCombsSet = n.normalize(skills);
    got = c.combine(skills, norCombsSet);
    exp = 6;
    QUnit.deepEqual(got.length, exp, 'weaponSlot: 2');
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
