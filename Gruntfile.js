module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dev: {
        options: {
          outputStyle: 'nested',
          imagePath: '/web/assets/images',
          sourceMap: true
        },
        files: {
          'web/assets/css/main.css': 'res/scss/main.scss'
        }
      },
      live: {
        options: {
          outputStyle: 'compressed',
          imagePath: '/web/assets/images'
        },
        files: {
          'web/assets/css/main.css': 'res/scss/main.scss'
        }
      }
    },
    watch: {
      files: [
        'res/scss/**/*.scss'
      ],
      tasks: ['default']
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['sass:dev']);
};
