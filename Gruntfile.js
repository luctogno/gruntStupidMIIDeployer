/*
 * grunt-StupidMIIDeployer
 * https://github.com/ltogno/gruntStupidMIIDeployer
 *
 * Copyright (c) 2017 Luca Togno
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    stupidMIIDeployer: {
      deployer: {
        options: {
            miiHost: 'localhost',
            miiPort: '50000',
            login: 'admin',
            pass: 'admin',
            localPath: 'test/expected',
            remotePath: '0100/WEB/CAUSFERM'
        },
        files: {
          'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'stupidMIIDeployer', 'nodeunit']);
  
  grunt.registerTask('deployToMii', ['clean', 'stupidMIIDeployer']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
