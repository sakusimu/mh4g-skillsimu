(function (define) {
'use strict';
var deps = [ '../deco.js', '../util.js', '../util/skill.js', '../util/comb.js' ];
define(deps, function (Deco, Util, Skill, Comb) {

var parts = Util.parts;

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
Combinator.prototype.combine = function (skillNames, decombsSet) {
    if (skillNames == null || skillNames.length === 0) return [];
    if (decombsSet == null || decombsSet.body == null) return [];

    var i, ilen, j, jlen, decombList, lists;

    this.initialize();

    var borderLine = Comb.calcBorderLine(decombsSet, skillNames);

    var activates   = false, // スキルが発動したらその時点で処理を終了するために利用
        decombLists = [];
    for (i = 0, ilen = parts.length; i < ilen; ++i) {
        var part    = parts[i],
            decombs = decombsSet[part] || null;
        var seen = [];

        if (decombLists.length === 0) {
            lists = this._combine([], decombs, borderLine, part);
            seen = seen.concat(lists);
        }
        for (j = 0, jlen = decombLists.length; j < jlen; ++j) {
            decombList = decombLists[j];
            lists = this._combine(decombList, decombs, borderLine, part);
            if (lists == null) {
                lists = [ decombList ];
                activates = true;
            }
            seen = seen.concat(lists);
        }

        decombLists = seen;
        if (activates) break;
    }

    // decombLists -> decombSets: パーツ毎の組み合わせの配列をハッシュに
    var ret = [];
    for (i = 0, ilen = decombLists.length; i < ilen; ++i) {
        decombList = decombLists[i];
        var hash = {};
        for (j = 0, jlen = parts.length; j < jlen; ++j) {
            hash[parts[j]] = decombList[j];
        }
        ret.push(hash);
    }

    ret = this._removeOverlap(ret);

    return ret;
};

/**
 * 装飾品の組み合わせを求める。
 *
 * decombList は [ bodyDecomb, headDecomb, ... ] という形で、組み合わせを配列でもったもの。
 * decombs は、スロット数順でソート済みの前提。
 */
Combinator.prototype._combine = function (decombList, decombs, borderLine, part) {
    if (decombList == null) decombList = [];

    var ret = [];

    if (decombs == null || decombs.length === 0) {
        ret.push(decombList.concat(null));
        return ret;
    }

    var unifiedSC = Comb.unify(decombList),
        bodySC    = decombList[0] ? decombList[0].skillComb : {}; // 胴系統倍化

    // スキルが発動していたら
    if (Comb.activates(unifiedSC, borderLine.goal)) return null;

    for (var i = 0, len = decombs.length; i < len; ++i) {
        var decomb    = decombs[i];
        var skillComb = decomb.skillComb;

        if (skillComb['胴系統倍化']) skillComb = bodySC;

        var sc = Skill.merge(unifiedSC, skillComb);
        var isOverMaxSum  = Comb.isOverMaxSumSkill(sc, borderLine, part);
        var isOverMaxEach = Comb.isOverMaxEachSkill(sc, borderLine, part);

        if (isOverMaxSum && isOverMaxEach) {
            ret.push(decombList.concat(decomb));
        }
    }

    return ret;
};

/** 装飾品の組み合わせがかぶってるものを削除 */
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
