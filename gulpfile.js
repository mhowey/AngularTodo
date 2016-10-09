var gulp = require('gulp'),
	webserver = require('gulp-webserver'),
	typescript = require('gulp-typescript'),
	sourcemaps = require('gulp-sourcemaps'),
	tscConfig = require('./tsconfig.json');

/* define where the files will be going to (appSrc)...
 * as well as where the files are coming from (tsSrc).
 * keeping this at a "generic level" so I can target other
 * folders for sass processing, etc.
 */
var appSrc = 'builds/development/',
	tsSrc = 'process/typescript/';

/* this task isn't doing anything for development */
gulp.task('html', function(){
	gulp.src(appSrc + '**/*.html');
});

/* this task isn't doing anything for development */
gulp.task('css', function(){
	gulp.src(appSrc + '**/*.css');
});

/* this task moves all the node_module dependencies into the
 * builds/js/lib/ng2 folder
 */
gulp.task('copylibs',function() {
	return gulp
		.src([
			'node_modules/es6-shim/es6-shim.min.js',
			'node_modules/systemjs/dist/system-polyfill.js',
			'node_modules/angular2/bundles/angular2-polyfills.js',
			'node_modules/systemjs/dist/system.src.js',
			'node_modules/angular2/bundles/angular2.dev.js'
		]).pipe(gulp.dest(appSrc + 'js/lib/ng2'));
});


/*
 * This task processes our typescript into javascript
 * first via sourcemaps init function,
 * second via the typescript compiler (with config options),
 * third via writing the sourcemap
 * finally via writing the .js file to the appSrc/js directory
 */
gulp.task('typescript', function() {
	return gulp
		.src(tsSrc + '**/*.ts')
		.pipe(sourcemaps.init())
		.pipe(typescript(tscConfig.compilerOptions))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(appSrc + 'js/'));
});

/*
 * This task sets up any watch tasks that we want to have
 * below is one for: 1) typescript, 2) css and 3) html
 */
gulp.task('watch', function() {
	gulp.watch(tsSrc + '**/*.ts', ['typescript']);
	gulp.watch(appSrc + 'css/*.css', ['css']);
	gulp.watch(appSrc + '**/*.html', ['html']);
});

/*
 * Task to setup a webserver to preview in realtime
 */
gulp.task('webserver', function() {
	gulp.src(appSrc)
		.pipe(webserver({
			livereload: true,
			open: true
		}));
});

gulp.task('default', ['copylibs', 'typescript', 'watch', 'webserver']);


