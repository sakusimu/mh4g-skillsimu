(function (define) {
'use strict';
var deps = [ 'underscore', '../test/lib/driver-myapp.js',
             '../lib/deco/normalizer.js', '../lib/deco/combinator.js',
             '../lib/deco/assembler.js' ];
define(deps, function (_, myapp, Normalizer, Combinator, Assembler) {

var simulate = function (skillNames, quipSet) {
    var n = new Normalizer(),
        c = new Combinator(),
        a = new Assembler();

    var start = Date.now();
    var normalized = n.normalize(skillNames, equipSet);
    var ndone = Date.now();
    var decombSets = c.combine(skillNames, normalized);
    var cdone = Date.now();
    var assems = a.assemble(decombSets);
    var adone = Date.now();

    console.log('>', '[ ' + skillNames.join(', ') + ' ]');
    console.log('n:', resultNormalizer(normalized));
    console.log('c:', decombSets.length);
    console.log('a:', assems.length);

    var time = (adone - start) + ' ('
            + 'n=' + (ndone - start)
            + ', c=' + (cdone - ndone)
            + ', a=' + (adone - cdone) + ')';
    console.log('time:', time);
};

var resultNormalizer = function (normalized) {
    var list = [];
    for (var part in normalized.decombsSet) {
        var decombs = normalized.decombsSet[part];
        list.push(part + ': ' + decombs.length);
    }
    return '[ ' + list.join(', ') + ' ]';
};

var simplify = function (decombSets) {
    return _.map(decombSets, function (decombSet) {
        var names = _.map(decombSet, function (decomb, part) {
            var names = decomb.names;
            if (part === 'body') names = _.map(names, function (n) { return n += '(胴)'; });
            return names;
        });
        names = _.flatten(names);
        return names.sort().join(',');
    });
};

var equipSet, omas;

omas = [ myapp.oma([ '龍の護石',3,'匠',4,'氷耐性',-5 ]) ];

myapp.setup({ hr: 1, vs: 6 }); // 装備を村のみにしぼる

equipSet = {
    head  : myapp.equip('head', 'ガララキャップ')  // スロ2
  , body  : myapp.equip('body', 'レックスメイル')  // スロ2
  , arm   : myapp.equip('arm', 'ガルルガアーム')   // スロ3
  , waist : myapp.equip('waist', 'ゴアフォールド') // スロ1
  , leg   : myapp.equip('leg', 'アークグリーヴ')   // スロ2
  , weapon: { name: 'slot3' }
  , oma   : omas[0]
};
simulate([ '斬れ味レベル+1', '攻撃力UP【大】', '耳栓' ], equipSet);

myapp.initialize();

equipSet = {
    head  : myapp.equip('head', '三眼のピアス')
  , body  : myapp.equip('body', '三眼の首飾り')
  , arm   : myapp.equip('arm', '三眼の腕輪')
  , waist : myapp.equip('waist', '三眼の腰飾り')
  , leg   : myapp.equip('leg', '三眼の足輪')
  , weapon: { name: 'slot3' }
  , oma   : omas[0]
};

simulate([ '斬れ味レベル+1', '砥石使用高速化' ], equipSet);
simulate([ '斬れ味レベル+1', '高級耳栓' ], equipSet);

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
           test(this._, this.myapp, this.simu.Deco.Normalizer,
                this.simu.Deco.Combinator, this.simu.Deco.Assembler);
       }
);
