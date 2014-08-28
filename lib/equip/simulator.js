(function (define) {
'use strict';
var deps = [ '../equip.js', './normalizer.js', './combinator.js', './assembler.js' ];
define(deps, function (Equip, Normalizer, Combinator, Assembler) {

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

return Equip.Simulator = Simulator;
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
           factory(this.simu.Equip, this.simu.Equip.Normalizer,
                   this.simu.Equip.Combinator, this.simu.Equip.Assembler);
       }
);
