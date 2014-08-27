(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', '../lib/equip/combinator.js',
             '../lib/equip/normalizer.js', './lib/driver-myapp.js' ];
define(deps, function (QUnit, Combinator, Normalizer, myapp) {

QUnit.module('34_eq-combinator', {
    setup: function () {
        myapp.initialize();
    }
});

QUnit.test('combine: summary', function () {
    var got, exp, skills, bulksSet,
        n = new Normalizer(),
        c = new Combinator();

    skills = [ '攻撃力UP【大】', '業物' ];
    bulksSet = n.normalize(skills);
    got = c.combine(skills, bulksSet).length;
    exp = 18;
    QUnit.strictEqual(got, exp, skills.join(', '));

    skills = [ '斬れ味レベル+1', '高級耳栓' ];
    bulksSet = n.normalize(skills);
    got = c.combine(skills, bulksSet).length;
    exp = 418;
    QUnit.strictEqual(got, exp, skills.join(', '));

    skills = [ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ];
    bulksSet = n.normalize(skills);
    got = c.combine(skills, bulksSet).length;
    exp = 0;
    QUnit.strictEqual(got, exp, skills.join(', '));
});

QUnit.test('combine: weaponSlot', function () {
    var got, exp, skills, bulksSet,
        n = new Normalizer(),
        c = new Combinator();

    // 装備を村のみにしぼる
    myapp.setup({ hr: 1, vs: 6 });

    skills = [ '斬れ味レベル+1', '集中' ];
    n.weaponSlot = 2; // 武器スロ2
    bulksSet = n.normalize(skills);

    got = c.combine(skills, bulksSet).length;
    exp = 6;
    QUnit.strictEqual(got, exp, 'weaponSlot: 2');
});

QUnit.test('combine: oma', function () {
    var got, exp, skills, bulksSet,
        n = new Normalizer(),
        c = new Combinator();

    // 装備を村のみにしぼる
    myapp.setup({ hr: 1, vs: 6 });

    n.omas = [
        myapp.oma([ '龍の護石',3,'匠',4,'氷耐性',-5 ]),
        myapp.oma([ '龍の護石',0,'溜め短縮',5,'攻撃',9 ]),
        myapp.oma([ '龍の護石',3,'痛撃',4 ])
    ];
    skills = [ '斬れ味レベル+1', '攻撃力UP【大】', '耳栓' ];
    n.weaponSlot = 3; // 武器スロ3
    bulksSet = n.normalize(skills);

    got = c.combine(skills, bulksSet).length;
    exp = 12;
    QUnit.strictEqual(got, exp, 'oma');

    // 武器スロ0
    n.weaponSlot = 0;
    bulksSet = n.normalize(skills);

    got = c.combine(skills, bulksSet).length;
    exp = 0;
    QUnit.strictEqual(got, exp, 'oma');
});

QUnit.test('combine: null or etc', function () {
    var got,
        c = new Combinator();

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
           test(this.QUnit,
                this.simu.Equip.Combinator, this.simu.Equip.Normalizer, this.myapp);
       }
);
