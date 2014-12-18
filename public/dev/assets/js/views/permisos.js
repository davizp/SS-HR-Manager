var d_disp = [];
require(['/assets/js/app.js'],function(){
	mifuncion();
	$("#badge_dper").html(vdper);

	$("#aceptar").click(function(){
		$('.bs-example').slideUp();
		switch(error_alerta){
			case 1: //error de fecha del PERMISO vacia
				setTimeout(function(){$('#fpermiso').focus()},400);
			break;
			case 2: //error no tiene DEPARTAMENTO Asignado
				document.location.href = "/";
			break;
			case 3: //error no Fecha de RETORNO
				setTimeout(function(){$('#ftrabajo').focus()},400);
			break;
			case 4: //error no Fecha de RETORNO
				setTimeout(function(){$('#flotante').focus()},400);
			break;
		}


	});//-- <!--  FIN   --> --

	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - * 
	 |	DATEPICKER FECHA DEL PERMISO 																 |
	 |																								 |
	 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
	 
		$.ajax({
			url: '/permisos',
			type: 'POST',
			data:{accion:'dp_aprobados'},
			success: function(r){
				if(typeof r == "string") return $.ajax(this); //si no retorna el objecto
				d_disp = r;
				$(".datepicker").datepicker("option", "beforeShowDay", function(date){					
					var s = jQuery.datepicker.formatDate('mm/dd/yy', date);
					var d = new Date(s).getTime();
					// SIN FINES DE SEMANA
					if(new Date(s).getDay() == 6 || new Date(s).getDay() == 0)
						return [false];


					// QUITAR DIAS APROBADOS
					for(var i = 0; i < r.length ; i++){
						var fi = new Date(r[i].fp).getTime();
						var ff = new Date(r[i].ft).getTime();
						// console.log('fi - '+r[i].fp)
						// console.log('ff - '+r[i].ft)
						// console.log('d - '+ s + '\n\n' )

						
						if( d >= fi && d < ff )
							return [false];
					}
					return [true];

				});
				
			}

		});// $.ajax

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - * 
	 |	BLOQUEAR DIAS CONCEDIDOS																	 |
	 |																								 |
	 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

	$(document).on('keypress', '#tconcedido2', function (event) {
			var character 	= 	((typeof event.key != 'undefined')?
								String (event.key ): 
								String.fromCharCode(event.keyCode)).replace(/[^0-9]+/g, ''),
				tam 		= 	this.value.length,
				max 		= 	20,
				nuevo 		= 	Number(this.value+character);
			console.log(character);
			if($("[name='tipo_permiso']:checked").parent().text().search(/Personal/i) != -1) max = vdper;
			if(tam < 2 && nuevo <= max && nuevo!= 0) this.value += character;
			tam  =  this.value.length;
			if(tam) fx_tconcedido($('#tconcedido2'));
            if(event.keyCode == 8)
            	return true;
            else
            	return false;
	});

	$("#form1").submit(function( event ) {
		var dep		= 	$("#departamento").val(),
			fper	= 	$(	"#fpermiso"	 ).val(),
			ftra	= 	$(	"#ftrabajo"	 ).val(),
			dper	= 	$("#tconcedido2" ).val(),
			dflo	=	$(	'#flotante'  ).val(),
			cflo	=	$('input[name=tipo_permiso]:checked', '#form1').parent().text().trim();
			
		console.log("dep : " +dep+"\n fper : " +fper+"\n ftra : " +ftra);
		if(dep != null && fper != "" && ftra != "" && !(cflo.search(/Flotante/i) != -1 && dflo == "")){
			if($("#tconcedido2").attr("disabled")== "disabled")
				$("#tconcedido2").removeAttr('disabled');
			return true;
		}

		if(dep == null){
			show_alerta("No Tiene Departamento Asignado!");
			error_alerta = 2;
		}
		if(cflo.search(/Flotante/i) != -1 && dflo == ""){
			show_alerta("No Tiene Fecha del día Flotante!");
			error_alerta = 4;
		}
		else if(fper == ""){
			show_alerta("No Tiene Fecha del Permiso!");
			error_alerta = 1;
		}
		else if(ftra == ""){
			show_alerta("No Tiene Fecha de Retorno!");
			error_alerta = 3;
		}
		
		console.log("SUBMIT");
		return false;
	});
	// $(".datepicker-flotante").multiDatesPicker({ 
	// 	dateFormat:		'mm-dd-yy',
	// 	changeMonth:	true,
	// 	monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
	// 	// beforeShowDay:	function(dt){return [dt.getDay() == 0 || dt.getDay() == 6, ""];},
	// 	maxDate:		'today',

	// 	onSelect: 		function(){
	// 		var cant = $(".datepicker-flotante").multiDatesPicker('getDates').length;
	// 		$('#tconcedido2').val(cant);
	// 		fx_tconcedido($('#tconcedido2'));
	// 		jQuery(this).multiDatesPicker("show");
	// 	}
	// }).val();
	/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - * 
	 |	DATEPICKER AGREGAR FERIADOS 																 |
	 |																								 |
	 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
		$.ajax({
			url: '/permisos',
			type: 'POST',
			data:{accion:'feriados'},
			success: function(r){
				console.log(r)
				if(typeof r == "string") return $.ajax(this); //si no retorna el objecto
				var today = new Date();
				var fec = r[0].fec.split(',');
				var temp = [];
				for(var i = 0;i<fec.length;i++){
					var f = new Date(fec[i]).getTime();
					var n = new Date([today.getMonth(),today.getDate(),today.getFullYear()].join('/')).getTime();
					if(f <= n)
						temp.push(fec[i])
				}
				$('#full-year').multiDatesPicker('addDates', temp);
				/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - * 
				 |	DATEPICKER DIA FLOTANTE 																	 |
				 |																								 |
				 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
				$(".datepicker-flotante").multiDatesPicker({ 
					dateFormat:		'mm-dd-yy',
					changeMonth:	true,
					monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
					beforeShowDay:	function(dt){
						var string = jQuery.datepicker.formatDate('mm/dd/yy', dt);
						if(temp.indexOf(string) != -1)
							return [true];
						else
							return [dt.getDay() == 0 || dt.getDay() == 6,""];
					},
					maxDate:		'today',

					onSelect: 		function(){
						var cant = $(".datepicker-flotante").multiDatesPicker('getDates').length;
						$('#tconcedido2').val(cant);
						fx_tconcedido($('#tconcedido2'));
						jQuery(this).multiDatesPicker("show");
					}
				}).val();				
			}

		});// $.ajax

});


//=====================================================================================================
//Si se cargo el archivo
var error_alerta = 0;

var mifuncion = function(){
	console.log('Permisos.js');
}


function show_alerta(msj){
	$(	".alert		").alert();
	$(	"#parrafo	").html(msj);
	$(	".bs-example").slideDown();   
}


//=====================================================================================================
// Funcion de Tiempo Concedido 
// Cambia el valor del html del combobox y 
// calcula la fecha que se deberá presentar.
function fx_tconcedido(x){
    var selectfpermiso		= 	$('#fpermiso').val().split('-').join('/'),
        selecttconcedido	= 	x.val(),
        diapresentarse 		= 	0,
    	date 				=	new Date(selectfpermiso);
    	dayofweek 			=	date.getDay();

    if (selectfpermiso) {
        diapresentarse = date + selecttconcedido;

        //---- RECORRE LA SEMANA Y SALTA FINES DE SEMANA ******
        //date.setDate(date.getDate() + 1);
    //     for (var i = 0; i < selecttconcedido;i++){
    //         dayofweek = date.getDay();
    //         var d = date.setDate(date.getDate() + 1);
    //         var dw = d.getDay();
    //         if(dw ==6 || dw ==0 ){
    //             date.setDate(date.getDate() + 2);
				// i--;
    //         }else{
    //         	console.log(d_disp)
    //         	for(var p = 0; p < d_disp.length ; p++){
				// 	var fi = new Date(d_disp[p].fp).getTime();
				// 	var ff = new Date(d_disp[p].ft).getTime();
				// 	console.log( date)
				// 	console.log( d_disp[p].fp)
				// 	if( date.getTime() >= fi && date.getTime() < ff ){
				// 		date.setDate(date.getDate() + 1);
				// 		i--;
				// 	}
				// 	else{
    //             		date.setDate(date.getDate() + 1);
				// 	}
				// }
    //         }
    		/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - * 
			 |	FUNCION PARA CALCULAR EL DIA QUE SE PRESENTA A TRABAJAR										 |
			 |																								 |
			 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    		var ds = new Date(selectfpermiso);

    		for(;selecttconcedido!=0;date.setDate(date.getDate() + 1)){
					ds = new Date(date.getTime() + 86400000);
				var dw = ds.getDay();

				

				if ( dw !=6 && dw !=0){
					if(d_disp == 0)
						selecttconcedido--;
					for(var p = 0;p < d_disp.length; p++){
						var fi = new Date(d_disp[p].fp).getTime();
						var ff = new Date(d_disp[p].ft).getTime();

						if( !(ds.getTime() >= fi && ds.getTime() < ff) )
							selecttconcedido--;
					}
					
				}
					

            }//fin del for

            //---------- Si cae día SABADO *************************
            // dayofweek = date.getDay();
            // if(dayofweek==6 || dayofweek==0 )
            //     date.setDate(date.getDate() + 2);
            

            //---------- SET Nueva Fecha en TextBox - ****************
            $("#ftrabajo").val(date_string(date));
    }//fin del if
    else{
        //FECHA INVALIDA
         show_alerta("Ingrese una Fecha de Permiso."); 
         error_alerta = 1;
    }

    //---------- Si selecciona más de 4 días - **************
    if(selecttconcedido == 0){
        x.css("display","none");
        $("#tconcedido2").css("display","inline");
        $("#tconcedido2").focus();
        return;        
    }//fin del if      

}//fin de la funcion

//=====================================================================================================
//Recibe fecha en formato DD/MM/YYYY  
function string_date(s){
    var fecha = s.split("-");
    var temp = fecha[1];
    fecha[1] = fecha[0];
    fecha[0] = temp;
    var s_fecha = fecha.join("-");
    var n_fecha = new Date(s_fecha); // mm/dd/yyyy
    return n_fecha;
}//fin de la funcion
//=====================================================================================================
//Recibe fecha en formato MM/DD/YYYY  
function date_string(dateObj){
	var month	=	dateObj.getUTCMonth() + 1, //months from 1-12
		day  	=	dateObj.getUTCDate(),
		year 	=	dateObj.getUTCFullYear();
		return [month,day,year].join("-");
}
function fx_flotante(x){
    //var f = Number($("[name='tipo_permiso']:checked").val());
    var f = x.text();
	if(f.search(/Flotante/i) != -1){
		$("#gflotante"	).slideDown();
		$("#flotante"	).attr("required","");
		$(".datepicker-flotante").multiDatesPicker('resetDates');
		$("#tconcedido2").attr("disabled","disabled");
	}
	else{
		$("#gflotante").css("display","none");
		if($("#tconcedido2").attr("disabled")== "disabled")
			$("#tconcedido2").removeAttr('disabled');
		$("#tconcedido2").val("");
		$("#flotante"	).val("");
	}
}