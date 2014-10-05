'use strict';
var util = require('../util.js');

/**
 * 正規化された装備とスキルの組み合わせを元に、条件となるスキルの発動を満たす
 * 装備の組み合わせを求めるクラス。
 *
 * 頑シミュさんの "高速化２「打ち切る」" をしながら組み合わせを求める。
 *
 * 概要
 *     var c = new Combinator();
 *     var bulksSet; // Normalizer で normalize([ '攻撃力UP【大】', '業物' ]) した結果
 *     => { head: [
 *            { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] },
 *            { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ 'slot1' ] },
 *            { skillComb: { '攻撃': 0, '斬れ味': 1 }, equips: [ 'slot1' ] },
 *            { skillComb: { '攻撃': 1, '斬れ味': 1 }, equips: [ 'slot2' ] },
 *            { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ 'slot2' ] },
 *            { skillComb: { '攻撃': 3, '斬れ味': 0 },
 *              equips: [ 'slot2', 'ランポスヘルム', 'クックヘルム', 'レウスヘルム' ] },
 *            { skillComb: { '攻撃': 1, '斬れ味': 2 },
 *              equips: [ 'slot3', 'ランポスキャップ', 'ギザミヘルム' ] },
 *            { skillComb: { '攻撃': 0, '斬れ味': 3 },
 *              equips: [ 'slot3', 'ギザミヘルム' ] },
 *            { skillComb: { '攻撃': 2, '斬れ味': 1 },
 *              equips: [ 'ランポスヘルム', 'ランポスキャップ', 'クックヘルム' ] },
 *            { skillComb: { '攻撃': 4, '斬れ味': 0 },
 *              equips: [ 'slot3', 'ランポスキャップ', 'ボロスヘルム', 'ボロスキャップ',
 *                        'レックスヘルム', 'レウスキャップ' ] },
 *            ... ],
 *          body  : [ ... ],
 *          arm   : [ ... ],
 *          waist : [ ... ],
 *          leg   : [ ... ],
 *          weapon: [ ... ],
 *          oma   : [ ... ] }
 *     c.combine([ '攻撃力UP【大】', '業物' ], bulksSet);
 *     => [
 *            { body: [ 'slot0' ],
 *              head: [ 'レウスＳキャップ' ],
 *              arm: [ 'ランポスＳアーム' ],
 *              waist: [ 'ジンオウＳフォールド' ],
 *              leg: [ 'バンギスグリーヴ' ],
 *              weapon: [],
 *              oma: [] },
 *            { body: [ 'slot0' ],
 *              head: [ 'レウスＳキャップ' ],
 *              arm: [ 'ランポスＳアーム' ],
 *              waist: [ 'ジンオウＳフォールド' ],
 *              leg: [ 'バンギスグリーヴ' ],
 *              weapon: [],
 *              oma: [] },
 *            ...
 *        ]
 */
var Combinator = function () {
    this.initialize.apply(this, arguments);
};

Combinator.prototype.initialize = function () {
    this.threshold = 0; // 組み合わせ数がこの閾値を超えたら打ち切り(0 は打ち切りなし)
};

var parts = util.comb.parts;

/**
 * 正規化された装備とスキルの組み合わせを元に、条件となるスキルの発動を満たす
 * 装備の組み合わせを返す。
 */
Combinator.prototype.combine = function (skillNames, bulksSet) {
    if (skillNames == null || skillNames.length === 0) return [];
    if (bulksSet == null || bulksSet.body == null) return [];

    for (var part in bulksSet) {
        if (bulksSet[part] == null) continue;
        bulksSet[part] = this._sortBulks(bulksSet[part]);
    }

    var combs, ret;

    combs = this._combineUsedSlot0(skillNames, bulksSet);
    ret = this._brushUp(combs);

    if (ret.length) return ret;

    combs = this._combine(skillNames, bulksSet);
    ret = this._brushUp(combs);

    return ret;
};

/**
 * bulks を、スキルポイントの合計の降順でソートする。
 * (ただし、胴系統倍化は先頭にする)
 */
Combinator.prototype._sortBulks = function (bulks) {
    var i, len, bulk, sum;

    // 合計ポイントでスキルの組み合わせをまとめる
    var buckets = {};
    for (i = 0, len = bulks.length; i < len; ++i) {
        bulk = bulks[i];
        sum  = util.skill.sum(bulk.skillComb);
        if (buckets[sum] == null) buckets[sum] = [];
        buckets[sum].push(bulk);
    }

    // 胴系統倍化があったら、まず追加する処理
    // (胴系統倍化は、合計ポイントが 0 になるので、最初に if で絞ってる)
    var ret = [];
    if (buckets[0] != null) {
        var sum0Bulks = buckets[0],
            torsoUpBulk;
        for (i = sum0Bulks.length - 1; 0 <= i; --i) {
            bulk = sum0Bulks[i];
            if (bulk.skillComb['胴系統倍化']) {
                torsoUpBulk = sum0Bulks.splice(i, 1);
                break;
            }
        }
        if (torsoUpBulk) ret = ret.concat(torsoUpBulk);
    }

    var sums = Object.keys(buckets).sort(function (a, b) { return b - a; });
    for (i = 0, len = sums.length; i < len; ++i) {
        sum = sums[i];
        ret = ret.concat(buckets[sum]);
    }

    return ret;
};

/**
 * slot0 を使った組み合わせを求める。
 */
Combinator.prototype._combineUsedSlot0 = function (skillNames, bulksSet) {
    var bulksSets = this._makeBulksSetWithSlot0(bulksSet);

    var ret = [];
    for (var i = 0, len = bulksSets.length; i < len; ++i) {
        var combs = this._combine(skillNames, bulksSets[i]);
        ret = ret.concat(combs);

        if (ret.length) return ret;
    }

    return ret;
};

Combinator.prototype._makeBulksSetWithSlot0 = function (bulksSet) {
    var i, len, part;

    // slot0 を含む bulk を見つける
    var slot0Set = {};
    for (part in bulksSet) {
        var bulks = bulksSet[part];
        if (bulks == null) continue;

        for (i = 0, len = bulks.length; i < len; ++i) {
            var bulk = bulks[i];
            if (contains(bulk.equips, 'slot0')) {
                slot0Set[part] = bulk;
                break;
            }
        }
    }

    var slot0Parts = Object.keys(slot0Set);
    if (slot0Parts.length === 0) return [];

    // slot0 を使った組み合わせ
    var bulksSets = [];
    for (part in slot0Set) {
        var set = {};
        set[part] = [ slot0Set[part] ];
        for (i = 0, len = parts.length; i < len; ++i) {
            if (part === parts[i]) continue;
            var restPart = parts[i];
            set[restPart] = bulksSet[restPart] || null;
        }
        bulksSets.push(set);
    }

    return bulksSets;
};

var contains = function (equips, target) {
    if (equips == null || equips.length === 0) return false;

    if (equips.indexOf) return equips.indexOf(target) !== -1;

    for (var i = 0, len = equips.length; i < len; ++i) {
        if (equips[i] === target) return true;
    }
    return false;
};

/**
 * 頑シミュさんの "高速化２「打ち切る」" をしながら組み合わせを求める。
 *
 * bulksSet の bulks は、スキルポイントの合計の降順でソート済みの前提。
 */
Combinator.prototype._combine = function (skillNames, bulksSet) {
    var borderLine = new util.BorderLine(skillNames, bulksSet);

    var combs = [ { eqcombs: [], sumSC: null } ];

    for (var i = 0, ilen = parts.length; i < ilen; ++i) {
        var part = parts[i],
            bulks = bulksSet[part];

        var seen = [];
        for (var j = 0, jlen = combs.length; j < jlen; ++j) {
            var comb = combs[j];
            var newCombs = this._combineEquip(comb, bulks, borderLine, part);
            seen = seen.concat(newCombs);

            if (this.threshold > 0 && seen.length > this.threshold) {
                seen = seen.slice(0, this.threshold);
                break;
            }
        }

        combs = this._compress(seen);

        // threshold で打ち切られた時に、できるだけ可能性の高い組み合わせを残すため
        // ソートしておく
        combs = this._sortCombs(combs);
    }

    return combs;
};

Combinator.prototype._combineEquip = function (comb, bulks, borderLine, part) {
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

        var isOverSum = util.skill.sum(sc) >= blSum;

        // bulks は合計ポイントで降順ソートされてるので
        // 合計ポイントが超えてなければ、以降の組み合わせでもダメ
        if (!isOverSum) break;

        var isOverEach = util.comb.isOver(blEach, sc);

        // 頑シミュさんの「打ち切る」は、処理対象のデータとして push しないことで実現
        if (!isOverEach) continue;

        ret.push(this._newComb(comb, bulk, part));
    }

    return ret;
};

Combinator.prototype._combineTorsoUp = function (comb, bulk, borderLine, part) {
    var ret = [];

    var blSum = borderLine.calcSum(part, comb.sumSC),
        blEach = borderLine.calcEach(part, comb.sumSC);

    for (var i = 0, len = comb.eqcombs.length; i < len; ++i) {
        var eqcomb = comb.eqcombs[i],
            bodySC = eqcomb.bodySC || {};

        var isOverSum  = util.skill.sum(bodySC) >= blSum,
            isOverEach = util.comb.isOver(blEach, bodySC);

        if (!isOverSum || !isOverEach) continue;

        var cloned = util.clone(eqcomb);
        cloned[part] = bulk.equips;

        var newComb = {
            eqcombs: [ cloned ],
            sumSC  : util.skill.merge(comb.sumSC, bodySC)
        };
        ret.push(newComb);
    }

    return ret;
};

Combinator.prototype._newComb = function (comb, bulk, part) {
    comb = comb || { eqcombs: [], sumSC: null };
    bulk = bulk || {};

    var srcEqcombs = comb.eqcombs;
    if (srcEqcombs.length === 0) srcEqcombs = [ {} ];

    var eqcombs = [];
    for (var i = 0, len = srcEqcombs.length; i < len; ++i) {
        var src    = srcEqcombs[i],
            eqcomb = this._newEqcomb(src, bulk, part);
        eqcombs.push(eqcomb);
    }

    var ret = {
        eqcombs: eqcombs,
        sumSC  : util.skill.merge(comb.sumSC, bulk.skillComb)
    };
    return ret;
};

// hidden class のためにコンストラクタ用意してみたけど速さ変わんなかった
//var Eqcomb = function (eqcomb) {
//    this.head   = null;
//    this.body   = null;
//    this.arm    = null;
//    this.waist  = null;
//    this.weapon = null;
//    this.oma    = null;
//    this.bodySC = null;
//
//    for (var part in eqcomb) {
//        if (eqcomb[part] == null) continue;
//        this[part] = eqcomb[part];
//    }
//};
Combinator.prototype._newEqcomb = function (eqcomb, bulk, part) {
    //var ret = new Eqcomb(eqcomb);
    var ret = util.clone(eqcomb);
    ret[part] = bulk.equips || [];

    if (part === 'body') ret.bodySC = bulk.skillComb;

    return ret;
};

/**
 * combs を圧縮する。
 *
 * 以下の処理をすることで圧縮する。
 * + combs を comb の sumSC でユニークにすることで数を減らす
 * + ユニークにする際、eqcombs をまとめる
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

        // eqcombs をまとめる
        bucket[key].eqcombs = bucket[key].eqcombs.concat(comb.eqcombs);
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

/**
 * combs を comb の sumSC の合計ポイントの降順でソートする。
 */
Combinator.prototype._sortCombs = function (combs) {
    var bucket = {},
        i, len, sum;
    for (i = 0, len = combs.length; i < len; ++i) {
        var comb = combs[i];

        sum = util.skill.sum(comb.sumSC);

        if (bucket[sum] == null) bucket[sum] = [];
        bucket[sum].push(comb);
    }

    var sorted = Object.keys(bucket).sort(function (a, b) { return b - a; });

    var ret = [];
    for (i = 0, len = sorted.length; i < len; ++i) {
        sum = sorted[i];
        ret = ret.concat(bucket[sum]);
    }

    return ret;
};

Combinator.prototype._brushUp = function (combs) {
    var eqcombs = [],
        i, ilen;
    for (i = 0, ilen = combs.length; i < ilen; ++i) {
        eqcombs = eqcombs.concat(combs[i].eqcombs);
    }

    var ret = [];
    for (i = 0, ilen = eqcombs.length; i < ilen; ++i) {
        var eqcomb  = eqcombs[i],
            brushed = {};
        for (var j = 0, jlen = parts.length; j < jlen; ++j) {
            var part = parts[j];
            brushed[part] = eqcomb[part] || [];
        }
        ret.push(brushed);
    }
    return ret;
};

module.exports = Combinator;
