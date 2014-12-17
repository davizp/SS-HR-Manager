module.exports = function (grunt) {
	'use strict';

	// Locals ==============================/
		var _ 				= grunt.util._,
			glob 			= require('glob').sync,
			path 			= require('path'),
			admin_assets 	= 'admin/',
			public_assets 	= 'public/',
			liveReload 		= 35729,
			systems			= ['admin','public'],
			config;

	// CONFIG Settings =========================/
		config = {
			pkg: grunt.file.readJSON('package.json'),
			jshint: {
				files: ['admin/dev/assets/js/**/*.js','public/dev/assets/js/**/*.js','!**/*.min.js'],
				options: {
					"-W041": true,
					laxcomma: true,
					evil: true,
					laxbreak: true,
					validthis: true,
					globals: {
						jQuery: true,
						console: true,
						app: true,
						module: true,
						document: true
					}
				}
			},
			uglify: {
				options: {
					banner: '// <%= pkg.name %> - Last Update: <%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT Z") %>\n',
				},
				admin:{
					files: [{
						expand: true,
						cwd: 'admin/dev/js',
						src: ['**/*.js','!**/_*.js'],
						dest: 'admin/dist/js',
						ext: '.js'
					}]
				},
				public:{
					files: [{
						expand: true,
						cwd: 'public/dev/assets/js',
						src: ['**/*.js','!**/_*.js'],
						dest: 'public/dist/assets/js',
						ext: '.js'
					}]
				}
			},
			sass: {
				options: {
					banner: '/* <%= pkg.name %> - Last Update: <%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT Z") %> */',
					style: 'compressed'
				},
				admin: {
					files: {
						'admin/dist/css/master.css': 'admin/dev/sass/master.scss'
					}
				},
				public: {
					files: {
						'public/dist/assets/css/master.css': 'public/dev/assets/sass/master.scss'
					}
				}
			},
			imagemin: {
				admin: {
					files: [
						{
							expand: true,
							cwd: 'admin/dist/img',
							src: ['**/*.{png,jpg,gif,PNG,JPG,GIF}'],
							dest: 'admin/dist/img'
						}
					]
				},
				public: {
					files: [
						{
							expand: true,
							cwd: 'public/dist/img',
							src: ['**/*.{png,jpg,gif,PNG,JPG,GIF}'],
							dest: 'public/dist/img'
						}
					]
				}
			},
			htmlmin: {
				public: {
					options: {
						removeComments: true,
						collapseWhitespace: true
					},
					files: [
						{
							expand: true,
							cwd: 'public/dev/views',
							src: ['**/*.html', '*.html'],
							dest: 'public/dist/views'
						}
					]
				}
			},
			watch: {
				admin_css: {
					files: ['admin/dev/assets/sass/**/*.scss'],
					tasks: ['sass:admin'],
					options: {
						livereload: liveReload
					}
				},
				public_css: {
					files: ['public/dev/assets/sass/**/*.scss'],
					tasks: ['sass:public'],
					options: {
						livereload: liveReload
					}
				},
				js: {
					files: ['<%= jshint.files %>'],
					tasks: ['uglify'],
					options: {
						livereload: liveReload
					}
				},
				html: {
					files: ['**/*.html'],
					tasks: ['htmlmin'],
					options: {
						livereload: liveReload
					}
				}
			}
		};

	// DEPENDENT PLUGINS =======================/
		require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	// TASKS ===================================/
		grunt.registerTask('default', ['watch']);
		grunt.registerTask('js', ['jshint','uglify']);
		grunt.registerTask('css', ['sass']);

	// CONFIG ==================================/
		grunt.initConfig(config);

	// EVENTS ==================================/
		grunt.event.on('watch', function(action, filepath, target) {
			// JS
			if(filepath.search(".js") > 0 ){
				var destFilePath = filepath.replace('dev','dist'),
					system = (filepath.indexOf('public')!==-1)?'uglify.public':'uglify.admin';
				grunt.config(system+'.src', filepath);
				grunt.config(system+'.dest', destFilePath);
			}
		});
}
