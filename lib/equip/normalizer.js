'use strict';
var data = require('../data.js'),
    util = require('../util.js');

/**
 * 条件となるスキルを元に、対象となる装備と装飾品で実現できる
 * 装備とスキルの組み合わせを正規化するクラス。
 *
 * 頑シミュさんの "高速化１「まとめる」" を行っている。
 *
 *     var n = new Normalizer()
 *     n.normalize([ '攻撃力UP【大】', '業物' ]);
 *     => { head: [
 *            { skillComb: { '攻撃': 0, '斬れ味': 0 },
 *              equips: [ 'ボーンヘルム','ボーンキャップ',...,'逆巻く怒髪','威圧の逆髪' ] },
 *            { skillComb: { '攻撃': 0, '斬れ味': 0, '胴系統倍加': 1 },
 *              equips: [ 'クロオビヘルム', 'スカルヘッド', '伝説Ｊハット' ] },
 *            { skillComb: { '攻撃': 1, '斬れ味': 0 },
 *              equips: [ 'ブレイブヘッド','レザーヘッド','チェーンヘッド',... ] },
 *            { skillComb: { '攻撃': 0, '斬れ味': 1 },
 *              equips: [ 'ブレイブヘッド','レザーヘッド','チェーンヘッド',... ] },
 *            { skillComb: { '攻撃': 1, '斬れ味': 1 },
 *              equips: [ 'ジャギィヘルム','ズワロフード','ゲネポスキャップ',... ] },
 *            { skillComb: { '攻撃': 0, '斬れ味': 2 },
 *              equips: [ 'ジャギィヘルム','ズワロフード','ゲネポスキャップ',... ] },
 *            { skillComb: { '攻撃': 2, '斬れ味': 0 }, equips: [ 'ランポスＳキャップ' ] },
 *            { skillComb: { '攻撃': 3, '斬れ味': 0 },
 *              equips: [ 'ジャギィヘルム','ズワロフード','ゲネポスキャップ',... ] },
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

Normalizer.prototype.initialize = function () {
    this.equips = data.equips;
};

/**
 * 引数のスキルを元に、対象となる装備と装飾品で実現できる
 * 装備とスキルの組み合わせを返す。
 */
Normalizer.prototype.normalize = function (skillNames) {
    if (skillNames == null || skillNames.length === 0) return null;

    var skillTrees = util.skill.trees(skillNames);
    if (skillTrees.length === 0) return null;

    var parts = util.parts,
        ret   = {};
    for (var i = 0, len = parts.length; i < len; ++i) {
        var part   = parts[i],
            equips = this.equips[part];

        if (equips == null || equips.length === 0) {
            ret[part] = [];
            continue;
        }

        var combs;
        combs = this._normalize1(equips, skillTrees);
        combs = this._normalize2(combs, skillTrees);
        combs = this._normalize3(combs);
        ret[part] = this._normalize4(combs);
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
    var decoCombs = util.deco.skillCombs(skillTrees),
        ret = {};

    for (var i = 0, ilen = equips.length; i < ilen; ++i) {
        var equip = equips[i],
            slot  = equip.slot,
            decoComb = decoCombs[slot];

        decoComb = decoComb.length === 0 ? [ null ] : decoComb;
        var combs = [];
        for (var j = 0, jlen = decoComb.length; j < jlen; ++j) {
            var sc = util.skill.merge(equip.skillComb, decoComb[j]);
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
        if (equipName === '胴系統倍加') continue;
        combs[equipName] = util.skill.compact(skillTrees, combs[equipName]);
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
                sum = util.skill.sum(sc);
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
                if (util.skill.isEqual(rest.skillComb, uniq.skillComb)) {
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

module.exports = Normalizer;
