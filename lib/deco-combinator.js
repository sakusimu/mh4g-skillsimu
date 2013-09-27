(function (define) {
'use strict';
define([ './namespace.js', './deco.js', './skill.js' ] , function (simu, Deco, Skill) {

/**
 * 装飾品の組み合わせを求めるクラス。
 *
 * ユースケースとして、一度シミュした後の装飾品検索で使われることを想定しているので
 * 前提として、そのスキルが発動する装備の組み合わせはわかっている。
 */
var DecoCombinator = function () {
    this.initialize.apply(this, arguments);
};

DecoCombinator.prototype.initialize = function () {
    this.result = null;
    this.equips = {};
    this.weaponSlot = null;
};

/**
 * 条件となるスキルの発動を満たす装飾品の組み合わせを返す。
 */
DecoCombinator.prototype.combine = function (skillNames, equips) {
    if (skillNames == null || skillNames.length === 0) return [];

    var skillTrees = Skill.trees(skillNames);
    if (skillTrees.length === 0) return null;

    this.equips = equips;

    return [];
};

DecoCombinator.prototype._makeCombs = function (skillTrees, equips) {
    var decoCombs = Deco.combs(skillTrees),
        ret = {};

    for (var part in equips) {
        var equip   = equips[part];
        var slot    = equip.slot;
        var deCombs = decoCombs[slot],
            list    = [];

        for (var i = 0, len = deCombs.length; i < len; ++i) {
            list.push({ equip: equip, deComb: deCombs[i] });
        }

        ret[part] = list;
    }

    return ret;
};

return simu.DecoCombinator = DecoCombinator;
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
           factory(this.simu, this.simu.Deco, this.simu.Skill);
       }
);
