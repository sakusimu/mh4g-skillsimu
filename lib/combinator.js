(function (define) {
'use strict';
define([ './namespace.js', './skill.js' ] , function (simu, Skill) {

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
 *                { skillComb: { '攻撃': 0, '斬れ味': 0, '胴系統倍化': 1 },
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
    // この順番で組み合わせを試していく(胴系統倍化のため body が先頭)
    this.parts = [ 'body', 'head', 'arm', 'waist', 'leg', 'weapon' ];

    this.result    = null;
    this.count     = 0;    // 組み合わせ数をカウント
    this.threshold = 1000; // 組み合わせ数がこの閾値を超えたら打ち切り
};

/**
 * 引数の正規化されたスキルの組み合わせを元に、条件となるスキルの発動を満たす
 * スキルポイントの組み合わせを返す。
 */
Combinator.prototype.combine = function (skillNames, norCombsSet) {
    if (skillNames == null || skillNames.length === 0) return [];
    if (norCombsSet == null || norCombsSet.body == null) return [];

    var i, ilen, j, jlen, part, set;

    this.initialize();

    for (part in norCombsSet) {
        norCombsSet[part] = this._sort(norCombsSet[part]);
    }

    var goal       = this._goal(skillNames);
    var borderLine = this._calcBorderLine(norCombsSet, goal);

    var sets      = [],
        restParts = this.parts.slice(1); // body を除く残り

    for (i = 0, ilen = norCombsSet.body.length; i < ilen; ++i) {
        var bodyComb = norCombsSet.body[i];
        var newSets = [ [ bodyComb ] ];

        for (j = 0, jlen = restParts.length; j < jlen; ++j) {
            part     = restParts[j];
            var norCombs = norCombsSet[part],
                seen     = [];
            for (var k = 0, klen = newSets.length; k < klen; ++k) {
                set = newSets[k];
                set = this._combine(set, norCombs, borderLine, part);
                seen = seen.concat(set);
            }
            newSets = seen;
        }

        sets = sets.concat(newSets);
        this.count += newSets.length;

        if (this.count >= this.threshold) break;
    }

    var ret = [];
    for (i = 0, ilen = sets.length; i < ilen; ++i) {
        set = sets[i];
        var hash = {};
        for (j = 0, jlen = this.parts.length; j < jlen; ++j) {
            hash[this.parts[j]] = set[j];
        }
        ret.push(hash);
    }

    return this.result = ret;
};

/**
 * 検索条件となるスキルから必要なスキル系統のポイントを返す。
 *
 * e.g.
 *     _goal([ '攻撃力UP【大】', '業物' ]);
 *     => { '攻撃': 20, '斬れ味': 10 }
 */
Combinator.prototype._goal = function (skillNames) {
    if (skillNames == null || skillNames.length === 0) return null;

    var goal = {};
    for (var i = 0, len = skillNames.length; i < len; ++i) {
        var skill = Skill.get(skillNames[i]);
        goal[skill.tree] = skill.point;
    }

    return goal;
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

/**
 * 部位ごとに、組み合わせを考える時に必要なスキルの個別ポイントと
 * 合計ポイントを計算。
 */
Combinator.prototype._calcBorderLine = function (norCombsSet, goal) {
    var i, len, part, restPt;

    var maxSkill = this._calcMaxSkillPoints(norCombsSet),
        maxSum   = this._calcMaxSumPoints(norCombsSet),
        goalSum  = Skill.sum(goal);

    // 個別ポイントのボーダーラインを設定
    var ret = {};
    for (i = 0, len = this.parts.length; i < len; ++i) {
        part = this.parts[i];
        ret[part] = {};
        for (var skillName in maxSkill) {
            var maxPtSet = maxSkill[skillName];
            delete maxSkill[skillName][part];
            if (ret[part][skillName] === undefined) {
                ret[part][skillName] = goal[skillName];
            }
            restPt = Skill.sum(maxPtSet);
            ret[part][skillName] -= restPt;
        }
    }

    // 合計のボーダーラインを設定
    ret.sum = {};
    for (i = 0, len = this.parts.length; i < len; ++i) {
        part = this.parts[i];
        delete maxSum[part];
        ret.sum[part] = goalSum;
        restPt = Skill.sum(maxSum);
        ret.sum[part] -= restPt;
    }

    return ret;
};

/**
 * 部位ごとに、各スキルの取り得る最大ポイントを計算。
 */
Combinator.prototype._calcMaxSkillPoints = function (norCombsSet) {
    if (norCombsSet == null) return null;

    var part, maxPt, skillName;
    var msp = {};

    for (var i = 0, ilen = this.parts.length; i < ilen; ++i) {
        part  = this.parts[i];
        var combs = norCombsSet[part],
            max   = {};
        for (var j = 0, jlen = combs.length; j < jlen; ++j) {
            var skillComb = combs[j].skillComb;
            if (skillComb['胴系統倍化'] > 0) skillComb = msp.body;
            for (skillName in skillComb) {
                if (skillName === '胴系統倍化') continue;
                var point = skillComb[skillName];
                maxPt = max[skillName] || 0;
                max[skillName] = point >  maxPt ? point : maxPt;
            }
        }
        msp[part] = max;
    }

    // 扱いやすいようにデータの形を変える
    var ret = {};
    for (part in msp) {
        maxPt = msp[part];
        for (skillName in maxPt) {
            var pt = maxPt[skillName];
            if (ret[skillName] === undefined) ret[skillName] = {};
            ret[skillName][part] = pt;
        }
    }

    return ret;
};

/**
 * 部位ごとに、最大の合計ポイントを計算。
 */
Combinator.prototype._calcMaxSumPoints = function (norCombsSet) {
    var maxSum = {};
    for (var i = 0, ilen = this.parts.length; i < ilen; ++i) {
        var part = this.parts[i];
        var combs = norCombsSet[part],
            sum   = 0;
        for (var j = 0, jlen = combs.length; j < jlen; ++j) {
            var comb      = combs[j];
            var skillComb = comb.skillComb;
            var newSum    = skillComb['胴系統倍化'] > 0 ? maxSum.body : Skill.sum(skillComb);
            sum = newSum > sum ? newSum : sum;
        }

        maxSum[part] = sum;
    }

    return maxSum;
};

/**
 * 頑シミュさんの "高速化２「打ち切る」" をしながら組み合わせを求める。
 *
 * norCombs は、スキルポイントの合計の降順でソート済みの前提。
 */
Combinator.prototype._combine = function (set, norCombs, borderLine, part) {
    if (set == null) set = [];

    var i, ilen, len;
    var dupliComb = part !== 'body' ? set[0].skillComb : null; // 胴系統倍化

    var list = [];
    for (i = 0, len = set.length; i < len; ++i) {
        var sc = set[i].skillComb;
        if (sc['胴系統倍化'] > 0) sc = dupliComb;
        list.push(sc);
    }
    var mergedComb = Skill.merge(list);

    var ret = [];
    for (i = 0, ilen = norCombs.length; i < ilen; ++i) {
        var norComb = norCombs[i], skillComb = norComb.skillComb;
        if (skillComb['胴系統倍化'] > 0) skillComb = dupliComb;
        var isBeyondMaxSum =
                this._isBeyondMaxSum(mergedComb, skillComb, borderLine, part);


        // 合計ポイントで降順ソートされてるので
        // 合計ポイントが超えてなければ、以降の組み合わせでもダメ
        // (ただし slot0 と 胴系統倍化は中断しない)
        if (!isBeyondMaxSum &&
            !(i < 2 && (contains(norComb.equips, 'slot0') ||
                        norComb.skillComb['胴系統倍化'] > 0))) break;

        var isBeyondMaxSkill =
                this._isBeyondMaxSkill(mergedComb, skillComb, borderLine, part);

        // 頑シミュさんの「打ち切る」は、処理対象のデータとして push しないことで実現
        if (isBeyondMaxSum && isBeyondMaxSkill) ret.push(set.concat(norComb));
    }

    return ret;
};

Combinator.prototype._isBeyondMaxSkill = function (mergedComb, skillComb, borderLine, part) {
    for (var skillName in borderLine[part]) {
        var borderLinePt = borderLine[part][skillName];
        var currentPt = mergedComb[skillName] || 0;
        currentPt += skillComb[skillName];
        if (borderLinePt > currentPt) return false;
    }
    return true;
};

Combinator.prototype._isBeyondMaxSum = function (mergedComb, skillComb, borderLine, part) {
    var currentSum = Skill.sum(mergedComb) + Skill.sum(skillComb);
    return borderLine.sum[part] <= currentSum;
};

return simu.Combinator = Combinator;
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
           factory(this.simu, this.simu.Skill);
       }
);
