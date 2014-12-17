require(['/assets/js/app.js','/assets/js/libs/jquery.js'],function(){
	
	mifuncion();

	$("#form").submit(function( event ) {
		var n_sql 				= 	"",
			d 					= 	["departamentos","(departamento,reg_id_usuario)"],
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
	console.log('Departamentos.js');
}
function form_nuevo(){
	$("#modal_departamentos_titulo").text("Nuevo Departamento");
	$(	'#form_departamentos'	)[0].reset();
	$(	"#guardar"	).attr("onclick","fx_accion('nuevo')");
	$("[name='dep']").focus();
}
function form_editar(x){
	$("#modal_departamentos_titulo").text("Editar Departamento");
	var hijos 	 =	 x.closest('tr').children();
	var id_padre =	 x.closest('tr').attr("id");
	$("[name='dep'] ").val(	hijos[0].innerHTML);
	$("[name='jefe']").val(	hijos[1].getAttribute("value"));
	$(	"#guardar"	 ).attr("onclick","fx_accion('editar',"+id_padre+")");
}
function form_eliminar(x){
	var hijos	 	= 	x.closest('tr').children();
	var id_padre 	= 	x.closest('tr').attr("id");
	$(	"#eliminar"		).attr("onclick","fx_accion('eliminar',"+id_padre+")");
	$(	"#msj_eliminar"	).html("¿Estas seguro de Eliminar a <h4 style = 'display:inline;'><span class = 'label label-danger'>"+hijos[0].innerHTML+"</span></h4>?");
}
function fx_accion(valor) {
	if(valor != "eliminar")
		var form 	=	document.getElementById('form_departamentos');
	else{
		var form 	= 	document.createElement("form");
		form.method = 	"POST";
		form.action = 	"/departamentos-data";   
	}

	if(valor != "nuevo" && arguments.length > 1){
		var textbox2 			=	document.createElement("input");
		textbox2.value			=	arguments[1];
		textbox2.name			=	"id";
		textbox2.style.display	=	"none";
		form.appendChild(textbox2);
	}

	var textbox 			=	document.createElement("input"); 
	textbox.value			=	valor;
	textbox.name			=	"accion";
	textbox.style.display	= 	"none";
	form.appendChild(textbox);
	if(valor == "eliminar") 	document.body.appendChild(form);
	form.submit();
}