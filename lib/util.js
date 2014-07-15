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

Util.combination = function (list, r) {
    if (list == null) return [];
    var ret = [];
    for (var i = 0, len = list.length; i < len; ++i) {
        ret = ret.concat(_comb(list, r, [], i, 0));
    }
    return ret;
};

var _comb = function (list, r, combs, index, cnt) {
    if (++cnt > r) return combs;

    // r 回組み合わせる前にリストの最後に達してしまった場合
    if (index >= list.length) return [];

    if (combs.length === 0) {
        combs.push([ list[index] ]);
        return _comb(list, r, combs, index + 1, cnt);
    }

    var newCombs = [];
    for (var i = 0, ilen = combs.length; i < ilen; ++i) {
        var newList = [];
        for (var j = index, jlen = list.length; j < jlen; ++j) {
            var comb = combs[i].concat(list[j]);
            newList = newList.concat(_comb(list, r, [ comb ], j + 1, cnt));
        }
        newCombs = newCombs.concat(newList);
    }

    return newCombs;
};
Util._combination = _comb;

Util.power = function (list) {
    var size = list.length,
        pow  = Math.pow(2, size),
        ret  = [];
    for (var n = 0; n < pow; ++n) {
        var subset = [],
            bit = n;
        for (var i = 0; i < size; bit >>= 1, ++i) {
            if (bit & 1) subset.push(list[i]);
        }
        ret.push(subset);
    }
    return ret;
};

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
