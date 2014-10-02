'use strict';
var Normalizer = require('./equip/normalizer.js'),
    Combinator = require('./equip/combinator.js'),
    Assembler = require('./equip/assembler.js');

var Simulator = function () {
    this.initialize.apply(this, arguments);
};

Simulator.prototype.initialize = function () {
    this.normalizer = new Normalizer();
    this.combinator = new Combinator();
    this.assembler  = new Assembler();
};

Simulator.prototype.simulate = function (skillNames) {
    this.normalizer.initialize();

    var bulksSet = this.normalizer.normalize(skillNames);
    var eqcombs  = this.combinator.combine(skillNames, bulksSet);
    var assems   = this.assembler.assemble(eqcombs);
    return assems;
};

module.exports = Simulator;
