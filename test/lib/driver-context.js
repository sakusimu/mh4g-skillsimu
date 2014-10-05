'use strict';

/**
 * シミュレータのユーザ側クラス。
 * コンテキスト情報のクラス。
 */
var Context = function () {
    this.initialize.apply(this, arguments);
};

Context.prototype.initialize = function (args) {
    args = args || {};

    this.sex  = args.sex  || 'm'; // 'm' or 'w' (m: man, w: woman)
    this.type = args.type || 'k'; // 'k' or 'g' (k: kenshi, g: gunner)

    this.hr = args.hr || 8; // 進行度(HR)
    this.vs = args.vs || 6; // 進行度(村☆) vs=VillageStar
};

module.exports = Context;
