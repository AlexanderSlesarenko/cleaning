'use strict';
var _ = require('lodash');
var glob = require('glob');
var gulp = require('gulp');
var concat_js = require('gulp-concat');
var concat_css = require('gulp-concat-css');
var merge = require('merge2');
var buffer = require('gulp-buffer');
var uglify = require('gulp-uglify');
var minify_css = require('gulp-cssnano');

function getGlobbedFiles(globPatterns) {
	var urlRegex = new RegExp('^(?:[a-z]+:)?//', 'i');
	var output = [];
	if (_.isArray(globPatterns)) {
		globPatterns.forEach(function(globPattern) {
			output = _.union(output, getGlobbedFiles(globPattern));
		});
	} else if (_.isString(globPatterns)) {
		if (urlRegex.test(globPatterns)) {
			output.push(globPatterns);
		} else {
			var files = glob(globPatterns, {
				sync: true
			});
            output = _.union(output, files);
		}
	}
	return output;
}

var assets = {
    css: [
        'css/*.css'
    ],
    js: [
        'js/*.js'
    ]
};

gulp.task('js', function() {
    merge.apply(this, [gulp.src(getGlobbedFiles(assets.js))])
      .pipe(buffer())
      .pipe(concat_js('bundle.min.js'))
      .pipe(uglify({mangle: false}))
      .pipe(gulp.dest('./bundle'));
});
gulp.task('css', function() {
    merge.apply(this, [gulp.src(getGlobbedFiles(assets.css))])
        .pipe(buffer())
        .pipe(concat_css('bundle.css'))
        .pipe(minify_css({
            core: true,
            minifySelectors: false,
            autoprefixer: false,
            calc: false,
            colormin: false,
            convertValues: false,
            discardComments: true,
            discardDuplicates: false,
            discardEmpty: false,
            discardOverridden: false,
            discardUnused: false,
            filterOptimiser: false,
            filterPlugins: false,
            functionOptimiser: false,
            mergeIdents: false,
            mergeLonghand: false,
            mergeRules: false,
            minifyFontValues: false,
            minifyGradients: false,
            minifyParams: false,
            normalizeCharset: false,
            normalizeUrl: false,
            orderedValues: false,
            reduceBackgroundRepeat: false,
            reduceIdents: false,
            reduceInitial: false,
            reducePositions: false,
            reduceTimingFunctions: false,
            reduceTransforms: false,
            styleCache: false,
            svgo: false,
            uniqueSelectors: false,
            zindex: false
        }))
        .pipe(gulp.dest('./bundle'));
});

gulp.task('default', [
    'js',
    'css'
]);

