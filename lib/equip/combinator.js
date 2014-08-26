(function (define) {
'use strict';
var deps = [ '../equip.js', '../util.js', '../util/skill.js',
             '../util/comb.js', '../util/border-line.js' ];
define(deps, function (Equip, Util, Skill, Comb, BorderLine) {

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

var parts = Comb.parts;

/**
 * 引数の正規化されたスキルの組み合わせを元に、条件となるスキルの発動を満たす
 * スキルポイントの組み合わせを返す。
 */
Combinator.prototype.combine = function (skillNames, norCombsSet) {
    if (skillNames == null || skillNames.length === 0) return [];
    if (norCombsSet == null || norCombsSet.body == null) return [];

    for (var part in norCombsSet) {
        if (norCombsSet[part] == null) continue;
        norCombsSet[part] = this._sortCombs(norCombsSet[part]);
    }

    var combSets, ret;

    combSets = this._combineUsedSlot0(skillNames, norCombsSet);
    ret = Comb.brushUp(combSets);

    if (ret.length) return ret;

    combSets = this._combine(skillNames, norCombsSet);
    ret = Comb.brushUp(combSets);

    return ret;
};

/**
 * 正規化されたスキルの組み合わせを、スキルポイントの合計の降順でソートする。
 * (ただし、胴系統倍化は先頭にする)
 */
Combinator.prototype._sortCombs = function (combs) {
    var i, len, comb, sum;

    // 合計ポイントでスキルの組み合わせをまとめる
    var buckets = {};
    for (i = 0, len = combs.length; i < len; ++i) {
        comb = combs[i];
        sum  = Skill.sum(comb.skillComb);
        if (buckets[sum] == null) buckets[sum] = [];
        buckets[sum].push(comb);
    }

    // 胴系統倍化があったら、まず追加する処理
    // (胴系統倍化は、合計ポイントが 0 になるので、最初に if で絞ってる)
    var ret = [];
    if (buckets[0] != null) {
        var sum0Combs = buckets[0],
            torsoUpComb;
        for (i = sum0Combs.length - 1; 0 <= i; --i) {
            comb = sum0Combs[i];
            if (comb.skillComb['胴系統倍化']) {
                torsoUpComb = sum0Combs.splice(i, 1);
                break;
            }
        }
        if (torsoUpComb) ret = ret.concat(torsoUpComb);
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
Combinator.prototype._combineUsedSlot0 = function (skillNames, norCombsSet) {
    var combsSets = this._makeCombsSetWithSlot0(norCombsSet);

    var ret = [];
    for (var i = 0, len = combsSets.length; i < len; ++i) {
        var combsSet = combsSets[i],
            combSets = this._combine(skillNames, combsSet);
        ret = ret.concat(combSets);

        if (ret.length) return ret;
        //if (ret.length > this.threshold) return ret.slice(0, this.threshold);
    }

    return ret;
};

Combinator.prototype._makeCombsSetWithSlot0 = function (norCombsSet) {
    var i, len, part, comb;

    // slot0 を含む組み合わせを見つける
    var slot0Set = {};
    for (part in norCombsSet) {
        var combs = norCombsSet[part];
        if (combs == null) continue;

        for (i = 0, len = combs.length; i < len; ++i) {
            comb = combs[i];
            if (contains(comb.equips, 'slot0')) {
                slot0Set[part] = comb;
                break;
            }
        }
    }

    var slot0Parts = Object.keys(slot0Set);
    if (slot0Parts.length === 0) return [];

    // slot0 を使った組み合わせ
    var combsSets = [];
    for (part in slot0Set) {
        var combsSet = {};
        combsSet[part] = [ slot0Set[part] ];
        for (i = 0, len = parts.length; i < len; ++i) {
            if (part === parts[i]) continue;
            var restPart = parts[i];
            combsSet[restPart] = norCombsSet[restPart] || null;
        }
        combsSets.push(combsSet);
    }

    return combsSets;
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
 * norCombsSet の要素の combs は、スキルポイントの合計の降順でソート済みの前提。
 */
Combinator.prototype._combine = function (skillNames, norCombsSet) {
    var borderLine = new BorderLine(skillNames, norCombsSet);

    var combSets = [ { cache: null } ];

    for (var i = 0, ilen = parts.length; i < ilen; ++i) {
        var part = parts[i],
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
    combSet = combSet || {};

    var ret = [];

    if (combs == null || combs.length === 0) {
        combSet[part] = null;
        ret.push(combSet);
        return ret;
    }

    var blSum  = borderLine.calcSum(part, combSet.cache || 0),
        blEach = borderLine.calcEach(part, combSet.cache),
        bodySC = combSet.body ? combSet.body.skillComb : {}; // 胴系統倍化

    for (var i = 0, len = combs.length; i < len; ++i) {
        var comb      = combs[i],
            skillComb = comb.skillComb;

        if (skillComb['胴系統倍化']) skillComb = bodySC;

        var isOverSum = Skill.sum(skillComb) >= blSum;

        // combs は合計ポイントで降順ソートされてるので
        // 合計ポイントが超えてなければ、以降の組み合わせでもダメ
        // (ただし胴系統倍化は中断しない)
        if (!isOverSum && !(i === 0 && !!comb.skillComb['胴系統倍化'])) break;

        var isOverEach = Comb.isOver(blEach, skillComb);

        // 頑シミュさんの「打ち切る」は、処理対象のデータとして push しないことで実現
        if (!isOverSum || !isOverEach) continue;

        var set = Util.clone(combSet);
        set.cache = Skill.merge(combSet.cache, skillComb);
        set[part] = comb;
        ret.push(set);
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
           factory(this.simu.Equip, this.simu.Util, this.simu.Util.Skill,
                   this.simu.Util.Comb, this.simu.Util.BorderLine);
       }
);
