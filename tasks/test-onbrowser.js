'use strict';

module.exports = function(grunt) {
    var path = require('path'),
        _    = require('underscore');

    var rootDir = path.resolve(__dirname, '../');

    grunt.registerMultiTask('test-onbrowser', 'Prepare for test on browser.', function() {
        var options = this.options();
        buildTestData(options);
    });

    var buildTestData = function (opts) {
        var testdata = opts.data.dest;
        var outPath  = rootDir + '/' + testdata,
            tmpl     = grunt.file.read(__dirname + '/test-onbrowser/testdata.tmpl');

        var data  = {},
            jsons = grunt.file.expand('data/*.json');
        jsons.forEach(function (json) {
            var jsonPath = rootDir + '/' + json,
                name     = path.basename(json, '.json');
            data[name] = grunt.file.read(jsonPath);
        });

        var contents = _.template(tmpl, data);
        grunt.file.write(outPath, contents);
        console.log('File "' + testdata + '" created.');
    };
};
