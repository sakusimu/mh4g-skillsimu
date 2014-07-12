(function (define) {
'use strict';
var deps = [ './lib/namespace.js',
             './lib/equip/simulator.js', './lib/deco/simulator.js' ];
define(deps, function (simu, EquipSimulator, DecoSimulator) {

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

Simulator.prototype.simulateDeco = function (skillNames, equips, opts) {
    return this.deco.simulate(skillNames, equips, opts);
};

return simu.Simulator = Simulator;
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
           factory(this.simu, this.simu.Equip.Simulator, this.simu.Deco.Simulator);
       }
);
