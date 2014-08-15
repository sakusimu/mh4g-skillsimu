(function (define) {
'use strict';
define([ './driver-namespace.js' ], function (myapp) {

/**
 * シミュレータのユーザ側クラス。
 * コンテキスト情報のクラス。
 */
var Context = function () {
    this.initialize.apply(this, arguments);
};

Context.prototype.initialize = function (args) {
    args = args || {};

    this.sex  = args.sex  || 'm'; // 'm' or 'w' (m: man, w: woman)
    this.type = args.type || 'k'; // 'k' or 'g' (k: kenshi, g: gunner)

    this.hr = args.hr || 8; // 進行度(HR)
    this.vs = args.vs || 6; // 進行度(村☆) vs=VillageStar
};

return myapp.Context = Context;
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
           factory(this.myapp);
       }
);
