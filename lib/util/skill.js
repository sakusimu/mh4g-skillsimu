(function (define) {
'use strict';
define([ '../util.js', '../data.js' ], function (Util, data) {

var Skill = {};

/**
 * skillTrees のみのスキルの組み合わせにまとめる。
 *
 * skillTrees のスキルがない場合(undefined のプロパティ)は 0 で初期化。
 * skillComb に胴系統倍化がある場合は、skillTrees に関係なく含める。
 */
Skill.compact = function (skillTrees, skillComb) {
    if (!Util.isArray(skillComb)) {
        return compact(skillTrees, skillComb);
    }

    var skillCombs = skillComb,
        ret = [];

    for (var i = 0, len = skillCombs.length; i < len; ++i) {
        var sc = skillCombs[i];
        ret.push(Skill.compact(skillTrees, sc));
    }

    if (ret.length === 0) ret = [ Skill.compact(skillTrees) ];

    return ret;
};
var compact = function (skillTrees, skillComb) {
    var ret = {};

    skillTrees = skillTrees || [];
    skillComb  = skillComb  || {};

    for (var i = 0, len = skillTrees.length; i < len; ++i) {
        var tree = skillTrees[i];
        ret[tree] = skillComb[tree] || 0;
    }

    if (skillComb['胴系統倍化']) ret['胴系統倍化'] = skillComb['胴系統倍化'];

    return ret;
};


/**
 * スキルの組み合わせに skillTree のスキル系統が含まれていたら true 、
 * そうでなければ false を返す。
 */
Skill.contains = function (skillComb, skillTree) {
    var trees = Util.isArray(skillTree) ? skillTree : [ skillTree ];
    for (var combTree in skillComb) {
        for (var i = 0, len = trees.length; i < len; ++i) {
            if (combTree === trees[i]) return true;
        }
    }
    return false;
};

/**
 * スキルの名前をキーに Data.Skill を返す。
 */
Skill.get = function (name) {
    return data.skills[name] || null;
};

/**
 * スキルの組み合わせが同じか調べる。
 *
 * 前提として combA と combB は全く同じプロパティを持っていること。
 */
Skill.isEqual = function (combA, combB) {
    for (var key in combA) {
        if (combA[key] !== combB[key]) return false;
    }
    return true;
};

/**
 * スキルの組み合わせのリストを結合する。
 * (胴系統倍化のポイントは加算しない)
 *
 * e.g.
 *     join([ { '攻撃': 1, '防御': -1 }, { '斬れ味': 1, '匠': -1 } ]);
 *     => { '攻撃': 1, '防御': -1, '斬れ味': 1, '匠': -1 }
 */
Skill.join = function (combs) {
    combs = combs || [];
    var ret = {};
    for (var i = 0, len = combs.length; i < len; ++i) {
        var comb = combs[i];
        if (comb == null) continue;
        for (var name in comb) {
            if (name === '胴系統倍化') {
                ret[name] = 1;
                continue;
            }
            if (ret[name] == null) ret[name] = 0;
            ret[name] += comb[name];
        }
    }
    return ret;
};

/**
 * スキルの組み合わせをマージする。
 * (胴系統倍化のポイントは加算しない)
 *
 * e.g.
 *     merge({ '攻撃': 1, '防御': -1 }, { '斬れ味': 1, '匠': -1 });
 *     => { '攻撃': 1, '防御': -1, '斬れ味': 1, '匠': -1 }
 */
Skill.merge = function (a, b) {
    return this.join([ a, b ]);
};

/**
 * スキルの組み合わせのスキルポイントを合計する。
 * (胴系統倍化のポイントは合計しない)
 *
 * e.g.
 *     sum({ '攻撃': 1, '斬れ味': 1 })
 *     => 2
 */
Skill.sum = function (skillComb) {
    if (skillComb == null) return 0;
    var sum = 0;
    for (var name in skillComb) {
        if (name === '胴系統倍化') continue;
        sum += skillComb[name];
    }
    return sum;
};

/**
 * スキル(の名前)から対応するスキル系統を返す。
 */
Skill.trees = function (skillNames) {
    var skillTrees = [];
    for (var i = 0, len = skillNames.length; i < len; ++i) {
        var name  = skillNames[i];
        var skill = this.get(name);
        if (skill == null) throw new Error(name + ' is not found');
        skillTrees.push(skill.tree);
    }
    return skillTrees;
};

/**
 * セット or リストとして渡されたスキルを一つにまとめて返す。
 * (胴系統倍化も考慮)
 *
 * セットの場合のデータ構造
 *   { head: { skillComb: {}, ... }, ... }
 *
 * リストの場合のデータ構造
 *   [ { skillComb: {}, ... }, ... }
 *
 * リストの場合、最初の要素を胴として胴系統倍化を処理する。
 */
Skill.unify = function (setOrList) {
    return Util.isArray(setOrList) ?
        this._unifyList(setOrList) : this._unifySet(setOrList);
};
Skill._unifySet = function (set) {
    var bodySC = set.body ? (set.body.skillComb || {}) : {};

    var combs = [];
    for (var part in set) {
        var skillComb = set[part] ? (set[part].skillComb || {}) : {};
        if (skillComb['胴系統倍化']) skillComb = bodySC;
        combs.push(skillComb);
    }

    return Skill.join(combs);
};
Skill._unifyList = function (list) {
    var bodySC = list[0] ? (list[0].skillComb || {}) : {};

    var combs = [];
    for (var i = 0, len = list.length; i < len; ++i) {
        var skillComb = list[i] ? (list[i].skillComb || {}) : {};
        if (skillComb['胴系統倍化']) skillComb = bodySC;
        combs.push(skillComb);
    }

    return Skill.join(combs);
};

return Util.Skill = Skill;
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
           factory(this.simu.Util, this.simu.data);
       }
);
