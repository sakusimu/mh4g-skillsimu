(function (define) {
'use strict';
var deps = [ './lib/test-helper.js', '../lib/equip/simulator.js',
             '../lib/data.js', './lib/driver-myapp.js' ];
define(deps, function (QUnit, Simulator, data, myapp) {

QUnit.module('39_eq-simulator', {
    setup: function () {
        myapp.initialize();
    }
});

QUnit.test('Simulator', function () {
    QUnit.strictEqual(typeof Simulator, 'function', 'is function');
});

QUnit.test('new', function () {
    var simu = new Simulator();
    QUnit.strictEqual(typeof simu, 'object', 'is object');
});

QUnit.test('simulate', function () {
    var got, exp, skills,
        simu = new Simulator();

    skills = [ '攻撃力UP【大】', '業物' ];
    got = simu.simulate(skills).length;
    exp = 8;
    QUnit.strictEqual(got, exp, skills.join(', '));

    skills = [ '斬れ味レベル+1', '高級耳栓' ];
    got = simu.simulate(skills).length;
    exp = 1378;
    QUnit.strictEqual(got, exp, skills.join(', '));

    skills = [ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ];
    got = simu.simulate(skills).length;
    exp = 0;
    QUnit.strictEqual(got, exp, skills.join(', '));
});

QUnit.test('simulate: torsoUp', function () {
    var got, exp, equips,
        simu = new Simulator();

    myapp.setup({ sex: 'w' });

    equips = data.equips;
    equips.head  = [ myapp.equip('head', 'ユクモノカサ・天') ];
    equips.body  = [ myapp.equip('body', '三眼の首飾り') ];
    equips.arm   = [ myapp.equip('arm', 'ユクモノコテ・天') ];
    equips.waist = [
        myapp.equip('waist', 'レザーベルト'),
        myapp.equip('waist', 'バンギスコイル'),
        myapp.equip('waist', 'シルバーソルコイル')
    ];
    equips.leg   = [ myapp.equip('leg', 'ユクモノハカマ・天') ];

    got = simu.simulate([ '斬れ味レベル+1', '砥石使用高速化' ]);
    exp = [ { head  : 'ユクモノカサ・天',
              body  : '三眼の首飾り',
              arm   : 'ユクモノコテ・天',
              waist : '胴系統倍化',
              leg   : 'ユクモノハカマ・天',
              weapon: null,
              oma   : null } ];
    QUnit.deepEqual(got, exp, 'torsoUp');
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
           test(this.QUnit, this.simu.Equip.Simulator, this.simu.data, this.myapp);
       }
);
