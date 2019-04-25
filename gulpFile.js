// cnpm install --save-dev gulp gulp-sass gulp-rename gulp-replace
// 参考 [在微信小程序中愉快地使用sass](https://segmentfault.com/a/1190000015807708)
const gulp = require('gulp')
const sass= require('gulp-sass')
const rename = require('gulp-rename')
// const replace = require('gulp-replace')
const config = require('./gulpConfig')

gulp.task('watch',gulp.series(watcher));

// sass 编译任务
function sassCompile(){
	return gulp.src(config.src.sass)
	.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
	.pipe(rename({
			extname: '.wxss'
	}))
	.pipe(gulp.dest(config.dest.wxss))
}

// 监听任务;
function watcher(done) {
		gulp.watch(config.src.sass, gulp.series(sassCompile))
		done()
}
