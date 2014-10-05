'use strict';

exports.parts = [ 'head', 'body', 'arm', 'waist', 'leg', 'weapon', 'oma' ];

// 単純な Object (というかハッシュ)をシャローコピーするだけを想定
exports.clone = function(obj) {
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

exports.has = function(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
};

exports.isArray = Array.isArray || function(obj) {
    return obj.toString.call(obj) === '[object Array]';
};

exports.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
};

// So far
