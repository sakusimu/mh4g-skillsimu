(function (define) {
'use strict';
var deps = [ './lib/namespace.js', './lib/simulator.js', './lib/deco-simulator' ];
define(deps, function (simu, Simulator, DecoSimulator) {

simu.initialize = function () {
    this.simu     = null;
    this.decoSimu = null;
};

simu.simulate = function (skillNames, opts) {
    if (this.simu == null) this.simu = new Simulator();
    return this.simu.simulate(skillNames, opts);
};

simu.simulateDeco = function (skillNames, equips, opts) {
    if (this.decoSimu == null) this.decoSimu = new DecoSimulator();
    return this.decoSimu.simulate(skillNames, equips, opts);
};

return simu;
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
           factory(this.simu, this.simu.Simulator, this.simu.DecoSimulator);
       }
);
