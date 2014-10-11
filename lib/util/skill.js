'use strict';
var data = require('../data.js'),
    util = require('./util.js');

exports.isTorsoUp = function (skillTree) {
    if (skillTree === '胴系統倍加') return true;
    if (skillTree === '胴系統倍化') return true;
    return false;
};

exports.hasTorsoUp = function (skillComb) {
    if (skillComb == null) return false;
    if (skillComb['胴系統倍加']) return true;
    if (skillComb['胴系統倍化']) return true;
    return false;
};

/**
 * skillTrees のみのスキルの組み合わせにまとめる。
 *
 * skillTrees のスキルがない場合(undefined のプロパティ)は 0 で初期化。
 * skillComb に胴系統倍加がある場合は、skillTrees に関係なく含める。
 */
exports.compact = function (skillTrees, skillComb) {
    if (!util.isArray(skillComb)) {
        return compact(skillTrees, skillComb);
    }

    var skillCombs = skillComb,
        ret = [];

    for (var i = 0, len = skillCombs.length; i < len; ++i) {
        var sc = skillCombs[i];
        ret.push(this.compact(skillTrees, sc));
    }

    if (ret.length === 0) ret = [ this.compact(skillTrees) ];

    return ret;
};
var compact = function (skillTrees, skillComb) {
    var tree,
        ret = {};

    skillTrees = skillTrees || [];
    skillComb  = skillComb  || {};

    for (var i = 0, len = skillTrees.length; i < len; ++i) {
        tree = skillTrees[i];
        ret[tree] = skillComb[tree] || 0;
    }

    for (tree in skillComb) {
        if (exports.isTorsoUp(tree)) {
            ret[tree] = skillComb[tree];
            break;
        }
    }

    return ret;
};


/**
 * スキルの組み合わせに skillTree のスキル系統が含まれていたら true 、
 * そうでなければ false を返す。
 */
exports.contains = function (skillComb, skillTree) {
    var trees = util.isArray(skillTree) ? skillTree : [ skillTree ];
    for (var combTree in skillComb) {
        for (var i = 0, len = trees.length; i < len; ++i) {
            if (combTree === trees[i]) return true;
        }
    }
    return false;
};

/**
 * スキルの名前をキーに data のスキルデータを返す。
 */
exports.get = function (name) {
    return data.skills[name] || null;
};

/**
 * スキルの組み合わせが同じか調べる。
 *
 * 前提として combA と combB は全く同じプロパティを持っていること。
 */
exports.isEqual = function (combA, combB) {
    for (var key in combA) {
        if (combA[key] !== combB[key]) return false;
    }
    return true;
};

/**
 * スキルの組み合わせのリストを結合する。
 * (胴系統倍加のポイントは加算しない)
 *
 * e.g.
 *     join([ { '攻撃': 1, '防御': -1 }, { '斬れ味': 1, '匠': -1 } ]);
 *     => { '攻撃': 1, '防御': -1, '斬れ味': 1, '匠': -1 }
 */
exports.join = function (combs) {
    combs = combs || [];
    var ret = {};
    for (var i = 0, len = combs.length; i < len; ++i) {
        var comb = combs[i];
        if (comb == null) continue;
        for (var tree in comb) {
            if (exports.isTorsoUp(tree)) {
                ret[tree] = 1;
                continue;
            }
            if (ret[tree] == null) ret[tree] = 0;
            ret[tree] += comb[tree];
        }
    }
    return ret;
};

/**
 * スキルの組み合わせをマージする。
 * (胴系統倍加のポイントは加算しない)
 *
 * e.g.
 *     merge({ '攻撃': 1, '防御': -1 }, { '斬れ味': 1, '匠': -1 });
 *     => { '攻撃': 1, '防御': -1, '斬れ味': 1, '匠': -1 }
 */
exports.merge = function (a, b) {
    return this.join([ a, b ]);
};

/**
 * スキルの組み合わせのスキルポイントを合計する。
 * (胴系統倍加のポイントは合計しない)
 *
 * e.g.
 *     sum({ '攻撃': 1, '斬れ味': 1 })
 *     => 2
 */
exports.sum = function (skillComb) {
    if (skillComb == null) return 0;
    var sum = 0;
    for (var tree in skillComb) {
        if (exports.isTorsoUp(tree)) continue;
        sum += skillComb[tree];
    }
    return sum;
};

/**
 * スキル(の名前)から対応するスキル系統を返す。
 */
exports.trees = function (skillNames) {
    var skillTrees = [];
    for (var i = 0, len = skillNames.length; i < len; ++i) {
        var name  = skillNames[i],
            skill = this.get(name);
        if (skill == null) throw new Error(name + ' is not found');
        skillTrees.push(skill.tree);
    }
    return skillTrees;
};

/**
 * セット or リストとして渡されたスキルを一つにまとめて返す。
 * (胴系統倍加も考慮)
 *
 * セットの場合のデータ構造
 *   { head: { skillComb: {}, ... }, ... }
 *
 * リストの場合のデータ構造
 *   [ { skillComb: {}, ... }, ... }
 *
 * リストの場合、最初の要素を胴として胴系統倍加を処理する。
 */
exports.unify = function (setOrList) {
    return util.isArray(setOrList) ?
        this._unifyList(setOrList) : this._unifySet(setOrList);
};
exports._unifySet = function (set) {
    var bodySC = set.body ? (set.body.skillComb || {}) : {};

    var combs = [];
    for (var part in set) {
        var skillComb = set[part] ? (set[part].skillComb || {}) : {};
        if (exports.hasTorsoUp(skillComb)) skillComb = bodySC;
        combs.push(skillComb);
    }

    return this.join(combs);
};
exports._unifyList = function (list) {
    var bodySC = list[0] ? (list[0].skillComb || {}) : {};

    var combs = [];
    for (var i = 0, len = list.length; i < len; ++i) {
        var skillComb = list[i] ? (list[i].skillComb || {}) : {};
        if (exports.hasTorsoUp(skillComb)) skillComb = bodySC;
        combs.push(skillComb);
    }

    return this.join(combs);
};
