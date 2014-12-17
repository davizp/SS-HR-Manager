require(['/assets/js/app.js'],function(){
    $(document).ready(function(){
    	/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *
		|	MANTENIMIENTO																													|
		|																																	|
		/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		$('#modal_nuevo').on('hidden.bs.modal', function (e) {
			$('#form_eventos')[0].reset();
			v_ac = "";
			v_id = 0;
			$('.has-error').removeClass('has-error').removeClass('has-feedback');
			$('.glyphicon.glyphicon-remove.form-control-feedback').remove();

		});
		$('.accion').click(function(){
			console.log('cliick');
			var data = fx_data();
			fx_error(data);
			if(typeof $('.has-error').get(0) == "undefined"){
				console.log('$.ajax');
				$.ajax({
					url: '/mant_eventos',
					type: "POST",
					data: data,
					success: function(r) {
						if(typeof r == "string") return $.ajax(this); //si no retorna el objecto

						if(r.affectedRows){
							if(data.accion == "editar"){
								var hijos 			=	$("#"+data.id).closest('tr').children();
								hijos[0].innerHTML	= 	data.no;
								hijos[1].innerHTML	= 	data.fi;
								hijos[2].innerHTML	= 	data.ff;
								hijos[3].innerHTML	= 	data.inf.replace(/\\/g,'');
							}
							else if(data.accion == "eliminar"){
								$("#"+data.id).remove();
							}
							else if(data.accion == "nuevo"){
								var btn_editar = '<td><a onclick="fx_editar($(this))" class="btn btn-primary" data-toggle="modal" data-target="#modal_nuevo"><span class="glyphicon glyphicon-edit"></span> Editar</a></td>';
								var btn_eliminar = '<td><a onclick="fx_eliminar($(this))" class="lg btn btn-danger" data-toggle="modal" data-target="#confirmDelete"><span class="glyphicon glyphicon-trash"></span> Eliminar</a></td>';
								var rowIndex =	t.fnAddData([
													data.no,
													data.fi,
													data.ff,
													data.inf.replace(/\\/g,''),
													btn_editar,
													btn_eliminar
												]);
							    var row = t.fnGetNodes(rowIndex);
							    $(row).attr('id',r.insertId);

							}
							$('.modal').modal("hide");
						}//r.affectedRows
					}// success
				});
			}else{
				//Mensaje de error
			}
		});
		function fx_error(d){
			for(v in d){
				if($("[name='"+ v +"']").val() == ""){
					$("[name='"+ v +"']").parent().addClass('has-error has-feedback').append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>');
				}
			}
		}
		/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *
		|	DATEPICKER																														|
		|																																	|
		/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		$( "#startDate" ).datepicker({
			defaultDate: 	"+1w",
			dateFormat:		'mm-dd-yy',
			changeMonth:	true,
			changeYear:		true,
			onSelect: 		function( selectedDate ) {
								$( "#endDate" ).datepicker( "option", "minDate", selectedDate );
								$(this).parent().removeClass('has-error has-feedback');
								$('.glyphicon.glyphicon-remove.form-control-feedback',$(this).parent()).remove();
								// fx_fecha();
			}
		});

		$( "#endDate" ).datepicker({
			defaultDate: 	"+1w",
			dateFormat:		'mm-dd-yy',
			changeMonth:	true,
			changeYear:		true,
			onSelect: 		function( selectedDate ) {
								$( "#startDate" ).datepicker( "option", "maxDate", selectedDate );
								$(this).parent().removeClass('has-error has-feedback');
								$('.glyphicon.glyphicon-remove.form-control-feedback',$(this).parent()).remove();
								// fx_fecha();

			}
		});

		/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *
		|	CALENDARIO																														|
		|																																	|
		/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		// $('#fc-eventos').fullCalendar({
		// 	header: {
		// 		left: 'prev,next today',
		// 		center: 'title',
		// 		right: 'none'
		// 	},
		// 	defaultDate: new Date(),
		// 	eventClick:  function(event, jsEvent, view) {
		// 		$('#myModalLabel').html(event.title || "Evento");
		// 		$('.modal-body').html(event.msg || "Ninguno");
		// 		//$('#eventUrl').attr('href',event.url);
		// 		$('#myModal').modal();
		// 	},
		// 	editable: false,
		// 	eventLimit: true // allow "more" link when too many events
		// });

	});// READY

	
	/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *
	|	CALENDARIO																														|
	|																																	|
	/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	// $('#fc-eventos').fullCalendar( 'addEventSource',{
	// 	events: function(start, end, timezone, callback) {
	// 		var events 	= [];
	// 		var r = t.fnGetData();

	// 		for(var i = 0;i < r.length;i++){
	// 			var id 	= 	t.fnGetNodes(i).id,
	// 				no	=	r[i][0],
	// 				fi 	= 	r[i][1],
	// 				ff 	= 	r[i][2],
	// 				inf = 	r[i][3];
	// 			console.log(id);

	// 				events.push({
	// 					id: 		id,
	// 					title: 		no,
	// 					start: 		fi,
	// 					end: 		ff,
	// 					allDay:		true,
	// 					msg: 		inf,

	// 				});
	// 		}
	// 		callback (events);
	// 	}
	// });// FIN


});// REQUIRE

/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *
|	MANTENIMIENTO																													|
|																																	|
/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	var v_ac = ""; //ACCION (nuevo,eliminar,editar)
	var v_id = 0; //ID 	(eliminar,editar)

	function fx_nuevo(){
		v_ac = "nuevo";
		$("#modal_eventos_titulo").text("Nuevo Evento");
		$("[name='no']").focus();
	}
	function fx_eliminar(x){
			v_ac 		= 	"eliminar";	
			v_id 		= 	x.closest('tr').attr("id");
			var hijos 	=	x.closest('tr').children();
			var msj 	= 	"¿Estas seguro de Eliminar a <h4 style = 'display:inline;'><span class = 'label label-danger'>"+
							hijos[0].innerHTML+"</span></h4>?";
			$("#msj_eliminar").html(msj);
	}
	function fx_editar(x){
			v_ac	= 	"editar";
			v_id 	= 	x.closest('tr').attr("id");
		var hijos 	=	x.closest('tr').children();
		$("#modal_eventos_titulo").text("Editar Evento");
		$("input[name='no']").val(hijos[0].innerHTML);
		$("input[name='fi']").val(hijos[1].innerHTML);
		$("input[name='ff']").val(hijos[2].innerHTML);
		$("[name='inf']").val((hijos[3].innerHTML).split('</span> ')[1]);
		$('.btn.btn-default.iconpicker > i').removeClass().addClass( $(hijos[3].innerHTML).attr('class') );
	}
	function fx_data(){
		var data = {};
		if(v_ac == "nuevo" || v_ac == "editar" ){

			var v_no = $('input[name="no"]').val();
			var v_fi = $('input[name="fi"]').val();
			var v_ff = $('input[name="ff"]').val();
			var v_de = "<span class = \\'" + $('.btn.btn-default.iconpicker > i').attr('class') +
			"\\' style = \\'font-size: 18px;\\'></span> "+ $('textarea').val().split('\n').join('<br>');
				data = {
							accion	:	v_ac,
							no		:	v_no,
							fi		:	v_fi,
							ff		:	v_ff,
							inf		:	v_de
						};
		}
		if(v_ac == "editar" || v_ac == "eliminar" ){
			data.id			=	v_id;
			data.accion		=	v_ac;
		}
		return data;
	}