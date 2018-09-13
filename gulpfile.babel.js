import gulp from "gulp";
import {spawn} from "child_process";
import hugoBin from "hugo-bin";
import gutil from "gulp-util";
import flatten from "gulp-flatten";
import watch from "gulp-watch"; // JM add
// import postcss from "gulp-postcss";
import cssImport from "postcss-import";
import cssnext from "postcss-cssnext";
import BrowserSync from "browser-sync";
import webpack from "webpack";
import webpackConfig from "./webpack.conf";
// JM add
import sass from "gulp-sass";
// import cssNano from "gulp-cssnano";

const browserSync = BrowserSync.create();

// Hugo arguments
const hugoArgsDefault = ["-d", "../dist", "-s", "site", "-v"];
const hugoArgsPreview = ["--buildDrafts", "--buildFuture"];

// Development tasks
gulp.task("hugo", (cb) => buildSite(cb));
gulp.task("hugo-preview", (cb) => buildSite(cb, hugoArgsPreview));

// Run server tasks
// JM add SCSS here
// gulp.task("server", ["hugo", "scss", "js", "fonts"], (cb) => runServer(cb));
// gulp.task("server-preview", ["hugo-preview", "scss", "js", "fonts"], (cb) => runServer(cb));

// Build/production tasks
// JM add SCSS here
gulp.task("build", ["scss", "js", "fonts"], (cb) => buildSite(cb, [], "production"));
gulp.task("build-preview", ["scss",  "js", "fonts"], (cb) => buildSite(cb, hugoArgsPreview, "production"));

// Compile SCSS JM comment out
// gulp.task("scss", () => (
 // gulp.src("./src/scss/jm.scss")
 //   .pipe(sass({
      // outputStyle:  "nested",
 //     precision: 10,
 //     includePaths: ["node_modules"],
 //   }))
    // .pipe(postcss([ autoprefixer() ]))
    // .pipe(postcss())
    // .pipe(cssNano())
 //   .pipe(gulp.dest("./dist/css"))
//    .pipe(browserSync.stream())
// ));

gulp.task("scss", function() {
  return gulp.src("./src/scss/tl.scss")
    .pipe(sass()) // Using gulp-sass
    // .pipe(postcss([cssnext({browserslist: [ ">= 1% in US" ]}), cssnano()]))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
});

// Compile CSS with PostCSS - JM comment out
//gulp.task("css", () => (
 // gulp.src("./src/css/*.css")
  //  .pipe(postcss([cssImport({from: "./src/css/jm.css"}), cssnext()]))
 //   .pipe(gulp.dest("./dist/css"))
 //   .pipe(browserSync.stream())
// ));

// Compile Javascript
gulp.task("js", (cb) => {
  const myConfig = Object.assign({}, webpackConfig);

  webpack(myConfig, (err, stats) => {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      colors: true,
      progress: true
    }));
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
/* function runServer() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  }); */
  // gulp.watch("./src/js/**/*.js", ["js"]); 
  // gulp.watch("./src/scss/**/*.scss", ["scss"]); // JM add
  // gulp.watch("./src/css/**/*.css", ["css"]);
  // gulp.watch("./src/fonts/**/*", ["fonts"]);
  // gulp.watch("./site/**/*", ["hugo"]);
// };

// Development server with browsersync -- JM add (and commented the above)
gulp.task("server", ["hugo", "scss", "js"], () => {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
  watch("./src/js/**/*.js", () => { gulp.start(["js"]) });
  watch("./src/scss/**/*.scss", () => { gulp.start(["scss"]) });
  // watch("./src/css/**/*.css", () => { gulp.start(["css"]) });
  watch("./src/fonts/**/*", () => { gulp.start(["fonts"]) });
  watch("./site/**/*", () => { gulp.start(["hugo"]) });
});

gulp.task('default', ['scss' /*, possible other tasks... */]);

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