module.exports = function(grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        requirejs: {
            build: {
                options: {
                    baseUrl: 'src',
                    name: 'main',
                    out: 'build/main.min.js',
                    removeCombined: false
                }
            }
        },
        usebanner: {
            build: {
                options: {
                    position: 'top'
                },
                files: {
                    src: [ 'build/main.min.js' ]
                }
            }
        },
        sass: {
            build: {
                options: {
                    loadPath: 'scss',
                    style: 'compressed',
                    cacheLocation: 'cache/scss'
                },
                files: {
                    'build/main.min.css': 'scss/main.scss'
                }
            }
        },
        jshint: {
            all: [
                'Gruntfile.js',
                'src/**/*.js',
                'spec/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        jasmine: {
            src : 'src/**/*.js',
            options : {
                specs : 'spec/**/*.js',
                template: require('grunt-template-jasmine-requirejs'),
                templateOptions: {
                    requireConfig: {
                        baseUrl: 'src'
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.registerTask('default', ['requirejs', 'sass']);
    grunt.registerTask('test', ['jshint', 'jasmine']);
};