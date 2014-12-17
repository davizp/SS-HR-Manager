require(['/assets/js/app.js'],function(){
    $(document).ready(function(){

		$('#fc-eventos').fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'none'
			},
			defaultDate: new Date(),
			// eventRender: function (event, element) {
			// 	console.log(element);
			// 	element.popover({
			// 		title: "Evento",
			// 		// placement:            new Date(event.start.format("MM/DD/YYYY")).getHours()>12?'top':'bottom',
			// 		html:true,
			// 		content: event.title //event.msg
			// 	});
			// },
			eventClick:  function(event, jsEvent, view) {
				$('#myModalLabel').html(event.title || "Evento");
				$('.modal-body').html(event.msg || "Ninguno");
				//$('#eventUrl').attr('href',event.url);
				$('#myModal').modal();
			},
			editable: false,
			eventLimit: true // allow "more" link when too many events
		});

		$('#fc-aprobados').fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'none'
			},
			defaultDate: new Date(),
			// eventRender: function (event, element) {
			// 	console.log(element);
			// 	element.popover({
			// 		title: "Evento",
			// 		// placement:            new Date(event.start.format("MM/DD/YYYY")).getHours()>12?'top':'bottom',
			// 		html:true,
			// 		content: event.title //event.msg
			// 	});
			// },
			eventClick:  function(event, jsEvent, view) {
				$('#myModalLabel').html(event.title || "Evento");
				$('.modal-body').html(event.msg || "Ninguno");
				//$('#eventUrl').attr('href',event.url);
				$('#myModal').modal();
			},
			editable: false,
			eventLimit: true // allow "more" link when too many events
		});

		//- - - - - - - - - - - - - - - - - - - - - - -

    });// <!--   READY   -->
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
*	Agregar Cumpleaños de Colaboradores
*/
 // $('.hola').fullCalendar( 'addEventSource',{
	// 		events: function(start, end, timezone, callback) {
	// 					var events = [];

	// 					for (loop = new Date(start.format("MM/DD/YYYY")).getTime();
	// 						 loop <= new Date(end.format("MM/DD/YYYY")).getTime();
	// 						 loop = loop + (24 * 60 * 60 * 1000)) {

	// 							var test_date = new Date(loop);
								
	// 							if (test_date.getDate() == "13" && test_date.getMonth() == "9") {
	// 								events.push({
	// 									title: 'David\'s Birthday',
	// 									start: test_date,
	// 									end: test_date,
	// 									allDay: true,
	// 									msg: "<span class='glyphicon glyphicon-gift' style='color: rgb(213, 87, 87);font-size: 18px;'>"+
	// 									"</span> Cumpleaños de David Nuñez"
	// 								});
	// 							}
								
	// 					} // for loop
	// 					callback (events);
						
	// 				},
	// 				color: '#428bca',
	// 				textColor: 'white'
 //  		}
	// );
$('#fc-eventos').fullCalendar( 'addEventSource',{
		events: function(start, end, timezone, callback) {
			$.ajax({
				url: '/inicio',
				type: "POST",
				data: {accion: "eventos"},
				success: function(r) {
					if(typeof r == "string") return $.ajax(this); //si no retorna el objecto
					var events 	= [];
					for(var i = 0;i < r.length;i++){
						var id 		= "'"+r[i].id+"'",
							ti 		= r[i].no,
							fi 		= "'"+r[i].fi+"'",
							ff 		= "'"+r[i].ff+"'",
							msg 	= r[i].inf;
						console.log("addEventSource")
						console.log(r)
							events.push({
								id 		: 		id,
								title	: 		ti,
								start	: 		fi,
								end		: 		ff,
								msg		: 		msg,
								allDay	:		true,
							});
					}// for
					callback (events);
				}// success
			});// $.ajax
		}
	});// FIN

 	$('#fc-eventos').fullCalendar( 'addEventSource',{
		events: function(start, end, timezone, callback) {
			$.ajax({
				url: '/inicio',
				type: "POST",
				data: {
					accion: "fc_eventos"
				},
				success: function(r) {
					if(typeof r == "string"){
						// $(this).ajax;
						return $.ajax(this);
					}
					var events 	= [];
					for(var i = 0;i < r.length;i++){
						var no = r[i].nom.split(' ')[0];														// NOMBRE
						var ini = new Date(start.format("MM/DD/YYYY")); 						// FECHA INICIAL DEL VIEW
						var fin = new Date(end.format("MM/DD/YYYY"));							// FECHA FINAL   DEL VIEW

						var fn = new Date(r[i].fnac),
							nfn = [ini.getFullYear(),fn.getMonth()+1,fn.getDate()].join('/'); 	// FECHA DE NACIMIENTO

						var ft = new Date(r[i].ftra),
							nft = [ini.getFullYear(),ft.getMonth()+1,ft.getDate()].join('/'); 	// FECHA DE TRABAJO

						events.push({
							title: no+'\'s Birthday',
							start: nfn,
							end: nfn,
							allDay: true,
							msg: "<span class='glyphicon glyphicon-gift' style='color: rgb(213, 87, 87);font-size: 18px;'>"+
							"</span> Cumpleaños de "+ r[i].nom,
							color: '#428bca',
							textColor: 'white'
						});

						if(ini.getFullYear() != fin.getFullYear()){
							if(ini.getMonth() == "12")
								nfn = [ini.getFullYear(),fn.getMonth()+1,fn.getDate()].join('/');
							else
								nfn = [fin.getFullYear(),fn.getMonth()+1,fn.getDate()].join('/');
							events.push({
								title: no+'\'s Birthday',
								start: nfn,
								end: nfn,
								allDay: true,
								msg: "<span class='glyphicon glyphicon-gift' style='color: rgb(213, 87, 87);font-size: 18px;'>"+
								"</span> Cumpleaños de "+ r[i].nom,
								color: '#428bca',
								textColor: 'white'
							});
						}
						/* - - - - - - - - - - - - - - - - - - - - - - - - - - - 
						|	
						|	CÓDIGO DE ANIVERSARIO
						*/
						events.push({
							title: no+'\'s Anniversary',
							start: nft,
							end: nft,
							allDay: true,
							msg: "<span class='glyphicon glyphicon-globe' style='color: rgb(87, 114, 200);font-size: 18px;'>"+
							"</span> Nuestro Compañero "+ r[i].nom +" cumple un año más con nosotros.",
							color: '#f1c40f',
							textColor: 'black'
						});

						if(ini.getFullYear() != fin.getFullYear()){
							if(ini.getMonth() == "12")
								nft = [ini.getFullYear(),ft.getMonth()+1,ft.getDate()].join('/');
							else
								nft = [fin.getFullYear(),ft.getMonth()+1,ft.getDate()].join('/');
							events.push({
								title: no+'\'s Birthday',
								start: nft,
								end: nft,
								allDay: true,
								msg: "<span class='glyphicon glyphicon-globe' style='color: rgb(87, 114, 200);font-size: 18px;'>"+
									"</span> Nuestro Compañero "+ r[i].nom +" cumple un año más con nosotros.",
								color: '#f1c40f',
								textColor: 'black'
							});
						}
					}
					callback (events);
				}
			});
		}
		
  	});

	if(typeof $.fn.fullCalendar != "undefined"){
		$('.loading-container').fadeOut(function() {
			$(this).remove();
		});
		$('.container-fluid').hide().css('visibility','visible').fadeIn('slow');
			//.css('visibility', 'visible');

	}
//------------------------

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
*	Agregar Aniversario de trabajo de Colaboradores
*/
// function fx_aniversario(e){
// 	$('.hola').fullCalendar( 'addEventSource',{
// 			events: function(start, end, timezone, callback) {
// 				callback (e);
// 			},
// 			color: '#f1c40f',
// 			textColor: 'black'
//   		}
// 	);
// }

// function fx_aniversario(r){
// 	$('.hola').fullCalendar( 'addEventSource',{
// 			events: function(start, end, timezone, callback) {
// 						console.log(r);
// 						var events = [];
// 						for(var i = 0;i < r.length;i++){
// 							var ft = new Date(r[i].ftra),
// 							no = r[i].nom;
// 							ini = new Date(start.format("MM/DD/YYYY")); // fecha inicial del view
// 							fin = new Date(end.format("MM/DD/YYYY"));
// 							nft = [ini.getFullYear(),ft.getMonth()+1,ft.getDate()].join('-');

// 							var no = r[i].nom;

// 							var test_date = new Date(loop);
							
// 							if (test_date.getDate() == ft.getDate() && test_date.getMonth() == ft.getMonth()) {
// 								events.push({
// 									title: no+'\'s Anniversary',
// 									start: nft,
// 									end: nft,
// 									allDay: true,
// 									msg: "<span class='glyphicon glyphicon-globe' style='color: rgb(87, 114, 200);font-size: 18px;'>"+
// 									"</span> Nuestro Compañero "+ r[i].nom +" cumple un año más con nosotros."
// 								});
// 							}

// 						if(ini.getFullYear() != fin.getFullYear()){
// 							if(ini.getMonth() == "12")
// 								nft = [ini.getFullYear(),ft.getMonth()+1,ft.getDate()].join('-');
// 							else
// 								nft = [fin.getFullYear(),ft.getMonth()+1,ft.getDate()].join('-');
// 							events.push({
// 								title: no+'\'s Birthday',
// 								start: nft,
// 								end: nft,
// 								allDay: true,
// 								msg: "<span class='glyphicon glyphicon-globe' style='color: rgb(87, 114, 200);font-size: 18px;'>"+
// 									"</span> Nuestro Compañero "+ r[i].nom +" cumple un año más con nosotros."
// 							});
// 						}
									

// 							callback (events);
// 						}
// 					},
// 					color: '#f1c40f',
// 					textColor: 'black'
//   		}
// 	);
// }
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
*	Agregar Solicitudes Aprobadas de Colaboradores
*/

$('#fc-aprobados').fullCalendar( 'addEventSource',{
		events: function(start, end, timezone, callback) {
			$.ajax({
				url: '/inicio',
				type: "POST",
				data: {accion: "fc_aprobados"},
				success: function(r) {
					if(typeof r == "string") return $.ajax(this); //si no retorna el objecto
					var events 	= [];
					for(var i = 0;i < r.length;i++){
						var fi = new Date(r[i].fp),
							ff = new Date(r[i].ft),
							tp = r[i].tp;
						var color = "#5cb85c";
						switch(tp.toUpperCase()){
							case "permiso especial".toUpperCase():
								color = "#e74c3c";
							break;

							case "Incapacidad".toUpperCase():
								color = "#f0ad4e";
							break;

							case "día personal".toUpperCase():
								color = "#5cb85c";
							break;

							case "día flotante".toUpperCase():
								color = "#95a5a6";
							break;
						}
						if(typeof r[i].nom == "undefined")
							events.push({
								title: 		tp,
								start: 		fi,
								end: 		ff,
								allDay:		true,
								msg: 		"<span class='glyphicon glyphicon-ok-circle' style='color: rgb(30, 148, 36);font-size: 18px;'></span>"+
											"</span> ¡La solicitud de la fecha "+ fi.MDY() +" fue aprobada!",
								color:		color,
								textColor:	'white'
							});
						else{
							events.push({
								title: 		tp+" - "+r[i].nom ,
								start: 		fi,
								end: 		ff,
								allDay:		true,
								msg: 		"<span class='glyphicon glyphicon-ok-circle' style='color: rgb(30, 148, 36);font-size: 18px;'></span>"+
											"</span> Solicitud aprobada de "+ r[i].nom +"",
								color:		color,
								textColor:	'white'
							});
						}
					}
					callback (events);
				}
			});
		}
	});
		

					 // 	$('.hola').fullCalendar( 'addEventSource',{
						// 		events: function(start, end, timezone, callback) {
						// 			var events = [];

						// 			for (loop = new Date(start.format("MM/DD/YYYY")).getTime();
						// 				 loop <= new Date(end.format("MM/DD/YYYY")).getTime();
						// 				 loop = loop + (24 * 60 * 60 * 1000)) {
						// 					var test_date = new Date(loop);					
						// 					if (test_date.getDate() == "8" && test_date.getMonth() == 9-1) {
						// 						events.push({
						// 							title: 'Incapacidad',
						// 							start: test_date,
						// 							end: test_date,
						// 							allDay: true,
						// 							msg: "<span class='glyphicon glyphicon-ok-circle' style='color: rgb(30, 148, 36);font-size: 18px;'></span>"+
						// 							"</span> ¡La solicitud del día "+ test_date +" fue aprobada!"
						// 						});
						// 					}
						// 			} // for
						// 			callback (events);
						// 		},
						// 		color: '#5cb85c',
						// 		textColor: 'white'
					 //  		}
						// );
 


});// <!--   REQUIRE   -->

// $(".hola").fullCalendar('addEventSource', {
//     events: [
//         {
//             title: 'Event1',
//             start: new Date()
//         },
//         {
//             title: 'Event2',
//             start: '2014-12-15'
//         }
//         // etc...
//     ],
//     color: 'red',   // an option!
//     textColor: 'black' // an option!
// });