'use strict';

const gulp = require('gulp'),
  fs = require("fs"),
  tar = require('gulp-tar'),
  gzip = require('gulp-gzip'),
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
    './angular-fullscreen-*',
    './angular-fullscreen-*.tar.gz',
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
  return gulp.src('./src/**/*.js')
    // Add version  header
    .pipe(header(preamble))
    .pipe(jshint())
    .pipe(gulp.dest( './dist'));
}

function minify(done) {
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
  return done();
}

function copyArchiveFiles() {
  log(colors.green('Creating tarball...'));
  const project = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const basename = project.name + '-' + project.version;

  return gulp.src(['./dist/**/*.*', 'package.json', 'bower.json', 'README.md', 'LICENSE'], {base: '.'})
    .pipe(gulp.dest('./' + basename));
}


function createArchive() {
  const project = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const basename = project.name + '-' + project.version;

  return gulp.src(['./' + basename + '/**/*.*'], {base: '.'})
    .pipe(tar(basename+'.tar'))
    .pipe(gzip())
    .pipe(gulp.dest('./'));
}

function cleanArchiveFiles() {
  const project = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const basename = project.name + '-' + project.version;

  return del([
    './' + basename
  ]);
}

function archive(done) {
  const project = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const basename = project.name + '-' + project.version;
  log(colors.green('Tarball created at: ' + basename + '.tar.gz'));
  done();
}

/* --------------------------------------------------------------------------
   -- Define gulp public tasks
   --------------------------------------------------------------------------*/

gulp.task('clean', clean);
gulp.task('copyFiles', gulp.series('clean', copyFiles));
gulp.task('minify', gulp.series('copyFiles', minify));
gulp.task('build', gulp.series('minify'));

gulp.task('copyArchiveFiles', gulp.series('build', copyArchiveFiles));
gulp.task('createArchive', gulp.series('copyArchiveFiles', createArchive));
gulp.task('cleanArchiveFiles', gulp.series('createArchive', cleanArchiveFiles));
gulp.task('archive', gulp.series('cleanArchiveFiles', archive));

gulp.task('default', gulp.series('minify')); // Default task

gulp.task('help', function() {
  log(colors.green("Usage: gulp {build} OPTIONS"));
  log(colors.green(""));
  log(colors.green("NAME"));
  log(colors.green(""));
  log(colors.green("  build                       Build dist"));
  log(colors.green("  archive                     Create a tarball of dist"));
  log(colors.green(""));
  log(colors.green("OPTIONS"));
  log(colors.green(""));
  log(colors.green("  --release                   Release build"));
  log(colors.green("  --useref | --uglify         Build with uglify and useref plugins"));
})
