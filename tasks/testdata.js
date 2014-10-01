'use strict';
// jshint laxcomma:true
module.exports = function (grunt) {
    var path = require('path'),
        request = require('request');

    var data  = {},
        dlcnt = 0,
        done;

    grunt.registerMultiTask('testdata', 'Build test data.', function () {
        done = this.async();

        var count = 0,
            urls  = this.data.urls;
        for (var name in urls) {
            download(name, urls[name]);
            ++count;
        }

        var self = this;
        setInterval(function () {
            if (count !== dlcnt) return;
            buildTestData(self.data.dest);
            done();
        }, 100);
    });

    var download = function (name, url) {
        request.get(url, function (error, res, body) {
            var code = res.statusCode;

            if (error || code !== 200) {
                var msg = '(code: ' + code + ')';
                grunt.log.warn('download error:', url, msg);
                done(false);
                return;
            }

            data[name] = body;
            ++dlcnt;
            grunt.log.ok('download:', url);
        });
    };

    var buildTestData = function (dest) {
        var outPath = path.resolve(dest),
            content = grunt.template.process(template, { data: data });
        grunt.file.write(outPath, content);
        grunt.log.ok('created:', dest);
    };

    var template = [
        'var testdata = {};'
      , 'testdata.equips = {};'
      , 'testdata.equips.head ='
      , '<%= equip_head %>'
      , ';'
      , 'testdata.equips.body ='
      , '<%= equip_body %>'
      , ';'
      , 'testdata.equips.arm ='
      , '<%= equip_arm %>'
      , ';'
      , 'testdata.equips.leg ='
      , '<%= equip_leg %>'
      , ';'
      , 'testdata.equips.waist ='
      , '<%= equip_waist %>'
      , ';'
      , 'testdata.decos ='
      , '<%= deco %>'
      , ';'
      , 'testdata.skills ='
      , '<%= skill %>'
      , ';'
      , 'testdata;'
    ].join('\n');
};
