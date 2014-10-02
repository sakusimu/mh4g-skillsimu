'use strict';

/**
 * シミュレータで利用するデータを持つクラス。
 *
 * 装備データ
 * 防具
 *   name       名前
 *   slot       スロット数
 *   skillComb  装備のスキルを { スキル系統: スキル値 } でまとめたもの
 *              スキル値は必ず数値(文字列はダメ)
 *              例えば「ユクモノドウギ」なら { '加護': 2, '気まぐれ': 2, '達人': 1 }
 * お守り
 *   name       名前
 *              normalizer で、名前ごとにスキルをまとめたりするので
 *              「龍の護石」とかの同じ名前の護石だらけになるとマズイ
 *   slot       スロット
 *   skillComb  装飾品のスキルを { スキル系統: スキル値 } でまとめたもの
 *              スキル値は必ず数値(文字列はダメ)
 *              例えば t5k9 なら { '溜め短縮': 5, '攻撃': 9 }
 *
 * 装飾品データ
 *   name       名前
 *   slot       スロット
 *   skillComb  装飾品のスキルを { スキル系統: スキル値 } でまとめたもの
 *              スキル値は必ず数値(文字列はダメ)
 *              例えば「攻撃珠【１】」なら { '攻撃': 1, '防御': -1 }
 *
 * スキルデータ
 *   name   スキル名
 *   tree   スキル系統
 *   point  ポイント
 *          ポイントは必ず数値(文字列はダメ)
 *
 * cf. test/lib/driver-myapp.js
 *
 * 固定装備
 *   例えば頭を固定したい場合、equips.head に固定したい装備を1つだけセットすればOK。
 *
 * 装飾品なし
 *   装飾品なしでシミュりたい場合は decos を [] にすればOK。
 */
var Data = function () {
    this.initialize.apply(this, arguments);
};

Data.prototype.initialize = function () {
    // シミュ対象の装備データを各部位ごとに配列で持つ
    this.equips = {};
    this.parts = [ 'head', 'body', 'arm', 'waist', 'leg', 'weapon', 'oma' ];
    for (var i = 0, len = this.parts.length; i < len; ++i) {
        var part = this.parts[i];
        this.equips[part] = [];
    }

    // シミュ対象の装飾品データを配列で持つ
    this.decos = [];

    // シミュ対象のスキルデータを { スキル名: スキルデータ } のハッシュで持つ
    this.skills = {};
};

Data.prototype.set = function (data) {
    var equips = data.equips || {};
    for (var i = 0, len = this.parts.length; i < len; ++i) {
        var part = this.parts[i];
        this.equips[part] = equips[part] || [];
    }
    this.decos  = data.decos || [];
    this.skills = data.skills || {};
};

var data = new Data();

module.exports = data;
