// Local Vars ===================================
	var db = function(server) {
		server.pack.register({
			plugin: require('hapi-mysql'),
			name: 'db',
			options: {
					host     : '127.0.0.1',
					user     : 'root',
					database : 'sanservices'
				}
			}, function(err) {
				if (err) throw err;
			}
		);
	};

// Plugin export ================================
	module.exports = db;