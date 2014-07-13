(function (define) {
'use strict';
var deps = [ '../deco.js', '../util/deco.js', '../util/skill.js' ];
define(deps , function (DecoSimulator, Deco, Skill) {

/**
 * 部位ごとの装備スロットで実現できる装飾品の組み合わせのセットを返す。
 */
var Normalizer = function () {
    this.initialize.apply(this, arguments);
};

Normalizer.prototype.initialize = function () {
    this.parts = [ 'body', 'head', 'arm', 'waist', 'leg', 'weapon', 'oma' ];
};

Normalizer.prototype.normalize = function (skillNames, equipSet) {
    if (skillNames == null || skillNames.length === 0) return null;
    if (equipSet == null || equipSet.body == null) return null;

    var skillTrees = Skill.trees(skillNames);
    if (skillTrees.length === 0) return null;

    var decoCombsBySlot = Deco.combs(skillTrees),
        ret = {};

    equipSet = this._normalizeEquip(equipSet);

    for (var i = 0, len = this.parts.length; i < len; ++i) {
        var part  = this.parts[i],
            equip = equipSet[part],
            decombs;

        decombs = this._normalize1(decoCombsBySlot, equip);
        decombs = this._normalize2(decombs, equip);
        decombs = this._normalize3(decombs, skillTrees);

        ret[part] = decombs;
    }

    return ret;
};

/**
 * equipSet を処理するのに都合のいいように正規化する。
 */
Normalizer.prototype._normalizeEquip = function (equipSet) {
    var ret = {};

    for (var i = 0, len = this.parts.length; i < len; ++i) {
        var part  = this.parts[i],
            base = equipSet[part] || {};

        var equip = {
            name: base.name || '',
            slot: base.slot || 0,
            skillComb: Skill.clone(base.skillComb) || {}
        };

        if (/^slot\d$/.test(equip.name)) {
            // slotN だと slot や skillComb がないので用意
            equip.slot = +equip.name.substr(4, 1);
            equip.skillComb = {};
        } else if (equip.name === '胴系統倍化') {
            equip.slot = 0;
            equip.skillComb = { '胴系統倍化': 1 };
        }

        ret[part] = equip;
    }

    return ret;
};

/** 装飾品の組み合わせを作成(胴系統倍加も考慮) */
Normalizer.prototype._normalize1 = function (decoCombsBySlot, equip) {
    var decombs = this._makeDecombs(decoCombsBySlot, equip.slot);

    // 胴系統倍化なら decombs は [] だが、胴系統倍化を処理するための
    // decomb を追加しておく
    if (equip.name === '胴系統倍化' || equip.skillComb['胴系統倍化']) {
        decombs[0] = this._makeDecomb();
        decombs[0].skillComb = { '胴系統倍化': 1 };
    }

    return decombs;
};

Normalizer.prototype._makeDecombs = function (decoCombsBySlot, maxSlot) {
    var decombs = [];

    for (var slot = 0; slot <= maxSlot; ++slot) {
        var decoCombs = decoCombsBySlot[slot];

        for (var i = 0, ilen = decoCombs.length; i < ilen; ++i) {
            var decoComb = decoCombs[i];
            var decomb = this._makeDecomb(decoComb, slot);
            decombs.push(decomb);
        }
    }

    return decombs;
};

Normalizer.prototype._makeDecomb = function (decoComb, slot) {
    var decomb = {
        names: [],
        slot: slot || 0,
        skillComb: {}
    };

    if (decoComb == null) return decomb;

    var names  = [],
        skills = [];
    for (var i = 0, len = decoComb.length; i < len; ++i) {
        names.push(decoComb[i].name);
        skills.push(decoComb[i].skillComb);
    }

    decomb.names = names;
    decomb.skillComb = Skill.merge(skills);

    return decomb;
};

/** 装備と装飾品のスキルをマージする */
Normalizer.prototype._normalize2 = function (decombs, equip) {
    for (var i = 0, len = decombs.length; i < len; ++i) {
        var decomb = decombs[i];
        decomb.skillComb = Skill.merge(decomb.skillComb, equip.skillComb);
    }
    return decombs;
};

/** 条件のスキル系統のみで構成されたスキルの組み合わせにする(関係のないスキルは省く) */
Normalizer.prototype._normalize3 = function (decombs, skillTrees) {
    for (var i = 0, len = decombs.length; i < len; ++i) {
        var decomb = decombs[i];
        decomb.skillComb = Skill.compact(skillTrees, decomb.skillComb);
    }
    return decombs;
};

return DecoSimulator.Normalizer = Normalizer;
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
           factory(this.simu.Deco, this.simu.Util.Deco, this.simu.Util.Skill);
       }
);
