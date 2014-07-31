(function (define) {
'use strict';
define([ '../util.js', '../util/skill.js' ], function (Util, Skill) {

/**
 * Combinator で使う関数を提供するクラス。
 */
var Comb = {};

var parts = Util.parts;

/**
 * skillComb が goal のスキルを発動しているか調べる。
 */
Comb.activates = function (skillComb, goal) {
    if (goal == null) throw new Error('goal is required');

    for (var tree in goal) {
        var goalPt = goal[tree],
            point  = skillComb[tree] || 0;
        if (point < goalPt) return false;
    }
    return true;
};

/**
 * skillComb が goal のスキルをちょうど発動しているか調べる。
 */
Comb.justActivates = function (skillComb, goal) {
    if (goal == null) throw new Error('goal is required');

    for (var tree in goal) {
        var goalPt = goal[tree],
            point  = skillComb[tree] || 0;
        if (point !== goalPt) return false;
    }
    return true;
};

/**
 * 部位ごとに、組み合わせを考える時に必要なスキルの個別ポイントと
 * 合計ポイントを計算。
 */
Comb.calcBorderLine = function (combsSet, skillNames, subtractedSet) {
    var i, len, part, restPt, tree,
        ret = {};

    var eachSkill = this._calcMaxEachSkillPoint(combsSet),
        maxSumSet = this._calcMaxSumSkillPoint(combsSet);

    var goal = this.goal(skillNames);
    if (subtractedSet) {
        var subSC = Skill.unify(subtractedSet);
        for (tree in goal) goal[tree] -= subSC[tree] || 0;
    }

    var goalSum = Skill.sum(goal);

    // 個別ポイントのボーダーラインを設定
    for (i = 0, len = parts.length; i < len; ++i) {
        part = parts[i];
        ret[part] = {};
        for (tree in eachSkill) {
            var maxPtSet = eachSkill[tree];
            delete eachSkill[tree][part];

            if (ret[part][tree] == null) ret[part][tree] = goal[tree];

            restPt = Skill.sum(maxPtSet);
            ret[part][tree] -= restPt;
        }
    }

    // 合計のボーダーラインを設定
    ret.sum = {};
    for (i = 0, len = parts.length; i < len; ++i) {
        part = parts[i];
        delete maxSumSet[part];
        ret.sum[part] = goalSum;
        restPt = Skill.sum(maxSumSet);
        ret.sum[part] -= restPt;
    }

    ret.goal = goal;

    return ret;
};

/**
 * 部位ごとに、各スキルの取り得る最大ポイントを計算。
 */
Comb._calcMaxEachSkillPoint = function (combsSet) {
    if (combsSet == null) return null;

    var part, tree, maxSC;

    var bucket = {}; // combsSet 内にあった全てのスキル名(胴系統倍化を除く)を覚えておく
    var maxSkillCombSet = {}; // 各部位ごとに最大ポイントのスキルを保持

    for (var i = 0, ilen = parts.length; i < ilen; ++i) {
        part = parts[i];
        var combs = combsSet[part] || [];

        maxSC = {};
        for (var j = 0, jlen = combs.length; j < jlen; ++j) {
            var skillComb = combs[j].skillComb;

            // 胴系統倍化があったら他のスキルは付かない(付いてても無視して良い)前提
            if (skillComb['胴系統倍化']) skillComb = maxSkillCombSet.body;

            for (tree in skillComb) {
                if (tree === '胴系統倍化') continue;
                bucket[tree] = true;
                var point = skillComb[tree],
                    maxPt = maxSC[tree] || 0;
                maxSC[tree] = point >  maxPt ? point : maxPt;
            }
        }

        maxSkillCombSet[part] = maxSC;
    }

    // 扱いやすいようにデータの形を変える
    // { head: { '攻撃': 10, ... }, ... } -> { '攻撃': { head: 10, ... }, ... }
    var ret = {};
    for (part in maxSkillCombSet) {
        maxSC = maxSkillCombSet[part];
        for (tree in bucket) {
            var pt = maxSC[tree] || 0;
            if (ret[tree] === undefined) ret[tree] = {};
            ret[tree][part] = pt;
        }
    }

    return ret;
};

/**
 * 部位ごとに、最大の合計ポイントを計算。
 */
Comb._calcMaxSumSkillPoint = function (combsSet) {
    if (combsSet == null) return null;

    var msspSet = {}; // mssp: max sum skill point

    for (var i = 0, ilen = parts.length; i < ilen; ++i) {
        var part  = parts[i],
            combs = combsSet[part] || [];

        var sum = 0;
        for (var j = 0, jlen = combs.length; j < jlen; ++j) {
            var skillComb = combs[j].skillComb,
                curSum    = Skill.sum(skillComb);

            // 胴系統倍化があったら他のスキルは付かない(付いてても無視して良い)前提
            if (skillComb['胴系統倍化']) curSum = msspSet.body;

            sum = curSum > sum ? curSum : sum;
        }

        msspSet[part] = sum;
    }

    return msspSet;
};

/**
 * 検索条件となるスキルから必要なスキル系統のポイントを返す。
 *
 * e.g.
 *     goal([ '攻撃力UP【大】', '業物' ]);
 *     => { '攻撃': 20, '斬れ味': 10 }
 */
Comb.goal = function (skillNames) {
    if (skillNames == null || skillNames.length === 0) return null;

    var goal = {};
    for (var i = 0, len = skillNames.length; i < len; ++i) {
        var name  = skillNames[i],
            skill = Skill.get(name);
        if (skill == null) throw new Error ('skill not found: ' + name);
        goal[skill.tree] = skill.point;
    }

    return goal;
};

Comb.isOverMaxEachSkill = function (skillComb, borderLine, part) {
    var blSkillComb = borderLine[part];
    for (var tree in blSkillComb) {
        var base  = blSkillComb[tree],
            point = skillComb[tree] || 0;
        if (point < base) return false;
    }
    return true;
};

Comb.isOverMaxSumSkill = function (skillComb, borderLine, part) {
    var sum = Skill.sum(skillComb);
    return borderLine.sum[part] <= sum;
};

return Util.Comb = Comb;
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
           factory(this.simu.Util, this.simu.Util.Skill);
       }
);
