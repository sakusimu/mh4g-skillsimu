'use strict';
var Normalizer = require('./deco/normalizer.js'),
    Combinator = require('./deco/combinator.js'),
    Assembler = require('./deco/assembler.js');

/**
 * 装飾品の組み合わせを求めるクラス。
 *
 * ユースケースとして、一度シミュした後の装飾品検索で使われることを想定しているので
 * 前提として、そのスキルが発動する装備の組み合わせはわかっている。
 */
var Simulator = function () {
    this.initialize.apply(this, arguments);
};

Simulator.prototype.initialize = function () {
    this.normalizer = new Normalizer();
    this.combinator = new Combinator();
    this.assembler  = new Assembler();
};

/**
 * 条件となるスキルの発動を満たす装飾品の組み合わせを返す。
 */
Simulator.prototype.simulate = function (skillNames, equip) {
    if (skillNames == null || skillNames.length === 0) return null;
    if (equip == null) return null;

    this.normalizer.initialize();
    this.combinator.initialize();
    this.assembler.initialize();

    var bulksSet = this.normalizer.normalize(skillNames, equip);
    var decombs  = this.combinator.combine(skillNames, bulksSet, equip);
    var assems   = this.assembler.assemble(decombs);

    return assems;
};

module.exports = Simulator;
