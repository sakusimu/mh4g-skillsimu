'use strict';
var util = require('./util/util.js'),
    sutil = require('./util/skill.js'),
    dutil = require('./util/deco.js'),
    cutil = require('./util/comb.js'),
    BorderLine = require('./util/border-line.js');

for (var prop in util) {
    exports[prop] = util[prop];
}

exports.skill = sutil;
exports.deco  = dutil;
exports.comb  = cutil;
exports.BorderLine = BorderLine;
