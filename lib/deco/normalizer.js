'use strict';
var util = require('../util.js');

/**
 * 部位ごとの装備スロットで実現できる装飾品の組み合わせを正規化するクラス。
 *
 *     var n = new Normalizer()
 *     // equip はスキルが発動する装備の組み合わせ
 *     n.normalize([ '斬れ味レベル+1', '砥石使用高速化' ], equip);
 *     => { head: [
 *            { skillComb: { '匠': 0, '研ぎ師': 0 }, decos: [], slot: 0 },
 *            { skillComb: { '匠': 0, '研ぎ師': 2 }, decos: [ '研磨珠【１】' ], slot: 1 },
 *            { skillComb: { '匠': 0, '研ぎ師': 4 },
 *              decos: [ '研磨珠【１】', '研磨珠【１】' ], slot: 2 },
 *            { skillComb: { '匠': 1, '研ぎ師': 0 }, decos: [ '匠珠【２】' ], slot: 2 } ],
 *          body: [
 *            { skillComb: { '匠': 0, '研ぎ師': 0 }, decos: [], slot: 0 },
 *            { skillComb: { '匠': 0, '研ぎ師': 2 }, decos: [ '研磨珠【１】' ], slot: 1 },
 *            { skillComb: { '匠': 0, '研ぎ師': 4 },
 *              decos: [ '研磨珠【１】', '研磨珠【１】' ], slot: 2 },
 *            { skillComb: { '匠': 1, '研ぎ師': 0 }, decos: [ '匠珠【２】' ], slot: 2 },
 *            { skillComb: { '匠': 0, '研ぎ師': 6 },
 *              decos: [ '研磨珠【１】', '研磨珠【１】', '研磨珠【１】' ], slot: 3,  },
 *            ... ],
 *          arm   : [ ... ],
 *          waist : [ ... ],
 *          leg   : [ ... ],
 *          weapon: [ ... ],
 *          oma   : [ ... ] }
 */
var Normalizer = function () {
    this.initialize.apply(this, arguments);
};

Normalizer.prototype.initialize = function () {};

var parts = util.parts;

Normalizer.prototype.normalize = function (skillNames, equip) {
    if (skillNames == null || skillNames.length === 0) return null;
    if (equip == null) return null;

    var skillTrees = util.skill.trees(skillNames);
    if (skillTrees.length === 0) return null;

    var decoCombsBySlot = util.deco.combs(skillTrees);

    var ret = {};
    for (var i = 0, len = parts.length; i < len; ++i) {
        var part = parts[i],
            eq = equip[part];

        var bulks;
        bulks = this._normalize1(decoCombsBySlot, eq);
        bulks = this._normalize2(bulks, skillTrees);

        ret[part] = bulks;
    }

    return ret;
};

/**
 * 装飾品の組み合わせを作成。
 */
Normalizer.prototype._normalize1 = function (decoCombsBySlot, equip) {
    if (equip == null) return [];

    var maxSlot = equip.slot,
        sc = equip.skillComb;

    var bulks = [ makeBulk(null, 0, sc) ];

    for (var slot = 1; slot <= maxSlot; ++slot) {
        var decoCombs = decoCombsBySlot[slot];
        for (var i = 0, ilen = decoCombs.length; i < ilen; ++i) {
            var decoComb = decoCombs[i],
                bulk = makeBulk(decoComb, slot, sc);
            bulks.push(bulk);
        }
    }

    return bulks;
};

var makeBulk = function (decoComb, slot, skillComb) {
    var sc = skillComb || {};

    var bulk = {
        decos: [],
        slot: slot || 0,
        skillComb: sc['胴系統倍加'] ? sc : {}
    };

    if (decoComb == null) return bulk;

    var decos = [],
        skillCombs = [ bulk.skillComb ];
    for (var i = 0, len = decoComb.length; i < len; ++i) {
        decos.push(decoComb[i].name);
        skillCombs.push(decoComb[i].skillComb);
    }

    bulk.decos = decos;
    bulk.skillComb = util.skill.join(skillCombs);

    return bulk;
};

/**
 * 条件のスキル系統のみで構成されたスキルの組み合わせにする(関係のないスキルは省く)
 */
Normalizer.prototype._normalize2 = function (bulks, skillTrees) {
    for (var i = 0, len = bulks.length; i < len; ++i) {
        var bulk = bulks[i];
        bulk.skillComb = util.skill.compact(skillTrees, bulk.skillComb);
    }
    return bulks;
};

module.exports = Normalizer;
