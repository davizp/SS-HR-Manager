// Dependencies =================================
	var path = require('path'),
		rootPath = path.normalize(__dirname + '/../..');

// Exposing Settings ============================
	module.exports = {
		root: rootPath,
		port: parseInt(process.env.PORT, 10) || 3000,
		hapi: {
			options: {
				views: {
					path: rootPath+'/server/views',
					engines: {
						hbs: require('handlebars')
					},
					layout: true,
					layoutPath: rootPath+'/server/views/layouts/'
				}
			}
		},
		env: require('./env.json')[process.env.NODE_ENV || 'development']
	}