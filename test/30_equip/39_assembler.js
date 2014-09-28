(function (define) {
'use strict';
var deps = [ '../lib/test-helper.js', '../../lib/equip/assembler.js',
             '../../lib/equip/normalizer.js', '../../lib/equip/combinator.js',
             '../lib/driver-myapp.js' ];
define(deps, function (QUnit, Assembler, Normalizer, Combinator, myapp) {

QUnit.module('30_equip/39_assembler', {
    setup: function () {
        myapp.initialize();
    }
});

QUnit.test('assemble', function () {
    var got, exp, eqcombs,
        a = new Assembler();

    eqcombs = [
        { head  : [ 'head1a', 'head1b' ],
          body  : [ 'body1' ],
          arm   : [ 'arm1' ],
          waist : [ 'waist1' ],
          leg   : [ 'leg1' ],
          weapon: [ 'weapon1' ],
          oma   : [ 'oma1' ] },
        { head  : [ 'head2' ],
          body  : [ 'body2' ],
          arm   : [ 'arm2' ],
          waist : [ 'waist2' ],
          leg   : [ 'leg2' ],
          weapon: [],
          oma   : [ 'oma2a', 'oma2b' ] }
    ];
    got = a.assemble(eqcombs);
    exp = [
        { head  : 'head1a',
          body  : 'body1',
          arm   : 'arm1',
          waist : 'waist1',
          leg   : 'leg1',
          weapon: 'weapon1',
          oma   : 'oma1' },
        { head  : 'head1b',
          body  : 'body1',
          arm   : 'arm1',
          waist : 'waist1',
          leg   : 'leg1',
          weapon: 'weapon1',
          oma   : 'oma1' },
        { head  : 'head2',
          body  : 'body2',
          arm   : 'arm2',
          waist : 'waist2',
          leg   : 'leg2',
          weapon: null,
          oma   : 'oma2a' },
        { head  : 'head2',
          body  : 'body2',
          arm   : 'arm2',
          leg   : 'leg2',
          waist : 'waist2',
          weapon: null,
          oma   : 'oma2b' }
    ];
    QUnit.deepEqual(got, exp, 'assemble');

    got = a.assemble();
    QUnit.deepEqual(got, [], 'nothing in');
    got = a.assemble(undefined);
    QUnit.deepEqual(got, [], 'undefined');
    got = a.assemble(null);
    QUnit.deepEqual(got, [], 'null');
    got = a.assemble([]);
    QUnit.deepEqual(got, [], '[]');
});

QUnit.test('assemble: summary', function () {
    var got, exp, skills, bulksSet, eqcombs,
        n = new Normalizer(),
        c = new Combinator(),
        a = new Assembler();

    skills = [ '攻撃力UP【大】', '業物' ];
    bulksSet = n.normalize(skills);
    eqcombs = c.combine(skills, bulksSet);
    got = a.assemble(eqcombs).length;
    exp = 8;
    QUnit.strictEqual(got, exp, skills.join(', '));

    skills = [ '斬れ味レベル+1', '高級耳栓' ];
    bulksSet = n.normalize(skills);
    eqcombs = c.combine(skills, bulksSet);
    got = a.assemble(eqcombs).length;
    exp = 1378;
    QUnit.strictEqual(got, exp, skills.join(', '));

    skills = [ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ];
    bulksSet = n.normalize(skills);
    eqcombs = c.combine(skills, bulksSet);
    got = a.assemble(eqcombs).length;
    exp = 0;
    QUnit.strictEqual(got, exp, skills.join(', '));
});

QUnit.test('assemble: weaponSlot', function () {
    var got, exp, skills, bulksSet, eqcombs,
        n = new Normalizer(),
        c = new Combinator(),
        a = new Assembler();

    // 装備を村のみにしぼる
    myapp.setup({
        context: { hr: 1, vs: 6 }, // 装備を村のみにしぼる
        weaponSlot: 2
    });
    skills = [ '斬れ味レベル+1', '集中' ];
    bulksSet = n.normalize(skills);
    eqcombs = c.combine(skills, bulksSet);
    got = a.assemble(eqcombs).length;
    exp = 11;
    QUnit.strictEqual(got, exp, 'weaponSlot: 2');
});

QUnit.test('combine: oma', function () {
    var got, exp, skills, bulksSet, eqcombs,
        n = new Normalizer(),
        c = new Combinator(),
        a = new Assembler();

    // 武器スロ3
    myapp.setup({
        context: { hr: 1, vs: 6 }, // 装備を村のみにしぼる
        weaponSlot: 3,
        omas: [
            [ '龍の護石',3,'匠',4,'氷耐性',-5 ],
            [ '龍の護石',0,'溜め短縮',5,'攻撃',9 ],
            [ '龍の護石',3,'痛撃',4 ]
        ]
    });
    skills = [ '斬れ味レベル+1', '攻撃力UP【大】', '耳栓' ];
    bulksSet = n.normalize(skills);
    eqcombs = c.combine(skills, bulksSet);
    got = a.assemble(eqcombs).length;
    exp = 3; // 頑シミュさんと同じ
    QUnit.strictEqual(got, exp, 'oma');

    // 武器スロ0
    myapp.setup({
        context: { hr: 1, vs: 6 }, // 装備を村のみにしぼる
        weaponSlot: 0,
        omas: [
            [ '龍の護石',3,'匠',4,'氷耐性',-5 ],
            [ '龍の護石',0,'溜め短縮',5,'攻撃',9 ],
            [ '龍の護石',3,'痛撃',4 ]
        ]
    });
    bulksSet = n.normalize(skills);
    eqcombs = c.combine(skills, bulksSet);
    got = a.assemble(eqcombs).length;
    exp = 0;
    QUnit.strictEqual(got, exp, 'oma: weaponSlot=0');
});

QUnit.test('assemble: dig', function () {
    var got, exp, bulksSet, eqcombs,
        n = new Normalizer(),
        c = new Combinator(),
        a = new Assembler();

    var skills = [ '真打', '集中', '弱点特効', '耳栓' ];
    myapp.setup({
        omas: [
            [ '龍の護石',3,'匠',4,'氷耐性',-5 ],
            [ '龍の護石',0,'溜め短縮',5,'攻撃',9 ],
            [ '龍の護石',3,'痛撃',4 ]
        ],
        dig: true
    });
    bulksSet = n.normalize(skills);
    eqcombs = c.combine(skills, bulksSet);
    got = a.assemble(eqcombs);
    exp = 27; // 頑シミュさんと同じ
    QUnit.strictEqual(got.length, exp, 'dig');
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
           test(this.QUnit, this.simu.Equip.Assembler,
                this.simu.Equip.Normalizer, this.simu.Equip.Combinator,
                this.myapp);
       }
);
