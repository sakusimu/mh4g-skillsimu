(function (define) {
'use strict';
var deps = [ '../deco.js', './normalizer.js', './combinator.js', './assembler.js' ];
define(deps, function (Deco, Normalizer, Combinator, Assembler) {

/**
 * 装飾品の組み合わせを求めるクラス。
 *
 * ユースケースとして、一度シミュした後の装飾品検索で使われることを想定しているので
 * 前提として、そのスキルが発動する装備の組み合わせはわかっている。
 *
 * deComb について
 * 装飾品の組み合わせのこと
 * 例えば
 *   [ { name: '研磨珠【１】', slot: 1, skillComb: { '研ぎ師': 2 } },
 *     { name: '研磨珠【１】', slot: 1, skillComb: { '研ぎ師': 2 } } ]
 * とか
 *   [ { name: '匠珠【２】', slot: 2, skillComb: { '匠': 1, '斬れ味': -1 } } ]
 * になる。
 */
var Simulator = function () {
    this.initialize.apply(this, arguments);
};

Simulator.prototype.initialize = function () {
    this.normalizer = new Normalizer();
    this.combinator = new Combinator();
    this.assembler  = new Assembler();
};

/**
 * 条件となるスキルの発動を満たす装飾品の組み合わせを返す。
 */
Simulator.prototype.simulate = function (skillNames, equipSet) {
    if (skillNames == null || skillNames.length === 0) return null;
    if (equipSet == null) return null;

    this.normalizer.initialize();
    this.combinator.initialize();
    this.assembler.initialize();

    var normalized = this.normalizer.normalize(skillNames, equipSet);
    var decombSets = this.combinator.combine(skillNames, normalized);
    var assems     = this.assembler.assemble(decombSets);

    return assems;
};

return Deco.Simulator = Simulator;
});
})(typeof define !== 'undefined' ?
   define :
   typeof module !== 'undefined' && module.exports ?
       function (deps, factory) {
           var modules = [], len = deps.length;
           for (var i = 0; i < len; ++i) modules.push(require(deps[i]));
           module.exports = factory.apply(this, modules);
       } :
       function (deps, factory) {
           factory(this.simu.Deco, this.simu.Deco.Normalizer,
                   this.simu.Deco.Combinator, this.simu.Deco.Assembler);
       }
);
