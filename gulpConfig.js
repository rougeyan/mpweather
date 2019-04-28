const setting = {
	// enterPath
  src:{
    sass: './src/**/*.+(scss|sass)',
	},
	// injectPath
  inject:{
	},
	// output
  dest:{
    wxss: './src/',
	},
	build:'./build',
  // 对 变量 函数不注释处理,交给sass处理;
	cssFilterFiles: ['css/var.scss'],
	// build,过滤不必要的文件;
	buildFilterFiles:['src/**/*','!src/**/*.scss','!src/**/var.wxss']
}
module.exports = setting
