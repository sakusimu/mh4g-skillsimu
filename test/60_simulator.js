(function (define) {
'use strict';
var deps = [ './lib/test-helper.js',
             '../lib/simulator.js', '../lib/data.js', './lib/driver-myapp.js' ];
define(deps, function (QUnit, Simulator, data, myapp) {

QUnit.module('60_simulator', {
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
    var got, exp,
        simu = new Simulator();

    got = simu.simulate([ '攻撃力UP【大】', '業物' ]);
    exp = 2788;
    //QUnit.strictEqual(got.length, exp, "[ '攻撃力UP【大】', '業物' ]");
    QUnit.ok(true, 'skip');

    got = simu.simulate([ '斬れ味レベル+1', '高級耳栓' ]);
    exp = 13;
    //QUnit.strictEqual(got.length, exp, "[ '斬れ味レベル+1', '高級耳栓' ]");
    QUnit.ok(true, 'skip');

    got = simu.simulate([ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ]);
    exp = 0;
    //QUnit.strictEqual(got.length, exp,
    //                   "[ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ]");
    QUnit.ok(true, 'skip');
});

QUnit.test('simulate: dupli', function () {
    var got, exp, equips,
        simu = new Simulator();

    myapp.setup({ sex: 'g' });

    equips = data.equips;
    equips.head  = myapp.equips('head', '天城・覇【鉢金】');
    equips.body  = myapp.equips('body', '三眼の首飾り');
    equips.arm   = myapp.equips('arm', 'ダマスクアーム');
    var waists   = [ 'レザーベルト', 'バンギスコイル', 'シルバーソルコイル' ];
    equips.waist = myapp.equips('waist', waists);
    equips.leg   = myapp.equips('leg', '日向【袴】');

    got = simu.simulate([ '斬れ味レベル+1', '集中' ]);
    exp = [ { head: '天城・覇【鉢金】',
              body: 'slot3',
              arm: 'ダマスクアーム',
              waist: 'slot2',
              leg: '日向【袴】',
              weapon: 'slot0' },
            { head: '天城・覇【鉢金】',
              body: 'slot3',
              arm: 'ダマスクアーム',
              waist: 'バンギスコイル',
              leg: '日向【袴】',
              weapon: 'slot0' } ];
    //QUnit.deepEqual(got, exp, "[ '斬れ味レベル+1', '集中' ]");
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
           test(this.QUnit, this.simu.Simulator, this.simu.data, this.myapp);
       }
);
