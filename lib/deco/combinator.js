(function (define) {
'use strict';
var deps = [ '../deco.js', '../util.js', '../util/skill.js', '../util/comb.js' ];
define(deps, function (Deco, Util, Skill, Comb) {

var parts = Comb.parts;

/**
 * 部位ごとの装備スロットで実現できる装飾品の組み合わせのセットを返す。
 */
var Combinator = function () {
    this.initialize.apply(this, arguments);
};

Combinator.prototype.initialize = function () {};

/**
 * 引数の decombsSet を元に、条件となるスキルの発動を満たす組み合わせを返す。
 */
Combinator.prototype.combine = function (skillNames, normalized) {
    if (skillNames == null || skillNames.length === 0) return [];
    if (normalized == null || normalized.decombsSet == null) return [];

    this.initialize();

    var equipSet   = normalized.equipSet,
        decombsSet = normalized.decombsSet;

    var borderLine = Comb.calcBorderLine(decombsSet, skillNames, equipSet),
        decombSets = [];

    // 装飾品無しでスキルが発動してるか
    if (Comb.activates({}, borderLine.goal)) {
        decombSets.push({});
    } else {
        decombSets = this._combine(decombsSet, borderLine);
    }

    decombSets = Comb.brushUp(decombSets);

    decombSets = this._removeOverlap(decombSets);

    var totalSlot = this._calcTotalSlot(equipSet);
    var ret = this._removePointOver(decombSets, totalSlot, borderLine.goal);

    return ret;
};

Combinator.prototype._combine = function (decombsSet, borderLine) {
    var decombSets    = [ { cache: null } ],
        activatedSets = [];

    for (var i = 0, ilen = parts.length; i < ilen; ++i) {
        var part    = parts[i],
            decombs = decombsSet[part] || null;

        var j, jlen, decombSet;

        var seen = [];
        for (j = 0, jlen = decombSets.length; j < jlen; ++j) {
            decombSet = decombSets[j];
            var sets = this._combineDecomb(decombSet, decombs, borderLine, part);
            seen = seen.concat(sets);
        }

        decombSets = seen;

        for (j = 0, jlen = decombSets.length; j < jlen; ++j) {
            decombSet = decombSets[j];
            if (decombSet.activates) activatedSets.push(decombSet);
        }

        if (activatedSets.length) break;
    }

    return activatedSets;
};

/**
 * 装飾品の組み合わせを求める。
 *
 * decombSet は { cache: {}, body: {}, head: {}, ... } という形で組み合わせをもったもの。
 * decombs は装飾品の組み合わせ。スロット数の昇順でソート済み前提。
 */
Combinator.prototype._combineDecomb = function (decombSet, decombs, borderLine, part) {
    if (decombSet == null) decombSet = {};

    var bodySC = decombSet.body ? decombSet.body.skillComb : {}, // 胴系統倍化用
        ret    = [];

    if (decombs == null || decombs.length === 0) {
        decombSet[part] = null;
        ret.push(decombSet);
        return ret;
    }

    var slot = null;
    for (var i = 0, len = decombs.length; i < len; ++i) {
        var decomb    = decombs[i],
            skillComb = decomb.skillComb;

        // decombs はスロット数でソート済み前提
        if (slot != null && decomb.slot > slot) break;

        if (skillComb['胴系統倍化']) skillComb = bodySC;

        var sc = Skill.merge(decombSet.cache, skillComb);

        var set = Util.clone(decombSet);
        set.cache = sc;
        set[part] = decomb;

        if (Comb.activates(sc, borderLine.goal)) {
            ret.push(set);
            set.activates = true;
            slot = decomb.slot;

            continue;
        }

        var isOverMaxSum  = Comb.isOverMaxSumSkill(sc, borderLine, part),
            isOverMaxEach = Comb.isOverMaxEachSkill(sc, borderLine, part);

        if (isOverMaxSum && isOverMaxEach) {
            ret.push(set);
        }
    }

    return ret;
};

/**
 * 装飾品の組み合わせがかぶってるものを削除
 */
Combinator.prototype._removeOverlap = function (decombSets) {
    var ret = [];

    var bucket = {};
    for (var i = 0, len = decombSets.length; i < len; ++i) {
        var decombSet = decombSets[i];

        var names = [];
        for (var part in decombSet) {
            var decomb = decombSet[part];
            if (decomb == null) continue;
            names = names.concat(decomb.names);
        }

        var key = names.sort().join(',');
        if (bucket[key]) continue;

        ret.push(decombSet);
        bucket[key] = true;
    }

    return ret;
};

Combinator.prototype._calcTotalSlot = function (equipSet) {
    var total = 0;
    for (var part in equipSet) {
        var equip = equipSet[part];
        if (equip == null) continue;
        total += equip.slot;
    }
    return total;
};

Combinator.prototype._removePointOver = function (decombSets, totalSlot, goal) {
    var groupBy = this._groupByFreeSlot(decombSets, totalSlot);

    var freeSlot,
        list = [];
    for (freeSlot in groupBy) list.push(freeSlot);
    list = list.sort().reverse();

    var ret = [];
    for (var i = 0, len = list.length; i < len; ++i) {
        freeSlot = list[i];
        var sets = groupBy[freeSlot],
            just = this._getJustActivated(sets, goal);

        // ちょうどスキルが発動してるのがなかったら全部を結果に
        if (just.length === 0) just = sets;

        ret = ret.concat(just);
    }

    return ret;
};

Combinator.prototype._groupByFreeSlot = function (decombSets, totalSlot) {
    var ret = {};
    for (var i = 0, len = decombSets.length; i < len; ++i) {
        var decombSet = decombSets[i],
            usedSlot  = 0;
        for (var part in decombSet) {
            var decomb = decombSet[part];
            if (decomb == null) continue;
            usedSlot += decomb.slot;
        }
        var freeSlot = totalSlot - usedSlot;
        if (ret[freeSlot] == null) ret[freeSlot] = [];
        ret[freeSlot].push(decombSet);
    }
    return ret;
};

/**
 * スキルがちょうど発動している装飾品の組み合わせを返す。
 */
Combinator.prototype._getJustActivated = function (decombSets, goal) {
    var ret = [];
    for (var i = 0, len = decombSets.length; i < len; ++i) {
        var decombSet = decombSets[i],
            skillComb = Skill.unify(decombSet);
        if (Comb.justActivates(skillComb, goal)) ret.push(decombSet);
    }
    return ret;
};

return Deco.Combinator = Combinator;
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
           factory(this.simu.Deco, this.simu.Util,
                   this.simu.Util.Skill, this.simu.Util.Comb);
       }
);
