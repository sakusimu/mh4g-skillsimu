(function (define) {
'use strict';
var deps = [ '../equip.js', '../data.js', '../util/skill.js', '../util/deco.js' ];
define(deps, function (Equip, data, Skill, Deco) {

/**
 * 条件となるスキルを元に、対象となる装備と装飾品で実現できる
 * スキルの組み合わせを正規化するクラス。
 *
 * 頑シミュさんの "高速化１「まとめる」" を行っている。
 *
 * 概要
 *     var n = new Normalizer()
 *     n.normalize([ '攻撃力UP【大】', '業物' ]);
 *     => { head:
 *           [ { skillComb: { '攻撃': 0, '斬れ味': 0 },
 *               equips: [ 'slot0', 'ブナハキャップ', 'ブナハＳハット',
 *                         '高級ユアミタオル', 'ダマスクヘルム' ] },
 *             { skillComb: { '攻撃': -1, '斬れ味': 1 },
 *               equips: [ 'ブナハキャップ' ] },
 *             { skillComb: { '攻撃': 1, '斬れ味': -1 },
 *               equips: [ 'ダマスクヘルム' ] },
 *             { skillComb: { '攻撃': 1, '斬れ味': 0 },
 *               equips: [ 'slot1' ] },
 *             { skillComb: { '攻撃': 0, '斬れ味': 1 },
 *               equips: [ 'slot1', 'ブナハＳキャップ' ] },
 *             { skillComb: { '攻撃': 0, '斬れ味': 0, '胴系統倍化': 1 },
 *               equips: [ 'スカルフェイス', 'スカルＳフェイス' ] },
 *             { skillComb: { '攻撃': -1, '斬れ味': 2 },
 *               equips: [ 'ブナハＳキャップ' ] },
 *             { skillComb: { '攻撃': 3, '斬れ味': -2 },
 *               equips: [ 'ダマスクヘルム' ] },
 *             { skillComb: { '攻撃': 2, '斬れ味': 0 },
 *               equips: [ 'バギィヘルム', 'ブナハＳキャップ' ] },
 *             ... ],
 *          body:
 *           [ ... ],
 *          arm:
 *           [ ... ],
 *          waist:
 *           [ ... ],
 *          leg:
 *           [ ... ],
 *          weapon:
 *           [ ... ] }
 *
 * スキルの組み合わせとは、スキル系統とポイントの組み合わせのことで
 *   { スキル系統: ポイント }
 * というオブジェクト。
 * e.g.
 *   ジンオウメイル => { '本気': 3, '雷属性攻撃': 1, '斬れ味': 2, '気配': -3 }
 *   攻撃珠【１】   => { '攻撃': 1, '防御': -1 }
 *
 * ここでいう正規化とは以下の処理を行うこと。
 * 1. 対象となる装備と装飾品から、スキルの組み合わせを
 *      { 装備名: [ { スキル系統: ポイント } ] }
 *    というデータにする
 *    (関係するスキルを持たない装備は slotN (N=0,1,2,3) という装備名でまとめる)
 * 2. 条件のスキル系統のみで構成されたスキルの組み合わせにする(関係ないスキルは省く)
 * 3. 装備単位でスキルの組み合わせをポイントの大きいものにまとめる
 * 4. 同じスキルの組み合わせの装備をまとめる
 */
var Normalizer = function () {
    this.initialize.apply(this, arguments);
};

Normalizer.prototype.initialize = function (opts) {
    opts = opts || {};

    this.reuslt = null;
    this.equips = data.equips;
    this.weaponSlot = opts.weaponSlot == null ? 0 : opts.weaponSlot;
    this.omas = data.omas;
};

/**
 * 引数のスキルを元に、対象となる装備と装飾品で実現できる
 * スキル系統とポイントの組み合わせを返す。
 *
 * 装飾品なしで調べたい場合は simu.data.decos を [] で実行すればOK。
 */
Normalizer.prototype.normalize = function (skillNames) {
    if (skillNames == null || skillNames.length === 0) return null;

    var skillTrees = Skill.trees(skillNames);
    if (skillTrees.length === 0) return null;

    var combs,
        ret = {};
    for (var part in this.equips) {
        var equips = this.equips[part];
        combs = this._normalize1(skillTrees, equips);
        combs = this._normalize2(skillTrees, combs);
        combs = this._normalize3(combs);
        ret[part] = this._normalize4(combs);
    }

    ret.weapon = null;
    if (this.weaponSlot) {
        var wpnNorCombs = this._normalizeWeaponSkill(skillTrees);
        ret.weapon = wpnNorCombs;
    }

    ret.oma = null;
    if (this.omas != null && this.omas.length !== 0) {
        var omas = this.omas;
        combs = this._normalize1(skillTrees, omas, 1);
        combs = this._normalize2(skillTrees, combs);
        combs = this._normalize3(combs);
        ret.oma = this._normalize4(combs);
    }

    return ret;
};

/**
 * 正規化の 1 を行う。
 *
 * 1. 対象となる装備と装飾品から、スキルの組み合わせを
 *      { 装備名: [ { スキル系統: ポイント } ] }
 *    というデータにする
 *    - 関係するスキルを持たない装備は slotN (N=0,1,2,3) という装備名でまとめる
 *    - 胴系統倍化は、胴系統倍加という装備名でまとめる
 */
Normalizer.prototype._normalize1 = function (skillTrees, equips) {
    if (skillTrees == null || skillTrees.length === 0) return null;
    if (equips == null || equips.length === 0) return null;

    var decoCombs = Deco.skillCombs(skillTrees);
    var ret = {};

    // skillTrees のスキルを持たないスロットだけの組み合わせは
    // 一度調べたら覚えておいて次以降はスキップ
    var checkedDoubling = false,
        checkedSlot     = [ false, false, false, false ];

    for (var i = 0, ilen = equips.length; i < ilen; ++i) {
        var equip  = equips[i];
        var slot   = equip.slot,
            dCombs = decoCombs[slot];

        if (Skill.contains(equip.skillComb, '胴系統倍化')) {
            if (checkedDoubling) continue;
            ret['胴系統倍化'] = [ equip.skillComb ];
            checkedDoubling = true;
            continue;
        } else if (!Skill.contains(equip.skillComb, skillTrees)) {
            if (checkedSlot[slot]) continue;
            ret['slot' + slot] = dCombs;
            checkedSlot[slot]  = true;
            continue;
        }

        dCombs = dCombs.length === 0 ? [ null ] : dCombs;
        var combs = [];
        for (var j = 0, jlen = dCombs.length; j < jlen; ++j) {
            combs.push(Skill.merge(equip.skillComb, dCombs[j]));
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
Normalizer.prototype._normalize2 = function (skillTrees, combs) {
    if (skillTrees == null || skillTrees.length === 0) return null;
    if (combs == null) return null;

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
    if (combs == null) return null;

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
    if (combs == null) return [];

    var i, len, ilen;

    // 同じ合計ポイントじゃないと同じスキルの組み合わせにはならないので
    // 合計ポイントでまとめて調べる量を減らす
    var buckets = {};
    for (var equipName in combs) {
        var skillCombs = combs[equipName];
        for (i = 0, len = skillCombs.length; i < len; ++i) {
            var sc  = skillCombs[i],
                sum = Skill.sum(sc);
            if (buckets[sum] == null) buckets[sum] = [];
            var norComb = { skillComb: sc, equips: [ equipName ] };
            buckets[sum].push(norComb);
        }
    }

    var ret = [];
    for (var point in buckets) {
        var norCombs  = buckets[point],
            uniqCombs = [];
        for (i = 0, ilen = norCombs.length; i < ilen; ++i) {
            var rest     = norCombs[i],
                sameComb = null;
            for (var j = 0, jlen = uniqCombs.length; j < jlen; ++j) {
                var uniq = uniqCombs[j];
                if (Skill.isEqual(rest.skillComb, uniq.skillComb)) {
                    sameComb = uniq;
                    break;
                }
            }
            if (sameComb) {
                sameComb.equips = sameComb.equips.concat(rest.equips);
                continue;
            }
            uniqCombs.push(rest);
        }
        ret = ret.concat(uniqCombs);
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
