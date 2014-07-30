module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    deploy: grunt.file.readJSON('.deploy.json'),
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
      build: {
        options: {
          outputStyle: 'compressed',
          imagePath: '/web/assets/images'
        },
        files: {
          'web/assets/css/main.css': 'res/scss/main.scss'
        }
      }
    },

    'sftp-deploy': {
      live: {
        auth: {
          host: '<%= deploy.live.host %>',
          port: '<%= deploy.live.port %>',
          authKey: 'live'
        },
        src: '<%= deploy.live.src %>',
        dest: '<%= deploy.live.dest %>',
        server_sep: '<%= deploy.live.sep %>'
      }
    },

    shell: {
      build: {
        command: 'pub build --mode=release'
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
  grunt.loadNpmTasks('grunt-sftp-deploy');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', ['sass:dev']);
  grunt.registerTask('build-test', ['sass:dev', 'shell:build']);
  grunt.registerTask('build-live', ['sass:build', 'shell:build']);

  grunt.registerTask('deploy-live', ['build-live', 'sftp-deploy:live']);
};
