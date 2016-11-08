'use strict';

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);
    require('grunt-browserify')(grunt);

    // Configurable paths
    var paths = {
        tmp: '.tmp',
        assets: './public'
    };

    grunt.initConfig({

        // Project settings
        paths: paths,
        config: { version: '1.0.0' },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            less: {
                files: ['./src/bootstrap-gisp/less/**/*.less'],
                tasks: ['less', 'usebanner', 'postcss', 'copy']
            },
            scripts: {
                files: ['<%= paths.assets %>/js/main.js', '<%= paths.assets %>/js/modules/**/*.js'],
                tasks: ['jshint', 'concat', 'browserify:dev']
            }
        },

        // Lint LESS
        lesslint: {
            src: ['.src/bootstrap-gisp/less/**/*.less'],
            options: {
                csslint: {
                    'box-model': false,
                    'adjoining-classes': false,
                    'qualified-headings': false,
                    'empty-rules': false,
                    'outline-none': false,
                    'unique-headings': false
                }
            }
        },

        // Lint JS
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= paths.assets %>/js/main.js',
                '<%= paths.assets %>/js/modules/**/.*.js'
            ]
        },

        // LESS -> CSS
        less: {
            options: {
                paths: ['bootstrap-gisp/less', 'node_modules'],
                compress: true,
                sourceMap: true,
                sourceMapFileInline: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: './src/bootstrap-gisp/less',
                    src: ['gisp-theme.less'],
                    dest: '<%= paths.assets %>/css/',
                    ext: '.min.css'
                }]
            }
        },

        // Add vendor prefixed styles to CSS
        postcss: {
            options: {
                map: false,
                processors: [
                    require('autoprefixer')({ browsers: ['last 4 version'] })
                ]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.assets %>/css/',
                    src: '{,*/}*.css',
                    dest: '<%= paths.assets %>/css/'
                }]
            }
        },

        // Bundle Bootstrap plugins
        concat: {
            pluginsjs: {
                src: [
                    // 'node_modules/bootstrap/js/affix.js',
                    // 'node_modules/bootstrap/js/alert.js',
                    'node_modules/bootstrap/js/dropdown.js',
                    //'node_modules/bootstrap/js/tooltip.js',
                    //'node_modules/bootstrap/js/modal.js'
                    //'node_modules/bootstrap/js/transition.js'
                    // 'node_modules/bootstrap/js/button.js',
                    // 'node_modules/bootstrap/js/popover.js',
                    // 'node_modules/bootstrap/js/carousel.js',
                    // 'node_modules/bootstrap/js/scrollspy.js',
                    // 'node_modules/bootstrap/js/collapse.js'
                    'node_modules/bootstrap/js/tab.js',
                ],
                dest: './public/js/vendor/bootstrap.min.js'
            }
        },

        // Add a banner to the top of the generated LESS file.
        usebanner: {
            taskName: {
                options: {
                    position: 'top',
                    banner: '/* FCC GIS Theme v<%= config.version %> | http://fcc.github.io/design-standards/ */\n',
                    linebreak: true
                },
                files: {
                    src: ['<%= paths.assets %>/css/gisp-theme.min.css'],
                }
            }
        },

        browserify: {
            options: {
                browserifyOptions: {
                    debug: true
                }
            },
            dev: {
                src: ['<%= paths.assets %>/js/main.js'],
                dest: '<%= paths.assets %>/js/app.js'
            },
            production: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: '<%= browserify.dev.src %>',
                dest: '<%= paths.assets %>/js/app.js'
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [

                    { // fonts 
                        dot: true,
                        expand: true,
                        cwd: 'node_modules/font-awesome/fonts',
                        src: '**',
                        dest: '<%= paths.assets %>/fonts'
                    }
                ]
            }
        }
    });

    grunt.registerTask('build', [
        'jshint',
        'less',
        'usebanner',
        'postcss',
        'concat',
        'browserify:dev'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};
