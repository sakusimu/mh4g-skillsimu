(function (define) {
'use strict';
define([ '../util.js', '../util/skill.js' ], function (Util, Skill) {

/**
 * Combinator で使う関数を提供するクラス。
 */
var Comb = {};

var parts = Util.parts;

/**
 * 部位ごとに、組み合わせを考える時に必要なスキルの個別ポイントと
 * 合計ポイントを計算。
 */
Comb.calcBorderLine = function (combsSet, skillNames) {
    var i, len, part, restPt,
        ret = {};

    var maxSkill = this._calcMaxSkillPoint(combsSet),
        msspSet  = this._calcMaxSumSkillPoint(combsSet);

    var goal     = this.goal(skillNames),
        goalSum  = Skill.sum(goal);

    // 個別ポイントのボーダーラインを設定
    for (i = 0, len = parts.length; i < len; ++i) {
        part = parts[i];
        ret[part] = {};
        for (var tree in maxSkill) {
            var mspSet = maxSkill[tree];
            delete maxSkill[tree][part];

            if (ret[part][tree] == null) ret[part][tree] = goal[tree];

            restPt = Skill.sum(mspSet);
            ret[part][tree] -= restPt;
        }
    }

    // 合計のボーダーラインを設定
    ret.sum = {};
    for (i = 0, len = parts.length; i < len; ++i) {
        part = parts[i];
        delete msspSet[part];
        ret.sum[part] = goalSum;
        restPt = Skill.sum(msspSet);
        ret.sum[part] -= restPt;
    }

    ret.goal = goal;

    return ret;
};

/**
 * 部位ごとに、各スキルの取り得る最大ポイントを計算。
 */
Comb._calcMaxSkillPoint = function (combsSet) {
    if (combsSet == null) return null;

    var part, tree,
        bucket = {}, // combsSet 内にあった全てのスキル名(胴系統倍化を除く)を覚えておく
        mspSet = {}; // msp: max skill point

    for (var i = 0, ilen = parts.length; i < ilen; ++i) {
        part = parts[i];
        var combs = combsSet[part] || [];

        var max = {};
        for (var j = 0, jlen = combs.length; j < jlen; ++j) {
            var skillComb = combs[j].skillComb;

            // 胴系統倍化があったら他のスキルは付かない(付いてても無視して良い)前提
            if (skillComb['胴系統倍化']) skillComb = mspSet.body;

            for (tree in skillComb) {
                if (tree === '胴系統倍化') continue;
                bucket[tree] = true;
                var point = skillComb[tree],
                    maxPt = max[tree] || 0;
                max[tree] = point >  maxPt ? point : maxPt;
            }
        }

        mspSet[part] = max;
    }

    // 扱いやすいようにデータの形を変える
    var ret = {};
    for (part in mspSet) {
        var msp = mspSet[part];
        for (tree in bucket) {
            var pt = msp[tree] || 0;
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
                newSum    = Skill.sum(skillComb);

            // 胴系統倍化があったら他のスキルは付かない(付いてても無視して良い)前提
            if (skillComb['胴系統倍化']) newSum = msspSet.body;

            sum = newSum > sum ? newSum : sum;
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
        if (skill == null) throw 'skill not found: ' + name;
        goal[skill.tree] = skill.point;
    }

    return goal;
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
