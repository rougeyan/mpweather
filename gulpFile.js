/**
 * // cnpm install --save-dev gulp gulp-sass gulp-rename gulp-replace gulp-changed
 *
 * 参考:[在微信小程序中愉快地使用sass](https://segmentfault.com/a/1190000015807708)
 *
 * 理解正常编译的话 会把import 中的所有内容都import到当前的wxss的,造成冗余, 需要将原本的import命令同行地导回去wxss的页面内;因此与文章做同样的余下处理;
 * 参考:
 * [@import 使用方式](https://www.sass.hk/docs/)
 * [gulp-clean-css](https://github.com/jakubpawlowicz/clean-css#inlining-options;)
 * [clean-css](https://www.npmjs.com/package/gulp-clean-css;)
 * [pipe方法](https://blog.csdn.net/mrfano/article/details/78179735)
 * [gulp pipe 流中如何插入自己写的代码？](https://segmentfault.com/q/1010000009464566)
 */
const gulp = require('gulp')
const sass = require('gulp-sass')
const rename = require('gulp-rename')
const replace = require('gulp-replace')
const clean = require('gulp-clean');
const tap = require('gulp-tap');
const cleanCss = require('gulp-clean-css')
const path = require('path');
const debug = require('gulp-debug');
const changed = require('gulp-changed'); // 只编译修改过的文件;
const config = require('./gulpconfig')
const hasRmCssFiles = new Set();
const stream = require('stream');
const del = require('del');


gulp.task('watch', gulp.series(sassCompile,watcher));
// test debugger;
function showMsgOfBuffer(){
	var fileStream = new stream.Transform({ objectMode: true });
	fileStream._transform = function (file, unused, callback) {

		// 插件主体;
		console.log(file.contents.toString());//把传入的文件内容log出来

		this.push(file);//注意的是这个file是也必须是vinyl对象
		callback();
	};
	return fileStream;
}

// sass 编译任务
function sassCompile() {
	return gulp.src(config.src.sass)
		.pipe(tap((file) => {
			// 当前处理文件的路径
			const filePath = path.dirname(file.path);
			// 当前处理内容
			const content = file.contents.toString();
			// 找到filter的scss，并匹配是否在配置文件中
			content.replace(/@import\s+['|"](.+)['|"];/g, ($1, $2) => {
				const hasFilter = config.cssFilterFiles.filter(item => $2.indexOf(item) > -1);
				// hasFilter > 0表示filter的文件在配置文件中，打包完成后需要删除
				if (hasFilter.length > 0) {
					const rmPath = path.join(filePath, $2);
					// 将src改为dist，.scss改为.wxss，例如：'/xxx/src/scss/const.scss' => '/xxx/dist/scss/const.wxss'
					const filea = rmPath.replace(/src/, 'dist').replace(/\.scss/, '.wxss');
					// 加入待删除列表
					hasRmCssFiles.add(filea);
				}
			});
			// console.log('rm', hasRmCssFiles);
		}))
		.pipe(replace(/(@import.+;)/g, ($1, $2) => {
			const hasFilter = config.cssFilterFiles.filter(item => $1.indexOf(item) > -1);
			if (hasFilter.length > 0) {
				return $2;
			}
			return `/** ${$2} **/`;
		}))
		.pipe(sass().on('error', sass.logError))
		// 针对sass编译后且还原注释的css的 进行clean 操作;
		// @include 'xxx.scss'
		.pipe(replace(/(\/\*\*\s{0,})(@.+)(\s{0,}\*\*\/)/g, ($1, $2, $3) => $3.replace(/\.scss/g, '.wxss'))) // 打开注释并且还原为wxss文件;
		// .pipe(showMsgOfBuffer())
		// 此阶段已经sass编译完毕, 是一个css文件;  且是@include 'xxx.wxss'
		.pipe(cleanCss({inline:['remote']}),()=>{
			// 只对css远程作操作; 不会对 本地 ../做操作;
		})
		.pipe(rename({
			extname: '.wxss',
		}))
		.pipe(changed(config.dest.wxss))
		.pipe(debug({title: '编译:'}))
		.pipe(gulp.dest(config.dest.wxss))
}
// 清理无用的wxss文件
gulp.task('cleanwxss', () => {
	const arr = [];
	hasRmCssFiles.forEach((item) => {
		arr.push(item);
	});
	return gulp.src(arr, { read: false })
		.pipe(clean({ force: true }));
});

// 监听任务;
function watcher(done) {
	gulp.watch(config.src.sass, gulp.series(sassCompile))
	done()
}

function cleanBuild() {
  return del('./build');
}
function buildProgram(){
	return gulp.src(config.buildFilterFiles)
				.pipe(gulp.dest(config.build))
}
gulp.task('build',gulp.series(sassCompile,cleanBuild,buildProgram));
gulp.task('clean',gulp.series(cleanBuild));
