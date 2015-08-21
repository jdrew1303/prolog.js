/*
 * @author: jldupont
 * 
 */
'use strict';

module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-mocha-test');
    
    // Define the configuration for all the tasks
    grunt.initConfig({

    	pkg: grunt.file.readJSON("package.json"),
    	
    	concat: {
    		options: {
    		      stripBanners: true,
    		      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
    		        '<%= grunt.template.today("yyyy-mm-dd") %> */\n\n',
    		    },    		
    		dist: {
    			src: 'src/**/*.js',
    			dest: 'prolog.js'
    		}
    	},
    	
    	mochaTest : {
        	test: {
        		options: {
        			//clearRequireCache: true,
        			reporter: 'min'
        			,bail: true
        			//,quiet: true
        			
        		},
        		src: ['tests/**/*.js']
        		
        	} //test
    
    	}//mochaTest

    ,watch: {
    	js: {
          options: {
            spawn: true,
            interrupt: true,
            debounceDelay: 100,
          },
          files: ['Gruntfile.js', 'src/**/*.js', 'tests/**/*.js'],
          tasks: ['concat', 'test']
    	}
      }
    	
    });//initConfig

    /*
    grunt.event.on('watch', function(action, filepath, target) {
    	  grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    	});
    */
    
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    
    grunt.registerTask("test", ["mochaTest"]);
    grunt.registerTask('default', ['test']);
};
