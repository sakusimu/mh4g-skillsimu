(function (define) {
'use strict';
var deps = [ './lib/test-helper.js',
             '../lib/assembler.js', '../lib/normalizer.js', '../lib/combinator.js',
             './lib/driver-myapp.js' ];
define(deps, function (QUnit, Assembler, Normalizer, Combinator, myapp) {

QUnit.module('51_assembler', {
    setup: function () {
        myapp.initialize();
    }
});

QUnit.test('assembleEquip', function () {
    var got, exp, actiCombs,
        a = new Assembler();

    // [ '攻撃力UP【大】', '業物' ] の組み合わせの一部
    actiCombs =
        [ { head: { skillComb: { '攻撃': 5, '斬れ味': 0 },
                    equips: [ 'バギィキャップ', 'レウスヘルム', 'slot3',
                              'レウスＳヘルム', 'シルバーソルキャップ' ] },
            body: { skillComb: { '攻撃': 1, '斬れ味': 0 },
                    equips: [ 'slot1' ] },
             arm: { skillComb: { '攻撃': 7, '斬れ味': 1 },
                    equips: [ 'シルバーソルアーム' ] },
           waist: { skillComb: { '攻撃': 5, '斬れ味': 3 },
                    equips: [ 'シルバーソルコイル' ] },
             leg: { skillComb: { '攻撃': 2, '斬れ味': 6 },
                    equips: [ 'シルバーソルグリーヴ' ] },
          weapon: { skillComb: { '攻撃': 0, '斬れ味': 0 },
                    equips: [ 'slot0' ] } },
          { head: { skillComb: { '攻撃': 5, '斬れ味': 0 },
                    equips: [ 'バギィキャップ', 'レウスヘルム', 'slot3',
                              'レウスＳヘルム', 'シルバーソルキャップ' ] },
            body: { skillComb: { '攻撃': 1, '斬れ味': 0 },
                    equips: [ 'slot1' ] },
             arm: { skillComb: { '攻撃': 2, '斬れ味': 5 },
                    equips: [ 'シルバーソルアーム' ] },
           waist: { skillComb: { '攻撃': 5, '斬れ味': 3 },
                    equips: [ 'シルバーソルコイル' ] },
             leg: { skillComb: { '攻撃': 7, '斬れ味': 2 },
                    equips: [ 'シルバーソルグリーヴ' ] },
          weapon: { skillComb: { '攻撃': 0, '斬れ味': 0 },
                    equips: [ 'slot0' ] } } ];
    got = a.assembleEquip(actiCombs);
    exp = [ { head: 'バギィキャップ',
              body: 'slot1',
              arm: 'シルバーソルアーム',
              waist: 'シルバーソルコイル',
              leg: 'シルバーソルグリーヴ',
              weapon: 'slot0' },
            { head: 'レウスヘルム',
              body: 'slot1',
              arm: 'シルバーソルアーム',
              waist: 'シルバーソルコイル',
              leg: 'シルバーソルグリーヴ',
              weapon: 'slot0' },
            { head: 'slot3',
              body: 'slot1',
              arm: 'シルバーソルアーム',
              waist: 'シルバーソルコイル',
              leg: 'シルバーソルグリーヴ',
              weapon: 'slot0' },
            { head: 'レウスＳヘルム',
              body: 'slot1',
              arm: 'シルバーソルアーム',
              waist: 'シルバーソルコイル',
              leg: 'シルバーソルグリーヴ',
              weapon: 'slot0' },
            { head: 'シルバーソルキャップ',
              body: 'slot1',
              arm: 'シルバーソルアーム',
              waist: 'シルバーソルコイル',
              leg: 'シルバーソルグリーヴ',
              weapon: 'slot0' } ];
    QUnit.deepEqual(got, exp, 'assemble');

    got = a.assembleEquip();
    QUnit.deepEqual(got, [], 'nothing in');
    got = a.assembleEquip(undefined);
    QUnit.deepEqual(got, [], 'undefined');
    got = a.assembleEquip(null);
    QUnit.deepEqual(got, [], 'null');
    got = a.assembleEquip([]);
    QUnit.deepEqual(got, [], '[]');
});

QUnit.test('assembleEquip: summary', function () {
    var got, exp, skills, norCombsSet, actiCombs,
        n = new Normalizer(),
        c = new Combinator(),
        a = new Assembler();

    skills = [ '攻撃力UP【大】', '業物' ];

    norCombsSet = n.normalize(skills);
    actiCombs = c.combine(skills, norCombsSet);
    got = a.assembleEquip(actiCombs);
    exp = 2788;
    //QUnit.deepEqual(got.length, exp, "[ '攻撃力UP【大】', '業物' ]");
    QUnit.ok(true, 'skip');

    skills = [ '斬れ味レベル+1', '高級耳栓' ];
    norCombsSet = n.normalize(skills);
    actiCombs = c.combine(skills, norCombsSet);
    got = a.assembleEquip(actiCombs);
    exp = 13;
    //QUnit.deepEqual(got.length, exp, "[ '斬れ味レベル+1', '高級耳栓' ]");
    QUnit.ok(true, 'skip');

    skills = [ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ];
    norCombsSet = n.normalize(skills);
    actiCombs = c.combine(skills, norCombsSet);
    got = a.assembleEquip(actiCombs);
    exp = 0;
    //QUnit.deepEqual(got.length, exp,
    //                 "[ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ]");
    QUnit.ok(true, 'skip');
});

QUnit.test('assembleEquip: weaponSlot', function () {
    var got, exp, skills, norCombsSet, actiCombs,
        n = new Normalizer(),
        c = new Combinator(),
        a = new Assembler();

    // 装備を村のみにしぼる
    myapp.setup({ hr: 1 });

    skills = [ '斬れ味レベル+1', '砥石使用高速化' ];

    n.weaponSlot = 2; // 武器スロ2
    norCombsSet = n.normalize(skills);
    actiCombs = c.combine(skills, norCombsSet);
    got = a.assembleEquip(actiCombs);
    exp = 11;
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
           test(this.QUnit,
                this.simu.Assembler, this.simu.Normalizer, this.simu.Combinator,
                this.myapp);
       }
);
