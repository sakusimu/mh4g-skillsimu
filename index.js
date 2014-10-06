'use strict';

exports.VERSION = '0.5.0';
exports.Simulator = require('./lib/simulator.js');
exports.data = require('./lib/data.js');
exports.util = require('./lib/util.js');

if (global.document) global.simu = exports;
