(function (define) {
'use strict';
define([ './driver-namespace', './data-loader.js' ], function (myapp, testdata) {

/**
 * シミュレータのユーザ側クラス。
 * データを用意。
 */
var Data = function () {
    this.initialize.apply(this, arguments);
};

Data.prototype.initialize = function () {
    this.equips = {};
    this.equips.head  = testdata.equips.head;
    this.equips.body  = testdata.equips.body;
    this.equips.arm   = testdata.equips.arm;
    this.equips.waist = testdata.equips.waist;
    this.equips.leg   = testdata.equips.leg;
    this.decos        = testdata.decos;
    this.skills       = testdata.skills;
};

return myapp.data = new Data();
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
           factory(this.myapp, this.testdata);
       }
);
