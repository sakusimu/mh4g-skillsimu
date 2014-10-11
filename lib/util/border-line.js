'use strict';
var util = require('./util.js'),
    sutil = require('./skill.js');

/**
 * Equip.Combinator で使うボーダーラインを計算するクラス。
 */
var BorderLine = function () {
    this.initialize.apply(this, arguments);
};

BorderLine.prototype.initialize = function (skillNames, bulksSet, subtracted) {
    this.goal    = this._goal(skillNames, subtracted);
    this.goalSum = sutil.sum(this.goal);

    this.eachSkill = this._calcMaxEachSkillPoint(bulksSet);
    this.maxSumSet = this._calcMaxSumSkillPoint(bulksSet);
};

// 胴系統倍加を処理しやすくするため body が先頭にきた各部位の配列
var parts = [ 'body', 'head', 'arm', 'waist', 'leg', 'weapon', 'oma' ];

/**
 * 検索条件となるスキルから必要なスキル系統のポイントを返す。
 *
 * e.g.
 *     _goal([ '攻撃力UP【大】', '業物' ]);
 *     => { '攻撃': 20, '斬れ味': 10 }
 */
BorderLine.prototype._goal = function (skillNames, subtracted) {
    if (skillNames == null || skillNames.length === 0) return null;
    subtracted = subtracted || {};

    var goal = {};
    for (var i = 0, len = skillNames.length; i < len; ++i) {
        var name  = skillNames[i],
            skill = sutil.get(name);
        if (skill == null) throw new Error ('skill not found: ' + name);
        var subPt = subtracted[skill.tree] || 0;
        goal[skill.tree] = skill.point - subPt;
    }

    return goal;
};

/**
 * 部位ごとに、各スキルの取り得る最大ポイントを計算。
 */
BorderLine.prototype._calcMaxEachSkillPoint = function (bulksSet) {
    if (bulksSet == null) return null;

    var part, tree, maxSC;

    var buckets = {}; // bulksSet 内にあった全てのスキル名(胴系統倍加を除く)を覚えておく
    var maxSkillCombSet = {}; // 各部位ごとに最大ポイントのスキルを保持

    for (var i = 0, ilen = parts.length; i < ilen; ++i) {
        part = parts[i];
        var combs = bulksSet[part] || [];

        maxSC = {};
        for (var j = 0, jlen = combs.length; j < jlen; ++j) {
            var skillComb = combs[j].skillComb;

            // 胴系統倍加があったら他のスキルは付かない(付いてても無視して良い)前提
            if (sutil.hasTorsoUp(skillComb)) skillComb = maxSkillCombSet.body;

            for (tree in skillComb) {
                if (sutil.isTorsoUp(tree)) continue;
                buckets[tree] = true;
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
        for (tree in buckets) {
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
BorderLine.prototype._calcMaxSumSkillPoint = function (bulksSet) {
    if (bulksSet == null) return null;

    var msspSet = {}; // mssp: max sum skill point

    for (var i = 0, ilen = parts.length; i < ilen; ++i) {
        var part  = parts[i],
            combs = bulksSet[part] || [];

        var sum = 0;
        for (var j = 0, jlen = combs.length; j < jlen; ++j) {
            var skillComb = combs[j].skillComb,
                curSum    = sutil.sum(skillComb);

            // 胴系統倍加があったら他のスキルは付かない(付いてても無視して良い)前提
            if (sutil.hasTorsoUp(skillComb)) curSum = msspSet.body;

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
    var curSum = util.isObject(skillComb) ? sutil.sum(skillComb) : skillComb;

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

module.exports = BorderLine;
