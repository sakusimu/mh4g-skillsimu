'use strict';

module.exports = function(grunt) {
    var proc = require('child_process');

    var done;

    grunt.registerMultiTask('test-prove', 'Test with prove command.', function(test) {
        var options = this.options({
            target : test == null ? 'test/' : test
        });

        done = this.async();

        if (this.target === 'all') all.call(this, options);
        else                       one.call(this, options);
    });

    var one = function (opts) {
        var args = '--verbose --exec=node --ext=.js';
        var cmd  = [ 'prove', args, opts.target ].join(' ');
        proc.exec(cmd, callback);
    };

    var all = function (opts) {
        var args = '--exec=node --ext=.js';
        var cmd  = [ 'prove', args, opts.target ].join(' ');
        proc.exec(cmd, callback);
    };

    var callback = function (err, stdout, stderr) {
        if (err) grunt.log.error('prove:', err);

        grunt.log.ok('-- stdout --');
        console.log(stdout);
        grunt.log.warn('-- stderr --');
        console.log(stderr);

        done(err ? false : true);
    };
};
