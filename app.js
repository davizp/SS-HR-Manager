// Dependencies =================================
	var Hapi 	= require('hapi'),
		config 	= require('./server/config/');

// Initialization code for the App ==============
	var server = Hapi.createServer(config.env.host, config.port, config.hapi.options);

	// App settings
	server.app = config;

	// Bootstrap Hapi Server Plugins, passes the server object to the plugins
	require('./server/plugins/')(server);

	// Require the routes and pass the server object.
	require('./server/config/routes')(server);

// Start the server =============================
	server.start(function() {
		//Log to the console the host and port info
		console.log('Server started at: ' + server.info.uri);
		
    	//console.log(server._stateDefinitions.cookies)
    	//console.log(server.plugins)

		// server.ext('onPostAuth', function (request, next) {

		// 	console.log("----------  antes de Auth ---------------");
			
		// });



	
		server.ext('onPreResponse', function (request, reply) {
			
			if(typeof request.response.output != "undefined"){
				var v_error = request.response.output.statusCode,
				v_error_msj = String(request.response);
				console.log("-------------------------------");
				
				
				if(request.response.output.statusCode === 404){
					v_error_msj = "Lo Siento, la página no ha sido encontrada!";
				}
				switch(v_error_msj){
					case "TypeError: Uncaught error: Cannot call method 'query' of undefined":
						v_error_msj = "Error! No Tiene Conexion con la Base de Datos!";
					break;

					default:
						if(v_error_msj.search(/ER_DUP_ENTRY: Duplicate entry '/i) != -1){							
							var temp = v_error_msj.substring(v_error_msj.indexOf(" for key "),v_error_msj.indexOf("'")) + " ya existe.";
							v_error_msj = "Error! Entrada Duplicada! El valor "+ temp;
						}
					break;
				}
				return reply.view('error',{login:" ", error: v_error,error_msj:v_error_msj});
			}

			if(request.response.variety === 'view') {
				if(request.auth.isAuthenticated ){
					request.response.source.context.auth = 1;
					request.response.source.context.admin = Number(request.auth.credentials.user.admin);
					request.response.source.context.jefe = Number(request.auth.credentials.user.jefe);
						if(typeof request.auth.credentials.user.id != "undefined"){
						console.log("----------  onPreResponse ---------------")

						// var strsql = "SELECT count(id_notificacion) as cant FROM notificaciones WHERE visto = 0 AND id_usuario = " + request.auth.credentials.user.id;
						// console.log(strsql)
						// request.server.plugins['db'].pool.getConnection(function(err, connection) {
						// 	connection.query(strsql,function(err, rows) {
						// 		if(err) throw new Error(err);
						// 		var res = Number(rows[0].cant);
						// 		if(res != 0)
						// 		request.response.source.context.notificacion = res;
						// 	reply(request.response)
						// 	});
						// 	connection.release();
						// });
						
						reply(request.response);
					}
				}else				
				reply();
			}else
				return reply();
		});
	});


