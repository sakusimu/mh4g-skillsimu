(function (define) {
'use strict';
define([ './namespace.js', './data.js' ], function (simu, data) {

var Skill = {};

var isArray = Array.isArray || function(obj) {
    return obj.toString.call(obj) === '[object Array]';
};

/**
 * スキルの組み合わせに skillTree のスキル系統が含まれていたら true 、
 * そうでなければ false を返す。
 */
Skill.contains = function (skillComb, skillTree) {
    var trees = isArray(skillTree) ? skillTree : [ skillTree ];
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
 * スキルの組み合わせをマージする。
 *
 * e.g.
 *     merge({ '攻撃': 1, '防御': -1 }, { '斬れ味': 1, '匠': -1 });
 *     => { '攻撃': 1, '防御': -1, '斬れ味': 1, '匠': -1 }
 *     merge([ { '攻撃': 1, '防御': -1 }, { '斬れ味': 1, '匠': -1 } ]);
 *     => { '攻撃': 1, '防御': -1, '斬れ味': 1, '匠': -1 }
 */
Skill.merge = function () {
    var args = Array.prototype.slice.apply(arguments);
    if (args.length === 0) return null;

    var combs = isArray(args[0]) ? args[0] : args;
    var ret = {};
    for (var i = 0, len = combs.length; i < len; ++i) {
        var comb = combs[i];
        if (comb == null) continue;
        for (var name in comb) {
            if (ret[name] == null) ret[name] = 0;
            ret[name] += comb[name];
        }
    }
    return ret;
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
        if (skill == null) throw name + ' is not found';
        skillTrees.push(skill.tree);
    }
    return skillTrees;
};

return simu.Skill = Skill;
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
           factory(this.simu, this.simu.data);
       }
);
