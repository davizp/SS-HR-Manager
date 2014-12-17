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
	$(".datepicker-flotante").multiDatesPicker({ 
		dateFormat:		'mm-dd-yy',
		changeMonth:	true,
		monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
		// beforeShowDay:	function(dt){return [dt.getDay() == 0 || dt.getDay() == 6, ""];},
		maxDate:		'today',

		onSelect: 		function(){
			var cant = $(".datepicker-flotante").multiDatesPicker('getDates').length;
			$('#tconcedido2').val(cant);
			fx_tconcedido($('#tconcedido2'));
			jQuery(this).multiDatesPicker("show");
		}
	}).val();

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
        for (var i = 0; i < selecttconcedido;i++){
            dayofweek = date.getDay();
            if(dayofweek==6 || dayofweek==0 ){
                date.setDate(date.getDate() + 2);
                i--;
            }
            else
                date.setDate(date.getDate() + 1);            
            }//fin del for

            //---------- Si cae día SABADO *************************
            dayofweek = date.getDay();
            if(dayofweek==6 || dayofweek==0 )
                date.setDate(date.getDate() + 2);
            

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
	}
}