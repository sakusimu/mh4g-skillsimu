(function (define) {
'use strict';
define([ '../util.js', '../util/skill.js' ], function (Util, Skill) {

/**
 * Combinator で使うボーダーラインを計算するクラス。
 */
var BorderLine = function () {
    this.initialize.apply(this, arguments);
};

BorderLine.prototype.initialize = function (skillNames, combsSet) {
    this.goal    = this._goal(skillNames);
    this.goalSum = Skill.sum(this.goal);

    this.eachSkill = this._calcMaxEachSkillPoint(combsSet);
    this.maxSumSet = this._calcMaxSumSkillPoint(combsSet);
};

// 胴系統倍化を処理しやすくするため body が先頭にきた各部位の配列
var parts = [ 'body', 'head', 'arm', 'waist', 'leg', 'weapon', 'oma' ];

/**
 * 検索条件となるスキルから必要なスキル系統のポイントを返す。
 *
 * e.g.
 *     goal([ '攻撃力UP【大】', '業物' ]);
 *     => { '攻撃': 20, '斬れ味': 10 }
 */
BorderLine.prototype._goal = function (skillNames) {
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

/**
 * 部位ごとに、各スキルの取り得る最大ポイントを計算。
 */
BorderLine.prototype._calcMaxEachSkillPoint = function (combsSet) {
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
BorderLine.prototype._calcMaxSumSkillPoint = function (combsSet) {
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
 * 現在のスキルと残りの部位で想定し得る最大値から、必要なボーダーラインとなる
 * 個別ポイントを計算。
 */
BorderLine.prototype.calcEach = function (curPart, skillComb) {
    skillComb = skillComb || {};

    var index = parts.indexOf(curPart);
    if (index === -1) throw new Error('unknown part:' + curPart);
    var start = index + 1;

    var ret = {};
    for (var tree in this.eachSkill) {
        var point = this.goal[tree] - (skillComb[tree] || 0);

        var maxPtSet = this.eachSkill[tree];
        for (var i = start, len = parts.length; i < len; ++i) {
            var restPart = parts[i];
            point -= maxPtSet[restPart];
        }

        ret[tree] = point;
    }

    return ret;
};

/**
 * 現在のスキルと残りの部位で想定し得る最大値から、必要なボーダーラインとなる
 * 合計ポイントを計算。
 */
BorderLine.prototype.calcSum = function (curPart, skillComb) {
    var curSum = Util.isObject(skillComb) ? Skill.sum(skillComb) : skillComb;

    var index = parts.indexOf(curPart);
    if (index === -1) throw new Error('unknown part:' + curPart);
    var start = index + 1;

    var ret = null;
    ret = this.goalSum - curSum;
    for (var i = start, len = parts.length; i < len; ++i) {
        var restPart = parts[i];
        ret -= this.maxSumSet[restPart];
    }

    return ret;
};

return Util.BorderLine = BorderLine;
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
