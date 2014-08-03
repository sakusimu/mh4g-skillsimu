(function (define) {
'use strict';
var deps = [ '../equip.js', '../util.js', '../util/skill.js', '../util/comb.js' ];
define(deps, function (Equip, Util, Skill, Comb) {

/**
 * 正規化されたスキルの組み合わせを元に、条件となるスキルの発動を満たす
 * スキルポイントの組み合わせを求めるクラス。
 *
 * 頑シミュさんの "高速化２「打ち切る」" をしながら組み合わせを求める。
 *
 * 概要
 *     var c = new Combinator();
 *     var norCombsSet // Normalizer で normalize([ '攻撃力UP【大】', '業物' ]) した結果
 *         = { head:
 *              [ { skillComb: { '攻撃': 0, '斬れ味': 0 },
 *                  equips: [ 'slot0', 'ブナハキャップ', 'ブナハＳハット',
 *                            '高級ユアミタオル', 'ダマスクヘルム' ] },
 *                { skillComb: { '攻撃': -1, '斬れ味': 1 },
 *                  equips: [ 'ブナハキャップ' ] },
 *                { skillComb: { '攻撃': 1, '斬れ味': -1 },
 *                  equips: [ 'ダマスクヘルム' ] },
 *                { skillComb: { '攻撃': 1, '斬れ味': 0 },
 *                  equips: [ 'slot1' ] },
 *                { skillComb: { '攻撃': 0, '斬れ味': 1 },
 *                  equips: [ 'slot1', 'ブナハＳキャップ' ] },
 *                { skillComb: { '胴系統倍化': 1 },
 *                  equips: [ 'スカルフェイス', 'スカルＳフェイス' ] },
 *                { skillComb: { '攻撃': -1, '斬れ味': 2 },
 *                  equips: [ 'ブナハＳキャップ' ] },
 *                { skillComb: { '攻撃': 3, '斬れ味': -2 },
 *                  equips: [ 'ダマスクヘルム' ] },
 *                { skillComb: { '攻撃': 2, '斬れ味': 0 },
 *                  equips: [ 'バギィヘルム', 'ブナハＳキャップ' ] },
 *                ... ],
 *             body:
 *              [ ... ],
 *             arm:
 *              [ ... ],
 *             waist:
 *              [ ... ],
 *             leg:
 *              [ ... ],
 *             weapon:
 *              [ ... ] };
 *     c.combine(norCombsSet, [ '攻撃力UP【大】', '業物' ]);
 *     => [ { head:
 *             { skillComb: { '攻撃': 5, '斬れ味': 3 },
 *               equips: [ 'シルバーソルヘルム' ] },
 *            body:
 *             { skillComb: { '攻撃': 0, '斬れ味': 0 },
 *               equips: [ 'slot0', '大和【胴当て】' ] },
 *            arm:
 *             { skillComb: { '攻撃': 7, '斬れ味': 1 },
 *               equips: [ 'シルバーソルアーム' ] },
 *            waist:
 *             { skillComb: { '攻撃': 5, '斬れ味': 3 },
 *               equips: [ 'シルバーソルコイル' ] },
 *            leg:
 *             { skillComb: { '攻撃': 5, '斬れ味': 3 },
 *               equips: [ 'シルバーソルグリーヴ' ] },
 *            weapon:
 *             { skillComb: { '攻撃': 0, '斬れ味': 0 },
 *               equips: [ 'slot0' ] } },
 *          { head:
 *             { skillComb: { '攻撃': 5, '斬れ味': 3 },
 *               equips: [ 'シルバーソルヘルム' ] },
 *            body:
 *             { skillComb: { '攻撃': 0, '斬れ味': 0 },
 *               equips: [ 'slot0', '大和【胴当て】' ] },
 *            arm:
 *             { skillComb: { '攻撃': 7, '斬れ味': 1 },
 *               equips: [ 'シルバーソルアーム' ] },
 *            waist:
 *             { skillComb: { '攻撃': 5, '斬れ味': 3 },
 *               equips: [ 'シルバーソルコイル' ] },
 *            leg:
 *             { skillComb: { '攻撃': 3, '斬れ味': 4 },
 *               equips: [ 'シルバーソルグリーヴ' ] },
 *            weapon:
 *             { skillComb: { '攻撃': 0, '斬れ味': 0 },
 *               equips: [ 'slot0' ] } },
 *          ... ]
 */
var Combinator = function () {
    this.initialize.apply(this, arguments);
};

Combinator.prototype.initialize = function () {
    this.threshold = 9999; // 組み合わせ数がこの閾値を超えたら打ち切り
};

var parts = Util.parts;

/**
 * 引数の正規化されたスキルの組み合わせを元に、条件となるスキルの発動を満たす
 * スキルポイントの組み合わせを返す。
 */
Combinator.prototype.combine = function (skillNames, norCombsSet) {
    if (skillNames == null || skillNames.length === 0) return [];
    if (norCombsSet == null || norCombsSet.body == null) return [];

    this.initialize();

    for (var part in norCombsSet) {
        if (norCombsSet[part] == null) continue;
        norCombsSet[part] = this._sort(norCombsSet[part]);
    }

    var borderLine = Comb.calcBorderLine(norCombsSet, skillNames);

    var combSets = this._combine(norCombsSet, borderLine);

    var ret = Comb.brushUp(combSets);

    return ret;
};

/**
 * 正規化されたスキルの組み合わせを、スキルポイントの合計の降順でソートする。
 * (ただし、合計 0 の slot0 がある場合は slot0 が先頭となる)
 */
Combinator.prototype._sort = function (norCombs) {
    var i, len, comb;

    // 合計ポイントでスキルの組み合わせをまとめる
    var buckets = {};
    for (i = 0, len = norCombs.length; i < len; ++i) {
        comb = norCombs[i];
        var sum  = Skill.sum(comb.skillComb);
        if (buckets[sum] == null) buckets[sum] = [];
        buckets[sum].push(comb);
    }

    var ret = [];

    // slot0 や 胴系統倍化があったら、まず追加する処理
    // (slot0 や胴系統倍化は、合計ポイントが 0 になるので、最初に if で絞ってる)
    if (buckets[0] != null) {
        var combs = buckets[0],
            dupliComb, slot0Comb;
        for (i = combs.length - 1; 0 <= i; --i) {
            comb = combs[i];
            if (dupliComb == null && comb.skillComb['胴系統倍化'] > 0) {
                dupliComb = combs.splice(i, 1);
            }
            else if (slot0Comb == null && contains(comb.equips, 'slot0')) {
                slot0Comb = combs.splice(i, 1);
            }
        }

        if (slot0Comb) ret = ret.concat(slot0Comb);
        if (dupliComb) ret = ret.concat(dupliComb);
    }

    var keys = [];
    for (var key in buckets) keys[keys.length] = key;

    keys.sort(function (a, b) { return b - a; });

    for (i = 0, len = keys.length; i < len; ++i) {
        ret = ret.concat(buckets[keys[i]]);
    }

    return ret;
};

var contains = function (list, target) {
    if (list == null || list.length === 0) return false;

    if (list.indexOf) return list.indexOf(target) !== -1;

    for (var i = 0, len = list.length; i < len; ++i) {
        if (list[i] === target) return true;
    }
    return false;
};

/**
 * 頑シミュさんの "高速化２「打ち切る」" をしながら組み合わせを求める。
 *
 * norCombs は、スキルポイントの合計の降順でソート済みの前提。
 */
Combinator.prototype._combine = function (norCombsSet, borderLine) {
    var combSets = [ { cache: null } ];

    for (var i = 0, ilen = parts.length; i < ilen; ++i) {
        var part  = parts[i],
            combs = norCombsSet[part];

        var seen = [];
        for (var j = 0, jlen = combSets.length; j < jlen; ++j) {
            var combSet = combSets[j];
            var sets = this._combineEquip(combSet, combs, borderLine, part);
            seen = seen.concat(sets);

            if (seen.length > this.threshold) {
                seen = seen.slice(0, this.threshold);
                break;
            }
        }
        combSets = seen;
    }

    return combSets;
};

Combinator.prototype._combineEquip = function (combSet, combs, borderLine, part) {
    if (combSet == null) combSet = {};

    var bodySC = combSet.body ? combSet.body.skillComb : {}, // 胴系統倍化
        ret    = [];

    if (combs == null || combs.length === 0) {
        combSet[part] = null;
        ret.push(combSet);
        return ret;
    }

    for (var i = 0, len = combs.length; i < len; ++i) {
        var comb      = combs[i],
            skillComb = comb.skillComb;

        if (skillComb['胴系統倍化']) skillComb = bodySC;

        var sc = Skill.merge(combSet.cache, skillComb);

        var isOverMaxSum = Comb.isOverMaxSumSkill(sc, borderLine, part);

        // 合計ポイントで降順ソートされてるので
        // 合計ポイントが超えてなければ、以降の組み合わせでもダメ
        // (ただし slot0 と 胴系統倍化は中断しない)
        if (!isOverMaxSum &&
            !(i < 2 && (contains(comb.equips, 'slot0') ||
                        comb.skillComb['胴系統倍化'] > 0))) break;

        var isOverMaxEach = Comb.isOverMaxEachSkill(sc, borderLine, part);

        var set = Util.clone(combSet);
        set.cache = sc;
        set[part] = comb;

        // 頑シミュさんの「打ち切る」は、処理対象のデータとして push しないことで実現
        if (isOverMaxSum && isOverMaxEach) ret.push(set);
    }

    return ret;
};

return Equip.Combinator = Combinator;
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
           factory(this.simu.Equip, this.simu.Util, this.simu.Util.Skill, this.simu.Util.Comb);
       }
);
