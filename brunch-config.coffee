module.exports = config:
  files:
    javascripts: joinTo:
      'js/vendor.js': /^bower_components\//
      'js/app.js': /^(?!bower_components\/)/
    stylesheets: joinTo:
      'css/vendor.css': /^bower_components\//
      'css/app.css': /^(?!bower_components\/)/
  overrides:
    production:
      sourceMaps: true

  plugins:
    react:
      transformOptions:
        harmony: yes
        sourceMap: yes
        stripTypes: no

  server:
    run: yes
