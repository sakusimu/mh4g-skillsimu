(function (define) {
'use strict';
var deps = [ '../test/lib/driver-myapp.js', '../lib/data.js', '../lib/deco/simulator.js' ];
define(deps, function (myapp, data, Simulator) {

var simulate = function (skillNames, quipSet) {
    var s = new Simulator();

    var start = Date.now();
    var result = s.simulate(skillNames, equipSet);
    var done = Date.now();

    console.log('>', '[ ' + skillNames.join(', ') + ' ]');
    console.log('decos:', result.decos.length);
    console.log('time:', done - start);
};

var equipSet, omas;

myapp.setup({ hr: 1, vs: 6 }); // 装備を村のみにしぼる

omas = [ [ '龍の護石',3,'匠',4,'氷耐性',-5 ] ];
omas = myapp.model.Oma.createSimuData(omas);

equipSet = {
    head  : myapp.equips('head', 'ガララキャップ')[0]  // スロ2
  , body  : myapp.equips('body', 'ガルルガメイル')[0]  // スロ1
  , arm   : myapp.equips('arm', 'レウスアーム')[0]     // スロ3
  , waist : myapp.equips('waist', 'ゴアフォールド')[0] // スロ1
  , leg   : myapp.equips('leg', 'アークグリーヴ')[0]   // スロ2
  , weapon: { name: 'slot3' }
  , oma   : omas[0]
};
simulate([ '斬れ味レベル+1', '攻撃力UP【大】', '耳栓' ], equipSet);

equipSet = {
    head  : myapp.equips('head', 'ガララキャップ')[0]  // スロ2
  , body  : myapp.equips('body', 'レックスメイル')[0]  // スロ2
  , arm   : myapp.equips('arm', 'ガルルガアーム')[0]   // スロ3
  , waist : myapp.equips('waist', 'ゴアフォールド')[0] // スロ1
  , leg   : myapp.equips('leg', 'アークグリーヴ')[0]   // スロ2
  , weapon: { name: 'slot3' }
  , oma   : omas[0]
};
simulate([ '斬れ味レベル+1', '攻撃力UP【大】', '耳栓' ], equipSet);

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
           test(this.myapp, this.simu.data, this.simu.Deco.Simulator);
       }
);
