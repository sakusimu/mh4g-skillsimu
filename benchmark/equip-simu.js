'use strict';
var myapp = require('../test/lib/driver-myapp.js'),
    data = require('../lib/data.js'),
    Normalizer = require('../lib/equip/normalizer.js'),
    Combinator = require('../lib/equip/combinator.js'),
    Assembler = require('../lib/equip/assembler.js');

var DEBUG = false;

var simulate = function (skillNames, opts) {
    var n = new Normalizer(opts),
        c = new Combinator(),
        a = new Assembler();

    var start = Date.now();
    var bulksSet = n.normalize(skillNames);
    var ndone = Date.now();
    var eqcombs = c.combine(skillNames, bulksSet);
    var cdone = Date.now();
    var assems = a.assemble(eqcombs);
    var adone = Date.now();

    if (DEBUG) printAssems(assems);

    console.log('>', '[ ' + skillNames.join(', ') + ' ]');
    console.log('n:', resultNormalizer(bulksSet));
    console.log('c:', eqcombs.length);
    console.log('a:', assems.length);

    var time = [
        'n=' + (ndone - start),
        'c=' + (cdone - ndone),
        'a=' + (adone - cdone)
    ].join(', ');
    console.log('time:', (adone - start), '(' + time + ')');
};

var resultNormalizer = function (bulksSet) {
    var list = [];
    for (var part in bulksSet) {
        var bulks = bulksSet[part];
        if (bulks == null) continue;
        list.push(part + ': ' + bulks.length);
    }
    return '[ ' + list.join(', ') + ' ]';
};

var printAssems = function (assems) {
    assems.forEach(function (assem) {
        var list = [];
        for (var part in assem) list.push(assem[part]);
        console.log(list.join('\t'));
    });
};

var list = [];
for (var part in data.equips) list.push(part + ': ' + data.equips[part].length);
console.log('data.equips:', '[ ' + list.join(', ') + ' ]');

myapp.setup({ weaponSlot: 2 });
simulate([ '斬れ味レベル+1', '集中' ]);

myapp.setup();
simulate([ '回避性能+3', '回避距離UP', '斬れ味レベル+1' ]);
simulate([ '攻撃力UP【大】', '業物' ]);
simulate([ '斬れ味レベル+1', '高級耳栓' ]);

myapp.setup({ weaponSlot: 3 });
simulate([ '斬れ味レベル+1', '高級耳栓', '砥石使用高速化' ]);

myapp.setup();
simulate([ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ]);

// お守りあり
myapp.setup({
    omas: [
        [ '龍の護石',3,'匠',4,'氷耐性',-5 ]
    ]
});
simulate([ '斬れ味レベル+1', '高級耳栓' ]);
simulate([ '斬れ味レベル+1', '高級耳栓', '砥石使用高速化' ]);

// 発掘装備
myapp.setup({
    omas: [
        [ '龍の護石',3,'匠',4,'氷耐性',-5 ],
        [ '龍の護石',0,'溜め短縮',5,'攻撃',9 ],
        [ '龍の護石',3,'痛撃',4 ]
    ],
    dig: true
});
simulate([ '真打', '集中', '弱点特効', '耳栓' ]);
