(function (define) {
'use strict';
define([ './namespace.js', './data.js' ], function (simu, data) {

/**
 * 発動条件を満たすスキルポイントの組み合わせを元に、装備と装飾品を
 * 組み立てるクラス。
 *
 * 概要
 *     var a = new Assembler();
 *     var actiCombs // Combinator で [ '攻撃力UP【大】', '業物' ] の組み合わせの結果
 *         = [ { head:
 *                { skillComb: { '攻撃': 5, '斬れ味': 3, '胴系統倍化': 0 },
 *                  equips: [ 'シルバーソルヘルム' ] },
 *               body:
 *                { skillComb: { '攻撃': 0, '斬れ味': 0, '胴系統倍化': 0 },
 *                  equips: [ 'slot0', '大和【胴当て】' ] },
 *               arm:
 *                { skillComb: { '攻撃': 7, '斬れ味': 1, '胴系統倍化': 0 },
 *                  equips: [ 'シルバーソルアーム' ] },
 *               waist:
 *                { skillComb: { '攻撃': 5, '斬れ味': 3, '胴系統倍化': 0 },
 *                  equips: [ 'シルバーソルコイル' ] },
 *               leg:
 *                { skillComb: { '攻撃': 5, '斬れ味': 3, '胴系統倍化': 0 },
 *                  equips: [ 'シルバーソルグリーヴ' ] },
 *               weapon:
 *                { skillComb: { '攻撃': 0, '斬れ味': 0, '胴系統倍化': 0 },
 *                  equips: [ 'slot0' ] } },
 *             { head:
 *                { skillComb: { '攻撃': 5, '斬れ味': 3, '胴系統倍化': 0 },
 *                  equips: [ 'シルバーソルヘルム' ] },
 *               body:
 *                { skillComb: { '攻撃': 0, '斬れ味': 0, '胴系統倍化': 0 },
 *                  equips: [ 'slot0', '大和【胴当て】' ] },
 *               arm:
 *                { skillComb: { '攻撃': 7, '斬れ味': 1, '胴系統倍化': 0 },
 *                  equips: [ 'シルバーソルアーム' ] },
 *               waist:
 *                { skillComb: { '攻撃': 5, '斬れ味': 3, '胴系統倍化': 0 },
 *                  equips: [ 'シルバーソルコイル' ] },
 *               leg:
 *                { skillComb: { '攻撃': 3, '斬れ味': 4, '胴系統倍化': 0 },
 *                  equips: [ 'シルバーソルグリーヴ' ] },
 *               weapon:
 *                { skillComb: { '攻撃': 0, '斬れ味': 0, '胴系統倍化': 0 },
 *                  equips: [ 'slot0' ] } },
 *             ... ];
 *     a.assebleEquip(actiCombs);
 *     => [ { head: 'シルバーソルヘルム',
 *            body: 'slot0',
 *            arm: 'シルバーソルアーム',
 *            waist: 'シルバーソルコイル',
 *            leg: 'シルバーソルグリーヴ',
 *            weapon: 'slot0' },
 *          { head: 'シルバーソルヘルム',
 *            body: '大和【胴当て】',
 *            arm: 'シルバーソルアーム',
 *            waist: 'シルバーソルコイル',
 *            leg: 'シルバーソルグリーヴ',
 *            weapon: 'slot0' },
 *          ... ]
 */
var Assembler = function () {
    this.initialize.apply(this, arguments);
};

Assembler.prototype.initialize = function () {
    this.parts = data.parts.concat([ 'weapon' ]);
};

/**
 * 発動条件を満たすスキルポイントの組み合わせを元に、装備を組み立てて返す。
 *
 * 装飾品の組み合わせまで見ると処理に時間がかかるので装飾品見ない。
 */
Assembler.prototype.assembleEquip = function (actiCombs) {
    if (actiCombs == null || actiCombs.length === 0) return [];

    var i, ilen, len;

    actiCombs = this._simplifyActivableCombs(actiCombs);
    actiCombs = this._uniqActivableCombs(actiCombs);

    var assemblies = [];
    for (i = 0, len = actiCombs.length; i < len; ++i) {
        var comb = actiCombs[i];
        assemblies = assemblies.concat(this._assembleEquip(comb));
    }

    assemblies = this._uniqAssemblies(assemblies);

    var ret = [];
    for (i = 0, ilen = assemblies.length; i < ilen; ++i) {
        var assem = assemblies[i],
            hash  = {};
        for (var j = 0, jlen = this.parts.length; j < jlen; ++j) {
            hash[this.parts[j]] = assem[j];
        }
        ret.push(hash);
    }

    return ret;
};

/**
 * 発動条件を満たす装備を組み立てて返す。
 */
Assembler.prototype._assembleEquip = function (actiComb) {
    var ret = [ [] ];
    for (var i = 0, ilen = this.parts.length; i < ilen; ++i) {
        var part       = this.parts[i];
        var equipNames = actiComb[part],
            eqNum      = equipNames.length,
            assems     = [];
        for (var j = 0, jlen = ret.length; j < jlen; ++j) {
            var assembly = ret[j],
                expanded = [];
            for (var k = 0; k < eqNum; ++k) {
                expanded.push(assembly.concat([ equipNames[k] ]));
            }
            assems = assems.concat(expanded);
        }
        ret = assems;
    }
    return ret;
};

/**
 * 装備の情報しか使わないので、装備の情報のみに単純化する。
 */
Assembler.prototype._simplifyActivableCombs = function (actiCombs) {
    var ret = [];
    for (var i = 0, len = actiCombs.length; i < len; ++i) {
        var comb = actiCombs[i],
            set  = {};
        for (var part in comb) set[part] = comb[part].equips;
        ret.push(set);
    }
    return ret;
};

var isEqual = function (combA, combB) {
    for (var part in combA) {
        var eqNamesA = combA[part], eqNamesB = combB[part];
        for (var i = 0, len = eqNamesA.length; i < len; ++i) {
            if (eqNamesA[i] !== eqNamesB[i]) return false;
        }
    }
    return true;
};

/**
 * 同じ装備の組み合わせをまとめる。
 */
Assembler.prototype._uniqActivableCombs = function (actiCombs) {
    // 各部位がもつ装備の数をくっつけたキーを作る
    var genKey = function (actiComb) {
        var str = '';
        for (var part in actiComb) {
            var equipNames = actiComb[part];
            str += str.length === 0 ? equipNames.length : ',' + equipNames.length;
        }
        return str;
    };

    // 同じ装備の数でないと同じ装備の組み合わせにはならないので
    // 同じ装備の数でまとめて調べる量を減らす
    var ret = [],
        buckets = {};
    for (var i = 0, ilen = actiCombs.length; i < ilen; ++i) {
        var comb = actiCombs[i];
        var key  = genKey(comb);
        if (buckets[key] == null) buckets[key] = [];
        var alreadyExists = false;
        for (var j = 0, jlen = buckets[key].length; j < jlen; ++j) {
            var combA = comb,
                combB = buckets[key][j];
            if (isEqual(combA, combB)) {
                alreadyExists = true;
                break;
            }
        }
        if (alreadyExists) continue;
        buckets[key].push(comb);
        ret.push(comb);
    }

    return ret;
};

Assembler.prototype._uniqAssemblies = function (assemblies) {
    var genKey = function (assem) {
        return assem.join();
    };

    var uniq = {};
    for (var i = 0, len = assemblies.length; i < len; ++i) {
        var assem = assemblies[i];
        uniq[genKey(assem)] = assem;
    }

    var ret = [];
    for (var key in uniq) ret.push(uniq[key]);

    return ret;
};

return simu.Assembler = Assembler;
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
