'use strict';

module.exports = function(grunt) {
    // jshint laxcomma:true
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
            all: [ 'dist', 'tmp' ]
        },

        jshint: {
            all: [ '*.js', 'lib/**/*.js', 'test/**/*.js', 'tasks/**/*.js' ],
            options: {
                force: true,
                jshintrc: true
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
                  , 'lib/util/border-line.js'
                  , 'lib/equip.js'
                  , 'lib/equip/normalizer.js'
                  , 'lib/equip/combinator.js'
                  , 'lib/equip/assembler.js'
                  , 'lib/equip/simulator.js'
                  , 'lib/deco.js'
                  , 'lib/deco/normalizer.js'
                  , 'lib/deco/combinator.js'
                  , 'lib/deco/assembler.js'
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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-espower');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadTasks('tasks');

    grunt.registerTask('default', [ 'clean', 'test', 'dist' ]);
    grunt.registerTask('dist', [ 'concat', 'uglify' ]);
    grunt.registerTask('test', function (type, file) {
        switch (type) {
        case 'node':
            var files = grunt.config.data.mochaTest.test.src;
            if (file) {
                file = file.replace('test/unit/', 'tmp/espowered/');
                files.splice(-1, 1, file);
            }
            grunt.task.run([ 'jshint', 'espower:test', 'mochaTest:test' ]);
            break;
        case 'karma':
            /* falls through */
        default:
        }
    });
};
