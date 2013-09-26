(function (define) {
'use strict';
var deps = [ 'underscore', './driver-namespace' ];
define(deps, function (_, myapp) {

/**
 * シミュレータのユーザ側クラス。
 * データを用意。
 */
var Data = function () {
    this.initialize.apply(this, arguments);
};

Data.prototype.initialize = function () {
    var parts = [ 'head', 'body', 'arm', 'waist', 'leg' ];

    this.equips = {};
    _.each(parts, function (part) { this.equips[part] = {}; }, this);

    this.decos  = {};
    this.skills = {};
    this.omas   = [];
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
           require('./data-loader.js');
       } :
       function (deps, factory) {
           factory(this._, this.myapp);
       }
);
