(function (define) {
'use strict';
var deps = [ './namespace.js', './normalizer.js', './combinator.js', './assembler.js' ];
define(deps, function (simu, Normalizer, Combinator, Assembler) {

var Simulator = function () {
    this.initialize.apply(this, arguments);
};

Simulator.prototype.initialize = function () {
    this.normalizer = new Normalizer();
    this.combinator = new Combinator();
    this.assembler  = new Assembler();
};

Simulator.prototype.simulate = function (skillNames, opts) {
    this.normalizer.initialize(opts);
    this.combinator.initialize(opts);
    this.assembler.initialize(opts);

    var norCombsSet = this.normalizer.normalize(skillNames);
    var actiCombs   = this.combinator.combine(skillNames, norCombsSet);
    var assems      = this.assembler.assembleEquip(actiCombs);
    return assems;
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
           factory(this.simu, this.simu.Normalizer,
                   this.simu.Combinator, this.simu.Assembler);
       }
);
