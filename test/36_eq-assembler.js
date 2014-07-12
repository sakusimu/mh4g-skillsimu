(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', '../lib/equip/assembler.js',
             '../lib/equip/normalizer.js', '../lib/equip/combinator.js',
             './lib/driver-myapp.js' ];
define(deps, function (QUnit, Assembler, Normalizer, Combinator, myapp) {

QUnit.module('36_eq-assembler', {
    setup: function () {
        myapp.initialize();
    }
});

QUnit.test('assembleEquip', function () {
    var got, exp, actiCombs,
        a = new Assembler();

    // [ '攻撃力UP【大】', '業物' ] の組み合わせの一部
    actiCombs =
        [ { head: { skillComb: { '攻撃': 19, '斬れ味': 0 }, equips: [ 'レウスＳキャップ' ] },
            body: { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] },
            arm: { skillComb: { '攻撃': 5, '斬れ味': 2 }, equips: [ 'ジンオウＳフォールド' ] },
            waist: { skillComb: { '攻撃': 5, '斬れ味': 2 }, equips: [ 'ジンオウＳフォールド' ] },
            leg: { skillComb: { '攻撃': 1, '斬れ味': 6 }, equips: [ 'バンギスグリーヴ' ] },
            weapon: { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] } },
          { head: { skillComb: { '攻撃': 5, '斬れ味': 0 },
                    equips: [ 'slot3', 'バトルヘルム', 'バトルキャップ', 'クックキャップ',
                              'レックスキャップ', 'ドボルキャップ' ] },
            body: { skillComb: { '攻撃': 5, '斬れ味': 2 }, equips: [ 'シルバーソルメイル' ] },
            arm: { skillComb: { '攻撃': 7, '斬れ味': 0 }, equips: [ 'ランポスＳアーム' ] },
            waist: { skillComb: { '胴系統倍化': 1 }, equips: [ '胴系統倍化' ] },
            leg: { skillComb: { '攻撃': 1, '斬れ味': 6 }, equips: [ 'バンギスグリーヴ' ] },
            weapon: { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] } } ];
    got = a.assembleEquip(actiCombs);
    exp = [ { head: 'レウスＳキャップ',
              body: 'slot0',
              arm: 'ジンオウＳフォールド',
              waist: 'ジンオウＳフォールド',
              leg: 'バンギスグリーヴ',
              weapon: 'slot0',
              oma: null },
            { head: 'slot3',
              body: 'シルバーソルメイル',
              arm: 'ランポスＳアーム',
              waist: '胴系統倍化',
              leg: 'バンギスグリーヴ',
              weapon: 'slot0',
              oma: null },
            { head: 'バトルヘルム',
              body: 'シルバーソルメイル',
              arm: 'ランポスＳアーム',
              waist: '胴系統倍化',
              leg: 'バンギスグリーヴ',
              weapon: 'slot0',
              oma: null },
            { head: 'バトルキャップ',
              body: 'シルバーソルメイル',
              arm: 'ランポスＳアーム',
              waist: '胴系統倍化',
              leg: 'バンギスグリーヴ',
              weapon: 'slot0',
              oma: null },
            { head: 'クックキャップ',
              body: 'シルバーソルメイル',
              arm: 'ランポスＳアーム',
              waist: '胴系統倍化',
              leg: 'バンギスグリーヴ',
              weapon: 'slot0',
              oma: null },
            { head: 'レックスキャップ',
              body: 'シルバーソルメイル',
              arm: 'ランポスＳアーム',
              waist: '胴系統倍化',
              leg: 'バンギスグリーヴ',
              weapon: 'slot0',
              oma: null },
            { head: 'ドボルキャップ',
              body: 'シルバーソルメイル',
              arm: 'ランポスＳアーム',
              waist: '胴系統倍化',
              leg: 'バンギスグリーヴ',
              weapon: 'slot0',
              oma: null } ];
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
    exp = 26831;
    QUnit.deepEqual(got.length, exp, "[ '攻撃力UP【大】', '業物' ]");

    skills = [ '斬れ味レベル+1', '高級耳栓' ];
    norCombsSet = n.normalize(skills);
    actiCombs = c.combine(skills, norCombsSet);
    got = a.assembleEquip(actiCombs);
    exp = 1378;
    QUnit.deepEqual(got.length, exp, "[ '斬れ味レベル+1', '高級耳栓' ]");

    skills = [ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ];
    norCombsSet = n.normalize(skills);
    actiCombs = c.combine(skills, norCombsSet);
    got = a.assembleEquip(actiCombs);
    exp = 0;
    QUnit.deepEqual(got.length, exp,
                    "[ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ]");
});

QUnit.test('assembleEquip: weaponSlot', function () {
    var got, exp, skills, norCombsSet, actiCombs,
        n = new Normalizer(),
        c = new Combinator(),
        a = new Assembler();

    // 装備を村のみにしぼる
    myapp.setup({ hr: 1, vs: 6 });

    skills = [ '斬れ味レベル+1', '集中' ];

    n.weaponSlot = 2; // 武器スロ2
    norCombsSet = n.normalize(skills);
    actiCombs   = c.combine(skills, norCombsSet);
    got = a.assembleEquip(actiCombs);
    exp = 11;
    QUnit.deepEqual(got.length, exp, 'weaponSlot: 2');
});

QUnit.test('combine: oma', function () {
    var got, exp, skills, norCombsSet, actiCombs,
        n = new Normalizer(),
        c = new Combinator(),
        a = new Assembler();

    // 装備を村のみにしぼる
    myapp.setup({ hr: 1, vs: 6 });

    var omas = [
        [ '龍の護石',3,'匠',4,'氷耐性',-5 ],
        [ '龍の護石',0,'溜め短縮',5,'攻撃',9 ],
        [ '龍の護石',3,'痛撃',4 ]
    ];
    n.omas = myapp.model.Oma.createSimuData(omas);

    skills = [ '斬れ味レベル+1', '攻撃力UP【大】', '耳栓' ];
    n.weaponSlot = 3; // 武器スロ3
    norCombsSet = n.normalize(skills);
    actiCombs   = c.combine(skills, norCombsSet);
    got = a.assembleEquip(actiCombs);
    exp = 3; // 頑シミュさんと同じ
    QUnit.deepEqual(got.length, exp, 'oma');

    // 武器スロ0
    n.weaponSlot = 0;
    norCombsSet = n.normalize(skills);
    actiCombs   = c.combine(skills, norCombsSet);
    got = a.assembleEquip(actiCombs);
    exp = 0;
    QUnit.deepEqual(got.length, exp, 'oma: weaponSlot=0');
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
