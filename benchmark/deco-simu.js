var myapp = require('../test/lib/driver-myapp.js'),
    data  = require('../lib/data.js'),
    DecoSimulator = require('../lib/deco-simulator.js');

var simulate = function (skillNames, quipSet) {
    var ds = new DecoSimulator();

    var start = Date.now();
    var result = ds.simulate(skillNames, equipSet);
    var done = Date.now();

    console.log('>', skillNames);
    console.log('decos:', result.decos.length);
    console.log('time:', done - start);
    //console.log('mem:', memoryUsage());
};

var memoryUsage = function () {
    var usage = process.memoryUsage();
    for (var key in usage) {
        var value = usage[key];
        usage[key] = ('' + value / 1024 / 1024).slice(0, 5) + 'MB';
    }
    return usage;
};

console.log('memoryUsage:', memoryUsage());

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
