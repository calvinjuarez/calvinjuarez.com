module.exports = function (grunt) {
	grunt.initConfig({
		  copy: {}
	})
	
	grunt.loadNpmTasks('grunt-contrib-copy')
	
	grunt.registerTask('default', ['copy'])
}
