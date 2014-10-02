'use strict';
/* jshint evil:true */
var fs   = require('fs'),
    path = require('path');

var testdata = global.testdata;

if (!testdata) {
    var root = path.resolve(__dirname, '..', '..'),
        filepath = path.join(root, 'tmp/testdata.js');

    var jscode = fs.readFileSync(filepath, 'utf-8');

    testdata = eval(jscode);
}

module.exports = testdata;
