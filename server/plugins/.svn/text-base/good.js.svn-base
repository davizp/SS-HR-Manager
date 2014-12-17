// Local Vars ===================================
	var config 	= require('../config/'),
		cl 		= (config.env.name==='dev')? ['ops', 'request', 'log', 'error']: [];

	var good = function(server) {
		server.pack.register({
			plugin: require('good'),
			name: 'good',
			options: {
				subscribers: {
					'console': 			cl,
					'logs/request.log': ['request'],
					'logs/server.log': 	['ops'],
					'logs/error.log': 	['error']
				},
				opsInterval: 600000
			}
			}, function(err) {
				if (err) throw err;
			}
		);
	};

// Plugin export ================================
	module.exports = good;



