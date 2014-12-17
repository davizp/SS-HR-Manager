require(['/assets/js/app.js','/assets/js/libs/sha512.js'],function(){
	
	console.log("Perfil.js");
	$(document).on('keypress', 'td > input', function (event) {
		if(event.keyCode == 13){
			$('#enviar').click();
			return false;
		}else
			return true;
	});

	$(document).on('keypress', 'div > input', function (event) {
		if(event.keyCode == 13){
			fx_enviar();
			return false;
		}else
			return true;
	});

	// $("#form").submit(function( event ) {
	// 	this["pass"].value = hex_sha512(this["pass"].value);
	// 	return true;
	// });
});

function fx_enviar(){
	if(document.getElementById("pass").value.length > 5){
		var textbox 			=	document.createElement("input");
		textbox.name 			=	"pass";
		textbox.value 			=	hex_sha512(document.getElementById("pass").value);
		textbox.style.display 	=	"none";
		
		document.getElementById("form").appendChild(textbox);

		$('#actualizar').click();
	}
	else{
		var strmsj = '<div class="alert alert-danger alert-dismissible" role="alert"> \
		<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> \
		<strong>Error!</strong> Contraseña muy Corta!</div>';
		$("#msj" ).html(strmsj);
	}
	$('#cancelar').click();
}
function editar(){
	if(typeof $("input")[1] == "undefined"){
		var td = document.getElementsByTagName("td");
		// var valor = clase = type = attrib = "",
		// nombre = ['nom','ape','dep','fnac','ftra','email','dper'];
		
		// for(var i=0;i<td.length;i++){
		// 	valor = td[i].innerHTML;
		// 	clase = (i == 3)?"datepicker-bday":((i == 4)?"datepicker-trab":"");
		// 	type = (i == 5)?"email":"text";
		// 	attrib = (i == 2 || i == 6)?"disabled":"";
		// 	td[i].innerHTML = '<input type="'+type+'" name = "'+nombre[i]+'" class="'+clase+'  form-control" value = "'+valor+'" required '+attrib+'>';
		// }
		td[0].innerHTML = '<input type="text" name = "nom" class="form-control" value = "'+td[0].innerHTML+'" required >';
		td[1].innerHTML = '<input type="text" name = "ape" class="form-control" value = "'+td[1].innerHTML+'" required >';
		td[2].innerHTML = '<input type="text" name = "dep" class="form-control" value = "'+td[2].innerHTML+'" required disabled>';
		td[3].innerHTML = '<input type="text" name = "fnac" class="datepicker-bday form-control" value = "'+td[3].innerHTML+'" required readonly>';
		td[4].innerHTML = '<input type="text" name = "ftra" class="form-control" value = "'+td[4].innerHTML+'" required disabled>';
		td[5].innerHTML = '<input type="email" name = "email" class="form-control" value = "'+td[5].innerHTML+'" required >';
		td[6].innerHTML = '<input type="text" name = "dper" class="form-control" value = "'+td[6].innerHTML+'" required disabled>';

		$('#enviar').slideDown();
	}
	var today = new Date();
	// $(".datepicker-trab" ).datepicker({
	// 	changeMonth: true,
	// 	changeYear: true,
	// 	yearRange: '1945:'+(new Date).getFullYear(),
	// 	dateFormat: 'dd-mm-yy',
	// 	minDate: new Date("2005",today.getMonth(),today.getDate()),
	// 	maxDate: today
	// });//fin del .datepicker-year

	$(".datepicker-bday" ).datepicker({
		changeMonth: true,
		changeYear: true,
		yearRange: '1945:'+(new Date).getFullYear(),
		dateFormat: 'dd-mm-yy',
		maxDate: new Date(today.getFullYear()-16,today.getMonth(),today.getDate())  
	});//fin del .datepicker-year
}

// function editar(){
// 	if(typeof $("input")[0] == "undefined"){
// 		var td = document.getElementsByTagName("td");

// 		td[0].innerHTML = '<input type="text" name = "nom" class="form-control '+clase+'" value = "'+valor+'"" required '+disable+'>';
// 	}
// }

// al dar enter en los input
// despliegue el modal

// al dar click en actualizar
// llamar fx_actualizar
// y verficar contrasenia