(function (define) {
'use strict';
define([ '../deco.js' ], function (Deco) {

var Assembler = function () {
    this.initialize.apply(this, arguments);
};

Assembler.prototype.initialize = function () {};

Assembler.prototype.assemble = function (decombSets) {
    var ret = [];

    var isTorsoUp = this._checkTorsoUp(decombSets);

    for (var i = 0, len = decombSets.length; i < len; ++i) {
        var decombSet = decombSets[i],
            all = [], torsoUp = [], rest = []; // all = torsoUp + rest
        for (var part in decombSet) {
            var decomb = decombSet[part];
            if (decomb == null) continue;
            var names = decomb.names;
            all = all.concat(names);
            if (isTorsoUp && part !== 'body') rest = rest.concat(names);
            if (isTorsoUp && part === 'body') torsoUp = torsoUp.concat(names);
        }
        if (!isTorsoUp) rest = all.concat();
        var assem = { all: all, torsoUp: torsoUp, rest: rest };
        ret.push(assem);
    }
    return ret;
};

Assembler.prototype._checkTorsoUp = function (decombSets) {
    for (var i = 0, len = decombSets.length; i < len; ++i) {
        var decombSet = decombSets[i];
        for (var part in decombSet) {
            var decomb = decombSet[part];
            if (decomb == null) continue;
            if (decomb.skillComb['胴系統倍化']) return true;
        }
    }
    return false;
};

return Deco.Assembler = Assembler;
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
           factory(this.simu.Deco);
       }
);
