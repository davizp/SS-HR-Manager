// Dependencies =================================



//-- Aqui pasamos variables a través de Handlebars {ej:5,ej2:"hola",js_view: js_custom.js} 
//-- BD y parte lógica

// Routes Object ================================
	var public_ctrl = {
		index: {
			auth: {
				mode: 'try',
				strategy: 'session'
			},
			plugins: {
				'hapi-auth-cookie': {
					redirectTo: false
				}
			},
			handler: function (request, reply) {
				if(request.auth.isAuthenticated){
					if(typeof request.auth.credentials.user.id == "undefined")
						set_cookie(request, reply);
					else
						return reply.redirect("/inicio");
					console.log(request.auth.credentials);
				}
				else
					reply.view('index', { js_view: 'index.js'});
				request.auth.session.set({});			
				check_login(request,reply);

			}
		},
		notificaciones:{
			auth: 'session',
			handler: function (request,reply){
				request.server.plugins['db'].pool.getConnection(function(err, connection) {
					var strsql = "SELECT id_notificacion as id , notificacion as notif FROM notificaciones WHERE id_usuario = "+
					request.auth.credentials.user.id+" ORDER BY id_notificacion DESC ";
					console.log(strsql)
					connection.query(strsql,function(err, rows) {
						if(err) throw new Error(err);
						if(rows.length > 0)
							for(var i=0,vt_not=""; i<rows.length; i++)
								vt_not += '<tr id="'+rows[i]["id"]+ '"> <td>'+rows[i]["notif"]+'</td> </tr>';		
							else
								var vt_not = '<tr><td  colspan="1" style="text-align: center;">No hay Notificaciones.</td></tr>';
							var strsql = "UPDATE notificaciones SET visto = 1 WHERE id_usuario = "+request.auth.credentials.user.id;
							console.log(strsql)
							sql_execute(request, reply,strsql,"");
							return reply.view("notificaciones",{t_not:vt_not,login:nav_log(request)});

					});
					connection.release();
				});
			}
		},
		login: {
			auth: {
				mode: 'try',
				strategy: 'session'
			},
			plugins: {
				'hapi-auth-cookie': {
					redirectTo: false
				}
			},
			handler: function (request, reply) {
				if(request.method === 'post'){
					var email	= request.payload["username"];
					var pass	= request.payload["password"];
					var strsql	= "SELECT fx_login('"+email+"','"+pass+"') as log";
					request.server.plugins['db'].pool.getConnection(function(err, connection) {
						connection.query(strsql,function(err, rows) {
							if(err) throw new Error(err);
							var res 	= Number(rows[0]["log"]);
							var message = '';
							console.log(res + " LOGIN -- " +request.auth.isAuthenticated)
							

							
								if (!email || !pass)	message = 'Falta Usuario o Contraseña';
								else 
									if(res == 1) message = 'Usuario Invalido';
									else
										if(res == 2) message = 'Usuario y Contraseña no coinciden.';
										else
											if(res == 3){					 				
												request.auth.session.set({user:{password:request.payload.password, email: request.payload.username}});
												console.log("ESTO ESTA CORRECTO ------------***********")
												
												return reply.redirect('/');
											}						
							console.log(message);
							return reply.view('login',{js_view: 'index.js',mensaje:message,email:email,login:" "});
						});
						connection.release();
					});
				}
				else
					return reply.redirect('/');

			}
		},
		logout: {
			auth: 'session',
			handler: function (request, reply){
				request.auth.session.clear();
				return reply.redirect("/");
			}
		},
		password_reset: {
			auth: {
				mode: 'try',
				strategy: 'session'
			},
			plugins: {
				'hapi-auth-cookie': {
					redirectTo: false
				}
			},
			handler: function (request, reply){
				
				if(request.method === 'post'){
					var vcorreo = request.payload.username;
					var strsql = "SELECT email_usuario as email FROM usuarios WHERE email_usuario = '"+ vcorreo +"'";

					console.log(request.payload)
					var vclase = "";
					request.server.plugins['db'].pool.getConnection(function(err, connection) {
						connection.query(strsql,function(err, rows) {
							if(err) throw new Error(err);
							var vmensaje = "";
							
							if(rows.length == 0){
								vmensaje = "<strong>Error!</strong> Usuario no existe!";
								vclase = "alert-danger";
								
							}else{
								var codigo = sha512(Math.random()+(new Date())).slice(0, 30);
								strsql = "UPDATE usuarios SET codigo = '"+codigo+"' WHERE email_usuario = '"+rows[0]["email"]+"'";
								console.log(strsql)
								request.server.plugins['db'].pool.getConnection(function(err, connection) {
									connection.query(strsql,function(err, rows) {
										if(err) throw new Error(err);
										// strmsj = "<h1>Correo para Restablecer Contraseña </h1> "+
										// "<br/>Tu Código es: <br/>"+ codigo + "<br/><br/><br/>"+
										// "Atentamente, <br/>San Sevices";
										strmsj = "Recibimos una solicitud de modificación de tu contraseña. Para hacer el cambio, copia el siguiente código: <br/><br/>"+
										"Tu Código es: "+ codigo +"<br/><br/>"+
										"Si no solicitaste el cambio, ignora este mensaje para que tu contraseña no sea alterada y puedas seguir ingresando a tu cuenta como acostumbras."+
										"Maneja tu información de forma sencilla. Si tienes consultas, escríbenos a soporte@sanservices.hn <br><br><br>"+
										"Atentamente, <br/>"+
										"El equipo San Services";
										console.log("---------->>>>>" + request.payload.username);
										email(request.payload.username,"Restablecer Contraseña","Código de Validación","Tienes un Nuevo Código de Validación",strmsj);

									});
									connection.release();
								});

								vclase = "alert-success";
								vmensaje = "El Mensaje ha sido Enviado Correctamente!";
								
								reply.view("password-code",{mensaje:vmensaje,clase:vclase,login:" ",correo: vcorreo});
							}
							reply.view("password-reset",{mensaje:vmensaje,clase:vclase,login:" "});

						});
						connection.release();
					});



				}
				else
					return reply.view("password-reset",{login:" "});
			}
		},
		password_code: {
			auth: {
				mode: 'try',
				strategy: 'session'
			},
			plugins: {
				'hapi-auth-cookie': {
					redirectTo: false
				}
			},
			handler: function (request, reply){
				console.log(request.payload);
				if(request.method === 'get'){
					return reply.redirect("/password-reset");
				}
				// vmensaje = "Se ha asignado nueva Contraseña (Revisar Correo)!";

				strsql = "SELECT codigo FROM usuarios WHERE email_usuario = '"+request.payload.username+"'";
				//CONCAT('http://www.',substring_index(email_usuario,'@',-1),'/') as url 
				console.log(strsql)
				request.server.plugins['db'].pool.getConnection(function(err, connection) {
					connection.query(strsql,function(err, rows) {
						if(rows[0]["codigo"] == request.payload.codigo && rows[0]["codigo"] != ''){
							fx_pass_reset(request,reply,request.payload.username);
							//open(rows[0]["url"]);
							strsql = "UPDATE usuarios SET codigo = null WHERE codigo = '"+rows[0]["codigo"]+"' AND email_usuario = '"+request.payload.username+"'";
							sql_execute(request, reply,strsql,'/');
							//reply.redirect("/");
						}else{
							var vmensaje = "Código Incorrecto!";
							vclase = "alert-danger";
							reply.view("password-code",{mensaje:vmensaje,clase:vclase,login:" ",correo: request.payload.username});
						}
					});
					connection.release();
				});

				// return reply.view('login',{mensaje:vmessage,email:email,login:" "});


			}
		},
		password_change: {
			auth: 'session',
			handler: function (request, reply){
				if(request.method === 'post'){
					var vmensaje = "";
					var vclase = "alert-danger";
					var verror = 0;
					if(request.payload.password2 != request.payload.password3){
						vmensaje = "<strong>Error!</strong> Contraseña no coinciden!";
						verror = 1;
					}else if(request.payload.password2 == request.payload.password1){
							vmensaje = "<strong>Error!</strong> No puedes poner la misma Contraseña!";
							verror = 2;
						}

						if(verror == 0){

							strsql = "UPDATE usuarios SET pas_usuario = '"+request.payload.password2+"'"+ 
							"WHERE email_usuario = '"+request.auth.credentials.user.email+
							"' AND pas_usuario = '"+request.payload.password1+"';";
							console.log(strsql);
							request.server.plugins['db'].pool.getConnection(function(err, connection) {			
								connection.query(strsql,function(err, rows) {
									if(err) throw new Error(err);

									if(Number(rows.changedRows) == 0)
										vmensaje = "Contraseña Incorrecta!";										
									else{ 
										vmensaje = "Tu Contraseña ha sido Cambiada!";
										vclase = "alert-success";
									}
									
									reply.view("password-change",{js_view: 'password.js',clase:vclase,mensaje:vmensaje,login:nav_log(request)});
								});
								connection.release();
							});

						}else
							return reply.view("password-change",{js_view: 'password.js',clase:vclase,mensaje:vmensaje,login:nav_log(request)});
				}else
					reply.view("password-change",{js_view: 'password.js',login:nav_log(request)});//aqui va el vmsj
			}
		},//__________________________________________________________________________________________________________________________________________________
		fc_eventos: {
			auth:'session',			
			handler: function (request, reply) {
				check_login(request,reply);
				reply.view('fc_eventos', {js_view:'inicio.js',login:nav_log(request)});
			}
		},
		fc_aprobados: {
			auth:'session',			
			handler: function (request, reply) {
				check_login(request,reply);
				reply.view('fc_aprobados', {js_view:'inicio.js',login:nav_log(request)});
			}
		},
		mant_feriados: {
			auth:'session',			
			handler: function (request, reply) {
				check_login(request,reply);
				fx_is_admin(request, reply);
				if(request.method === 'post'){
					if(request.payload.accion == 'cargar'){
						var strsql = "SELECT fec_feriados as fec FROM feriados WHERE id_feriado = YEAR(NOW())";
					}else{
						if(request.payload.fec.length > 0)
							var strsql = "	INSERT INTO feriados(id_feriado,fec_feriados)	\
											VALUES				("+request.payload.id+",	\
																'"+request.payload.fec+"')	\
											ON DUPLICATE KEY UPDATE 						\
											id_feriado 		=  "+request.payload.id+",		\
											fec_feriados	= '"+request.payload.fec+"'";
						else
							var strsql = "DELETE IGNORE FROM feriados WHERE id_feriado = " +request.payload.id;
					}
					console.log(strsql);

					fx_sql(request,strsql,function(r){
						return reply(r);
					});
				}else{
					return reply.view('mant_feriados', {js_view:'feriados.js',login:nav_log(request)});
				}

			}
		},
		mant_eventos: {
			auth:'session',			
			handler: function (request, reply) {
				check_login(request,reply);
				fx_is_admin(request, reply);
				if(request.method === 'get'){
					var strsql 	=	"SELECT 	id_evento 								as id,	\
												no_evento 								as no,	\
												DATE_FORMAT(fi_evento, '%m-%d-%Y')		as fi,	\
												DATE_FORMAT(ff_evento, '%m-%d-%Y')		as ff,	\
												in_evento 								as inf	\
									FROM 		eventos";
					fx_sql(request,strsql,function(r){
						var vt_eve = "";
						for(var i=0; i< r.length ;i++){
							vt_eve +=	"<tr id = '"+r[i].id+"'>"+
											"<td>" + r[i].no + "</td>"+
											"<td>" + r[i].fi + "</td>"+
											"<td>" + r[i].ff + "</td>"+
											"<td>" + r[i].inf + "</td>"+
											"<td><a onclick = 'fx_editar($(this))' class = 'btn btn-primary' data-toggle='modal' data-target='#modal_nuevo'><span class = 'glyphicon glyphicon-edit'></span> Editar</a></td>"+
											"<td><a  onclick = 'fx_eliminar($(this))' class='lg btn btn-danger' data-toggle='modal' data-target='#confirmDelete'><span class = 'glyphicon glyphicon-trash'></span> Eliminar</a></td>"+
										"</tr>\n";
						}
						return reply.view('mant_eventos', {js_view:'eventos.js',t_eve:vt_eve,login:nav_log(request)});
					});
					
				}else{
					var id 	= request.auth.credentials.user.id;
					var r 	= request.payload;

					switch(request.payload.accion){						
						case "nuevo":
							var strsql = "	INSERT INTO eventos(no_evento,fi_evento,ff_evento,in_evento,reg_id_usuario) \
											VALUES(		'"+ r.no  +"', 				\
											STR_TO_DATE('"+ r.fi  +"', '%m-%d-%Y'), 	\
											STR_TO_DATE('"+ r.ff  +"', '%m-%d-%Y'),	\
														'"+ r.inf +"',"+ id +")";
						break;
						case "editar":
							var strsql = "	UPDATE eventos SET													\
											no_evento 			= '"+ r.no +"',									\
											fi_evento 			= STR_TO_DATE('"+ r.fi +"', '%m-%d-%Y'),		\
											ff_evento 			= STR_TO_DATE('"+ r.ff +"', '%m-%d-%Y'),		\
											in_evento 			= '"+ r.inf +"'									\
											WHERE id_evento 	=  "+ r.id +"									\
										";

						break;
						case "eliminar":
							var strsql = "DELETE FROM eventos WHERE id_evento = "+ r.id;
						break;
					}
					console.log(strsql);

					fx_sql(request,strsql,function(r){
						return reply(r);
					});
				}
			}
		},
		correo: {
			auth:'session',			
			handler: function (request, reply) {
				check_login(request,reply);
				fx_is_admin(request,reply);

				if(request.method === 'post'){
					var d =request.payload; // data
					console.log(request.payload);
					console.log(request.payload);
					email(d.para,d.asunto,d.titulo,"",d.editor,function(r){
						var res = {};
						if(r == "ok"){
							res.r = "Mensaje Enviado"
						}
						else
							res.r = "Mensaje Fallido"
						console.log(res);
						reply(res);
					});
				}else{
					var strsql = "	SELECT 	email_usuario as email,								\
										CONCAT(substring_index(nom_usuario,' ',1) 			\
										,' ',  substring_index(ape_usuario,' ',1)) as nom 	\
								FROM	usuarios";

					fx_sql(request,strsql,function(r){
						var vop = "";
						for(var i = 0; i < r.length; i++ )
							vop += '<option value="'+r[i].email+'">'+ r[i].nom +'</option>';

						reply.view('correo',{js_view:'correo.js',op:vop,login:nav_log(request)});
					});
				}
			}
		},
		inicio: {
			auth:'session',			
			handler: function (request, reply) {
				check_login(request,reply);
				if(request.auth.credentials.user.admin)
					return reply.redirect("/consultas_admin");
				if(request.method === 'post'){
					switch(request.payload.accion){
						case "fc_eventos":
							var strsql = "SELECT 	id_usuario 							as id,		\
													concat(nom_usuario,' ',ape_usuario) as nom,		\
													fnac_usuario 						as fnac,	\
											 		ftra_usuarios 						as ftra		\
										  FROM 		usuarios";
						break;
						case "fc_aprobados":
							var id 	= request.auth.credentials.user.id;
							if(request.auth.credentials.user.jefe)
								var strsql = "SELECT 	s.id_solicitud 			as id,		 				\
														CONCAT(substring_index(u.nom_usuario, ' ', 1) 		\
														,' ',substring_index(u.ape_usuario,' ',1)) as nom, 	\
														tp.tipo_permiso 		as tp, 						\
														fper_solicitud 			as fp, 						\
														ftra_solicitud 			as ft 						\
												FROM 	solicitudes_permisos	s, 							\
														tipos_permisos 			tp, 						\
														departamentos 			d, 							\
														usuarios 				u 							\
												WHERE 	u.id_usuario 		= 	s.id_usuario				\
												AND 	d.id_departamento 	= 	s.id_departamento 			\
												AND 	tp.id_tipo_permiso 	= 	s.id_tipo_permiso 			\
												AND 	s.aprobado 			= 	1 							\
												AND		d.id_usuario 		= 	"+ id;
							else
								var strsql = "SELECT	s.id_solicitud			as id, 				\
														t.tipo_permiso			as tp, 				\
														s.fper_solicitud		as fp, 				\
														s.ftra_solicitud		as ft 				\
												FROM	solicitudes_permisos 	s, 					\
														tipos_permisos 			t 					\
												WHERE	s.id_tipo_permiso 	=	t.id_tipo_permiso	\
												AND		s.aprobado			=	1 					\
												AND		s.id_usuario 		= 	"+ id;
						break;
						case "eventos":
							var strsql 	=	"SELECT 	id_evento 								as id,	\
														no_evento 								as no,	\
														DATE_FORMAT(fi_evento, '%Y-%m-%d')		as fi,	\
														DATE_FORMAT(ff_evento, '%Y-%m-%d')		as ff,	\
														in_evento 								as inf	\
											FROM 		eventos";
						break
					}
					console.log(strsql);

					fx_sql(request,strsql,function(r){
						return reply(r);
					});
				}
				/* * * * * * * * * * * * * * * *
				*
				*/
				var strsql = "SELECT s.id_solicitud as id,s.id_usuario,CONCAT(substring_index(u.nom_usuario, ' ', 1),' ',substring_index(u.ape_usuario,' ',1)) as nom,s.id_departamento,d.departamento as dep, \
				s.id_tipo_permiso,tp.tipo_permiso,DATE_FORMAT(fper_solicitud, '%m-%d-%Y') as fper,dias_solicitud as dias,aprobado as apr,DATE_FORMAT(ftra_solicitud, '%m-%d-%Y') as ftra \
				,u.personal_restantes as per,dflo_solicitud as flo FROM solicitudes_permisos s,tipos_permisos tp, departamentos d,usuarios u \
				WHERE u.id_usuario = s.id_usuario AND d.id_departamento = s.id_departamento AND tp.id_tipo_permiso = s.id_tipo_permiso \
				AND s.id_departamento = "+ request.auth.credentials.user.dep + " AND s.id_usuario = "+request.auth.credentials.user.id+ 
				" AND s.aprobado = 0 ORDER BY s.id_solicitud DESC LIMIT 5";

				console.log(strsql)
				request.server.plugins['db'].pool.getConnection(function(err, connection) {
					connection.query(strsql,function(err, rows) {
						if(err) throw new Error(err);
						if(rows.length>0){
							for(var i=0,vt_pen=""; i<rows.length; i++){
								var apr_class = "";
								if(Number(rows[i]["apr"]) == 1)	apr_class ='glyphicon glyphicon-ok green';
								else if(Number(rows[i]["apr"]) == 2)	apr_class ='glyphicon glyphicon-remove red';
									else apr_class ='glyphicon glyphicon-time blue';

								vt_pen += '<tr id="'+rows[i]["id"]+ '">\n' + 
												'\t<td value="'+rows[i]["id_tipo_permiso"]+ '">'+rows[i]["tipo_permiso"]+'</td>\n'+
												'\t<td value="'+rows[i]["id_departamento"]+ '">'+rows[i]["fper"]+'</td>\n'+
												'\t<td>'+((rows[i]["flo"]==null)?"Ninguno": '<div type="text" class = "flo" readonly>'+rows[i]["flo"]+'</div>')+
												'</td>'+
												'\t<td>'+rows[i]["dias"]+'</td>\n'+
												'\t<td>'+rows[i]["ftra"]+'</td>\n'+												
												'\t<td class = "center" value = "'+rows[i]["apr"]+'"><span class="'+apr_class+'"></span></td>'+
											'</tr>\n';									
							}
						}
						else
						var vt_pen = '<tr><td  colspan="6" style="text-align: center;">No hay Resultados.</td></tr>';

							
							var strsql = "SELECT s.id_solicitud as id,s.id_usuario,CONCAT(substring_index(u.nom_usuario, ' ', 1),' ',substring_index(u.ape_usuario,' ',1)) as nom,s.id_departamento,d.departamento as dep, \
						s.id_tipo_permiso,tp.tipo_permiso,DATE_FORMAT(fper_solicitud, '%m-%d-%Y') as fper,dias_solicitud as dias,aprobado as apr,DATE_FORMAT(ftra_solicitud, '%m-%d-%Y') as ftra \
						,u.personal_restantes as per,dflo_solicitud as flo FROM solicitudes_permisos s,tipos_permisos tp, departamentos d,usuarios u \
						WHERE u.id_usuario = s.id_usuario AND d.id_departamento = s.id_departamento AND tp.id_tipo_permiso = s.id_tipo_permiso \
						AND s.id_departamento = "+ request.auth.credentials.user.dep + " AND s.id_usuario = "+request.auth.credentials.user.id+ 
						" AND (s.aprobado = 2 OR s.aprobado = 1) ORDER BY s.id_solicitud DESC LIMIT 5";

							connection.query(strsql,function(err, rows) {
								if(err) throw new Error(err);
								if(rows.length>0)
									for(var i=0,vt_his=""; i<rows.length; i++){
										var apr_class = "";
										if(Number(rows[i]["apr"]) == 1)	apr_class ='glyphicon glyphicon-ok green';
										else if(Number(rows[i]["apr"]) == 2)	apr_class ='glyphicon glyphicon-remove red';
											else apr_class ='glyphicon glyphicon-time blue';

										vt_his += '<tr id="'+rows[i]["id"]+ '">\n' + 
														'\t<td value="'+rows[i]["id_tipo_permiso"]+ '">'+rows[i]["tipo_permiso"]+'</td>\n'+
														'\t<td value="'+rows[i]["id_departamento"]+ '">'+rows[i]["fper"]+'</td>\n'+
														'\t<td>'+((rows[i]["flo"]==null)?"Ninguno": '<div type="text" class = "flo" readonly>'+rows[i]["flo"]+'</div>')+
														'</td>'+
														'\t<td>'+rows[i]["dias"]+'</td>\n'+
														'\t<td>'+rows[i]["ftra"]+'</td>\n'+												
														'\t<td class = "center" value = "'+rows[i]["apr"]+'"><span class="'+apr_class+'"></span></td>'+
													'</tr>\n';
									}
								else
								var vt_his = '<tr><td  colspan="6" style="text-align: center;">No hay Resultados</td></tr>';
								if(request.auth.credentials.user.jefe == 0)
									reply.view('inicio', {js_view:'inicio.js',t_pen:vt_pen,t_his:vt_his,login:nav_log(request)});
								else{
									var strsql = "SELECT s.id_solicitud as id,s.id_usuario,CONCAT(substring_index(u.nom_usuario, ' ', 1),' ',substring_index(u.ape_usuario,' ',1)) as nom,s.id_departamento,d.departamento as dep, \
									s.id_tipo_permiso,tp.tipo_permiso,DATE_FORMAT(fper_solicitud, '%m-%d-%Y') as fper,s.dias_solicitud as dias,aprobado as apr,DATE_FORMAT(ftra_solicitud, '%m-%d-%Y') as ftra \
									FROM solicitudes_permisos s,tipos_permisos tp, departamentos d,usuarios u \
									WHERE u.id_usuario = s.id_usuario AND d.id_departamento = s.id_departamento AND tp.id_tipo_permiso = s.id_tipo_permiso \
									AND fper_solicitud > (NOW()- INTERVAL 1 DAY) AND s.aprobado = 0 AND d.id_usuario = "+ request.auth.credentials.user.id + " ORDER BY s.id_solicitud DESC LIMIT 5";
									connection.query(strsql,function(err, rows) {
										if(err) throw new Error(err);
										if(rows.length>0)
											for(var i=0,vt_jpen=""; i<rows.length; i++){
												var apr_class = "";
												if(Number(rows[i]["apr"]) == 1)	apr_class ='glyphicon glyphicon-ok green';
												else if(Number(rows[i]["apr"]) == 2)	apr_class ='glyphicon glyphicon-remove red';
													else apr_class ='glyphicon glyphicon-time blue';

												vt_jpen += '<tr id="'+rows[i]["id"]+ '">\n' + 
																'\t<td>'+rows[i]["nom"]+'</td>\n'+
																'\t<td value="'+rows[i]["id_tipo_permiso"]+ '">'+rows[i]["tipo_permiso"]+'</td>\n'+
																'\t<td value="'+rows[i]["id_departamento"]+ '">'+rows[i]["fper"]+'</td>\n'+
																'\t<td>'+rows[i]["dias"]+'</td>\n'+
																'\t<td>'+rows[i]["ftra"]+'</td>\n'+												
																'\t<td class = "center" value = "'+rows[i]["apr"]+'"><span class="'+apr_class+'"></span></td>'+
															'</tr>\n';
											}
										else
											var vt_jpen = '<tr><td  colspan="6" style="text-align: center;">No hay Resultados</td></tr>';


										var strsql = "SELECT s.id_solicitud as id,s.id_usuario,CONCAT(substring_index(u.nom_usuario, ' ', 1),' ',substring_index(u.ape_usuario,' ',1)) as nom,s.id_departamento,d.departamento as dep, \
										s.id_tipo_permiso,tp.tipo_permiso,DATE_FORMAT(fper_solicitud, '%m-%d-%Y') as fper,dias_solicitud as dias,aprobado as apr,DATE_FORMAT(ftra_solicitud, '%m-%d-%Y') as ftra \
										FROM solicitudes_permisos s,tipos_permisos tp, departamentos d,usuarios u \
										WHERE u.id_usuario = s.id_usuario AND d.id_departamento = s.id_departamento AND tp.id_tipo_permiso = s.id_tipo_permiso \
										AND (s.aprobado = 2 OR s.aprobado = 1) AND d.id_usuario =  "+ request.auth.credentials.user.id + " ORDER BY s.id_solicitud DESC LIMIT 5";
										connection.query(strsql,function(err, rows) {
										if(err) throw new Error(err);
										if(rows.length>0)
											for(var i=0,vt_jhis=""; i<rows.length; i++){
												var apr_class = "";
												if(Number(rows[i]["apr"]) == 1)	apr_class ='glyphicon glyphicon-ok green';
												else if(Number(rows[i]["apr"]) == 2)	apr_class ='glyphicon glyphicon-remove red';
													else apr_class ='glyphicon glyphicon-time blue';

												vt_jhis += '<tr id="'+rows[i]["id"]+ '">\n' +
																'\t<td>'+rows[i]["nom"]+'</td>\n'+
																'\t<td value="'+rows[i]["id_tipo_permiso"]+ '">'+rows[i]["tipo_permiso"]+'</td>\n'+
																'\t<td value="'+rows[i]["id_departamento"]+ '">'+rows[i]["fper"]+'</td>\n'+
																'\t<td>'+rows[i]["dias"]+'</td>\n'+
																'\t<td>'+rows[i]["ftra"]+'</td>\n'+												
																'\t<td class = "center" value = "'+rows[i]["apr"]+'"><span class="'+apr_class+'"></span></td>'+
															'</tr>\n';
											}
										else
											var vt_jhis = '<tr><td  colspan="6" style="text-align: center;">No hay Resultados</td></tr>';
											reply.view('inicio', {js_view:'inicio.js',t_pen:vt_pen,t_his:vt_his,t_jpen:vt_jpen,t_jhis:vt_jhis,login:nav_log(request)});	
										});
									});
								}//fin del else
							});

						// else
						// 	var vt_per = '<tr><td  colspan="8" style="text-align: center;">No hay Resultados.</td></tr>';
						
						
					});
					connection.release();
				});

			}
		},//__________________________________________________________________________________________________________________________________________________
		perfil: {
			auth: 'session',
			handler: function (request, reply) {
				//if(request.method === 'get'){
					var vt_perfil = '';
					var strsql = "SELECT u.id_usuario as id ,u.nom_usuario as nom,u.ape_usuario as ape,DATE_FORMAT(u.fnac_usuario,'%m-%d-%Y') as fnac, \
					DATE_FORMAT(u.ftra_usuarios,'%m-%d-%Y') as ftra,u.email_usuario as email,u.personal_restantes as dper,d.departamento as dep \
					FROM usuarios u LEFT OUTER JOIN departamentos d ON u.id_departamento = d.id_departamento \
					WHERE u.email_usuario = '"+request.auth.credentials.user.email+
					"' AND u.pas_usuario = '"+request.auth.credentials.user.password+"'";
					console.log(strsql)
					request.server.plugins['db'].pool.getConnection(function(err, connection) {
						connection.query(strsql,function(err, rows) {
							if(err) throw new Error(err);
							
							vt_perfil+='<tr value = "'+rows[0]["id"]+'">\n \
											<th>Nombre</th>\n \
											<td>'+rows[0]["nom"]+'</td>\n \
										</tr>\n \
										<tr>\n \
											<th>Apellido</th>\n \
											<td>'+rows[0]["ape"]+'</td>\n \
										</tr>\n \
										<tr>\n \
											<th>Departamento</th>\n \
											<td>'+((rows[0]["dep"] == null)?"Ninguno":rows[0]["dep"])+'</td>\n \
										</tr>\n \
										<tr>\n \
											<th>Fecha de Nacimiento</th>\n \
											<td>'+rows[0]["fnac"]+'</td>\n \
										</tr>\n \
										<tr>\n \
											<th>Fecha que comenzó a Trabajar</th>\n \
											<td>'+rows[0]["ftra"]+'</td>\n \
										</tr>\n \
										<tr>\n \
											<th>Email</th>\n \
											<td>'+rows[0]["email"]+'</td>\n \
										</tr>\n \
										<tr>\n \
											<th>Dias Personales Disponibles</th>\n \
											<td>'+rows[0]["dper"]+'</td>\n \
										</tr>\n';

							if(request.payload != null){
								console.log(request.payload)					
								var strsql = "UPDATE usuarios SET "+
								"nom_usuario = '"+request.payload["nom"]+"',"+
								"ape_usuario = '"+request.payload["ape"]+"',"+
								"fnac_usuario = STR_TO_DATE('"+request.payload["fnac"]+"', '%m-%d-%Y'),"+
								// "ftra_usuarios = STR_TO_DATE('"+request.payload["ftra"]+"', '%m-%d-%Y'),"+
								"email_usuario = '"+request.payload["email"]+"'"+
								" WHERE id_usuario = "+request.auth.credentials.user.id+" AND pas_usuario = '"+request.payload["pass"]+"'";
								console.log(strsql)
								
								
								connection.query(strsql,function(err, rows) {
									if(err) throw new Error(err);
									var vmsj = "";
									console.log(rows);console.log(rows);console.log(rows);console.log(rows);console.log(rows);
									if(rows.affectedRows == 0)
										vmsj = '<div class="alert alert-danger alert-dismissible" role="alert"> \
											<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> \
											<strong>Error!</strong> Contraseña Incorrecta!</div>';
									else{
										// vmsj = '<div class="alert alert-success alert-dismissible" role="alert"> \
										// 	<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> \
										// 	Datos Actualizados!</div>';
										return reply.redirect("/perfil");
									}

									return reply.view('perfil', {js_view:"perfil.js",t_perfil: vt_perfil,login:nav_log(request),msj:vmsj });
								});
							}else
								reply.view('perfil', {js_view:"perfil.js",t_perfil: vt_perfil,login:nav_log(request)});

						});
						connection.release();
					});
			}
		},//__________________________________________________________________________________________________________________________________________________
		consultas_admin: {
			auth:'session',
			handler: function (request, reply) {
				fx_is_admin(request, reply);//-------- SI NO ES ADMIN NO PUEDE ENTRAR

				var strsql = "SELECT s.id_solicitud as id,s.id_usuario,CONCAT(u.nom_usuario,' ',u.ape_usuario) as nom,s.id_departamento,d.departamento as dep, \
				s.id_tipo_permiso,tp.tipo_permiso,DATE_FORMAT(fper_solicitud, '%m-%d-%Y') as fper,dias_solicitud as dias,s.aprobado as apr, \
				DATE_FORMAT(ftra_solicitud, '%m-%d-%Y') as ftra , (SELECT CONCAT(nom_usuario,' ',ape_usuario) FROM usuarios WHERE id_usuario = s.reg_id_usuario) as jefe \
				,dflo_solicitud as flo FROM solicitudes_permisos s,tipos_permisos tp, departamentos d,usuarios u \
				WHERE u.id_usuario = s.id_usuario AND d.id_departamento = s.id_departamento AND tp.id_tipo_permiso = s.id_tipo_permiso \
				ORDER BY s.id_solicitud DESC;";

				console.log(strsql)
				request.server.plugins['db'].pool.getConnection(function(err, connection) {
					connection.query(strsql,function(err, rows) {
						if(err) throw new Error(err);

						if(rows.length>0)
							for(var i=0,vt_con=""; i<rows.length; i++){
								var apr_class = "",apr = "";
								if(Number(rows[i]["apr"]) == 1){
									apr_class ='glyphicon glyphicon-ok green';
									apr = 'APROBADA';
								}
								else if(Number(rows[i]["apr"]) == 2){
									apr_class ='glyphicon glyphicon-remove red';
									apr = 'RECHAZADA';
								}
									else{
										apr_class ='glyphicon glyphicon-time blue';
										apr = 'ESPERA';
									}
									
								vt_con += '<tr id="'+rows[i]["id"]+ '">\n' + 
												'\t<td value="'+rows[i]["id_usuario"]+ '">'+rows[i]["nom"]+'</td>\n'+
												'\t<td value="'+rows[i]["id_tipo_permiso"]+ '">'+rows[i]["tipo_permiso"]+'</td>\n'+
												'\t<td>'+rows[i]["fper"]+'</td>\n'+
												'\t<td value="'+rows[i]["id_departamento"]+ '">'+rows[i]["dep"]+'</td>\n'+
												'\t<td>'+((rows[i]["flo"]==null)?"Ninguno": '<div type="text" class = "flo" readonly>'+rows[i]["flo"]+'</div>')+
												'</td>'+
												'\t<td>'+rows[i]["dias"]+'</td>\n'+
												'\t<td>'+rows[i]["ftra"]+'</td>\n'+
												'\t<td value = "'+rows[i]["apr"]+'"><span class="'+apr_class+'"> \
												<div style="text-indent: -99999px;">'+apr+'</div></span></td>'+
												'\t<td>'+(!(rows[i]["jefe"])?"Sistema":rows[i]["jefe"])+'</td>\n'+
											'</tr>\n';
							}



						reply.view('consultas_admin', {js_view: 'solicitudes_permisos-historial.js',t_con:vt_con,login:nav_log(request)});
					});
					connection.release();
				});


			}
		},//__________________________________________________________________________________________________________________________________________________
		mant_usuarios: {
			auth:'session',
			handler: function (request, reply) {
				fx_is_admin(request, reply);//-------- SI NO ES ADMIN NO PUEDE ENTRAR
				console.log(request.payload)
				if(request.payload ==null)
					var strsql = "SELECT u.id_usuario as id,u.nom_usuario as nom,u.ape_usuario as ape, \
					DATE_FORMAT(u.fnac_usuario, '%m-%d-%Y') as fnac,DATE_FORMAT(u.ftra_usuarios, '%m-%d-%Y') as ftra, \
					u.email_usuario as email ,u.is_admin as admin,u.personal_restantes per,d.id_departamento as id_dep,d.departamento as dep \
					FROM usuarios u \
					LEFT OUTER JOIN departamentos d \
					ON u.id_departamento = d.id_departamento";
				// else
				// 	if(typeof request.payload["buscar"] != 'undefined')
				// 	var strsql = "SELECT u.id_usuario as id,u.nom_usuario as nom,u.ape_usuario as ape, \
				// 	DATE_FORMAT(u.fnac_usuario, '%m-%d-%Y') as fnac,DATE_FORMAT(u.ftra_usuarios, '%m-%d-%Y') as ftra, \
				// 	u.email_usuario as email ,u.is_admin as admin,u.personal_restantes per,d.id_departamento as id_dep,d.departamento as dep \
				// 	FROM usuarios u, departamentos d \
				// 	WHERE u.id_departamento = d.id_departamento AND CONCAT(substring_index(u.nom_usuario, ' ', 1),' ',substring_index(u.ape_usuario,' ',1)) like '%"+request.payload["buscar"]+"%'";

				var vcmb_dep = ''; //STR COMBOBOX DEL DEPARTAMENTO
				request.server.plugins['db'].pool.getConnection(function(err, connection) {
					connection.query(strsql,function(err, rows) {
						if(err) throw new Error(err);
						var vjs_var = '<script>var availableTags = [';

						for(var i=0,vt_usr=""; i<rows.length; i++){
							vt_usr += '<tr id="'+rows[i]["id"]+ '">' + 
											'<td>'+rows[i]["nom"]+'</td>'+
											'<td>'+rows[i]["ape"]+'</td>'+
											'<td>'+rows[i]["fnac"]+'</td>'+
											'<td>'+rows[i]["ftra"]+'</td>'+
											'<td>'+rows[i]["email"]+'</td>'+
											'<td value = "'+((rows[i]["id_dep"]==null)?0:rows[i]["id_dep"])+'">'+((rows[i]["dep"]==null)?'Ninguno':rows[i]["dep"])+'</td>'+
											'<td value = "'+rows[i]["admin"]+'"><span class="'+((rows[i]["admin"] == 1)?'glyphicon glyphicon-ok green':'glyphicon glyphicon-remove red')+'">'+
											'<div style="text-indent: -99999px;">'+((rows[i]["admin"] == 1)?'SI':'NO')+'</div></span></td>'+
											'<td>'+rows[i]["per"]+'</td>'+
											'<td><a onclick = "form_editar($(this))" class = "btn btn-primary" data-toggle="modal" data-target="#modal_usr"><span class = "glyphicon glyphicon-edit"></span> Editar</a></td>'+
											'<td><a  onclick = "form_eliminar($(this))" class="lg btn btn-danger" data-toggle="modal" data-target="#confirmDelete"><span class = "glyphicon glyphicon-trash"></span> Eliminar</a></td>'+
										'</tr>';
							vjs_var += '"'+rows[i]["nom"]+'"';
							if((i+1)<rows.length)
								vjs_var +=',';
						}
						vjs_var += '];</script>';
						

						connection.query('SELECT id_departamento as id, departamento as dep FROM departamentos;',function(err, rows) {
							if(err) throw new Error(err);
							for(var i=0; i<rows.length; i++)
								vcmb_dep += '<option value="'+rows[i]["id"]+ '">' + rows[i]["dep"]+'</option>';

							reply.view('mant_usuarios', { js_view: 'usuarios.js', t_usr: vt_usr,js_var:vjs_var,cmb_dep:vcmb_dep,login:nav_log(request)});
						});
					});

					connection.release();
				});

			}
		},
		usuarios_data: {
			auth:'session',
			handler: function(request, reply) {
				if(request.payload != null){
					var is_admin = (request.payload["isadmin"]) ? 1 : 0;
					var dep = (request.payload["dep"]) ? request.payload["dep"] : null;
					var strsql = "";
					var password = sha512(Math.random()+(new Date()));
					if(request.payload["accion"] == 'nuevo'){
						strsql = "INSERT INTO usuarios(nom_usuario,ape_usuario,fnac_usuario,ftra_usuarios,email_usuario,is_admin, \
						personal_restantes,id_departamento,pas_usuario,reg_doc,reg_id_usuario)VALUES('"+
						request.payload["nom"]+"','"+
						request.payload["ape"]+"',STR_TO_DATE('"+
						request.payload["fnac"]+"', '%m-%d-%Y'),STR_TO_DATE('"+
						request.payload["ftra"]+"', '%m-%d-%Y'),'"+
						request.payload["email"]+"',"+
						is_admin+","+
						request.payload["per"]+","+
						dep+",'"+
						sha512(password)+"',NOW(),1)";
						
						// strmsj = "<h1>San Services te da la bienvenida </h1> <br/> Hola "+request.payload["nom"]+" "+request.payload["ape"]+
						//  "<br/>Tu Contraseña es: <br/>"+ password + "<br/><br/><br/>"+
						// "Atentamente, <br/>San Sevices";

						strmsj = "Recuerda que puedes consultar nuestros servicios en nuestra página web:  www.sanservices.hn<br/><br/>"+
						"Tu usuario es: "+ request.payload["email"] +" <br/><br/>"+
						"Tu contraseña es: "+password+"<br/><br/>"+
						"Actualizar tus preferencias y datos, así como revisar nuestras actualizaciones frecuentemente nos ayudará a brindarte un mejor servicio."+
						"Para acceder a tu cuenta da click aquí.<br/><br/><br/>"+
						"Atentamente, <br/><br/>"+
						"El equipo San Services.";
						
						

					}else if(request.payload["accion"] == 'editar')
							strsql = "UPDATE usuarios SET "+
										"nom_usuario = '"+request.payload["nom"]+"',"+
										"ape_usuario = '"+request.payload["ape"]+"',"+
										"fnac_usuario = STR_TO_DATE('"+request.payload["fnac"]+"', '%m-%d-%Y'),"+
										"ftra_usuarios = STR_TO_DATE('"+request.payload["ftra"]+"', '%m-%d-%Y'),"+
										"email_usuario = '"+request.payload["email"]+"',"+
										"is_admin = "+is_admin+","+
										"personal_restantes = "+request.payload["per"]+","+
										"id_departamento = "+dep+","+
										"reg_doc = NOW(),"+
										"reg_id_usuario = 1"+
										" WHERE id_usuario = "+request.payload["id"]+";";

					else if(request.payload["accion"] == 'eliminar')
							strsql = "DELETE FROM usuarios WHERE id_usuario = "+request.payload["id"]+";";
					else if(request.payload["accion"] == 'reset'){
						strsql = "UPDATE usuarios SET personal_restantes = 5";
						fx_sql(request,strsql,function(r){
							return reply(r);
						});
					}
					

					console.log(strsql)
					request.server.plugins['db'].pool.getConnection(function(err, connection) {
						connection.query(strsql,function(err, rows) {
							if(err) throw new Error(err);
							if(request.payload["accion"] == 'nuevo')
								email(request.payload["email"],"Contraseña","¡Bienvenido "+request.payload["nom"]+"!","¡Gracias por registrarte en san services!",strmsj);
							if(request.payload["id"] == request.auth.credentials.user.id){
								var e = request.auth.credentials.user.email,
									p = request.auth.credentials.user.password;
									request.auth.session.clear();
									request.auth.session.set({user:{email:e,password:p}});
								set_cookie(request,reply);
							}
							reply.redirect("/mant_usuarios");						
						});
						connection.release();
					});
				}
			}
		},//__________________________________________________________________________________________________________________________________________________
		mant_departamentos: {
			auth:'session',
			handler: function (request, reply) {
				check_login(request,reply);//------------------------
				fx_is_admin(request, reply);//-------- SI NO ES ADMIN NO PUEDE ENTRAR
				var strsql = "";
				if(request.payload ==null)
					strsql = "SELECT departamentos.id_departamento as id,departamentos.departamento as dep,usuarios.id_usuario as id_jefe \
					,CONCAT(substring_index(usuarios.nom_usuario, ' ', 1),' ',substring_index(usuarios.ape_usuario,' ',1)) as jefe FROM departamentos LEFT JOIN usuarios ON departamentos.id_usuario= usuarios.id_usuario;";
				// else
				// 	if(typeof request.payload["buscar"] != 'undefined')
				// 		strsql = "SELECT departamentos.id_departamento as id,departamentos.departamento as dep,usuarios.id_usuario as id_jefe"+
				// 		",CONCAT(substring_index(usuarios.nom_usuario, ' ', 1),' ',substring_index(usuarios.ape_usuario,' ',1)) as jefe FROM departamentos "+
				// 		"LEFT JOIN usuarios ON departamentos.id_usuario= usuarios.id_usuario "+
				// 		"WHERE CONCAT(substring_index(usuarios.nom_usuario, ' ', 1),' ',substring_index(usuarios.ape_usuario,' ',1)) like '%"+request.payload["buscar"]+
				// 		"%' OR departamentos.departamento like '%"+request.payload["buscar"]+"%'";

				request.server.plugins['db'].pool.getConnection(function(err, connection) {
					connection.query(strsql,function(err, rows) {
						if(err) throw new Error(err);
						var vjs_var = '<script>var availableTags = [';
						var rlenght = rows.length;
						if(rlenght>0)
							for(var i=0,vt_dep=""; i<rlenght; i++){
								vt_dep += '<tr id="'+rows[i]["id"]+ '">' + 
												'<td>'+rows[i]["dep"]+'</td>'+
												'<td value = "'+((rows[i]["id_jefe"]== null)?0:rows[i]["id_jefe"])+'">'+((rows[i]["jefe"]== null)?"Ninguno":rows[i]["jefe"])+'</td>'+
												'<td><a onclick = "form_editar($(this))" class = "btn btn-primary" data-toggle="modal" data-target="#modal_departamentos"><span class = "glyphicon glyphicon-edit"></span> Editar</a></td>'+
												'<td><a  onclick = "form_eliminar($(this))" class="lg btn btn-danger" data-toggle="modal" data-target="#confirmDelete"><span class = "glyphicon glyphicon-trash"></span> Eliminar</a></td>'+
											'</tr>';
								vjs_var += '"'+rows[i]["dep"]+'"';
								if((i+1)<rows.length)
									vjs_var +=',';
							}
						// else
						// 	vt_dep += '<tr><td  colspan="3" style="text-align: center;">No hay Resultados.</td></tr>';
						vjs_var += '];</script>';

						// strsql = "SELECT id_usuario as id, CONCAT(substring_index(nom_usuario, ' ', 1),' ',substring_index(ape_usuario,' ',1)) \
						// as nom FROM usuarios WHERE is_jefe is null";
						strsql = "SELECT u.id_usuario as id, CONCAT(u.nom_usuario,' ',u.ape_usuario) \
								as nom FROM usuarios u , departamentos d \
								WHERE u.id_departamento = d.id_departamento AND (UPPER(d.departamento) = 'MANAGEMENT' OR \
								UPPER(d.departamento) like UPPER('%vice president Technology%') OR \
								UPPER(d.departamento) like UPPER('%vice-president Technology%') OR \
								UPPER(d.departamento) like UPPER('%vp Technology%')) ;";
						connection.query(strsql,function(err, rows) {
							if(err) throw new Error(err);
							for(var i=0,vcmb_usr=""; i<rows.length; i++)
								vcmb_usr += '<option value="'+rows[i]["id"]+ '">' + rows[i]["nom"]+'</option>';
							reply.view('mant_departamentos', { js_view: 'departamentos.js', cmb_usr: vcmb_usr,t_dep:vt_dep,js_var:vjs_var,login:nav_log(request)});
						});						
					});
					connection.release();
				});

			}
		},
		departamentos_data: {
			auth:'session',
			handler: function(request, reply) {
				if(request.payload != null){
					var strsql = "";
					if(request.payload["accion"] == 'nuevo')
							strsql = "INSERT INTO departamentos(departamento,id_usuario,reg_doc,reg_id_usuario)"+
							" VALUES('"+request.payload["dep"]+"',"+request.payload["jefe"]+",NOW(),1);";

					else if(request.payload["accion"] == 'editar')
							strsql = "UPDATE departamentos SET "+
							"departamento = '"+request.payload["dep"]+"',id_usuario = "+request.payload["jefe"]+
							",reg_doc=NOW(),reg_id_usuario = 1 WHERE id_departamento = "+request.payload["id"];

					else if(request.payload["accion"] == 'eliminar')
							strsql = "DELETE FROM departamentos WHERE id_departamento = "+request.payload["id"]+";";
					else if(typeof request.payload["sql"] != 'undefined' && request.payload["sql"] != '')
						strsql = String(request.payload["sql"]).replace(/%idusuario/g, String(request.auth.credentials.user.id));

					console.log("---------  "+strsql)
					request.server.plugins['db'].pool.getConnection(function(err, connection) {
						connection.query(strsql,function(err, rows) {
							if(err) throw new Error(err);
							if(typeof request.payload["jefe"]!= "undefined" && request.payload["jefe"] == request.auth.credentials.user.id){
								// || request.payload["jefe"] == 0
								var e = request.auth.credentials.user.email,
									p = request.auth.credentials.user.password;
									request.auth.session.clear();
									request.auth.session.set({user:{email:e,password:p}});
								set_cookie(request,reply);
							}
							reply.redirect("/mant_departamentos");
						});
						connection.release();
					});
				}
			}
		},//__________________________________________________________________________________________________________________________________________________
		mant_tipos_permisos: {
			auth:'session',
			handler: function (request, reply) {
				check_login(request,reply);//-------------------------
				fx_is_admin(request, reply);//-------- SI NO ES ADMIN NO PUEDE ENTRAR
				if(request.payload ==null)
					var strsql = "SELECT id_tipo_permiso as id, tipo_permiso as per FROM tipos_permisos";
				// else
				// 	if(typeof request.payload["buscar"] != 'undefined')
				// 		strsql = "SELECT id_tipo_permiso as id, tipo_permiso as per FROM tipos_permisos WHERE tipo_permiso like '%"+request.payload["buscar"]+"%'";

				request.server.plugins['db'].pool.getConnection(function(err, connection) {
					connection.query(strsql,function(err, rows) {
						if(err) throw new Error(err);
						var vjs_var = '<script>var availableTags = [';
						if(rows.length>0)
							for(var i=0,vt_dep=""; i<rows.length; i++){
								vt_dep += '<tr id="'+rows[i]["id"]+ '">' + 
												'<td>'+rows[i]["per"]+'</td>'+
												'<td><a onclick = "form_editar($(this))" class = "btn btn-primary" data-toggle="modal" data-target="#modal_tipos_permisos"><span class = "glyphicon glyphicon-edit"></span> Editar</a></td>'+
												'<td><a  onclick = "form_eliminar($(this))" class="lg btn btn-danger" data-toggle="modal" data-target="#confirmDelete"><span class = "glyphicon glyphicon-trash"></span> Eliminar</a></td>'+
											'</tr>';
								vjs_var += '"'+rows[i]["per"]+'"';
								if((i+1)<rows.length)
									vjs_var +=',';
							}
						else
							var vt_dep = '<tr><td  colspan="3" style="text-align: center;">No hay Resultados.</td></tr>';
						vjs_var += '];</script>';
						reply.view('mant_tipos_permisos', {js_view: 'tipos_permisos.js', t_dep:vt_dep,js_var:vjs_var,login:nav_log(request)});
					});
					connection.release();
				});

			}
		},
		tipos_permisos_data: {
			auth:'session',
			handler: function(request, reply) {
				if(request.payload != null){
					var strsql = "";
					if(request.payload["accion"] == 'nuevo')
						strsql = "INSERT INTO tipos_permisos(tipo_permiso,reg_doc,reg_id_usuario) \
						VALUES('"+ request.payload["tipo_permiso"]+"',NOW(),1);";

					else if(request.payload["accion"] == 'editar')
						strsql = "UPDATE tipos_permisos SET tipo_permiso = '"+request.payload["tipo_permiso"]+"',reg_doc = NOW(),reg_id_usuario = 1 "+
						"WHERE id_tipo_permiso = " + request.payload["id"];

					else if(request.payload["accion"] == 'eliminar')
						strsql = "DELETE FROM tipos_permisos WHERE id_tipo_permiso = "+ request.payload["id"];
					else if(typeof request.payload["sql"] != 'undefined' && request.payload["sql"] != '')
						strsql = String(request.payload["sql"]).replace(/%idusuario/g, String(request.auth.credentials.user.id));
					console.log(request.payload)

					console.log("---------  "+strsql)
					request.server.plugins['db'].pool.getConnection(function(err, connection) {
						connection.query(strsql,function(err, rows) {
							if(err) throw new Error(err);
							reply.redirect("/mant_tipos_permisos");						
						});
						connection.release();
					});
				}
			}
		},//__________________________________________________________________________________________________________________________________________________
		permisos: {
			auth:'session',
			handler: function(request, reply) {
				check_login(request,reply);
				if(request.method === 'post'){
					var id = request.auth.credentials.user.id;
					switch(request.payload.accion){
						case 'dp_aprobados':
							var strsql = "		SELECT 	id_solicitud 								as id,		\
														DATE_FORMAT(fper_solicitud, '%m/%d/%Y')		as fp, 		\
														DATE_FORMAT(ftra_solicitud, '%m/%d/%Y')		as ft 		\
												FROM 	solicitudes_permisos	 								\
												WHERE 	aprobado 									= 	1 		\
												AND		fper_solicitud 								> 	NOW()	\
												AND		id_usuario 									= 	"+ id;
						break;
						case 'feriados':
						var strsql = "SELECT fec_feriados as fec FROM feriados WHERE id_feriado = YEAR(NOW())";
						break
					}
					console.log(strsql);
					fx_sql(request,strsql,function(r){
						return reply(r);
					});
				}else if(request.method === 'get'){
					var vusuario 	= 	'<input type="text" class="form-control" id="colaborador" placeholder="Colaborador" value = "'
										+request.auth.credentials.user.name+'" disabled>';
					var strsql 		= 	"SELECT u.id_departamento as id,u.personal_restantes as dper,departamento as dep FROM departamentos d, usuarios u \
										WHERE d.id_departamento = u.id_departamento AND u.email_usuario = '"+request.auth.credentials.user.email+
										"' AND u.pas_usuario = '"+request.auth.credentials.user.password+"'";
					console.log(strsql)
					request.server.plugins['db'].pool.getConnection(function(err, connection) {
						connection.query(strsql,function(err, rows) {
							if(err) throw new Error(err);
							var vdepartamento = vradio = vdper = "";
							if(rows.length > 0){
								vdepartamento 	= 	'<option value="'+rows[0]["id"]+ '"selected required>' + rows[0]["dep"]+'</option>';
								vdper 			= 	rows[0]["dper"];
							}
							var strsql 		 	= 	"SELECT id_tipo_permiso as id, tipo_permiso as per FROM tipos_permisos";
							connection.query(strsql,function(err, rows) {
								if(rows.length > 0)
									for(var i=0;i<rows.length; i++){
										if(vdper == 0 && rows[i]["per"].search(/Personal/i)!= -1)
											continue;
										else
											vradio += '<label class="btn btn-default" onclick = "fx_flotante($(this))"> \n \
											\t	<input type="radio" name="tipo_permiso" value = "'+rows[i]["id"]+'" required>'+rows[i]["per"]+' \n \
											</label>';
									}
								var vjs_dper = '<script> const vdper = '+vdper+';</script>'
								reply.view('permisos', { js_view: 'permisos.js',js_dper:vjs_dper,dper: vdper,usuario:vusuario,departamento:vdepartamento,radio:vradio,login:nav_log(request)});
							});

						});
						connection.release();
					});
				}// fin del else
			}
		},
		permisos_data: {
			auth: 'session',		
			handler: function(request, reply) {
				/*****************************************************************
				*	CORREO DE GMAIL
				*/
				var strsql = "SELECT CONCAT(u.nom_usuario,' ',u.ape_usuario) as nom,u.email_usuario as email, \
				(SELECT tipo_permiso FROM tipos_permisos WHERE id_tipo_permiso = "+ request.payload["tipo_permiso"] +") as tp \
				FROM usuarios u, departamentos d WHERE u.id_usuario = d.id_usuario AND d.id_departamento = "+ request.auth.credentials.user.dep;
				console.log(strsql);
				
				request.server.plugins['db'].pool.getConnection(function(err, connection) {
					connection.query(strsql,function(err, rows) {
						if(err) throw new Error(err);
						if(rows.length > 0){
							var d 		=	new Date(),
								m 		=	['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
								// d 		=	[d.getDate(),d.getMonth(),d.getFullYear()].join('/');
							// var strmsj 	= "<h1>Tienes una Nueva Solicitud de Permiso. </h1><br/> "+
							// "<br/> Hola "+rows[0]["nom"]+" Ingresa a tu Cuenta para ver la nueva solicitud pendiente que tienes del colaborador "
							// +request.auth.credentials.user.name+" a el día "+ d +".<br/><br/><br/>"+
							// "Atentamente, <br/>San Sevices";
							var strmsj = "Estimado(a) jefe(a) de departamento: <br/><br/><br/>"+
							"Por medio de la presente se le informa que el usuario "+request.auth.credentials.user.name+
							" ha realizado una solicitud de ausencia el día "+ d.getDate() +" del mes de "+m[d.getMonth()]+" del año "+d.getFullYear()+
							" por medio de la página web de www.sanservices.hn <br/><br/>"+
							"Tipo de permiso: "+ rows[0]["tp"] +"<br/><br/><br/>"+
							"Atentamente,<br/><br/>"+
							"Departamento de Recursos Humanos<br/><br/>"+
							"San Services";
							var correo = rows[0]["email"];
							console.log(correo+" "+strmsj)
							email(correo,"Nueva Solicitud de Permiso","Solicitud Pendiente","Nueva Solicitud de Permiso",strmsj);
							/*****************************************************************
							/**\/	 INSERT A LA BD
							/**/ 	var flo = 	(typeof request.payload["flo"] != "undefined" && request.payload["flo"] != "")?
							/**/			"'"+request.payload["flo"]+"',":"null,";
							/**/
							/**/	var strsql = "INSERT INTO solicitudes_permisos(id_usuario,id_departamento,id_tipo_permiso,"+
							/**/				"fper_solicitud,dflo_solicitud,dias_solicitud,ftra_solicitud,reg_doc,aprobado)"+
							/**/	"VALUES("+request.auth.credentials.user.id+","
							/**/	+ request.auth.credentials.user.dep		  +","
							/**/	+ request.payload["tipo_permiso"]		  +","
							/**/	+ "STR_TO_DATE('"+request.payload["fper"] +"', '%m-%d-%Y'),"
							/**/	+ flo
							/**/	+ request.payload["tcon"]+","
							/**/	+ "STR_TO_DATE('"+request.payload["ftra"]+"', '%m-%d-%Y'),NOW(),0);";
							/**/	console.log(strsql);
							/**/	sql_execute(request, reply,strsql,"/");
							/**\/
							/*****************************************************************/


						}
						else{
							/*****************************************************************
							/**\/	 INSERT A LA BD PERO NO TIENE JEFE DE DEPARTAMENTO
							/**/ 	var flo = 	(typeof request.payload["flo"] != "undefined" && request.payload["flo"] != "")?
							/**/			"'"+request.payload["flo"]+"',":"null,";
							/**/
							/**/	var strsql = "INSERT INTO solicitudes_permisos(id_usuario,id_departamento,id_tipo_permiso,"+
							/**/				"fper_solicitud,dflo_solicitud,dias_solicitud,ftra_solicitud,reg_doc,aprobado)"+
							/**/	"VALUES("+request.auth.credentials.user.id+","
							/**/	+ request.auth.credentials.user.dep		  +","
							/**/	+ request.payload["tipo_permiso"]		  +","
							/**/	+ "STR_TO_DATE('"+request.payload["fper"] +"', '%m-%d-%Y'),"
							/**/	+ flo
							/**/	+ request.payload["tcon"]+","
							/**/	+ "STR_TO_DATE('"+request.payload["ftra"]+"', '%m-%d-%Y'),NOW(),0);";
							/**/	console.log(strsql);
							/**/	sql_execute(request, reply,strsql,"/");
							/**\/
							/*****************************************************************/
						}
					});
					connection.release();
				});
			}
		},
		solicitudes_permisos: {
			auth: 'session',			
			handler: function(request, reply) {
				check_login(request,reply);
				fx_is_jefe(request, reply);
				
				var strsql = "SELECT s.id_solicitud as id,s.id_usuario,CONCAT(u.nom_usuario,' ',u.ape_usuario) as nom,s.id_departamento,d.departamento as dep, \
				s.id_tipo_permiso,tp.tipo_permiso,DATE_FORMAT(fper_solicitud, '%m-%d-%Y') as fper,s.dias_solicitud as dias,aprobado as apr,DATE_FORMAT(ftra_solicitud, '%m-%d-%Y') as ftra \
				,dflo_solicitud  flo  FROM solicitudes_permisos s,tipos_permisos tp, departamentos d,usuarios u \
				WHERE u.id_usuario = s.id_usuario AND d.id_departamento = s.id_departamento AND tp.id_tipo_permiso = s.id_tipo_permiso \
				AND fper_solicitud > (NOW()- INTERVAL 1 DAY) AND s.aprobado = 0 AND d.id_usuario = "+ request.auth.credentials.user.id + " ORDER BY s.id_solicitud DESC";

				console.log(strsql)
				request.server.plugins['db'].pool.getConnection(function(err, connection) {
					connection.query(strsql,function(err, rows) {
						if(err) throw new Error(err);
						if(rows.length>0)
							for(var i=0,vt_per=""; i<rows.length; i++){
								vt_per += '<tr id="'+rows[i]["id"]+ '">\n' + 
												'\t<td value="'+rows[i]["id_usuario"]+ '">'+rows[i]["nom"]+'</td>\n'+
												'\t<td value="'+rows[i]["id_tipo_permiso"]+ '">'+rows[i]["tipo_permiso"]+'</td>\n'+
												'\t<td value="'+rows[i]["id_departamento"]+ '">'+rows[i]["fper"]+'</td>\n'+
												'\t<td>'+((rows[i]["flo"]==null)?"Ninguno": '<div type="text" class = "flo" readonly>'+rows[i]["flo"]+'</div>')+
												'</td>'+
												'\t<td>'+rows[i]["dias"]+'</td>\n'+
												'\t<td>'+rows[i]["ftra"]+'</td>\n'+												
												'\t<td><a onclick = "form_aprobar($(this))" class = "btn btn-primary" data-toggle="modal" data-target="#confirmApprove">Aprobar</a></td>\n'+
												'\t<td><a onclick = "form_rechazar($(this))" class = "btn btn-danger" data-toggle="modal" data-target="#confirmReject">Rechazar</a></td>\n'+
											'</tr>\n';
							}
						console.log(vt_per)
						reply.view('solicitudes_permisos', {js_view: 'solicitudes_permisos.js',icon:'pencil',th:1,table_header : 'Acción',t_per:vt_per,login:nav_log(request)});
					});
					connection.release();
				});

			}
		},
		solicitudes_permisos_data: {
			auth: 'session',
			handler: function(request, reply) {
				console.log("-------------------------- solicitudes_permisos-data")
				if(request.method === 'post'){
					if(request.payload.accion == "aprobar"){
						var strsql = "UPDATE solicitudes_permisos SET aprobado = 1 ,reg_id_usuario = "+request.auth.credentials.user.id+" WHERE id_solicitud = "+
						request.payload.sol+" AND id_usuario = "+request.payload.usr+" AND id_departamento = "+request.payload.dep+" AND id_tipo_permiso = "+request.payload.per;
					}
					else
						if(request.payload.accion == "rechazar"){
							var strsql = "UPDATE solicitudes_permisos SET aprobado = 2, reg_id_usuario = "+request.auth.credentials.user.id+"  WHERE id_solicitud = "+
							request.payload.sol+" AND id_usuario = "+request.payload.usr+" AND id_departamento = "+request.payload.dep+" AND id_tipo_permiso = "
							+request.payload.per;
						}
					request.server.plugins['db'].pool.getConnection(function(err, connection) {
						connection.query(strsql,function(err, rows) {
							if(err) throw new Error(err);
							console.log(rows);
							if(rows.affectedRows == 1){
								var strsql = "SELECT u.email_usuario as email,DATE_FORMAT(s.reg_doc, '%m/%d/%Y %r') as fr, \
								DATE_FORMAT(s.fper_solicitud, '%m/%d/%Y') fper,s.dias_solicitud d FROM solicitudes_permisos s,usuarios u \
								WHERE u.id_usuario = s.id_usuario AND id_solicitud = "+ request.payload.sol;
								console.log(strsql);

								var r = (request.payload.accion == "aprobar")? "aprobada" : "rechazada";
								connection.query(strsql,function(err, rows) {
									if(err) throw new Error(err);
									var fr		= 	new Date(rows[0]["fr"]),	//fecha realizada
										fper 	= 	new Date(rows[0]["fper"]),	//fecha del permiso
										d 		= 			 rows[0]["d"],		//dias consedidos
										m 		=	['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

										var strmsj = "Estimado(a) colaborador(a): <br/><br/>"+
										"Le saludo atentamente de parte del departamento de Recursos Humanos de San Services "+
										"con ocasión de informar que su solicitud de permiso de trabajo ingresada la fecha "+ fr.getDate() +
										" de "+ m[fr.getMonth()] +" del "+ fr.getFullYear() + " a las " + rows[0]["fr"].substring(11,this.lenght) +
										" por medio de la página web ha sido procesada debidamente y la misma ha sido "+ r +" para la fecha "+
										fper.getDate() + " del mes de "+ m[fper.getMonth()] +" del año "+ fper.getFullYear()+". <br/><br/>"+
										"Atentamente,<br/><br/><br/>"+
										"Abog. Diana Zerón <br/><br/>Departamento de Recursos Humanos";


										correo = rows[0]['email'];
										console.log(correo+" "+strmsj)
										email(correo,"Solicitud de Permiso","Respuesta a Solicitud","",strmsj);

										reply.redirect('/');
								});
							}
						});
						connection.release();
					});

				}
				else
					return reply.redirect("/solicitudes_permisos");

			}
		},
		solicitudes_permisos_historial: {
			auth: 'session',
			handler: function(request, reply) {
				check_login(request,reply);
				fx_is_jefe(request, reply);
				
				var strsql = "SELECT s.id_solicitud as id,s.id_usuario,CONCAT(u.nom_usuario,' ',u.ape_usuario) as nom,s.id_departamento,d.departamento as dep, \
				s.id_tipo_permiso,tp.tipo_permiso,DATE_FORMAT(fper_solicitud, '%m-%d-%Y') as fper,dias_solicitud as dias,aprobado as apr,DATE_FORMAT(ftra_solicitud, '%m-%d-%Y') as ftra \
				,dflo_solicitud as flo FROM solicitudes_permisos s,tipos_permisos tp, departamentos d,usuarios u \
				WHERE u.id_usuario = s.id_usuario AND d.id_departamento = s.id_departamento AND tp.id_tipo_permiso = s.id_tipo_permiso \
				AND (s.aprobado = 2 OR s.aprobado = 1) AND d.id_usuario =  "+ request.auth.credentials.user.id + " ORDER BY s.id_solicitud DESC";

				console.log(strsql)
				request.server.plugins['db'].pool.getConnection(function(err, connection) {
					connection.query(strsql,function(err, rows) {
						if(err) throw new Error(err);
						var vjs_var = '<script>var availableTags = [';
						if(rows.length>0)
							for(var i=0,vt_per=""; i<rows.length; i++){
								var apr_class = "";
								if(Number(rows[i]["apr"]) == 1){
									apr_class ='glyphicon glyphicon-ok green';
									apr = 'APROBADA';
								}
								else if(Number(rows[i]["apr"]) == 2){
									apr_class ='glyphicon glyphicon-remove red';
									apr = 'RECHAZADA';
								}
									else{
										apr_class ='glyphicon glyphicon-time blue';
										apr = 'ESPERA';
									}

								vt_per += '<tr id="'+rows[i]["id"]+ '">\n' + 
												'\t<td value="'+rows[i]["id_usuario"]+ '">'+rows[i]["nom"]+'</td>\n'+
												'\t<td value="'+rows[i]["id_tipo_permiso"]+ '">'+rows[i]["tipo_permiso"]+'</td>\n'+
												'\t<td value="'+rows[i]["id_departamento"]+ '">'+rows[i]["fper"]+'</td>\n'+
												'\t<td>'+((rows[i]["flo"]==null)?"Ninguno": '<div type="text" class = "flo" readonly>'+rows[i]["flo"]+'</div>')+
												'</td>'+
												'\t<td>'+rows[i]["dias"]+'</td>\n'+
												'\t<td>'+rows[i]["ftra"]+'</td>\n'+												
												'\t<td value = "'+rows[i]["apr"]+'"><span class="'+apr_class+'">'+
												'<div style="text-indent: -99999px;">'+apr+'</div></span></td>'+
											'</tr>\n';
								vjs_var += '"'+rows[i]["nom"]+'"';
								if((i+1)<rows.length)
									vjs_var +=',';
							}
						// else
						// 	var vt_per = '<tr><td  colspan="6" style="text-align: center;">No hay Resultados.</td></tr>';
						vjs_var += '];</script>';
						console.log(vt_per)
						reply.view('solicitudes_permisos', {js_view: 'solicitudes_permisos-historial.js',icon:'folder-open',table_header : 'Aprobado',historial:"Historial de ",t_per:vt_per,js_var:vjs_var,login:nav_log(request)});
					});
					connection.release();
				});

			}
		},
		historial_solicitudes: {
			auth: 'session',
			handler: function(request, reply) {
				check_login(request,reply);
				var strsql = "SELECT s.id_solicitud as id,s.id_usuario,CONCAT(u.nom_usuario,' ',u.ape_usuario) as nom,s.id_departamento,d.departamento as dep, \
				s.id_tipo_permiso,tp.tipo_permiso,DATE_FORMAT(fper_solicitud, '%m-%d-%Y') as fper,dias_solicitud as dias,aprobado as apr,DATE_FORMAT(ftra_solicitud, '%m-%d-%Y') as ftra \
				,u.personal_restantes as per,dflo_solicitud as flo FROM solicitudes_permisos s,tipos_permisos tp, departamentos d,usuarios u \
				WHERE u.id_usuario = s.id_usuario AND d.id_departamento = s.id_departamento AND tp.id_tipo_permiso = s.id_tipo_permiso \
				AND s.id_departamento = "+ request.auth.credentials.user.dep + " AND s.id_usuario = "+request.auth.credentials.user.id+ " ORDER BY s.id_solicitud DESC";

				console.log(strsql)
				request.server.plugins['db'].pool.getConnection(function(err, connection) {
					connection.query(strsql,function(err, rows) {
						if(err) throw new Error(err);
						
						if(rows.length>0)
							for(var i=0,vt_per=""; i<rows.length; i++){
								var apr_class = "";
								if(Number(rows[i]["apr"]) == 1)	apr_class ='glyphicon glyphicon-ok green';
								else if(Number(rows[i]["apr"]) == 2)	apr_class ='glyphicon glyphicon-remove red';
									else apr_class ='glyphicon glyphicon-time blue';

								
								vt_per += '<tr id="'+rows[i]["id"]+ '">\n' + 
												'\t<td >'+rows[i]["nom"]+'</td>\n'+
												'\t<td >'+rows[i]["tipo_permiso"]+'</td>\n'+
												'\t<td >'+rows[i]["fper"]+'</td>\n'+
												'\t<td>'+((rows[i]["flo"]==null)?"Ninguno": '<div type="text" class = "flo" readonly>'+rows[i]["flo"]+'</div>')+
												'</td>'+
												// '\t<td>'+((rows[i]["flo"]==null)?"Ninguno": '<div class="multidatepicker">'+
												// '</div><script> var op = {dateFormat:	"mm-dd-yy", value:"'
												// 		+rows[i]["flo"]+'"};</script>')+'</td>\n'+
												'\t<td>'+rows[i]["dias"]+'</td>\n'+
												'\t<td>'+rows[i]["ftra"]+'</td>\n'+												
												'\t<td class = "center" value = "'+rows[i]["apr"]+'"><span class="'+apr_class+'"></span></td>'+
												'</tr>\n';
							}
						// else
						
						
						console.log(vt_per)
						reply.view('solicitudes_permisos', {js_view: 'solicitudes_permisos-historial.js',icon:'file',table_header : 'Aprobado',historial:"Historial de ",t_per:vt_per,login:nav_log(request)});
					});
					connection.release();
				});

			}
		}//__________________________________________________________________________________________________________________________________________________
	}
function check_login(request, reply){
	var cookie = request.auth.credentials;
	console.log("CHECK_LOGIN");
	console.log(request.auth.credentials)

	console.log(cookie);

	if(cookie != null){
		if(typeof cookie.user != "undefined"&& cookie.user.email && cookie.user.password){
			var email = cookie.user.email;
			var pass= cookie.user.password;
			var strsql = "SELECT fx_login('"+email+"','"+pass+"') as log";
			console.log(strsql)
			request.server.plugins['db'].pool.getConnection(function(err, connection) {
				connection.query(strsql,function(err, rows) {
					if(err) throw new Error(err);
					var res = Number(rows[0]["log"]);
					console.log("RES FX---------->"+res);
								if(res != 3){
									console.log("SESIÓN CORRUPTA ------------***********");
									request.auth.session.clear();
									return reply.redirect('/');
								}
				});
				connection.release();
			});
		}
	}
}//fin

function set_cookie(request,reply){
	console.log("AQUI ---------------------------------------------------------")
	if(request.auth.isAuthenticated ){
		if(typeof request.auth.credentials.user.id == "undefined"){
			var email = request.auth.credentials.user.email;
			var password = request.auth.credentials.user.password;
			strsql = "SELECT u.id_usuario as id,CONCAT(substring_index(u.nom_usuario, ' ', 1),' ',substring_index(u.ape_usuario,' ',1)) as nom, \
					d.id_usuario as jefe,u.is_admin as admin,u.id_departamento as dep FROM usuarios u \
					LEFT JOIN departamentos d ON u.id_usuario= d.id_usuario \
					WHERE u.pas_usuario = '"+password+"' AND u.email_usuario='"+email+"'";

			console.log(strsql);
			request.server.plugins['db'].pool.getConnection(function(err, connection) {
				connection.query(strsql,function(err, rows) {
					if(err) throw new Error(err);
					if(rows.length > 0){								
						var vid = rows[0]["id"];
						var vnom = rows[0]["nom"];
						var vadmin = (rows[0]["admin"] == 1)?1:0;
						var vjefe = (rows[0]["jefe"] != null)?1:0;
						var vdep = rows[0]["dep"];
						user = {user: {id: vid, name: vnom, email: email,password:password,admin:vadmin,jefe:vjefe,dep:vdep}};
						request.auth.session.clear();
						request.auth.session.set(user);
						console.log(request.auth.credentials)
						reply.redirect('/inicio');
					}else
					request.auth.session.clear();
				});
				connection.release();
			});
		}//fin del if
	}
}

function fx_is_admin(request, reply){
	var cookie = request.auth.credentials;
	console.log("IS_ADMIN");

	console.log(cookie);

	if(cookie != null){
		if(typeof cookie.user != "undefined"&& cookie.user.email && cookie.user.password){
			if(!cookie.user.admin) return reply.redirect("/");
			var email = cookie.user.email;
			var pass= cookie.user.password;
			var strsql = "SELECT is_admin FROM usuarios WHERE email_usuario = '"+cookie.user.email+"'AND pas_usuario = '"+cookie.user.password+"'";
			console.log(strsql)
			request.server.plugins['db'].pool.getConnection(function(err, connection) {
				connection.query(strsql,function(err, rows) {
					if(err) throw new Error(err);
					var res = Number(rows[0]["is_admin"]);
					if(res == 0)
						return reply.redirect("/");
				});
				connection.release();
			});
		}
	}
}//fin

function fx_is_jefe(request, reply){
	var cookie = request.auth.credentials;
	console.log("IS_JEFE");

	console.log(cookie);

	if(cookie != null){
		if(typeof cookie.user != "undefined"&& cookie.user.email && cookie.user.password){
			var email = cookie.user.email;
			var pass= cookie.user.password;
			var strsql = "SELECT d.id_usuario as jefe FROM departamentos d, usuarios u WHERE u.id_usuario = d.id_usuario AND \
			u.email_usuario = '"+email+"'AND pas_usuario = '"+pass+"'";
			console.log(strsql)
			request.server.plugins['db'].pool.getConnection(function(err, connection) {
				connection.query(strsql,function(err, rows) {
					if(err) throw new Error(err);
					var res = 0;
					if(rows.length > 0)
					res = Number(rows[0]["jefe"]);
					if(res == 0)
						return reply.redirect("/");
				});
				connection.release();
			});
		}
	}
}//fin

function fx_sql(request,strsql,callback){
	request.server.plugins['db'].pool.getConnection(function(err, connection) {
		connection.query(strsql,function(err, rows) {
			if(err) throw new Error(err);
			callback(rows);
		});
		connection.release();
	});

}


function nav_log(request){
	var vlogin = '<a href="/logout" class="dropdown-toggle btn btn-danger"><span class="glyphicon glyphicon-off"></span> Cerrar Sesión</a></a>';
	return vlogin;

}//fin
function sql_execute(request, reply,strsql,rdirect){
	request.server.plugins['db'].pool.getConnection(function(err, connection) {
		connection.query(strsql,function(err, rows) {
			if(err) throw new Error(err);
			if(rdirect)
				reply.redirect(rdirect);
		});
		connection.release();
	});
}

function fx_pass_reset(request,reply,correo){
	var password = sha512(Math.random()+(new Date()));	
	var strsql = "UPDATE usuarios SET pas_usuario = '"+sha512(password)+"' WHERE email_usuario = '"+correo+"';";
	console.log(strsql)
	request.server.plugins['db'].pool.getConnection(function(err, connection) {
		connection.query(strsql,function(err, rows) {
			if(err) throw new Error(err);
			var strmsj = "¡Tu contraseña ha sido cambiada exitosamente! <br/>"+
			"<br/>Tu Contraseña es: <br/>"+ password + "<br/><br/><br/>"+
			"Atentamente, <br/>San Sevices";
			console.log(correo+" "+strmsj)
			email(correo,"Nueva Contraseña","Nueva Contraseña","Estimado(a) colaborador(a):",strmsj);
		});
		connection.release();
	});
}

function email(mail,asunto,t1,t2,mensaje,r){
	var nodemailer = require('nodemailer');

	// create reusable transporter object using SMTP transport
	var transporter = nodemailer.createTransport({
	    service: 'Gmail',
	    auth: {
	        user: 'hn.sanservices@gmail.com',
	        pass: 'sandals01'
	    }
	});
	//console.log(request.auth.credentials.user.password);

	// NB! No need to recreate the transporter object. You can use
	// the same transporter object for all e-mails

	var template = '<html>'+
	'<head>'+
		'<meta charset="utf-8">'+
	'</head>'+
	'<body style="padding:0; margin:0;">'+
		'<table width="100%" cellpadding="0" cellspacing="0" border="0">'+
			'<tr>'+
				'<td width="100%" height="120" align="center">'+
					'<table style="background:#c7d62c; width:24%;height:100%;" align="right">'+
						'<tr>'+
							'<td width="1000"></td>'+
						'</tr>'+
					'</table>'+
					'<table width="37%" cellpadding="0" cellspacing="0" align="right">'+
						'<tr>'+
							'<td width="33%">'+
								'<img class="msj-top_left" src="https://x4r0iw-ch3301.files.1drv.com/y2ptAMj-XdKln_uabuLR9yqJD8gQEMRjqMxA8dR3Eu7hKlHFcoJvZ4tj-x3fiZYH3Sm8fbn6rWzM4k-rhubahfP__1Bfouipu9cSqkNdTidcI4/top_left.png?psid=1" alt="">'+
							'</td>'+
							'<td width="67%" valign="bottom" align="right">'+
								'<!-- imagen -->'+
								'<img src="https://kzsl3g-ch3302.files.1drv.com/y2pqbjhFEw22jj1ch8C9l5_gLwWBCDE4CZhI5IlOUpSWYDnI-WUh8Nsajp13ZRN8m3VpYYH8WOzJ8meyJB9ADs2-mD4c0B39mB1PWFt3u9t0N8/top_right.png?psid=1" alt="" style="vertical-align: bottom;">'+
							'</td>'+
						'</tr>'+
					'</table>'+
				'</td>'+
			'</tr>'+
			'<tr>'+
				'<td width="100%" height="275" align="center" style="background:#34495e;">'+
					'<table width="600" cellpadding="0" cellspacing="0">'+
						'<tr>'+
							'<td height="235" width="100%" align="center" valign="top" style="background:#34495e; color: white; font-family: arial; font-weight:normal; padding: 50px 44px 0 44px;">'+
								'<h1 style="font-weight:normal; text-align:center; color: #FFF;font-size:48px;">'+t1+'</h1>'+
								'<p style="font-weight:normal; text-align:center; font-size:14px; line-height:20px;">De: San Services <br/><br/>  </p>'+ //Para: '+nom+'
							'</td>'+
						'</tr>'+
						'<tr>'+
							'<td height="40" width="100%" style="background:#ffffff;">'+
							'</td>'+
						'</tr>'+
					'</table>'+
				'</td>'+
			'</tr>'+
			'<tr style = "background:#efefef">'+
				'<td width="100%" align="center">'+
					'<table width="600" cellpadding="0" cellspacing="0" style="word-wrap: break-word;table-layout: fixed;overflow-wrap: break-word;">'+
						'<tr>'+
							'<td width="100%" align="center" valign="top" style="background:#fff; color: #666666; font-family: arial; font-weight:normal; padding: 36px 44px 36px 44px;-webkit-font-smoothing: antialiased;text-align:left;">'+
								'<h3 style="font-size: 16px;color: #17365f;text-transform: uppercase;">'+t2+'</h3>'+
								'<p style="color:#666666;font-size: 14px;line-height: 20px;padding-bottom: 7px;margin-top: 6px;letter-spacing: -0.1px;">'+
									mensaje+
								'</p>'+
							'</td>'+
						'</tr>'+
					'</table>'+
				'</td>'+
			'</tr>'+
			'<tr style = "background:#efefef">'+
				'<td>'+
					'<table width="600" height = "152" cellpadding="0" cellspacing="0" align="center" style="background:#373737;">'+
						'<tr>'+
							'<td width="50%" align="right" style="padding-right:20px;">'+
								'<!-- logo -->'+
								'<img src="https://9izpow.bn1303.livefilestore.com/y2p9BM_Ybvy1zcqKo3Yfh65lveSxXw0sk9WLkGVaclpjI1AgidXIOzd-raddnqf0KNDB5OoicgI5lLP_d1sgMj7Tzl7_grHYW2h3la34zD_i6I/footer_left.png?psid=1"></img>'+
							'</td>'+
							'<td width="50%" valign="bottom" align="right">'+
								'<table width="166" height = "152" cellpadding="0" cellspacing="0" align="left">'+
									'<tr>'+
										'<td style="padding-left:20px;">'+
											'<span style = "color: #809a00;" >Kilometro 3 Carretera Armenta  Edificio Altia 4 Piso local 4d</span>'+
											'<br/>'+
											'<span style = "color:#7b7b7b;" >(504) 2580-2100</span>'+
										'</td>'+
									'</tr>'+
								'</table>'+
								''+
							'</td>'+
						'</tr>'+
					'</table>'+
					''+
				'</td>'+
			'</tr>'+
		'</table>'+
	'</body>'+
'</html>';

	// setup e-mail data with unicode symbols
	var mailOptions = {
		from: 'San Services ✔ <hn.sanservices@gmail.com>', // sender address
		to: mail, // list of receivers
		subject: asunto+' ✔', // Subject line
		text: '', // plaintext body
		html: template // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log(error);
			r(error);
		}else{
			console.log('Message sent: ' + info.response);
			r("ok");
		}
	});
}//fin

var sha512 = require('js-sha512');
// var open = require('open');
	
// Exposing Public Routes ========================
	module.exports = public_ctrl;