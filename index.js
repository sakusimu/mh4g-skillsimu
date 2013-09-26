(function (define) {
'use strict';
var deps = [ './lib/namespace.js', './lib/simulator.js' ];
define(deps, function (simu, Simulator) {

simu.initialize = function () {
    this.engin = new Simulator();
};

simu.simulate = function (skillNames) {
    if (this.engin == null) this.initialize();
    return this.engin.simulate(skillNames);
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
           factory(this.simu, this.simu.Simulator);
       }
);
