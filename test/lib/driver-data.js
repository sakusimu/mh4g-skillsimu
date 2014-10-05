'use strict';
var testdata = require('./data-loader.js');

/**
 * シミュレータのユーザ側クラス。
 * データを用意。
 */
var Data = function () {
    this.initialize.apply(this, arguments);
};

Data.prototype.initialize = function () {
    this.equips = {};
    this.equips.head  = testdata.equips.head;
    this.equips.body  = testdata.equips.body;
    this.equips.arm   = testdata.equips.arm;
    this.equips.waist = testdata.equips.waist;
    this.equips.leg   = testdata.equips.leg;
    this.decos        = testdata.decos;
    this.skills       = testdata.skills;
};

module.exports = new Data();
