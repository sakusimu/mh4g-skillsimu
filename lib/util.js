(function (define) {
'use strict';
define([ './namespace.js' ], function (simu) {

var Util = {};

// 胴系統倍化を処理しやすくするため body が先頭にきた各部位の配列
Util.parts = [ 'body', 'head', 'arm', 'waist', 'leg', 'weapon', 'oma' ];

// 単純な Object (というかハッシュ)をシャローコピーするだけを想定
Util.clone = function(obj) {
    if (obj == null) return null;
    var ret = {};
    for (var prop in obj) ret[prop] = obj[prop];
    return ret;
};

// A part of the following functions are:
//   http://underscorejs.org
//   (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//   Underscore may be freely distributed under the MIT license.
//
// From here

Util.has = function(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
};

Util.isArray = Array.isArray || function(obj) {
    return obj.toString.call(obj) === '[object Array]';
};

Util.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
};

Util.keys = function(obj) {
    if (!Util.isObject(obj)) return [];
    if (Object.keys) return Object.keys(obj);
    var keys = [];
    for (var key in obj) if (this.has(obj, key)) keys.push(key);
    return keys;
};

// So far

return simu.Util = Util;
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
           factory(this.simu);
       }
);
