'use strict';
var EquipSimulator = require('./equip.js'),
    DecoSimulator  = require('./deco.js');

var Simulator = function () {
    this.initialize.apply(this, arguments);
};

Simulator.prototype.initialize = function () {
    this.equip = new EquipSimulator();
    this.deco  = new DecoSimulator();
};

Simulator.prototype.simulateEquip = function (skillNames, opts) {
    return this.equip.simulate(skillNames, opts);
};

Simulator.prototype.simulateDeco = function (skillNames, equips) {
    return this.deco.simulate(skillNames, equips);
};

module.exports = Simulator;
