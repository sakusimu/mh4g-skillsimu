'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: [
            '/**',
            ' * <%= pkg.name %> <%= pkg.version %>',
            ' * Copyright (C) <%= grunt.template.today("yyyy") %> <%= pkg.author %>',
            ' * Licensed under the MIT license.',
            ' * <%= _.pluck(pkg.licenses, "url").join(", ") %>',
            ' */\n'
        ].join('\n'),

        clean: {
            all: [ 'dist', 'tmp' ]
        },

        jshint: {
            all: [ '*.js', 'lib/**/*.js', 'test/**/*.js', 'benchmark/**/*.js', 'tasks/**/*.js' ],
            options: {
                force: true,
                jshintrc: true
            }
        },

        browserify: {
            dist: {
                src: 'index.js',
                dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
            },
            test: {
                src: 'test/unit/**/*.js',
                dest: 'tmp/test-browser.js',
                options: {
                    transform: [ 'espowerify' ]
                }
            },
            'benchmark-equip': {
                src: 'benchmark/equip-simu.js',
                dest: 'tmp/benchmark/equip-simu.js'
            },
            'benchmark-deco': {
                src: 'benchmark/deco-simu.js',
                dest: 'tmp/benchmark/deco-simu.js'
            },
            'benchmark-util': {
                src: 'benchmark/util.js',
                dest: 'tmp/benchmark/util.js'
            }
        },

        usebanner: {
            dist: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>',
                    linebreak: false
                },
                files: {
                    src: [ '<%= browserify.dist.dest %>' ]
                }
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>',
                report: 'min'
            },
            js: {
                src: '<%= browserify.dist.dest %>',
                dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
            }
        },

        testdata: {
            mh4: {
                dest: 'tmp/testdata.js',
                urls: {
                    'equip_head' : 'http://sakusimu.net/data/mh4/equip_head.json',
                    'equip_body' : 'http://sakusimu.net/data/mh4/equip_body.json',
                    'equip_arm'  : 'http://sakusimu.net/data/mh4/equip_arm.json',
                    'equip_waist': 'http://sakusimu.net/data/mh4/equip_waist.json',
                    'equip_leg'  : 'http://sakusimu.net/data/mh4/equip_leg.json',
                    'deco' : 'http://sakusimu.net/data/mh4/deco.json',
                    'skill': 'http://sakusimu.net/data/mh4/skill.json'
                }
            }
        },

        espower: {
            test: {
                files: [
                    { expand: true,
                      cwd: 'test/unit',
                      src: [ '**/*.js' ],
                      dest: 'tmp/espowered/',
                      ext: '.js' }
                ]
            }
        },

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: [ 'tmp/espowered/**/*.js' ]
            }
        },

        karma: {
            test: {
                configFile: 'test/karma-conf.js',
                singleRun: true,
                options: {
                    files: [
                        '<%= testdata.mh4.dest %>',
                        '<%= browserify.test.dest %>'
                    ]
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);
    grunt.loadTasks('tasks');

    grunt.registerTask('default', [ 'clean:all', 'test', 'dist' ]);
    grunt.registerTask('dist', [ 'browserify:dist', 'usebanner:dist', 'uglify' ]);
    grunt.registerTask('test', function (type, file) {
        switch (type) {
        case 'browser':
            grunt.task.run([ 'browserify:test', 'karma:test' ]);
            break;
        case 'node':
            var files = grunt.config.data.mochaTest.test.src;
            if (file) {
                file = file.replace('test/unit/', 'tmp/espowered/');
                files.splice(-1, 1, file);
            }
            grunt.task.run([ 'jshint', 'espower:test', 'mochaTest:test' ]);
            /* falls through */
        default:
        }
    });
    grunt.registerTask('benchmark', [
        'browserify:benchmark-equip',
        'browserify:benchmark-deco',
        'browserify:benchmark-util'
    ]);
};
