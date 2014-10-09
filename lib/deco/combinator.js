'use strict';
var util = require('../util.js');

/**
 * 正規化された装飾品とスキルの組み合わせを元に、条件となるスキルの発動を満たす
 * 装飾品の組み合わせを求めるクラス。
 *
 *     var skills = [ '斬れ味レベル+1', '高級耳栓' ];
 *     var equip = {
 *         head  : ユクモノカサ・天,
 *         body  : 三眼の首飾り,
 *         arm   : ユクモノコテ・天,
 *         waist : バンギスコイル,
 *         leg   : ユクモノハカマ・天,
 *         weapon: slot2,
 *         oma   : 龍の護石(スロ3,匠+4,氷耐性-5)
 *     };
 *     var n = new Normalizer();
 *     var bulksSet = n.normalize(skills, equip);
 *     var c = new Combinator();
 *     c.combine(skills, bulksSet, equip);
 *     => [
 *            { head  : { decos: [ '防音珠【１】' ], slot: 1, skillComb: {...} },
 *              body  : { decos: [ '防音珠【３】' ], slot: 3, skillComb: {...} },
 *              arm   : { decos: [ '防音珠【１】', '防音珠【１】' ], slot: 2, ... },
 *              waist : { decos: [], slot: 0, skillComb: { '胴系統倍化': 1, ... } },
 *              leg   : { decos: [ '防音珠【１】', '防音珠【１】' ], slot: 2, ...},
 *              weapon: { decos: [ '防音珠【１】', '防音珠【１】' ], slot: 2, ... },
 *              oma   : { decos: [ '匠珠【３】' ], slot: 3, skillComb: {...} } },
 *            ...
 *     ]
 */
var Combinator = function () {
    this.initialize.apply(this, arguments);
};

Combinator.prototype.initialize = function () {};

var parts = util.comb.parts;

/**
 * 正規化された装飾品とスキルの組み合わせを元に、条件となるスキルの発動を満たす
 * 装飾品の組み合わせを返す。
 */
Combinator.prototype.combine = function (skillNames, bulksSet, equip) {
    if (skillNames == null || skillNames.length === 0) return [];
    if (bulksSet == null || bulksSet.body == null) return [];

    var equipSC = util.skill.unify(equip),
        borderLine = new util.BorderLine(skillNames, bulksSet, equipSC);

    var combs = this._combine(bulksSet, borderLine);

    combs = this._brushUp(combs);

    combs = this._removeOverlap(combs);

    var totalSlot = this._calcTotalSlot(equip);
    var ret = this._removePointOver(combs, totalSlot, borderLine.goal);

    return ret;
};

/**
 * 装飾品の組み合わせを求める。
 *
 * bulksSet の bulks は、スロット数の昇順でソート済みの前提。
 */
Combinator.prototype._combine = function (bulksSet, borderLine) {
    var combs = [ { decombs: [], sumSC: {} } ],
        activated = [];

    // 装飾品無しでスキルが発動してるか
    activated = this._filter(combs, borderLine.goal);
    if (activated.length) return activated;

    for (var i = 0, ilen = parts.length; i < ilen; ++i) {
        var part  = parts[i],
            bulks = bulksSet[part];

        var j, jlen, comb;

        var seen = [];
        for (j = 0, jlen = combs.length; j < jlen; ++j) {
            comb = combs[j];
            var newCombs = this._combineDeco(comb, bulks, borderLine, part);
            seen = seen.concat(newCombs);
        }

        combs = this._compress(seen);

        activated = this._filter(combs, borderLine.goal);
        if (activated.length) break;
    }

    return activated;
};

Combinator.prototype._combineDeco = function (comb, bulks, borderLine, part) {
    var ret = [];

    if (bulks == null || bulks.length === 0) {
        bulks = [ { skillComb: {} } ];
    }

    var blSum = borderLine.calcSum(part, comb.sumSC),
        blEach = borderLine.calcEach(part, comb.sumSC);

    for (var i = 0, len = bulks.length; i < len; ++i) {
        var bulk = bulks[i],
            sc   = bulk.skillComb;

        if (sc['胴系統倍化']) {
            var combs = this._combineTorsoUp(comb, bulk, borderLine, part);
            ret = ret.concat(combs);
            continue;
        }

        var isOverSum = util.skill.sum(sc) >= blSum,
            isOverEach = util.comb.isOver(blEach, sc);

        if (!isOverSum || !isOverEach) continue;

        ret.push(this._newComb(comb, bulk, part));
    }

    return ret;
};

Combinator.prototype._combineTorsoUp = function (comb, bulk, borderLine, part) {
    var ret = [];

    var blSum = borderLine.calcSum(part, comb.sumSC),
        blEach = borderLine.calcEach(part, comb.sumSC);

    for (var i = 0, len = comb.decombs.length; i < len; ++i) {
        var decomb = comb.decombs[i],
            bodySC = decomb.body.skillComb || {};

        var isOverSum  = util.skill.sum(bodySC) >= blSum,
            isOverEach = util.comb.isOver(blEach, bodySC);

        if (!isOverSum || !isOverEach) continue;

        var newComb = {
            decombs: [ this._newDecomb(decomb, bulk, part) ],
            sumSC  : util.skill.merge(comb.sumSC, bodySC)
        };
        ret.push(newComb);
    }

    return ret;
};

Combinator.prototype._newComb = function (comb, bulk, part) {
    comb = comb || { decombs: [], sumSC: null };
    bulk = bulk || {};

    var srcDecombs = comb.decombs;
    if (srcDecombs.length === 0) srcDecombs = [ {} ];

    var decombs = [];
    for (var i = 0, len = srcDecombs.length; i < len; ++i) {
        var src    = srcDecombs[i],
            decomb = this._newDecomb(src, bulk, part);
        decombs.push(decomb);
    }

    var ret = {
        decombs: decombs,
        sumSC  : util.skill.merge(comb.sumSC, bulk.skillComb)
    };
    return ret;
};

Combinator.prototype._newDecomb = function (decomb, bulk, part) {
    var ret = util.clone(decomb);

    ret[part] = {
        decos: bulk.decos || [],
        slot : bulk.slot || 0,
        skillComb: bulk.skillComb || {}
    };

    return ret;
};

/**
 * combs を圧縮する。
 *
 * 以下の処理をすることで圧縮する。
 * + combs を comb の sumSC でユニークにすることで数を減らす
 * + ユニークにする際、decombs をまとめる
 */
Combinator.prototype._compress = function (combs) {
    var bucket = {},
        key;
    for (var i = 0, len = combs.length; i < len; ++i) {
        var comb = combs[i];

        key = genKey(comb);
        if (bucket[key] == null) {
            bucket[key] = comb;
            continue;
        }

        // decombs をまとめる
        bucket[key].decombs = bucket[key].decombs.concat(comb.decombs);
    }

    var ret = [];
    for (key in bucket) ret.push(bucket[key]);

    return ret;
};

var genKey = function (comb) {
    var sumSC    = comb.sumSC || {},
        sumTrees = Object.keys(sumSC).sort();

    var list = [];
    for (var i = 0, len = sumTrees.length; i < len; ++i) {
        var tree = sumTrees[i];
        list.push(tree, sumSC[tree]);
    }

    return list.join();
};

Combinator.prototype._filter = function (combs, goal) {
    var ret = [];
    for (var i = 0, len = combs.length; i < len; ++i) {
        var comb = combs[i];
        if (!util.comb.activates(comb.sumSC, goal)) continue;
        ret.push(comb);
    }
    return ret;
};

Combinator.prototype._brushUp = function (combs) {
    var decombs = [],
        i, ilen;
    for (i = 0, ilen = combs.length; i < ilen; ++i) {
        decombs = decombs.concat(combs[i].decombs);
    }

    var ret = [];
    for (i = 0, ilen = decombs.length; i < ilen; ++i) {
        var decomb  = decombs[i],
            brushed = {};
        for (var j = 0, jlen = parts.length; j < jlen; ++j) {
            var part = parts[j];
            brushed[part] = decomb[part] || { decos: [], slot: 0, skillComb: {} };
        }
        ret.push(brushed);
    }
    return ret;
};

/**
 * 装飾品の組み合わせがかぶってるものを削除
 */
Combinator.prototype._removeOverlap = function (decombs) {
    var ret = [];

    var bucket = {};
    for (var i = 0, len = decombs.length; i < len; ++i) {
        var decomb = decombs[i];

        var names = [];
        for (var part in decomb) {
            var comb = decomb[part];
            if (comb == null) continue;
            names = names.concat(comb.decos);
        }

        var key = names.sort().join(',');
        if (bucket[key]) continue;

        ret.push(decomb);
        bucket[key] = true;
    }

    return ret;
};

Combinator.prototype._calcTotalSlot = function (equip) {
    var total = 0;
    for (var part in equip) {
        var eq = equip[part];
        if (eq == null) continue;
        total += eq.slot;
    }
    return total;
};

Combinator.prototype._removePointOver = function (decombs, totalSlot, goal) {
    var groupBy = this._groupByFreeSlot(decombs, totalSlot);

    var freeSlot,
        list = [];
    for (freeSlot in groupBy) list.push(freeSlot);
    list = list.sort().reverse();

    var ret = [];
    for (var i = 0, len = list.length; i < len; ++i) {
        freeSlot = list[i];
        var combs = groupBy[freeSlot],
            just = this._getJustActivated(combs, goal);

        // ちょうどスキルが発動してるのがなかったら全部を結果に
        if (just.length === 0) just = combs;

        ret = ret.concat(just);
    }

    return ret;
};

Combinator.prototype._groupByFreeSlot = function (decombs, totalSlot) {
    var ret = {};
    for (var i = 0, len = decombs.length; i < len; ++i) {
        var decomb = decombs[i],
            usedSlot  = 0;
        for (var part in decomb) {
            var comb = decomb[part];
            if (comb == null) continue;
            usedSlot += comb.slot;
        }
        var freeSlot = totalSlot - usedSlot;
        if (ret[freeSlot] == null) ret[freeSlot] = [];
        ret[freeSlot].push(decomb);
    }
    return ret;
};

/**
 * スキルがちょうど発動している装飾品の組み合わせを返す。
 */
Combinator.prototype._getJustActivated = function (decombs, goal) {
    var ret = [];
    for (var i = 0, len = decombs.length; i < len; ++i) {
        var decomb = decombs[i],
            sc = util.skill.unify(decomb);
        if (util.comb.justActivates(sc, goal)) ret.push(decomb);
    }
    return ret;
};

module.exports = Combinator;
