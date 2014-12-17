// Dependencies =================================
	var requireDirectory 	= require('require-directory');

// Dependencies =================================
	module.exports = function(server) {
		// Bootstrap your controllers so you dont have to load them individually. This loads them all into the controller name space. https://github.com/troygoode/node-require-directory
		var controller = requireDirectory(module, server.app.root+'/server/controllers');

		// Array of Routes to pass to Server
		var routes_table = [
			{
				method: 'GET',
				path: '/',
				config: controller.public.index
			},
			{
				method: 'GET',
				path: '/notificaciones',
				config: controller.public.notificaciones
			},
			{
				method: ['GET', 'POST'],
				path: '/login',
				config: controller.public.login
			},
			{
				method: 'GET',
				path: '/logout',
				config: controller.public.logout
			},
			{
				method: ['GET', 'POST'],
				path: '/password-reset',
				config: controller.public.password_reset
			},
			{
				method: ['GET', 'POST'],
				path: '/password-code',
				config: controller.public.password_code
			},
			{
				method: ['GET', 'POST'],
				path: '/password-change',
				config: controller.public.password_change
			},
			{
				method: ['GET', 'POST'],
				path: '/inicio',
				config: controller.public.inicio
			},
			{
				method: ['GET', 'POST'],
				path: '/fc_eventos',
				config: controller.public.fc_eventos
			},
			{
				method: 'GET',
				path: '/fc_aprobados',
				config: controller.public.fc_aprobados
			},
			{
				method: ['GET', 'POST'],
				path: '/mant_eventos',
				config: controller.public.mant_eventos
			},
			{
				method: ['GET', 'POST'],
				path: '/correo',
				config: controller.public.correo
			},
			{
				method: ['GET', 'POST'],
				path: '/permisos',
				config: controller.public.permisos
			},
			{
				method: 'POST',
				path: '/permisos-data',
				config: controller.public.permisos_data
			},
			{
				method: ['GET','POST'],
				path: '/solicitudes_permisos',
				config: controller.public.solicitudes_permisos
			},
			{
				method: ['GET','POST'],
				path: '/solicitudes_permisos-data',
				config: controller.public.solicitudes_permisos_data
			},
			{
				method: ['GET','POST'],
				path: '/solicitudes_permisos-historial',
				config: controller.public.solicitudes_permisos_historial
			},
			{
				method: ['GET','POST'],
				path: '/historial_solicitudes',
				config: controller.public.historial_solicitudes
			},
			{
				method: ['GET','POST'],
				path: '/perfil',
				config: controller.public.perfil
			},
			{
				method: ['GET','POST'],
				path: '/mant_usuarios',
				config: controller.public.mant_usuarios
			},
			{
				method: 'POST',
				path: '/usuarios-data',
				config: controller.public.usuarios_data
			},
			{
				method: ['GET', 'POST'],
				path: '/mant_departamentos',
				config: controller.public.mant_departamentos
			},
			{
				method: 'POST',
				path: '/departamentos-data',
				config: controller.public.departamentos_data
			},
			{
				method: ['GET', 'POST'],
				path: '/mant_tipos_permisos',
				config: controller.public.mant_tipos_permisos
			},
			{
				method: 'POST',
				path: '/tipos_permisos-data',
				config: controller.public.tipos_permisos_data
			},
			{
				method: 'GET',
				path: '/consultas_admin',
				config: controller.public.consultas_admin
			},

			// Public Assets Route
			{
				method: 'GET',
				path: '/assets/js/{path*}',
				handler: {
					directory: { path: './public/' + server.app.env.name + '/assets/js', listing: false, index: true }
				}
			},
			{
				method: 'GET',
				path: '/assets/{path*}',
				handler: {
					directory: { path: './public/dist/assets/', listing: false, index: true }
				}
			}
		];

		server.route(routes_table);
	};