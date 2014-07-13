'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: [
            '/*!'
          , ' * <%= pkg.name %> <%= pkg.version %>'
          , ' * Copyright (C) <%= grunt.template.today("yyyy") %> <%= pkg.author %>'
          , ' * Licensed under the MIT license.'
          , ' * <%= _.pluck(pkg.licenses, "url").join(", ") %>'
          , ' */\n'
        ].join('\n'),

        clean: {
            dist: [ 'dist' ]
        },

        jshint: {
            all: [ 'Gruntfile.js', 'lib/**/*.js', 'test/**/*.js', 'tasks/**/*.js' ],
            options: {
                force: true,
                ignores: [ 'vendor/*.js' ],
                jshintrc: '.jshintrc'
            }
        },

        concat: {
            options: {
                banner: '<%= banner %>'
            },
            js: {
                src: [
                    'lib/namespace.js'
                  , 'lib/data.js'
                  , 'lib/util.js'
                  , 'lib/util/skill.js', 'lib/util/deco.js', 'lib/util/comb.js'
                  , 'lib/equip.js'
                  , 'lib/equip/normalizer.js'
                  , 'lib/equip/combinator.js'
                  , 'lib/equip/assembler.js'
                  , 'lib/equip/simulator.js'
                  , 'lib/deco.js'
                  , 'lib/deco/normalizer.js'
                  , 'lib/deco/combinator.js'
                  , 'lib/deco/simulator.js'
                  , 'index.js'
                ],
                dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>',
                report: 'min'
            },
            js: {
                src : '<%= concat.js.dest %>',
                dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
            }
        },

        'build-data': {
            testdata: { src: 'data', dest : 'data' }
        },

        'test-prove': {
            all: { src: 'test/*.js' },
            one: {}
        },

        'test-onbrowser': {
            options: {
                data: { dest: 'data/testdata.js' }
            },
            test: {}
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadTasks('tasks');

    grunt.registerTask('default', [ 'clean', 'test', 'dist' ]);
    grunt.registerTask('dist', [ 'concat', 'uglify' ]);
    grunt.registerTask('test', function (file) {
        grunt.task.run([ 'jshint' ]);
        var task = [ 'test-prove' ];
        [].push.apply(task, file != null ? [ 'one', file ] : [ 'all' ]);
        grunt.task.run(task.join(':'));
    });
};
