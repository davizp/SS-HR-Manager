// Local Vars ===================================
	var sesion = function(server) {
		server.pack.register({
				plugin: require('hapi-auth-cookie'),
				name: 'sesion',
				// register: function (plugin, options, next) {
			 //        plugin.route({ method: 'GET', path: '/special', handler: function (request, reply) { reply(options.message); } });
			 //        next();
			 //    },
				options:{


				}
				
			}, function(err) {
				if (err) throw err;
				server.auth.strategy('session', 'cookie', {
					password: 'password', // cookie secret					
					cookie: 'sid', // Cookie name
					redirectTo: '/', // Let's handle our own redirections
					isSecure: false, // required for non-https applications
					ttl: 12* 60 * 60 * 1000, // Set session to 1 day
					//clearInvalid:true,
					validateFunc: function(session,callback){
						console.log("valfunc -->");
						console.log(session);
						// server.ext('onPreAuth', function (request, next) {
						// 	var strsql = "SELECT nom_usuario as nom FROM usuarios WHERE id_usuario = 1";
						// 	request.server.plugins['db'].pool.getConnection(function(err, connection) {
						// 		connection.query(strsql,function(err, rows) {
						// 			console.log(rows[0]["nom"]);
						// 		});
						// 		connection.release();
						// 	});	




						// 	next();
						// });	


						
						if(typeof session.user != "undefined"){
							// var vemail = session.user.email;
							// var vpassword = session.user.password;
							// var user;

							// var strsql = "SELECT id_usuario as id,CONCAT(substring_index(nom_usuario, ' ', 1),' ',substring_index(ape_usuario,' ',1)) as nom"+
							// 				" FROM usuarios WHERE pas_usuario = '"+vpassword +"' AND email_usuario='"+vemail +"';";

							// server.ext('onRequest', function (request, next) {
							// 	request.server.plugins['db'].pool.getConnection(function(err, connection) {
							// 		connection.query(strsql,function(err, rows) {
							// 			if(err) throw new Error(err);

							// 			var vid = rows[0]["id"];
							// 			var vnom = rows[0]["nom"];
							// 			//console.log(rows);
							// 			user = {user: {id: vid, name: vnom,email: vemail,password:vpassword} };
							// 			console.log("SQL -- >");										
							// 			console.log(user);
										
							// 			return callback(null, true, user);
							// 			request.auth.session.set({});


							// 		});//fin del query
							// 		connection.release();
							// 	});//fin del plugin		
							// 	next();							
							// });//fin del server.ext
							console.log("VALIDO")
							var x = session;
							return callback(null, true,x);
						}
						else
							return callback(null, false,null);

						
							
					}
					// validateFunc: function(session,callback){
						
					// 	//cache.get(session.sid,function(err,cached){
					// 	//	if(err) return callback(err,false);
					// 	//	if(!cached)callback(null,false);
					// 	console.log(request.payload["username"])
					// 		return callback(null,true,cached.item.account);
					// 		//callback(err, isValid, { id: user.id, name: user.name });
					// 	//});
					// }
		    	});	
			}			
		);
	};

// Plugin export ================================
	module.exports = sesion;