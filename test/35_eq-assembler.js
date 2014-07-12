(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', '../lib/assembler.js' ];
define(deps, function (QUnit, Assembler) {

QUnit.module('50_assembler');

QUnit.test('Assembler', function () {
    QUnit.strictEqual(typeof Assembler, 'function', 'is function');
});

QUnit.test('new', function () {
    var got, exp;

    var a = new Assembler();
    QUnit.strictEqual(typeof a, 'object', 'is object');
    QUnit.strictEqual(typeof a.initialize, 'function', 'has initialie()');

    got = a.parts.join(',');
    exp = 'head,body,arm,waist,leg,weapon,oma';
    QUnit.strictEqual(got, exp, 'parts');
});

QUnit.test('_simplifyActivableCombs', function () {
    var got, exp, actiCombs,
        a = new Assembler();

    actiCombs =
        [ { head  : { skillComb: { '攻撃': 5, '斬れ味': 0 },
                      equips: [ 'バギィキャップ', 'レウスヘルム', 'slot3',
                                'レウスＳヘルム', 'シルバーソルキャップ' ] },
            body  : { skillComb: { '攻撃': 1, '斬れ味': 0 },
                      equips: [ 'slot1' ] },
            arm   : { skillComb: { '攻撃': 7, '斬れ味': 1 },
                      equips: [ 'シルバーソルアーム' ] },
            waist : { skillComb: { '攻撃': 5, '斬れ味': 3 },
                      equips: [ 'シルバーソルコイル' ] },
            leg   : { skillComb: { '攻撃': 2, '斬れ味': 6 },
                      equips: [ 'シルバーソルグリーヴ' ] },
            weapon: { skillComb: { '攻撃': 1, '斬れ味': 0 },
                      equips: [ 'slot1' ] },
            oma   : { skillComb: { '攻撃': 2, '斬れ味': 0 },
                      equips: [ 'slot2' ] } },
          { head  : { skillComb: { '攻撃': 1, '斬れ味': 4 },
                      equips: [ 'ジンオウヘルム', 'ネブラＳヘルム',
                                'アグナＳヘルム', 'ヴァイクＳヘルム' ] },
            body  : { skillComb: { '攻撃': 1, '斬れ味': 0 },
                      equips: [ 'slot1' ] },
            arm   : { skillComb: { '攻撃': 7, '斬れ味': 1 },
                      equips: [ 'シルバーソルアーム' ] },
            waist : { skillComb: { '攻撃': 5, '斬れ味': 3 },
                      equips: [ 'シルバーソルコイル' ] },
            leg   : { skillComb: { '攻撃': 7, '斬れ味': 2 },
                      equips: [ 'シルバーソルグリーヴ' ] },
            weapon: { skillComb: { '攻撃': 1, '斬れ味': 0 },
                      equips: [ 'slot1' ] },
            oma   : { skillComb: { '攻撃': 2, '斬れ味': 0 },
                      equips: [ 'slot2' ] } } ];
    got = a._simplifyActivableCombs(actiCombs);
    exp = [ { head  : [ 'バギィキャップ', 'レウスヘルム', 'slot3',
                        'レウスＳヘルム', 'シルバーソルキャップ' ],
              body  : [ 'slot1' ],
              arm   : [ 'シルバーソルアーム' ],
              waist : [ 'シルバーソルコイル' ],
              leg   : [ 'シルバーソルグリーヴ' ],
              weapon: [ 'slot1' ],
              oma   : [ 'slot2' ] },
            { head  : [ 'ジンオウヘルム', 'ネブラＳヘルム',
                        'アグナＳヘルム', 'ヴァイクＳヘルム' ],
              body  : [ 'slot1' ],
              arm   : [ 'シルバーソルアーム' ],
              waist : [ 'シルバーソルコイル' ],
              leg   : [ 'シルバーソルグリーヴ' ],
              weapon: [ 'slot1' ],
              oma   : [ 'slot2' ] } ];
    QUnit.deepEqual(got, exp, 'simplify');

    // weapon や oma がなかったり null
    actiCombs =
        [ { head  : { skillComb: { '攻撃': 5, '斬れ味': 0 },
                      equips: [ 'シルバーソルキャップ' ] },
            body  : { skillComb: { '攻撃': 1, '斬れ味': 0 },
                      equips: [ 'slot1' ] },
            arm   : { skillComb: { '攻撃': 7, '斬れ味': 1 },
                      equips: [ 'シルバーソルアーム' ] },
            waist : { skillComb: { '攻撃': 5, '斬れ味': 3 },
                      equips: [ 'シルバーソルコイル' ] },
            leg   : { skillComb: { '攻撃': 2, '斬れ味': 6 },
                      equips: [ 'シルバーソルグリーヴ' ] },
            oma   : null } ];
    got = a._simplifyActivableCombs(actiCombs);
    exp = [ { head  : [ 'シルバーソルキャップ' ],
              body  : [ 'slot1' ],
              arm   : [ 'シルバーソルアーム' ],
              waist : [ 'シルバーソルコイル' ],
              leg   : [ 'シルバーソルグリーヴ' ],
              weapon: [],
              oma   : [] } ];
    QUnit.deepEqual(got, exp, 'simplify');
});

QUnit.test('_uniqActivableCombs', function () {
    var got, exp, actiCombs,
        a = new Assembler();

    actiCombs = [ { head  : [ 'head01', 'head02', 'slot3' ],
                    body  : [ 'body01' ],
                    arm   : [ 'arm01' ],
                    waist : [ 'waist01' ],
                    leg   : [ 'leg01' ],
                    weapon: [ 'wpn01' ],
                    oma   : [ 'oma01' ] },
                  { head  : [ 'head01', 'head02' ],
                    body  : [ 'body01' ],
                    arm   : [ 'arm01' ],
                    waist : [ 'waist01' ],
                    leg   : [ 'leg01' ],
                    weapon: [ 'wpn01' ],
                    oma   : [ 'oma01' ] },
                  { head  : [ 'head01', 'head02', 'slot3' ],
                    body  : [ 'body01' ],
                    arm   : [ 'arm01' ],
                    waist : [ 'waist01' ],
                    leg   : [ 'leg01' ],
                    weapon: [ 'wpn01' ],
                    oma   : [ 'oma01' ] },
                  { head  : [ 'head01', 'head02', 'head03' ],
                    body  : [ 'body01' ],
                    arm   : [ 'arm01' ],
                    waist : [ 'waist01' ],
                    leg   : [ 'leg01' ],
                    weapon: [ 'wpn01' ],
                    oma   : [ 'oma01' ] },
                  { head  : [ 'head01', 'head02', 'head03' ],
                    body  : [ 'body01' ],
                    arm   : [ 'arm01' ],
                    waist : [ 'waist01' ],
                    leg   : [ 'leg01' ],
                    weapon: [ 'wpn01' ],
                    oma   : [ 'oma01' ] } ];
    got = a._uniqActivableCombs(actiCombs);
    exp = [ { head  : [ 'head01', 'head02', 'slot3' ],
              body  : [ 'body01' ],
              arm   : [ 'arm01' ],
              waist : [ 'waist01' ],
              leg   : [ 'leg01' ],
              weapon: [ 'wpn01' ],
              oma   : [ 'oma01' ] },
            { head  : [ 'head01', 'head02' ],
              body  : [ 'body01' ],
              arm   : [ 'arm01' ],
              waist : [ 'waist01' ],
              leg   : [ 'leg01' ],
              weapon: [ 'wpn01' ],
              oma   : [ 'oma01' ] },
            { head  : [ 'head01', 'head02', 'head03' ],
              body  : [ 'body01' ],
              arm   : [ 'arm01' ],
              waist : [ 'waist01' ],
              leg   : [ 'leg01' ],
              weapon: [ 'wpn01' ],
              oma   : [ 'oma01' ] } ];
    QUnit.deepEqual(got, exp, 'uniq');

    // weapon や slot が []
    actiCombs = [ { head  : [ 'head01', 'head02', 'slot3' ],
                    body  : [ 'body01' ],
                    arm   : [ 'arm01' ],
                    waist : [ 'waist01' ],
                    leg   : [ 'leg01' ],
                    weapon: [],
                    oma   : [] },
                  { head  : [ 'head01', 'head02' ],
                    body  : [ 'body01' ],
                    arm   : [ 'arm01' ],
                    waist : [ 'waist01' ],
                    leg   : [ 'leg01' ],
                    weapon: [],
                    oma   : [] },
                  { head  : [ 'head01', 'head02', 'slot3' ],
                    body  : [ 'body01' ],
                    arm   : [ 'arm01' ],
                   waist  : [ 'waist01' ],
                    leg   : [ 'leg01' ],
                    weapon: [],
                    oma   : [] } ];
    got = a._uniqActivableCombs(actiCombs);
    exp = [ { head  : [ 'head01', 'head02', 'slot3' ],
              body  : [ 'body01' ],
              arm   : [ 'arm01' ],
              waist : [ 'waist01' ],
              leg   : [ 'leg01' ],
              weapon: [],
              oma   : [] },
            { head  : [ 'head01', 'head02' ],
              body  : [ 'body01' ],
              arm   : [ 'arm01' ],
              waist : [ 'waist01' ],
              leg   : [ 'leg01' ],
              weapon: [],
              oma   : [] } ];
    QUnit.deepEqual(got, exp, 'weapon & oma is []');
});

QUnit.test('_assembleEquip', function () {
    var got, exp, actiComb,
        a = new Assembler();

    // case 1
    actiComb = { head  : [ 'head01' ],
                 body  : [ 'body01' ],
                 arm   : [ 'arm01' ],
                 waist : [ 'waist01' ],
                 leg   : [ 'leg01' ],
                 weapon: [ 'wpn01' ],
                 oma   : [ 'oma01' ] };
    got = a._assembleEquip(actiComb);
    exp = [ [ 'head01', 'body01', 'arm01', 'waist01', 'leg01', 'wpn01', 'oma01' ] ];
    QUnit.deepEqual(got, exp, 'case 1');

    // case 2: weapon や oma が [] でも展開される
    actiComb = { head  : [ 'head01' ],
                 body  : [ 'body01' ],
                 arm   : [ 'arm01' ],
                 waist : [ 'waist01' ],
                 leg   : [ 'leg01' ],
                 weapon: [],
                 oma   : [] };
    got = a._assembleEquip(actiComb);
    exp = [ [ 'head01', 'body01', 'arm01', 'waist01', 'leg01', null, null ] ];
    QUnit.deepEqual(got, exp, 'case 2');

    // case 3: equips が複数ある場合に展開されるか
    actiComb = { head  : [ 'head01', 'head02' ],
                 body  : [ 'body01' ],
                 arm   : [ 'arm01', 'arm02' ],
                 waist : [ 'waist01' ],
                 leg   : [ 'leg01', 'leg02' ],
                 weapon: [],
                 oma   : [] };
    got = a._assembleEquip(actiComb);
    exp = [ [ 'head01', 'body01', 'arm01', 'waist01', 'leg01', null, null ],
            [ 'head01', 'body01', 'arm01', 'waist01', 'leg02', null, null ],
            [ 'head01', 'body01', 'arm02', 'waist01', 'leg01', null, null ],
            [ 'head01', 'body01', 'arm02', 'waist01', 'leg02', null, null ],
            [ 'head02', 'body01', 'arm01', 'waist01', 'leg01', null, null ],
            [ 'head02', 'body01', 'arm01', 'waist01', 'leg02', null, null ],
            [ 'head02', 'body01', 'arm02', 'waist01', 'leg01', null, null ],
            [ 'head02', 'body01', 'arm02', 'waist01', 'leg02', null, null ] ];
    QUnit.deepEqual(got, exp, 'case 3');
});

QUnit.test('_uniqAssembies', function () {
    var got, exp, assems,
        a = new Assembler();
    assems = [ [ 'head01', 'body01', 'arm01', 'waist01', 'leg01' ],
               [ 'head01', 'body01', 'arm02', 'waist01', 'leg01' ],
               [ 'head01', 'body01', 'arm01', 'waist01', 'leg01' ] ];
    got = a._uniqAssemblies(assems);
    exp = [ [ 'head01', 'body01', 'arm01', 'waist01', 'leg01' ],
            [ 'head01', 'body01', 'arm02', 'waist01', 'leg01' ] ];
    QUnit.deepEqual(got, exp, 'uniq');
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
           test(this.QUnit, this.simu.Assembler);
       }
);
