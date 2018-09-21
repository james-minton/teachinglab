import gulp from "gulp";
import {spawn} from "child_process";
import hugoBin from "hugo-bin";
import log from "fancy-log";
import pluginError from "plugin-error";
import flatten from "gulp-flatten";
// import watch from "gulp-watch"; // JM add
import postcss from "gulp-postcss";
import cssImport from "postcss-import";
import cssnext from "postcss-cssnext";
import BrowserSync from "browser-sync";
import webpack from "webpack";
import webpackConfig from "./webpack.conf";
import sass from "gulp-sass";
import cssnano from "cssnano";
const browserSync = BrowserSync.create();

// Hugo arguments
const hugoArgsDefault = ["-d", "../dist", "-s", "site", "-v"];
const hugoArgsPreview = ["--buildDrafts", "--buildFuture"];

// Development tasks
gulp.task("hugo", (cb) => buildSite(cb));
gulp.task("hugo-preview", (cb) => buildSite(cb, hugoArgsPreview));

// Run server tasks
// JM add SCSS here
gulp.task("server", ["hugo", "scss", "css", "js", "fonts"], (cb) => runServer(cb));
gulp.task("server-preview", ["hugo-preview", "scss", "css", "js", "fonts"], (cb) => runServer(cb));

// Build/production tasks
// JM add SCSS here
gulp.task("build", ["scss", "css", "js", "fonts"], (cb) => buildSite(cb, [], "production"));
gulp.task("build-preview", ["scss", "css", "js", "fonts"], (cb) => buildSite(cb, hugoArgsPreview, "production"));

// Compile CSS with PostCSS
 gulp.task("css", () => (
  gulp.src("./src/css/imports/*.css")
    .pipe(postcss([cssImport({from: "./src/css/imports/reset.css"}), cssnext()]))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream())
));

/* gulp.task("scss", function() {
  return gulp.src("./src/scss/tl.scss")
    .pipe(sass()) // Using gulp-sass
    // .pipe(postcss([cssnext({browserslist: [ ">= 1% in US" ]}), cssnano()]))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
}); */

gulp.task("scss", function() {
  return gulp.src("./src/scss/tl.scss")
    .pipe(sass()) // Using gulp-sass
    .pipe(postcss([cssnext({browserslist: [ ">= 1% in US" ]}), cssnano()]))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
});



// Compile Javascript
gulp.task("js", (cb) => {
  const myConfig = Object.assign({}, webpackConfig);

  webpack(myConfig, (err, stats) => {
    if (err) throw new pluginError("webpack", err);
    log(`[webpack] ${stats.toString({
      colors: true,
      progress: true
    })}`);
    browserSync.reload();
    cb();
  });
});

// Move all fonts in a flattened directory
gulp.task('fonts', () => (
  gulp.src("./src/fonts/**/*")
    .pipe(flatten())
    .pipe(gulp.dest("./dist/fonts"))
    .pipe(browserSync.stream())
));

// Development server with browsersync
function runServer() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  gulp.watch("./src/js/**/*.js", ["js"]);
  gulp.watch("./src/css/**/*.css", ["css"]);
  gulp.watch("./src/fonts/**/*", ["fonts"]);
  gulp.watch("./site/**/*", ["hugo"]);
  //JM ADD
  gulp.watch("./src/scss/**/*", ["scss"]);
};
//JM ADD
// gulp.task('default', ['scss' /*, possible other tasks... */]);

/**
 * Run hugo and build the site
 */
function buildSite(cb, options, environment = "development") {
  const args = options ? hugoArgsDefault.concat(options) : hugoArgsDefault;

  process.env.NODE_ENV = environment;

  return spawn(hugoBin, args, {stdio: "inherit"}).on("close", (code) => {
    if (code === 0) {
      browserSync.reload();
      cb();
    } else {
      browserSync.notify("Hugo build failed :(");
      cb("Hugo build failed");
    }
  });
}