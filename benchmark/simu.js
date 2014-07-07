var myapp = require('../test/lib/driver-myapp.js'),
    data  = require('../lib/data.js'),
    Normalizer = require('../lib/normalizer.js'),
    Combinator = require('../lib/combinator.js'),
    Assembler  = require('../lib/assembler.js');

myapp.setup();

var simulate = function (skillNames, opts) {
    var n = new Normalizer(opts),
        c = new Combinator(),
        a = new Assembler();

    var start = Date.now();
    var norCombsSet = n.normalize(skillNames);
    var ndone = Date.now();
    var actiCombs = c.combine(skillNames, norCombsSet);
    var cdone = Date.now();
    var assems = a.assembleEquip(actiCombs);
    var adone = Date.now();

    var time = { n: ndone - start,
                 c: cdone - ndone,
                 a: adone - cdone,
                 total: adone - start };

    console.log('>', skillNames);
    console.log('n:', resultNormalizer(norCombsSet));
    console.log('c:', actiCombs.length);
    console.log('a:', assems.length);
    console.log('time:', time);
    //console.log('mem:', memoryUsage());
};

var resultNormalizer = function (norCombsSet) {
    var list = [];
    for (var part in norCombsSet) {
        var norCombs = norCombsSet[part];
        if (norCombs == null) continue;
        list.push(part + ': ' + norCombs.length);
    }
    return '[ ' + list.join(', ') + ' ]';
};
var memoryUsage = function () {
    var usage = process.memoryUsage();
    for (var key in usage) {
        var value = usage[key];
        usage[key] = ('' + value / 1024 / 1024).slice(0, 5) + 'MB';
    }
    return usage;
};

console.log('mem:', memoryUsage());

//myapp.setup({ hr: 1, vs: 6 });

var list = [];
for (var part in data.equips) list.push(part + ': ' + data.equips[part].length);
console.log('data.equips:', list);

simulate([ '斬れ味レベル+1', '集中' ], { weaponSlot: 2});

simulate([ '回避性能+3', '回避距離UP', '斬れ味レベル+1' ]);
simulate([ '攻撃力UP【大】', '業物' ]);
simulate([ '斬れ味レベル+1', '高級耳栓' ]);
simulate([ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ]);

//if (global.gc) global.gc();
//console.log('memoryUsage:', memoryUsage());
