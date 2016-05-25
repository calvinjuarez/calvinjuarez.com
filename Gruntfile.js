module.exports = function (grunt) {
	var bower = {
		  jquery    : 'bower_components/jquery'
		, bootstrap : 'bower_components/bootstrap'
	}
	
	grunt.initConfig({
		  copy: {
			  jquery: {
				  expand : true
				, cwd    : bower.jquery + '/dist/'
				, src    : 'jquery.min.js'
				, dest   : 'js/lib/'
			}
			, bootstrap: {
				  files: [
					  { // copy .js files
						  expand : true
						, cwd    : bower.bootstrap + '/js/'
						, src    : '**/*.js'
						, dest   : 'js/lib/bootstrap/'
					}
					, { // copy .less files
						  expand : true
						, cwd    : bower.bootstrap + '/less/'
						, src    : '**/*.less'
						, dest   : 'css/lib/bootstrap/'
					}
				]
			}
		}
	})
	
	grunt.loadNpmTasks('grunt-contrib-copy')
	
	grunt.registerTask('default', ['copy'])
}
