// Local Vars ===================================
	var yar = function(server) {
		server.pack.register({
			plugin: require('yar'),
			name: 'yar',
			options: {
				cookieOptions: {
					password: 'sandals01',
					isSecure: false
				}
			}
			}, function(err) {
				if (err) throw err;
			}
		);
	};

// Plugin export ================================
	module.exports = "";