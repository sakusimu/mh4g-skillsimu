(function (define) {
'use strict';
define([ './namespace.js' ], function (simu) {

/**
 * シミュレータで利用するデータを持つクラス。
 *
 * 装備データ
 *   以下のプロパティを持つ。
 *     name       名前
 *     slot       スロット数
 *     skillComb  装備のスキルを { スキル系統: スキル値 } でまとめたもの
 *                スキル値は必ず数値(文字列はダメ)
 *                例えば「ユクモノドウギ」なら { '加護': 2, '気まぐれ': 2, '達人': 1 }
 *
 * 装飾品データ
 *   以下のプロパティを持つ。
 *     name       名前
 *     slot       スロット
 *     skillComb  装飾品のスキルを { スキル系統: スキル値 } でまとめたもの
 *                スキル値は必ず数値(文字列はダメ)
 *                例えば「攻撃珠【１】」なら { '攻撃': 1, '防御': -1 }
 *
 * スキルデータ
 *   以下のプロパティを持つ。
 *     name   スキル名
 *     tree   スキル系統
 *     point  ポイント
 *            ポイントは必ず数値(文字列はダメ)
 *
 * お守りデータ
 *   以下のプロパティを持つ。
 *     id         ID(一意なら何でもOK。普通は seed にしとけばよい)
 *     slot       スロット
 *     skillComb  装飾品のスキルを { スキル系統: スキル値 } でまとめたもの
 *                スキル値は必ず数値(文字列はダメ)
 *                例えば t5k9 なら { '溜め短縮': 5, '攻撃': 9 }
 *
 * cf. test/driver-model.js
 */
var Data = function () {
    this.initialize.apply(this, arguments);
};

Data.prototype.initialize = function () {
    // シミュ対象の装備データを各部位ごとに配列で持つ
    this.equips = {};
    this.parts = [ 'head', 'body', 'arm', 'waist', 'leg' ];
    for (var i = 0, len = this.parts.length; i < len; ++i) {
        var part = this.parts[i];
        this.equips[part] = [];
    }

    // シミュ対象の装飾品データを配列で持つ
    this.decos = [];

    // シミュ対象のスキルデータを { スキル名: スキルデータ } のハッシュで持つ
    this.skills = {};

    // シミュ対象のお守りデータを配列で持つ
    this.omas = [];
};

Data.prototype.set = function (data) {
    if (data.equips) {
        for (var part in data.equips) {
            this.equips[part] = data.equips[part];
        }
    }
    if (data.decos)  this.decos  = data.decos;
    if (data.skills) this.skills = data.skills;
    if (data.omas)   this.omas   = data.omas;
};

return simu.data = new Data();
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
           factory(this.simu);
       }
);
