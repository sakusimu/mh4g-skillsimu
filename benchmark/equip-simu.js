(function (define) {
'use strict';
var deps = [ '../test/lib/driver-myapp.js', '../lib/data.js',
             '../lib/equip/normalizer.js', '../lib/equip/combinator.js',
             '../lib/equip/assembler.js' ];
define(deps, function (myapp, data, Normalizer, Combinator, Assembler) {

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

    console.log('>', '[ ' + skillNames.join(', ') + ' ]');
    console.log('n:', resultNormalizer(norCombsSet));
    console.log('c:', actiCombs.length);
    console.log('a:', assems.length);

    var time = (adone - start) + ' ('
            + 'n=' + (ndone - start)
            + ', c=' + (cdone - ndone)
            + ', a=' + (adone - cdone) + ')';
    console.log('time:', time);
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

//myapp.setup({ hr: 1, vs: 6 });

var list = [];
for (var part in data.equips) list.push(part + ': ' + data.equips[part].length);
console.log('data.equips:', '[ ' + list.join(', ') + ' ]');

simulate([ '斬れ味レベル+1', '集中' ], { weaponSlot: 2});

simulate([ '回避性能+3', '回避距離UP', '斬れ味レベル+1' ]);
simulate([ '攻撃力UP【大】', '業物' ]);
simulate([ '斬れ味レベル+1', '高級耳栓' ]);
simulate([ '攻撃力UP【大】', '業物', '集中', '見切り+1', '弱点特効' ]);

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
           test(this.myapp, this.simu.data, this.simu.Equip.Normalizer,
                this.simu.Equip.Combinator, this.simu.Equip.Assembler);
       }
);
