'use strict';

const gulp = require('gulp'),
  fs = require("fs"),
  del = require('del'),
  uglify = require('gulp-uglify-es').default,
  sourcemaps = require('gulp-sourcemaps'),
  header = require('gulp-header'),
  rename = require('gulp-rename'),
  jshint = require('gulp-jshint'),
  log = require('fancy-log'),
  colors = require('ansi-colors'),
  argv = require('yargs').argv;


/* --------------------------------------------------------------------------
   -- Build
   --------------------------------------------------------------------------*/

function clean() {
  return del([
    './dist',
  ]);
}

function copyFiles() {
  log(colors.green('Copying files...'));
  const project = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const preamble = "/* "
    + project.name + " v" + project.version
    + (project.repository && project.repository.url ? (" - source code: "+ project.repository.url) : '')
    +" */\n\n";

  // Copy Js
  gulp.src('./src/**/*.js')
    // Add version  header
    .pipe(header(preamble))
    .pipe(jshint())
    .pipe(gulp.dest( './dist'));
}

function minify() {
  const enableUglify = argv.release || argv.useref || argv.uglify || false;
  if (enableUglify) {
    log(colors.green('Minify JS...'));
    const project = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const preamble = "/* "
      + project.name + " v" + project.version
      + " - minified */";
    const uglifyOptions = {
      toplevel: true,
      warnings: true,
      compress: {
        global_defs: {
          "@console.log": "alert"
        },
        passes: 2
      },
      output: {
        beautify: false,
        preamble,
        max_line_len: 120000
      }
    };

    // Process JS file
    return gulp.src('./src/**/*.js')
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify(uglifyOptions)) // Minify javascript files
      .pipe(rename({ extname: '.min.js' }))
      .pipe(sourcemaps.write('maps'))
      .pipe(gulp.dest('./dist'));
  }
}

/* --------------------------------------------------------------------------
   -- Define gulp public tasks
   --------------------------------------------------------------------------*/

gulp.task('clean', [], clean);
gulp.task('copyFiles', ['clean'], copyFiles);
gulp.task('minify', ['copyFiles'], minify);
gulp.task('build', ['minify']);

gulp.task('default', ['build']); // The default task

gulp.task('help', function() {
  log(colors.green("Usage: gulp {build} OPTIONS"));
  log(colors.green(""));
  log(colors.green("NAME"));
  log(colors.green(""));
  log(colors.green("  build                       Build dist"));
  log(colors.green(""));
  log(colors.green("OPTIONS"));
  log(colors.green(""));
  log(colors.green("  --release                   Release build"));
  log(colors.green("  --useref | --uglify         Build with uglify and useref plugins"));
})
