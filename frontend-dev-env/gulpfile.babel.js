/**
 * gulpfile.js
 */

// init
import path from "path";
import gulp from "gulp";
import sass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";
import autoprefixer from "gulp-autoprefixer";
import cleanCss from "gulp-clean-css";
import rename from "gulp-rename";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import pug from "gulp-pug";
import pugInheritance from "gulp-pug-inheritance";
import gulpif from "gulp-if";
import cached from "gulp-cached";
import changed from "gulp-changed";
import browserSync from "browser-sync";

const dev_dir = "./src";
const pug_dir = "./src/pug";
const assets_dir = path.join(process.cwd(), "../www/assets");
const public_dir = path.join(process.cwd(), "../www");
const paths = {
  styles: {
    src: dev_dir + "/sass/*.scss",
    lower: dev_dir + "/sass/**/*.scss",
    dest: assets_dir + "/css/"
  },
  pugs: {
    src: pug_dir + "/*.pug",
    lower: pug_dir + "/**/*.pug",
    dest: public_dir + "/"
  }
};
const bs_create = browserSync.create();

// Sass
export function run_style() {
  return gulp
    .src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(
      plumber({
        errorHandler: notify.onError("Error: <%= error.message %>")
      })
    )
    .pipe(
      sass({
        outputStyle: "expanded"
      }).on("error", sass.logError)
    )
    .pipe(
      autoprefixer({
        browsers: ["last 2 version", "iOS >= 8.1", "Android >= 4.0"],
        cascade: false,
        grid: true
      })
    )
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(cleanCss())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("../map/"))
    .pipe(gulp.dest(paths.styles.dest));
}

// pug
export function run_pug() {
  return gulp
    .src(paths.pugs.src)
    .pipe(
      plumber({
        errorHandler: notify.onError("Error: <%= error.message %>")
      })
    )
    .pipe(
      changed(paths.pugs.dest, {
        extension: ".html"
      })
    )
    .pipe(gulpif(global.isWatching, cached("pug")))
    .pipe(
      pugInheritance({
        basedir: pug_dir,
        skip: ["node_modules"]
      })
    )
    .pipe(
      pug({
        pretty: true
      })
    )
    .pipe(gulp.dest(paths.pugs.dest));
}

// browser-sync
export function to_browser_sync() {
  browserSync({
    server: {
      baseDir: public_dir + "/",
      index: "index.html"
    }
  });
}

function bs_reload(done) {
  bs_create.reload();
  done();
}

function bs_serve(done) {
  bs_create.init({
    server: {
      baseDir: public_dir + "/",
      index: "index.html"
    }
  });
  done();
}

// Watch
function watchFiles() {
  gulp.watch(paths.styles.src, run_style);
  gulp.watch(paths.styles.lower, run_style);
  gulp.watch(paths.pugs.src, run_pug);
  gulp.watch(paths.pugs.lower, run_pug);
  gulp.watch(public_dir + "/*.html", bs_reload);
  gulp.watch(assets_dir + "/css/*.css", bs_reload);
  gulp.watch(assets_dir + "/img/*.*", bs_reload);
}
export { watchFiles as watch };

// server
const server = gulp.series(gulp.parallel(run_style, bs_reload, bs_serve));
gulp.task("server", server);

// Export
export default server;
