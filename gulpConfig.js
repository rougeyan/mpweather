const setting = {
	// enterPath
  src:{
    sass: './src/pages/**/*.+(scss|sass)',
    // js: './src/js/**/*.js',
    // image: './src/common/images/**/*'
	},
	// injectPath
  inject:{
    // css: './build/css/**/*.css',
    // js: './build/js/**/*.js',
	},
	// output
  dest:{
    // pug: './build/html/',
    wxss: './src/pages/',
    // js:'./build/js/',
    // image: './build/common/images/'
  }

}
module.exports = setting
