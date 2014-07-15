(function (define) {
'use strict';
var deps = [ 'underscore', '../test/lib/driver-myapp.js',
             '../lib/deco/normalizer.js', '../lib/deco/combinator.js' ];
define(deps, function (_, myapp, Normalizer, Combinator) {

var simulate = function (skillNames, quipSet) {
    var n = new Normalizer(),
        c = new Combinator();

    var start = Date.now();
    var normalized = n.normalize(skillNames, equipSet);
    var ndone = Date.now();
    var decombSets = c.combine(skillNames, normalized);
    var cdone = Date.now();
    var adone = Date.now();

    console.log('>', '[ ' + skillNames.join(', ') + ' ]');
    console.log('n:', resultNormalizer(normalized));
    console.log('c:', decombSets.length);

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

omas = [ [ '龍の護石',3,'匠',4,'氷耐性',-5 ] ];
omas = myapp.model.Oma.createSimuData(omas);

myapp.setup({ hr: 1, vs: 6 }); // 装備を村のみにしぼる

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

myapp.initialize();

equipSet = {
    head  : myapp.equips('head', '三眼のピアス')[0]
  , body  : myapp.equips('body', '三眼の首飾り')[0]
  , arm   : myapp.equips('arm', '三眼の腕輪')[0]
  , waist : myapp.equips('waist', '三眼の腰飾り')[0]
  , leg   : myapp.equips('leg', '三眼の足輪')[0]
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
           test(this._, this.myapp,
                this.simu.Deco.Normalizer, this.simu.Deco.Combinator);
       }
);
