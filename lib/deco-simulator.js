(function (define) {
'use strict';
var deps = [ './namespace.js', './deco.js', './skill.js', './combinator.js' ];
define(deps , function (simu, Deco, Skill, Combinator) {

/**
 * 装飾品の組み合わせを求めるクラス。
 *
 * ユースケースとして、一度シミュした後の装飾品検索で使われることを想定しているので
 * 前提として、そのスキルが発動する装備の組み合わせはわかっている。
 */
var DecoSimulator = function () {
    this.initialize.apply(this, arguments);
};

DecoSimulator.prototype.initialize = function () {
    this.result = null;
    this.equips = {};
    this.weaponSlot = null;
};

/**
 * 条件となるスキルの発動を満たす装飾品の組み合わせを返す。
 */
DecoSimulator.prototype.combine = function (skillNames, equips) {
    if (skillNames == null || skillNames.length === 0) return [];

    var skillTrees = Skill.trees(skillNames);
    if (skillTrees.length === 0) return null;

    var combsSet = this._makeCombsSet(skillTrees, equips);
    var combSetList = this._makeCombSetList(combsSet);

    var key,
        goal   = Combinator.goal(skillNames),
        bucket = {};
    for (var i = 0, len = combSetList.length; i < len; ++i) {
        var combSet   = combSetList[i];
        var skillComb = this._calcPoint(combSet);

        key = genKey(combSet);
        if (bucket[key]) continue;

        if (this._isBeyond(goal, skillComb)) bucket[key] = combSet;
    }

    var ret = [];
    for (key in bucket) ret.push(bucket[key]);

    return ret;
};

var genKey = function (combSet) {
    var names = [];
    for (var part in combSet) {
        var comb = combSet[part];
        names = names.concat(comb.names);
    }
    names.sort().join(',');
};

DecoSimulator.prototype._makeCombSetList = function (combsSet) {
    var i, ilen, j, jlen, set,
        list = [];

    for (var part in combsSet) {
        var combs   = combsSet[part],
            newList = [];

        for (i = 0, ilen = list.length; i < ilen; ++i) {
            set = list[i];

            for (j = 0, jlen = combs.length; j < jlen; ++j) {
                var newSet = {};
                for (var p in set) newSet[p] = set[p];
                newSet[part] = combs[j];
                newList.push(newSet);
            }
        }
        if (list.length === 0) {
            for (i = 0, ilen = combs.length; i < ilen; ++i) {
                set = {};
                set[part] = combs[i];
                newList.push(set);
            }
        }

        list = newList;
    }

    return list;
};

DecoSimulator.prototype._makeCombsSet = function (skillTrees, equips) {
    var deCombsBySlot = Deco.combs(skillTrees),
        ret = {};

    for (var part in equips) {
        var equip = equips[part];

        // slotN とかだと skillComb がない
        if (equip.skillComb == null) equip.skillComb = {};

        var slot   = /^slot\d$/.test(equip.name) ? +equip.name.substr(4, 1) : equip.slot;
        var deCombs = deCombsBySlot[slot];

        var list = [];
        for (var i = 0, ilen = deCombs.length; i < ilen; ++i) {
            var deComb = deCombs[i],
                names = [], skills = [];
            for (var j = 0, jlen = deComb.length; j < jlen; ++j) {
                names.push(deComb[j].name);
                skills.push(deComb[j].skillComb);
            }
            var deco = { names: names, skillComb: Skill.merge(skills) };
            list.push({ equip: equip, deco: deco });
        }
        if (deCombs.length === 0) list.push({ equip: equip, deco: null });

        ret[part] = list;
    }

    return ret;
};

DecoSimulator.prototype._calcPoint = function (combSet) {
    var skillCombs = [];

    var bodySkill = (function () {
        var body = combSet.body;
        var e = body.equip.skillComb,
            d = body.deco ? body.deco.skillComb : {};
        return Skill.merge(e, d);
    })();

    for (var part in combSet) {
        if (part === 'body') {
            skillCombs.push(bodySkill);
            continue;
        }

        var comb = combSet[part];
        var e    = comb.equip.skillComb,
            d    = comb.deco ? comb.deco.skillComb : {};
        skillCombs.push(Skill.merge(e['胴系統倍化'] ? bodySkill : e, d));
    }

    return Skill.merge(skillCombs);
};

DecoSimulator.prototype._isBeyond = function (goal, skillComb) {
    for (var name in goal) {
        if (goal[name] > skillComb[name]) return false;
    }
    return true;
};

return simu.DecoSimulator = DecoSimulator;
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
           factory(this.simu, this.simu.Deco, this.simu.Skill, this.simu.Combinator);
       }
);
