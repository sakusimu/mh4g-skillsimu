'use strict';
var data = require('./lib/data.js'),
    EquipSimulator = require('./lib/equip.js'),
    DecoSimulator = require('./lib/deco.js');

var VERSION = '0.4.0';

var Simulator = function () {
    this.initialize.apply(this, arguments);
};

Simulator.prototype.initialize = function () {
    this.equip = new EquipSimulator();
    this.deco  = new DecoSimulator();
    this.data  = data;

    this.VERSION = VERSION;
};

Simulator.prototype.simulateEquip = function (skillNames, opts) {
    return this.equip.simulate(skillNames, opts);
};

Simulator.prototype.simulateDeco = function (skillNames, equips) {
    return this.deco.simulate(skillNames, equips);
};

module.exports = Simulator;
