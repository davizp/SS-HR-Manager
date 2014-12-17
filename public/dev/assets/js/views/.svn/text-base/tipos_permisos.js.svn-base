require(['/assets/js/app.js'],function(){
	
	mifuncion();
	$("#form_tipos_permisos").submit(function( event ) {
		$("#guardar").click();
	});

	$("#form").submit(function( event ) {
		var n_sql 				= 	"",
			d 					= 	["tipos_permisos","(tipo_permiso,reg_id_usuario)"],
			txb 				= 	document.createElement("input");
			n_sql 				=  sql.replace( "%tabla" ,	d[0] )
									  .replace( "%campos",	d[1] );
			txb.type			=	"password";
			txb.style.display	= 	"none";
			txb.name			= 	"sql";			
			txb.value 			= 	n_sql;
			
		document.getElementById("form").appendChild(txb);
	});
});


var mifuncion = function(){
	console.log('Tipos_Permisos.js');
}
function form_nuevo(){
	$("#modal_tipos_permisos_titulo").text("Nuevo Tipo de Permiso");
	$('#form_tipos_permisos')[0].reset();
	$("#guardar").attr("onclick","fx_accion('nuevo')");
	$("[name='tipo_permiso']").focus();
}
function form_editar(x){
	$("#modal_tipos_permisos_titulo").text("Editar Tipo de Permiso");
	var hijos 		= 	x.closest('tr').children(),
		id_padre 	= 	x.closest('tr').attr("id");
	$("[name='tipo_permiso']").val(hijos[0].innerHTML);
	$("#guardar").attr("onclick","fx_accion('editar',"+id_padre+")");
	
}

function form_eliminar(x){
	var hijos 		= 	x.closest('tr').children(),
		id_padre 	= 	x.closest('tr').attr("id");
	$(	"#eliminar"  	).attr("onclick","fx_accion('eliminar',"+id_padre+")");
	$(	"#msj_eliminar"	).html("¿Estas seguro de Eliminar a <h4 style = 'display:inline;'><span class = 'label label-danger'>"+
	hijos[0].innerHTML+"</span></h4>?");
}

function fx_accion(valor) {
	if(valor != "eliminar")
		var form = document.getElementById('form_tipos_permisos');
	else
		var form = document.createElement("form");


	if(valor != "nuevo" && arguments.length > 1){
		var textbox2 			= 	document.createElement("input");
		textbox2.value			=	arguments[1];
		textbox2.name			=	"id";
		textbox2.style.display 	= 	"none";
		form.appendChild(textbox2);
	}

	var textbox = document.createElement("input"); 

	form.method 			=	"POST";
	form.action 			=	"/tipos_permisos-data";
	textbox.value			=	valor;
	textbox.name			=	"accion";
	textbox.style.display 	=	"none";
	form.appendChild(textbox);
	if(valor == "eliminar")
		document.body.appendChild(form);
	form.submit();
}