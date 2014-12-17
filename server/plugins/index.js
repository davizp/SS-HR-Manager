// Dependencies =================================
	var settings = require('../config/'),
		requireDirectory = require('require-directory');

// Exporting Module =============================
	module.exports = function(server) {
		var plugs 	= requireDirectory(module,server.app.root+'/server/plugins');
		for (var key in plugs) {
			if (typeof plugs[key] === 'function') {
				plugs[key](server);
			}
		}
	};