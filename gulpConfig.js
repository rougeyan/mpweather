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
  // 对 变量 函数不注释处理,交给sass处理;
  cssFilterFiles: ['css/var.scss'],
}
module.exports = setting
