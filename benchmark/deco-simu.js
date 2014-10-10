'use strict';
var _ = require('underscore'),
    myapp = require('../test/lib/driver-myapp.js'),
    Normalizer = require('../lib/deco/normalizer.js'),
    Combinator = require('../lib/deco/combinator.js'),
    Assembler = require('../lib/deco/assembler.js');

var DEBUG = false;

var simulate = function (skillNames, equip) {
    var n = new Normalizer(),
        c = new Combinator(),
        a = new Assembler();

    var start = Date.now();
    var bulksSet = n.normalize(skillNames, equip);
    var ndone = Date.now();
    var decombs = c.combine(skillNames, bulksSet, equip);
    var cdone = Date.now();
    var assems = a.assemble(decombs);
    var adone = Date.now();

    if (DEBUG) console.log(simplify(decombs));

    console.log('>', '[ ' + skillNames.join(', ') + ' ]');
    console.log('n:', resultNormalizer(bulksSet));
    console.log('c:', decombs.length);
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
        list.push(part + ': ' + bulks.length);
    }
    return '[ ' + list.join(', ') + ' ]';
};

// 頑シミュさんの装飾品検索の結果と比較しやすくする
var simplify = function (decombs) {
    return _.map(decombs, function (decomb) {
        var torsoUp = _.some(decomb, function (comb) {
            if (comb == null) return false;
            return comb.skillComb['胴系統倍化'] ? true : false;
        });
        var names = _.map(decomb, function (comb, part) {
            var names = comb ? comb.decos : [];
            if (torsoUp && part === 'body')
                names = _.map(names, function (n) { return n += '(胴)'; });
            return names;
        });
        names = _.flatten(names);
        return names.sort().join(',');
    });
};

var equip, omas;

omas = [ myapp.oma([ '龍の護石',3,'匠',4,'氷耐性',-5 ]) ];

myapp.setup({ context: { hr: 1, vs: 6 } }); // 装備を村のみにしぼる

equip = {
    head  : myapp.equip('head', 'ガララキャップ'),  // スロ2
    body  : myapp.equip('body', 'レックスメイル'),  // スロ2
    arm   : myapp.equip('arm', 'ガルルガアーム'),   // スロ3
    waist : myapp.equip('waist', 'ゴアフォールド'), // スロ1
    leg   : myapp.equip('leg', 'アークグリーヴ'),   // スロ2
    weapon: { name: 'slot3', slot: 3 },
    oma   : omas[0]
};
simulate([ '斬れ味レベル+1', '攻撃力UP【大】', '耳栓' ], equip);

myapp.initialize();

equip = {
    head  : myapp.equip('head', '三眼のピアス'),
    body  : myapp.equip('body', '三眼の首飾り'),
    arm   : myapp.equip('arm', '三眼の腕輪'),
    waist : myapp.equip('waist', '三眼の腰飾り'),
    leg   : myapp.equip('leg', '三眼の足輪'),
    weapon: { name: 'slot3', slot: 3 },
    oma   : omas[0]
};

simulate([ '斬れ味レベル+1', '砥石使用高速化' ], equip);
simulate([ '斬れ味レベル+1', '高級耳栓' ], equip);
