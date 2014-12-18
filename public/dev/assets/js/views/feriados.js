require(['/assets/js/app.js'],function(){
	$(document).ready(function(){
		/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *
		|	MULTI-DATESPICKER 																												|
		|																																	|
		/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		var today = new Date();
		var y = today.getFullYear();
		$('#full-year').multiDatesPicker({
			//addDates: ['10/14/'+y, '02/19/'+y, '01/14/'+y, '11/16/'+y],
			numberOfMonths: [3,4],
			defaultDate: '1/1/'+y,
			maxDate:		new Date(today.getFullYear(),11,31),
			minDate:		new Date(today.getFullYear(),0,1)
		});
		/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *
		|	MULTI-DATESPICKER 	- CARGAR DATOS -																							|
		|																																	|
		/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		$.ajax({
			url: '/mant_feriados',
			type: "POST",
			data: {accion:'cargar'},
			success: function(r) {
				if(typeof r == "string") return $.ajax(this);
				var fec = r[0].fec.split(',');
				$('#full-year').multiDatesPicker('addDates', fec);
			}
		});
		/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - *
		|	MULTI-DATESPICKER 	- GUARDAR / ELIMINAR -																						|
		|																																	|
		/*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

		$('#guardar').click(function(){
			var data = {
							id 	:	y,
							fec :	$('#full-year').multiDatesPicker('getDates')
						};
			
			$.ajax({
				url: '/mant_feriados',
				type: "POST",
				data: data,
				success: function(r) {
					if(typeof r == "string") return $.ajax(this); //si no retorna el objecto
					var clase 	= "danger",
						res 	= "Error al guardar!";
					if(r.affectedRows){
						clase 	= "success"
						res 	= "Se ha guardado correctamente!"
					}
					var msj = '<div class="alert alert-'+ clase +' alert-dismissible" role="alert"> \
										<button type="button" class="close" data-dismiss="alert"> \
											<span aria-hidden="true">&times;</span><span class="sr-only">Close</span> \
										</button> \
										<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> \
										</strong>' +  res	+ '</strong>'
									'</div>';
					$(".container-fluid").prepend(msj);
					$('#confirmGuardar').modal('hide');
				}// success
			});			
		});// #guardar

		$('#confirm').click(function(){
			$('#confirmGuardar').modal('show');
		});

	});// READY
}); // REQUIRE


//$('#full-year').multiDatesPicker('getDates');