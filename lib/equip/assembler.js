'use strict';
var util = require('../util.js');

/**
 * 発動条件を満たす装備の組み合わせを元に、装備を組み立てるクラス。
 *
 *     var a = new Assembler();
 *     var eqcombs = [
 *         { head  : [ 'head1a', 'head1b' ],
 *           body  : [ 'body1' ],
 *           arm   : [ 'arm1' ],
 *           waist : [ 'waist1' ],
 *           leg   : [ 'leg1' ],
 *           weapon: [ 'weapon1' ],
 *           oma   : [ 'oma1' ] },
 *         { head  : [ 'head2' ],
 *           body  : [ 'body2' ],
 *           arm   : [ 'arm2' ],
 *           waist : [ 'waist2' ],
 *           leg   : [ 'leg2' ],
 *           weapon: [],
 *           oma   : [ 'oma2a', 'oma2b' ] }
 *     ];
 *     a.assebleEquip(eqcombs);
 *     => [
 *            { head  : 'head1a',
 *              body  : 'body1',
 *              arm   : 'arm1',
 *              waist : 'waist1',
 *              leg   : 'leg1',
 *              weapon: 'weapon1',
 *              oma   : 'oma1' },
 *            { head  : 'head1b',
 *              body  : 'body1',
 *              arm   : 'arm1',
 *              waist : 'waist1',
 *              leg   : 'leg1',
 *              weapon: 'weapon1',
 *              oma   : 'oma1' },
 *            { head  : 'head2',
 *              body  : 'body2',
 *              arm   : 'arm2',
 *              waist : 'waist2',
 *              leg   : 'leg2',
 *              weapon: null,
 *              oma   : 'oma2a' },
 *            { head  : 'head2',
 *              body  : 'body2',
 *              arm   : 'arm2',
 *              leg   : 'leg2',
 *              waist : 'waist2',
 *              weapon: null,
 *              oma   : 'oma2b' }
 *        ]
 */
var Assembler = function () {
    this.initialize.apply(this, arguments);
};

Assembler.prototype.initialize = function () {
    this.threshold = 9999; // 組み合わせ数がこの閾値を超えたら打ち切り
};

var parts = util.parts;

/**
 * 発動条件を満たす装備の組み合わせを元に、装備を組み立てて返す。
 */
Assembler.prototype.assemble = function (eqcombs) {
    if (eqcombs == null || eqcombs.length === 0) return [];

    var i, ilen, len;

    var assems = [],
        cache = {};
    for (i = 0, len = eqcombs.length; i < len; ++i) {
        var comb = eqcombs[i];
        assems = assems.concat(this._assemble(comb, cache));

        if (assems.length > this.threshold) {
            assems = assems.slice(0, this.threshold);
            break;
        }
    }

    var ret = [];
    for (i = 0, ilen = assems.length; i < ilen; ++i) {
        var assem = assems[i],
            equip = {};
        for (var j = 0, jlen = parts.length; j < jlen; ++j) {
            var part = parts[j];
            equip[part] = assem[j];
        }
        ret.push(equip);
    }

    return ret;
};

/**
 * 発動条件を満たす装備を組み立てて返す。
 * cache が指定されたら、cache 利用してユニークにしながら組み立てる。
 */
Assembler.prototype._assemble = function (eqcomb, cache) {
    var i, ilen, assem;

    var assems = [ [] ];
    for (i = 0, ilen = parts.length; i < ilen; ++i) {
        var part  = parts[i],
            names = eqcomb[part],
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

module.exports = Assembler;
