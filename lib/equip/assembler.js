(function (define) {
'use strict';
define([ '../equip.js', '../data.js' ], function (Equip, data) {

/**
 * 発動条件を満たすスキルポイントの組み合わせを元に、装備と装飾品を
 * 組み立てるクラス。
 *
 * 概要
 *     var a = new Assembler();
 *     var actiCombs // Combinator で [ '攻撃力UP【大】', '業物' ] の組み合わせの結果
 *         = [ { head:
 *                { skillComb: { '攻撃': 5, '斬れ味': 3 },
 *                  equips: [ 'シルバーソルヘルム' ] },
 *               body:
 *                { skillComb: { '攻撃': 0, '斬れ味': 0 },
 *                  equips: [ 'slot0', '大和【胴当て】' ] },
 *               arm:
 *                { skillComb: { '攻撃': 7, '斬れ味': 1 },
 *                  equips: [ 'シルバーソルアーム' ] },
 *               waist:
 *                { skillComb: { '攻撃': 5, '斬れ味': 3 },
 *                  equips: [ 'シルバーソルコイル' ] },
 *               leg:
 *                { skillComb: { '攻撃': 5, '斬れ味': 3 },
 *                  equips: [ 'シルバーソルグリーヴ' ] },
 *               weapon: null },
 *             { head:
 *                { skillComb: { '攻撃': 5, '斬れ味': 3 },
 *                  equips: [ 'シルバーソルヘルム' ] },
 *               body:
 *                { skillComb: { '攻撃': 0, '斬れ味': 0 },
 *                  equips: [ 'slot0', '大和【胴当て】' ] },
 *               arm:
 *                { skillComb: { '攻撃': 7, '斬れ味': 1 },
 *                  equips: [ 'シルバーソルアーム' ] },
 *               waist:
 *                { skillComb: { '攻撃': 5, '斬れ味': 3 },
 *                  equips: [ 'シルバーソルコイル' ] },
 *               leg:
 *                { skillComb: { '攻撃': 3, '斬れ味': 4 },
 *                  equips: [ 'シルバーソルグリーヴ' ] },
 *               weapon: null },
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
    this.parts = data.parts.concat([ 'weapon', 'oma' ]);
    this.threshold = 9999; // 組み合わせ数がこの閾値を超えたら打ち切り
};

/**
 * 発動条件を満たすスキルポイントの組み合わせを元に、装備を組み立てて返す。
 *
 * 装飾品の組み合わせまで見ると処理に時間がかかるので装飾品は見ない。
 */
Assembler.prototype.assemble = function (actiCombs) {
    if (actiCombs == null || actiCombs.length === 0) return [];

    var i, ilen, len;

    actiCombs = this._simplify(actiCombs);
    actiCombs = this._uniqActivableCombs(actiCombs);

    var assemblies = [],
        cache = {};
    for (i = 0, len = actiCombs.length; i < len; ++i) {
        var comb = actiCombs[i];
        assemblies = assemblies.concat(this._assemble(comb, cache));

        if (assemblies.length > this.threshold) {
            assemblies = assemblies.slice(0, this.threshold);
            break;
        }
    }

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
 * cache が指定されたら、cache 利用してユニークにしながら組み立てる。
 */
Assembler.prototype._assemble = function (actiComb, cache) {
    var i, ilen, assem;

    var assems = [ [] ];
    for (i = 0, ilen = this.parts.length; i < ilen; ++i) {
        var part  = this.parts[i];
        var names = actiComb[part],
            num   = names.length,
            list  = [];
        for (var j = 0, jlen = assems.length; j < jlen; ++j) {
            assem = assems[j];
            var expanded = [];
            if (num === 0) expanded.push(assem.concat(null));
            for (var k = 0; k < num; ++k) {
                expanded.push(assem.concat(names[k]));
            }
            list = list.concat(expanded);
        }
        assems = list;
    }

    if (cache == null) return assems;

    var ret = [];
    for (i = 0, ilen = assems.length; i < ilen; ++i) {
        assem = assems[i];
        var key = genKey(assem);
        if (cache[key]) continue;
        cache[key] = true;
        ret.push(assem);
    }

    return ret;
};

var genKey = function (assem) { return assem.join(); };

/**
 * 装備の情報しか使わないので、装備の情報のみに単純化する。
 * (武器スロやお守りが null なら空の配列を用意する)
 */
Assembler.prototype._simplify = function (actiCombs) {
    var ret = [];
    for (var i = 0, ilen = actiCombs.length; i < ilen; ++i) {
        var comb = actiCombs[i],
            set  = {};
        for (var j = 0, jlen = this.parts.length; j < jlen; ++j) {
            var part = this.parts[j];
            set[part] = comb[part] ? comb[part].equips : [];
        }
        ret.push(set);
    }
    return ret;
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
        var comb = actiCombs[i],
            key  = genKey(comb);
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

var isEqual = function (combA, combB) {
    for (var part in combA) {
        var eqNamesA = combA[part],
            eqNamesB = combB[part];
        for (var i = 0, len = eqNamesA.length; i < len; ++i) {
            if (eqNamesA[i] !== eqNamesB[i]) return false;
        }
    }
    return true;
};

return Equip.Assembler = Assembler;
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
           factory(this.simu.Equip, this.simu.data);
       }
);
