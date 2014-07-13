(function (define) {
'use strict';
var deps = [ '../deco.js', '../util.js',
             '../util/deco.js', '../util/skill.js', '../util/comb' ];
define(deps , function (Deco, Util, UtilDeco, Skill, Comb) {

/**
 * 装飾品の組み合わせを求めるクラス。
 *
 * ユースケースとして、一度シミュした後の装飾品検索で使われることを想定しているので
 * 前提として、そのスキルが発動する装備の組み合わせはわかっている。
 *
 * deComb について
 * 装飾品の組み合わせのこと
 * 例えば
 *   [ { name: '研磨珠【１】', slot: 1, skillComb: { '研ぎ師': 2 } },
 *     { name: '研磨珠【１】', slot: 1, skillComb: { '研ぎ師': 2 } } ]
 * とか
 *   [ { name: '匠珠【２】', slot: 2, skillComb: { '匠': 1, '斬れ味': -1 } } ]
 * になる。
 */
var Simulator = function () {
    this.initialize.apply(this, arguments);
};

Simulator.prototype.initialize = function () {
    this.set = [ 'head', 'body', 'arm', 'waist', 'leg', 'weapon', 'oma' ];
    this.result = null;
};

/**
 * 条件となるスキルの発動を満たす装飾品の組み合わせを返す。
 */
Simulator.prototype.simulate = function (skillNames, equipSet) {
    if (skillNames == null || skillNames.length === 0) return null;

    this.initialize();

    var skillTrees = Skill.trees(skillNames);
    if (skillTrees.length === 0) return null;

    var norSet = this._normalize(skillTrees, equipSet);
    var deCombSets = this._combine(skillNames, norSet);

    this.result = this._result(norSet, deCombSets);

    return this.result;
};

Simulator.prototype._normalize = function (skillTrees, equipSet) {
    var deCombsBySlot = UtilDeco.combs(skillTrees),
        ret = {};

    for (var i = 0, len = this.set.length; i < len; ++i) {
        var part  = this.set[i],
            equip = equipSet[part];

        if (equip == null) {
            equip = { name: part, slot: 0, skillComb: {} };
        } else if (/^slot\d$/.test(equip.name)) {
            // slotN とかだと slot や skillComb がないので用意
            equip.slot = +equip.name.substr(4, 1);
            equip.skillComb = {};
        } else if (equip.name === '胴系統倍化') {
            equip.slot = 0;
            equip.skillComb = { '胴系統倍化': 1 };
        }

        ret[part] = { equip: equip, decos: makeDecos(deCombsBySlot, equip.slot) };
    }

    return ret;
};

Simulator.prototype._combine = function (skillNames, norSet) {
    var need = this._needSkillComb(skillNames,
                                   this._equipSkillComb(norSet));
    if (!need) return [];

    var slotsSet      = this._slotsSet(norSet),
        deCombsBySlot = UtilDeco.combs(Skill.trees(skillNames));

    var activated = [];
    for (var i = 0, ilen = slotsSet.length; i < ilen; ++i) {
        var slots = slotsSet[i];
        activated = this._activatedDeCombs(need, slots, deCombsBySlot, norSet);
        if (activated.length) break;
    }

    return activated;
};

Simulator.prototype._equipSkillComb = function (norSet) {
    var list = [],
        bodySC = norSet.body.equip.skillComb;

    for (var part in norSet) {
        var sc = norSet[part].equip.skillComb;
        if (sc['胴系統倍化']) sc = bodySC;
        list.push(sc);
    }

    return Skill.merge(list);
};

Simulator.prototype._needSkillComb = function (skillNames, equipSkillComb) {
    var tree,
        skillTrees = Skill.trees(skillNames);

    // 関係のあるスキルのみを対象に
    var esc = {};
    for (var i = 0, len = skillTrees.length; i < len; ++i) {
        tree = skillTrees[i];
        esc[tree] = equipSkillComb[tree] || 0;
    }

    var goal = Comb.goal(skillNames),
        need = {};
    for (tree in goal) {
        need[tree] = goal[tree] - esc[tree];
        if (need[tree] < 0) need[tree] = 0;
    }

    // 既に必要なスキルポイントを満たしているか調べる
    var check = false;
    for (tree in need) {
        if (need[tree] > 0) check = true;
    }

    return check ? need : null;
};

/** スロットの使い方のセットを返す */
Simulator.prototype._slotsSet = function (norSet) {
    var slots = makeSlots(norSet);

    // 冪集合を求める
    var slotsSet     = Util.power(slots.slots),
        slotsSetName = Util.power(slots.slotsName),
        slotsSetPnt  = Util.power(slots.slotsPnt);

    var set = removeOverlapSlots(slotsSet, slotsSetName, slotsSetPnt);

    var bucket = uniqTotalSlots(set.slotsSet, set.slotsSetPnt);

    var ret = sortTotalSlotsSet(bucket);

    return ret;
};

/**
 * 例えば、norSet が以下のセットの場合
 *   [ 頭:2, 胴:3, 腕:2, 腰:(胴系統倍化), 脚:2, 武器:0, お守り:0 ]
 * 1. body は先頭へ(後の処理で、胴系統倍加の時に楽するため)
 * 2. 0スロは除く(胴系統倍化も含めて)
 * をしつつ以下のようにする
 *   [ 胴:1,胴:2,胴:3, 頭:1,頭:2, 腕:1,腕:2, 脚:1,脚:2 ]
 */
var makeSlots = function (norSet) {
    var part;

    var parts = [ 'body' ];
    for (part in norSet) if (part !== 'body') parts.push(part);

    var slots     = [],
        slotsName = [],
        slotsPnt  = [];

    for (var i = 0, len = parts.length; i < len; ++i) {
        part = parts[i];
        var equip = norSet[part].equip,
            slot  = equip.slot;
        for (var j = 1; j <= slot; ++j) {
            slots.push(part + ':' + j);
            slotsName.push(part);
            slotsPnt.push(j);
        }
    }

    return { slots: slots, slotsName: slotsName, slotsPnt: slotsPnt };
};

/** パーツがかぶってる([ body:1,body:2 ] とかの) slots を削除 */
var removeOverlapSlots = function (slotsSet, slotsSetName, slotsSetPnt) {
    var newSet = [],
        newSetPnt = [];

    for (var i = 0, ilen = slotsSet.length; i < ilen; ++i) {
        var slots     = slotsSet[i],
            slotsName = slotsSetName[i],
            slotsPnt  = slotsSetPnt[i];

        var overlap = false; // パーツがかぶったら true
        for (var j = 0, jlen = slots.length; j < jlen; ++j) {
            if (j !== slotsName.lastIndexOf(slotsName[j])) {
                overlap = true;
                break;
            }
        }
        if (!overlap) {
            newSet.push(slots);
            newSetPnt.push(slotsPnt);
        }
    }

    return { slotsSet: newSet, slotsSetPnt: newSetPnt };
};

/** 合計スロット数でユニークにする **/
var uniqTotalSlots = function (slotsSet, slotsSetPnt) {
    var bucket = {};
    for (var i = 0, ilen = slotsSet.length; i < ilen; ++i) {
        var slots    = slotsSet[i],
            slotsPnt = slotsSetPnt[i];
        var sum = 0;
        for (var j = 0, jlen = slotsPnt.length; j < jlen; ++j) sum += slotsPnt[j];
        if (bucket[sum]) continue;
        bucket[sum] = slots;
    }
    return bucket;
};

/** 合計スロットの少ない順にソート */
var sortTotalSlotsSet = function (bucket) {
    var keys = [];
    for (var sum in bucket) keys.push(sum);
    keys.sort(function (a, b) { return a - b; });

    var ret = [];
    for (var i = 0, len = keys.length; i < len; ++i) {
        sum = keys[i];
        ret.push(bucket[sum]);
    }

    return ret;
};

Simulator.prototype._activatedDeCombs = function (need, slots,
                                                      deCombsBySlot, norSet) {
    var i, len, part, slot;

    if (slots.length === 0) return [];

    // 胴系統倍加のために [ body:1 ] -> [ body:1, waist:'胴系統倍化' ] みたいにする
    for (part in norSet) {
        var sc = norSet[part].equip.skillComb;
        if (sc['胴系統倍化']) slots.push(part + ':胴系統倍化');
    }

    var deCombSets  = [],
        bodyDeCombs = [];
    for (i = 0, len = slots.length; i < len; ++i) {
        var pair = slots[i].split(':');
        part = pair[0]; slot = pair[1];

        // 胴系統倍化だったら body の deCombs を使う
        var deCombs = slot === '胴系統倍化' ? bodyDeCombs : deCombsBySlot[slot];

        if (part === 'body') bodyDeCombs = deCombs;

        deCombSets = this._appendDeCombSets(deCombSets, part, deCombs);
    }

    deCombSets = uniqDeCombSets(deCombSets);

    var ret = [];
    for (i = 0, len = deCombSets.length; i < len; ++i) {
        var deCombSet = deCombSets[i];

        var list = [];
        for (part in deCombSet) list.push(this._deCombSkill(deCombSet[part]));

        var skillComb = Skill.merge(list);
        if (this._isBeyond(need, skillComb)) ret.push(deCombSet);
    }

    return ret;
};

Simulator.prototype._appendDeCombSets = function (deCombSets, part, deCombs) {
    var i, ilen, j, jlen, set;
    var ret = [];

    if (deCombSets.length === 0) {
        for (i = 0, ilen = deCombs.length; i < ilen; ++i) {
            set = {};
            set[part] = deCombs[i];
            ret.push(set);
        }
        return ret;
    }

    for (i = 0, ilen = deCombSets.length; i < ilen; ++i) {
        var deCombSet = deCombSets[i];

        var list = [];
        for (j = 0, jlen = deCombs.length; j < jlen; ++j) {
            set = {};
            for (var p in deCombSet) set[p] = deCombSet[p];
            set[part] = deCombs[j];
            list.push(set);
        }

        ret = ret.concat(list);
    }

    return ret;
};

var uniqDeCombSets = function (deCombSets) {
    var ret = [];

    var bucket = {};
    for (var i = 0, len = deCombSets.length; i < len; ++i) {
        var deCombSet = deCombSets[i];
        var key = genKey(deCombSet);

        if (bucket[key]) continue;

        bucket[key] = true;
        ret.push(deCombSet);
    }

    return ret;
};

var genKey = function (deCombSet) {
    var names = [];
    for (var part in deCombSet) {
        var deComb = deCombSet[part];
        for (var i = 0, len = deComb.length; i < len; ++i) names.push(deComb[i].name);
    }
    return names.sort().join(',');
};

/** deComb の skillComb をマージして返す。 */
Simulator.prototype._deCombSkill = function (deComb) {
    if (deComb == null) return {};

    var list = [];
    for (var i = 0, len = deComb.length; i < len; ++i) {
        var deco = deComb[i];
        list.push(deco.skillComb);
    }
    return Skill.merge(list);
};

Simulator.prototype._isBeyond = function (need, skillComb) {
    for (var tree in need) {
        if (need[tree] !== 0 && skillComb[tree] == null) return false;
        if (need[tree] > skillComb[tree]) return false;
    }
    return true;
};

var makeDecos = function (deCombsBySlot, maxSlot) {
    var decos = [];
    for (var slot = 0; slot <= maxSlot; ++slot) {
        var deCombs = deCombsBySlot[slot];

        var simply = [];
        for (var i = 0, ilen = deCombs.length; i < ilen; ++i) {
            var deComb = deCombs[i],
                names  = [],
                skills = [];
            for (var j = 0, jlen = deComb.length; j < jlen; ++j) {
                names.push(deComb[j].name);
                skills.push(deComb[j].skillComb);
            }
            simply.push({ names: names, slot: slot, skillComb: Skill.merge(skills) });
        }
        if (maxSlot !== 0) decos[slot] = simply;
    }
    return decos;
};

Simulator.prototype._result = function (norSet, deCombSets) {
    var part;

    var hasDoubling = false;
    for (part in norSet) {
        var sc = norSet[part].equip.skillComb;
        if (sc['胴系統倍化']) hasDoubling = true;
    }

    var decos = [];
    for (var i = 0, ilen = deCombSets.length; i < ilen; ++i) {
        var deCombSet = deCombSets[i],
            decoNames = [];
        for (part in deCombSet) {
            var deComb = deCombSet[part];
            for (var j = 0, jlen = deComb.length; j < jlen; ++j) {
                var name = deComb[j].name;
                if (part === 'body' && hasDoubling) name += '(胴)';
                decoNames.push(name);
            }
        }

        var deco = {
            names: decoNames,
            skillComb: this._calcPoint(norSet, deCombSet),
            freeSlot : this._sumFreeSlot(norSet, deCombSet)
        };
        decos.push(deco);
    }

    var ret = {};
    for (i = 0, ilen = this.set.length; i < ilen; ++i) {
        part = this.set[i];
        ret[part] = norSet[part].equip;
    }
    ret.decos = decos;

    return ret;
};

Simulator.prototype._calcPoint = function (norSet, deCombSet) {
    var part;

    // 胴から調べるように並べる
    var parts = [ 'body' ];
    for (part in norSet) if (part !== 'body') parts.push(part);

    var bodySC,
        skillCombs = [];
    for (var i = 0, len = parts.length; i < len; ++i) {
        part = parts[i];

        var esc = norSet[part].equip.skillComb,
            dsc = this._deCombSkill(deCombSet[part]);

        var sc = Skill.merge(esc, dsc);
        if (esc['胴系統倍化']) sc = bodySC;

        skillCombs.push(sc);
        if (part === 'body') bodySC = sc;
    }

    return Skill.merge(skillCombs);
};

Simulator.prototype._sumFreeSlot = function (norSet, deCombSet) {
    var sum = 0;

    for (var part in norSet) {
        var equip  = norSet[part].equip,
            deComb = deCombSet[part] || [];

        if (equip.slot === 0) continue;

        var decoSlot = 0;
        for (var i = 0, len = deComb.length; i < len; ++i) {
            decoSlot += deComb[i].slot;
        }

        var freeSlot = equip.slot - decoSlot;
        sum += freeSlot;
    }

    return sum;
};

return Deco.Simulator = Simulator;
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
           factory(this.simu.Deco, this.simu.Util,
                   this.simu.Util.Deco, this.simu.Util.Skill, this.simu.Util.Comb);
       }
);
