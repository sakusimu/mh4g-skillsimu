'use strict';

/**
 * 発動条件を満たす装飾品の組み合わせを元に、結果を組み立てるクラス。
 *
 *     var skills = [ '斬れ味レベル+1', '高級耳栓' ];
 *     var equip = {
 *         head  : ユクモノカサ・天,
 *         body  : 三眼の首飾り,
 *         arm   : ユクモノコテ・天,
 *         waist : バンギスコイル,
 *         leg   : ユクモノハカマ・天,
 *         weapon: slot2,
 *         oma   : 龍の護石(スロ3,匠+4,氷耐性-5)
 *     };
 *     var n = new Normalizer();
 *     var bulksSet = n.normalize(skills, equip);
 *     var c = new Combinator();
 *     var decombs = c.combine(skills, bulksSet, equip);
 *     => [ // all = torsoUp + rest
 *            { all: [ '防音珠【３】', '防音珠【１】', '防音珠【１】', '防音珠【１】',
 *                     '防音珠【１】', '防音珠【１】', '防音珠【１】', '防音珠【１】',
 *                     '匠珠【３】' ],
 *              torsoUp: [ '防音珠【３】' ],
 *              rest: [ '防音珠【１】', '防音珠【１】', '防音珠【１】', '防音珠【１】',
 *                      '防音珠【１】', '防音珠【１】', '防音珠【１】', '匠珠【３】' ] },
 *            ...
 *     ]
 */
var Assembler = function () {
    this.initialize.apply(this, arguments);
};

Assembler.prototype.initialize = function () {};

Assembler.prototype.assemble = function (decombs) {
    if (decombs == null || decombs.length === 0) return [];

    var isTorsoUp = this._checkTorsoUp(decombs);

    var ret = [];
    for (var i = 0, len = decombs.length; i < len; ++i) {
        var decomb = decombs[i],
            all = [], torsoUp = [], rest = []; // all = torsoUp + rest
        for (var part in decomb) {
            var comb = decomb[part];
            if (comb == null) continue;
            var names = comb.decos;
            all = all.concat(names);
            if (isTorsoUp && part !== 'body') rest = rest.concat(names);
            if (isTorsoUp && part === 'body') torsoUp = torsoUp.concat(names);
        }
        if (!isTorsoUp) rest = all.concat();
        var assem = { all: all, torsoUp: torsoUp, rest: rest };
        ret.push(assem);
    }
    return ret;
};

Assembler.prototype._checkTorsoUp = function (decombs) {
    for (var i = 0, len = decombs.length; i < len; ++i) {
        var decomb = decombs[i];
        for (var part in decomb) {
            var comb = decomb[part];
            if (comb == null) continue;
            if (comb.skillComb['胴系統倍化']) return true;
        }
    }
    return false;
};

module.exports = Assembler;
