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

DecoSimulator.prototype.initialize = function (opts) {
    opts = opts || {};

    this.result = null;
    this.weaponSlot = opts.weaponSlot || 0;
};

/**
 * 条件となるスキルの発動を満たす、空きスロが一番多くなる装飾品の組み合わせを返す。
 */
DecoSimulator.prototype.simulate = function (skillNames, equipSet, opts) {
    if (skillNames == null || skillNames.length === 0) return [];

    this.initialize(opts);

    var skillTrees = Skill.trees(skillNames);
    if (skillTrees.length === 0) return null;

    var norSet = this._normalize(skillTrees, equipSet);
    var list   = this._combine(norSet);

    var i, len,
        goal   = Combinator.goal(skillNames),
        bucket = [];

    for (i = 0, len = list.length; i < len; ++i) {
        var combSet   = list[i];
        var skillComb = this._calcPoint(combSet);

        if (!this._isBeyond(goal, skillComb)) continue;

        var freeSlot = this._sumFreeSlot(combSet);

        if (bucket[freeSlot] == null) bucket[freeSlot] = [];
        bucket[freeSlot].push(combSet);
    }

    var key, uniq = {},
        combSetList = bucket.pop(); // 空きスロが一番多いものが対象

    // 同じ装飾品のみの組み合わせを取り除く
    for (i = 0, len = combSetList.length; i < len; ++i) {
        key = this._genKey(combSetList[i]);
        if (uniq[key]) continue;
        uniq[key] = combSetList[i];
    }

    var ret = this._result(uniq);

    return this.result = ret;
};

DecoSimulator.prototype._normalize = function (skillTrees, equipSet) {
    var deCombsBySlot = Deco.combs(skillTrees),
        ret = {};

    for (var part in equipSet) {
        var equip = equipSet[part];

        // slotN とかだと slot や skillComb がない
        if (/^slot\d$/.test(equip.name)) {
            equip.slot = +equip.name.substr(4, 1);
            equip.skillComb = {};
        } else if (equip.name === '胴系統倍化') {
            equip.slot = 0;
            equip.skillComb = { '胴系統倍化': 1 };
        }

        ret[part] = { equip: equip, decos: makeDecos(deCombsBySlot, equip.slot) };
    }

    ret.weapon = {
        equip: { name: 'weapon', slot: this.weaponSlot, skillComb: {} },
        decos: makeDecos(deCombsBySlot, this.weaponSlot)
    };

    return ret;
};

var makeDecos = function (deCombsBySlot, maxSlot) {
    var decos = [];
    for (var slot = 0; slot <= maxSlot; ++slot) {
        var deCombs = deCombsBySlot[slot];

        var simply = [];
        for (var i = 0, ilen = deCombs.length; i < ilen; ++i) {
            var deComb = deCombs[i],
                names  = [],
                skills = [];
            for (var j = 0, jlen = deComb.length; j < jlen; ++j) {
                names.push(deComb[j].name);
                skills.push(deComb[j].skillComb);
            }
            simply.push({ names: names, slot: slot, skillComb: Skill.merge(skills) });
        }
        if (maxSlot !== 0) decos[slot] = simply;
    }
    return decos;
};

DecoSimulator.prototype._combine = function (norSet) {
    var list = [];

    for (var part in norSet) {
        var comb    = norSet[part],
            newList = [];
        var equip = comb.equip,
            decos = comb.decos;

        var i = 0, ilen = list.length;
        do {
            var set = list[i];
            var deCombs = combineDeco(part, set, equip, decos);
            for (var j = 0, jlen = deCombs.length; j < jlen; ++j) {
                newList.push(deCombs[j]);
            }
        } while (++i < ilen);

        list = newList;
    }

    return list;
};

var combineDeco = function (part, set, equip, decos) {
    var newSet = {},
        ret    = [];

    var slot = 0, slen = decos.length;
    do {
        var deComb = decos[slot];

        var i = 0, len = deComb ? deComb.length : 0;
        do {
            var deco = deComb && deComb.length ? deComb[i] : null;
            newSet = {};

            if (set != null) {
                for (var p in set) newSet[p] = set[p];
            }

            newSet[part] = { equip: equip, deco: deco };
            ret.push(newSet);
        } while (++i < len);
    } while (++slot < slen);

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
        if (skillComb[name] == null) return false;
        if (goal[name] > skillComb[name]) return false;
    }
    return true;
};

DecoSimulator.prototype._sumFreeSlot = function (combSet) {
    var sum = 0;

    for (var part in combSet) {
        var equip = combSet[part].equip,
            deco  = combSet[part].deco;

        var freeSlot = equip.slot - (deco ? deco.slot : 0);
        sum += freeSlot;
    }

    return sum;
};

DecoSimulator.prototype._genKey = function (combSet) {
    var part,
        hasDoubling = false;

    for (part in combSet) {
        if (combSet[part].equip.skillComb['胴系統倍化']) hasDoubling = true;
    }

    var names = [];
    for (part in combSet) {
        var deco = combSet[part].deco;
        var list = deco ? deco.names : [];
        if (part === 'body' && hasDoubling) {
            var suffixes = [];
            for (var i = 0, len = list.length; i < len; ++i) {
                suffixes.push(list[i] + '(胴)');
            }
            list = suffixes;
        }
        names = names.concat(list);
    }

    return names.sort().join(',');
};

DecoSimulator.prototype._result = function (uniqCombSets) {
    var pickup,
        decos     = [],
        summaries = [];

    for (var key in uniqCombSets) {
        var combSet = uniqCombSets[key];

        // 装備はどれも同じなのでテキトーにピックアップしたのを使う
        if (pickup == null) pickup = combSet;

        var names = [];
        for (var part in combSet) {
            var deco  = combSet[part].deco;
            var list = deco ? deco.names : [];
            names = names.concat(list);
        }

        var summary = {
            names    : key,
            skillComb: this._calcPoint(combSet),
            freeSlot : this._sumFreeSlot(combSet)
        };

        decos.push(names);
        summaries.push(summary);
    }

    return {
        head : pickup.head.equip,
        body : pickup.body.equip,
        arm  : pickup.arm.equip,
        waist: pickup.waist.equip,
        leg  : pickup.leg.equip,
        decos: decos,
        summaries: summaries
    };
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
