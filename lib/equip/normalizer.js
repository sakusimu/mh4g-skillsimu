(function (define) {
'use strict';
var deps = [ '../equip.js', '../data.js', '../util/skill.js', '../util/deco.js' ];
define(deps, function (Equip, data, Skill, Deco) {

/**
 * 条件となるスキルを元に、対象となる装備と装飾品で実現できる
 * 装備とスキルの組み合わせを正規化するクラス。
 *
 * 頑シミュさんの "高速化１「まとめる」" を行っている。
 *
 * 概要
 *     var n = new Normalizer()
 *     n.normalize([ '攻撃力UP【大】', '業物' ]);
 *     => { head: [
 *            { skillComb: { '攻撃': 0, '斬れ味': 0 }, equips: [ 'slot0' ] },
 *            { skillComb: { '攻撃': 1, '斬れ味': 0 }, equips: [ 'slot1' ] },
 *            { skillComb: { '攻撃': 0, '斬れ味': 1 }, equips: [ 'slot1' ] },
 *            { skillComb: { '攻撃': 1, '斬れ味': 1 }, equips: [ 'slot2' ] },
 *            { skillComb: { '攻撃': 0, '斬れ味': 2 }, equips: [ 'slot2' ] },
 *            { skillComb: { '攻撃': 3, '斬れ味': 0 },
 *              equips: [ 'slot2', 'ランポスヘルム', 'クックヘルム', 'レウスヘルム' ] },
 *            { skillComb: { '攻撃': 1, '斬れ味': 2 },
 *              equips: [ 'slot3', 'ランポスキャップ', 'ギザミヘルム' ] },
 *            { skillComb: { '攻撃': 0, '斬れ味': 3 },
 *              equips: [ 'slot3', 'ギザミヘルム' ] },
 *            { skillComb: { '攻撃': 2, '斬れ味': 1 },
 *              equips: [ 'ランポスヘルム', 'ランポスキャップ', 'クックヘルム' ] },
 *            { skillComb: { '攻撃': 4, '斬れ味': 0 },
 *              equips: [ 'slot3', 'ランポスキャップ', 'ボロスヘルム', 'ボロスキャップ',
 *                        'レックスヘルム', 'レウスキャップ' ] },
 *            ... ],
 *          body  : [ ... ],
 *          arm   : [ ... ],
 *          waist : [ ... ],
 *          leg   : [ ... ],
 *          weapon: [ ... ],
 *          oma   : [ ... ] }
 *
 * スキルの組み合わせとは、スキル系統とポイントの組み合わせのことで
 *   { スキル系統: ポイント }
 * というオブジェクト。
 * e.g.
 *   ジンオウメイル => { '本気': 3, '雷属性攻撃': 1, '斬れ味': 2, '気配': -3 }
 *   攻撃珠【１】   => { '攻撃': 1, '防御': -1 }
 *
 * ここでいう正規化とは以下の処理を行うこと。
 * 0. まとめ処理
 *    - 関係するスキルを持たない装備は slotN (N=0,1,2,3) という装備名でまとめる
 *    - 胴系統倍化は、胴系統倍加という装備名でまとめる
 *    - なお、固定装備(対象となる装備が1つ)の場合はまとめない
 * 1. 対象となる装備と装飾品から、スキルの組み合わせを
 *      { 装備名: [ { スキル系統: ポイント } ] }
 *    というデータにする
 * 2. 条件のスキル系統のみで構成されたスキルの組み合わせにする(関係ないスキルは省く)
 * 3. 装備単位でスキルの組み合わせをポイントの大きいものにまとめる
 * 4. 同じスキルの組み合わせの装備をまとめる
 */
var Normalizer = function () {
    this.initialize.apply(this, arguments);
};

Normalizer.prototype.initialize = function (opts) {
    opts = opts || {};

    this.equips = data.equips;
    this.weaponSlot = opts.weaponSlot == null ? 0 : opts.weaponSlot;
    this.omas = data.omas;
};

/**
 * 引数のスキルを元に、対象となる装備と装飾品で実現できる
 * 装備とスキルの組み合わせを返す。
 */
Normalizer.prototype.normalize = function (skillNames) {
    if (skillNames == null || skillNames.length === 0) return null;

    var skillTrees = Skill.trees(skillNames);
    if (skillTrees.length === 0) return null;

    var combs, fix,
        ret = {};
    for (var part in this.equips) {
        var equips = this.equips[part];

        if (equips == null || equips.length === 0) {
            ret[part] = [];
            continue;
        }

        // 対象となる装備が1つの場合は固定装備と判断
        // 固定装備でない場合はまとめ処理(_normalize0)を実施
        fix = equips.length === 1;
        if (!fix) equips = this._normalize0(equips, skillTrees);

        combs = this._normalize1(equips, skillTrees);
        combs = this._normalize2(combs, skillTrees);
        combs = this._normalize3(combs);
        ret[part] = this._normalize4(combs);
    }

    ret.weapon = null;
    if (this.weaponSlot) {
        var wpnBulks = this._normalizeWeaponSkill(skillTrees);
        ret.weapon = wpnBulks;
    }

    ret.oma = null;
    if (this.omas != null && this.omas.length !== 0) {
        var omas = this.omas;

        // 対象となる装備が1つの場合は固定装備と判断
        // 固定装備でない場合はまとめ処理(_normalize0)を実施
        fix = omas.length === 1;
        if (!fix) omas = this._normalize0(omas, skillTrees);

        combs = this._normalize1(omas, skillTrees);
        combs = this._normalize2(combs, skillTrees);
        combs = this._normalize3(combs);
        ret.oma = this._normalize4(combs);
    }

    return ret;
};

/**
 * 正規化の 0 を行う。
 *
 * 0. まとめ処理
 *    - 関係するスキルを持たない装備は slotN (N=0,1,2,3) という装備名でまとめる
 *    - 胴系統倍化は、胴系統倍加という装備名でまとめる
 *    - なお、固定装備(対象となる装備が1つ)の場合はまとめない
 */
Normalizer.prototype._normalize0 = function (equips, skillTrees) {
    var ret = [];

    // skillTrees のスキルを持たないスロットだけの組み合わせは
    // 一度調べたら覚えておいて次以降はスキップ
    var checkedTorsoUp = false,
        checkedSlot    = [ false, false, false, false ];

    for (var i = 0, ilen = equips.length; i < ilen; ++i) {
        var equip  = equips[i],
            slot   = equip.slot,
            sc     = equip.skillComb || {};

        if (sc['胴系統倍化']) {
            if (checkedTorsoUp) continue;
            equip = { name: '胴系統倍化', slot: 0, skillComb: { '胴系統倍化': 1 } };
            checkedTorsoUp = true;
        } else if (!Skill.contains(sc, skillTrees)) {
            if (checkedSlot[slot]) continue;
            equip = { name: 'slot' + slot, slot: slot, skillComb: {} };
            checkedSlot[slot]  = true;
        }

        ret.push(equip);
    }

    return ret;
};

/**
 * 正規化の 1 を行う。
 *
 * 1. 対象となる装備と装飾品から、スキルの組み合わせを
 *      { 装備名: [ { スキル系統: ポイント } ] }
 *    というデータにする
 */
Normalizer.prototype._normalize1 = function (equips, skillTrees) {
    var decoCombs = Deco.skillCombs(skillTrees),
        ret = {};

    for (var i = 0, ilen = equips.length; i < ilen; ++i) {
        var equip = equips[i],
            slot  = equip.slot,
            decoComb = decoCombs[slot];

        decoComb = decoComb.length === 0 ? [ null ] : decoComb;
        var combs = [];
        for (var j = 0, jlen = decoComb.length; j < jlen; ++j) {
            var sc = Skill.merge(equip.skillComb, decoComb[j]);
            if (Object.keys(sc).length) combs.push(sc);
        }

        ret[equip.name] = combs;
    }

    return ret;
};

/**
 * 正規化の 2 を行う。
 *
 * 2. 条件のスキル系統のみで構成されたスキルの組み合わせにする(関係のないスキルは省く)
 */
Normalizer.prototype._normalize2 = function (combs, skillTrees) {
    for (var equipName in combs) {
        if (equipName === '胴系統倍化') continue;
        combs[equipName] = Skill.compact(skillTrees, combs[equipName]);
    }

    return combs;
};

/**
 * 正規化の 3 を行う。
 *
 * 3. 装備単位でスキルの組み合わせをポイントの大きいものにまとめる
 */
Normalizer.prototype._normalize3 = function (combs) {
    for (var equipName in combs) {
        combs[equipName] = this._collectMaxSkill(combs[equipName]);
    }

    return combs;
};

/**
 * 正規化の 4 を行う。
 *
 * 4. 同じスキルの組み合わせの装備をまとめる
 */
Normalizer.prototype._normalize4 = function (combs) {
    var i, ilen;

    // 同じ合計ポイントじゃないと同じスキルの組み合わせにはならないので
    // 合計ポイントでまとめて調べる量を減らす
    var buckets = {};
    for (var equipName in combs) {
        var skillCombs = combs[equipName];
        for (i = 0, ilen = skillCombs.length; i < ilen; ++i) {
            var sc  = skillCombs[i],
                sum = Skill.sum(sc);
            if (buckets[sum] == null) buckets[sum] = [];
            var bulk = { skillComb: sc, equips: [ equipName ] };
            buckets[sum].push(bulk);
        }
    }

    var ret = [];
    for (var point in buckets) {
        var bulks = buckets[point],
            uniqs = []; // uniq bulks
        for (i = 0, ilen = bulks.length; i < ilen; ++i) {
            var rest = bulks[i],
                same = null;
            for (var j = 0, jlen = uniqs.length; j < jlen; ++j) {
                var uniq = uniqs[j];
                if (Skill.isEqual(rest.skillComb, uniq.skillComb)) {
                    same = uniq;
                    break;
                }
            }
            if (same) {
                same.equips = same.equips.concat(rest.equips);
                continue;
            }
            uniqs.push(rest);
        }
        ret = ret.concat(uniqs);
    }

    return ret;
};

/**
 * 武器スロで付くスキルの正規化。
 */
Normalizer.prototype._normalizeWeaponSkill = function (skillTrees) {
    if (skillTrees == null || skillTrees.length === 0) return [];
    var wslot = this.weaponSlot;
    if (wslot == null || wslot < 0 || 3 < wslot) return [];

    var skillCombs = Deco.skillCombs(skillTrees)[wslot];
    skillCombs = Skill.compact(skillTrees, skillCombs);
    skillCombs = this._collectMaxSkill(skillCombs);

    var name = 'slot' + wslot,
        ret  = [];
    for (var i = 0, len = skillCombs.length; i < len; ++i) {
        ret.push({ skillComb: skillCombs[i], equips: [ name ] });
    }

    return ret;
};

/**
 * スキルの組み合わせをポイントが大きいものにまとめる。
 *
 * 前提として、処理対象の skillCombs は、ひとつの装備に装飾品を
 * 組み合わせたものなので、 skillCombs 内に同じ組み合わせは出現しない。
 *
 * e.g.
 *     var sc = [ { '攻撃': 1, '斬れ味': 0 }, { '攻撃': 2, '斬れ味': 0 },
 *                { '攻撃': 1, '斬れ味': 1 } ];
 *     _collectMaxSkill(sc);
 *     => [ { '攻撃': 2, '斬れ味': 0 }, { '攻撃': 1, '斬れ味': 1 } ]
 */
Normalizer.prototype._collectMaxSkill = function (skillCombs) {
    var ret = [];

    for (var i = 0, len = skillCombs.length; i < len; ++i) {
        var dstComb = skillCombs[i], max = true;
        for (var j = 0; j < len; ++j) {
            var srcComb = skillCombs[j];
            if (i === j) continue;
            if (!this._compareAny(srcComb, dstComb)) {
                max = false;
                break;
            }
        }
        if (max) ret.push(dstComb);
    }

    return ret;
};

/**
 * スキルの組み合わせを比べる。
 * いずれかのスキルのポイントで srcComb < dstComb なら true 、そうでないなら false 。
 *
 * 前提として srcComb と dstComb は全く同じプロパティを持っていること。
 * つまり、 srcComb が { '攻撃': 1, '斬れ味': 1 } の場合
 * dstComb は { '攻撃': 2 } ではなく { '攻撃' 2, '斬れ味': 0 } ということ。
 *
 * srcComb = { a: 1 } で dstComb = { b: 1 } の場合に
 * srcComb = { a: 1, b: 0 }, dstComb = { a: 0, b: 1 } としてまで処理はしない。
 */
Normalizer.prototype._compareAny = function (srcComb, dstComb) {
    for (var skill in srcComb) {
        var srcPt = srcComb[skill], dstPt = dstComb[skill];
        if (srcPt < dstPt) return true;
    }
    return false;
};

return Equip.Normalizer = Normalizer;
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
           factory(this.simu.Equip, this.simu.data,
                   this.simu.Util.Skill, this.simu.Util.Deco);
       }
);
