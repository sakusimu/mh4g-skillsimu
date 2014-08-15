/* jshint evil:true */
/* global testdata:false */
var fs    = require('fs'),
    path  = require('path');

var root = path.resolve(__dirname, '..', '..'),
    filepath = path.join(root, 'tmp/testdata.js');

var jscode = fs.readFileSync(filepath, 'utf-8');

eval(jscode);

module.exports = testdata;
