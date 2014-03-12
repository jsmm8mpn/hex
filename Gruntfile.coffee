#global module:false
module.exports = (grunt) ->

  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")

    copy:
      main:
        expand: true
        cwd: 'bower_components/bootstrap-css/'
        src: ['**/*.js', '**/*.css', 'img/*']
        dest: 'public/ext/bootstrap/'

    concurrent:
      dev:
        tasks: ['nodemon:dev', 'watch']
        options:
          logConcurrentOutput: true

    nodemon:
      dev:
        script: 'server.coffee'
        options:
          nodeArgs: []
          ext: 'coffee'
          watch: ['routes', './']
      debug:
        script: 'server.coffee'
        options:
          nodeArgs: ['--debug-brk']
          ext: 'coffee'
          watch: ['routes']

    watch:
      options:
        livereload: true
      #server:
      #  files: ["server.coffee", "routes/*.coffee"]
      coffee:
        files: ["client/js/**/*.coffee"]
        tasks: ["coffee","concat"]
      js:
        files: ["client/js/**/*.js"]
        tasks: ["concat"]
      less:
        files: ['client/stylesheets/*.less']
        tasks: "less"
      jade:
        files: ['view/*.jade', 'view/templates/*.jade']

    concat:
      js:
        src: ['client/coffee/**/*.js','tmp/compiled.js']
        dest: 'public/javascripts/client.js'

    coffee:
      compile:
        files:
          "tmp/compiled.js": ["client/js/**/*.coffee"]
          "server.js": ["server.coffee"]

    less:
      development:
        files:
          "public/stylesheets/client.css": "client/stylesheets/*.less"

    jade:
      dev:
        options:
          data:
            debug: true
        files:
          "public/html/templates.html": "view/*.jade"

    uglify:
      prod:
        files:
          "public/javascripts/client.min.js": ["public/javascripts/client.js"]

    mochacli:
      options:
        reporter: 'nyan'
        bail: true
        compilers: ['coffee:coffee-script']
        ui: "tdd"
      all: ["tests/*.t.coffee"]

    clean:
      stylesheets: "public/javascripts/*"
      javascript: "public/stylesheets/*"


  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-less"
  grunt.loadNpmTasks "grunt-contrib-jade"
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-contrib-concat"
  #grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-mocha-cli"
  #grunt.loadNpmTasks "grunt-plato"
  grunt.loadNpmTasks 'grunt-nodemon'
  grunt.loadNpmTasks 'grunt-concurrent'


  grunt.registerTask 'test', ['mochacli']
  grunt.registerTask "compile", ["coffee", "concat", 'less']
  grunt.registerTask "prod", ['test', "compile", "uglify"]

  grunt.registerTask "server", ->
    server = require('./server')
    done = this.async();
    server.on('end', ->
      done()
    )

  grunt.registerTask "heroku:production", ["compile", "copy"]


  grunt.registerTask 'serverDev', ['compile', 'copy', 'concurrent:dev']

  grunt.registerTask 'start', ->
    require('./server')

  grunt.registerTask 'default', ['serverDev']

  grunt.registerTask 'debug', ['compile', 'nodemon:debug', 'watch']