require(['/assets/js/app.js'],function(){
	
	mifuncion();
	$('#restaurar').click(function(){
		$.ajax({
			url: '/usuarios-data',
			type: 'POST',
			data:{accion:'reset'},
			success: function(r){
				if(r.affectedRows > 0){
					var clase 	= 'danger';
					var msj 	= 'Error al restaurar los días personales!'
					$('#confirmReset').modal("hide");
						clase 	= 'success';
						msj 	= 'Días personales han sido restaurados!';
						var row = t.fnGetNodes();
						$(':nth-child(8)',row).text('5');
						// $('tr:has(th) :nth-child(8)').text('Días Personales');

					}

				var msj = '	<div class="alert alert-'+ clase +' alert-dismissible" role="alert"> \
								<button type="button" class="close" data-dismiss="alert"> \
									<span aria-hidden="true">&times;</span><span class="sr-only">Close</span> \
								</button> \
								<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> \
								</strong>' +  msj	+ '</strong>'
							'</div>';
				$(".container-fluid").prepend(msj);
			}
		});//ajax
	});

});

var mifuncion = function(){console.log('Usuarios.js');}
// function fx_excel_sql(data,c,f){
// 	//if(c < 8){
		
// }

function form_nuevo(){
	$("#modal_usr_titulo").text("Nuevo Usuario");
	$(	"#form_usr	 "	 )[0].reset();
	$(	"#guardar    "	 ).attr("onclick","fx_accion('nuevo')");
	$(	"[name='nom']"	 ).focus();
}
function form_editar(x){
	$("#modal_usr_titulo").text("Editar Usuario");
	var hijos 		= x.closest('tr').children();
	var id_padre 	= x.closest('tr').attr("id");
	$(" [name ='nom'  ]").val(hijos[0].innerHTML);
	$(" [name ='ape'  ]").val(hijos[1].innerHTML);
	$(" [name ='fnac' ]").val(hijos[2].innerHTML);
	$(" [name ='ftra' ]").val(hijos[3].innerHTML);
	$(" [name ='email']").val(hijos[4].innerHTML);
	$(" [name ='dep'  ]").val(hijos[5].getAttribute("value"));

	if(Number(hijos[6].getAttribute("value")))
		$('.switch').bootstrapSwitch('state', true  );
	else
		$('.switch').bootstrapSwitch('state', false );

	$("[name='per']").val(hijos[7].innerHTML);
	$(	"#guardar"	).attr("onclick","fx_accion('editar',"+id_padre+")");
}


function form_eliminar(x){
	var hijos 	 =	 x.closest('tr').children(),
		id_padre =	 x.closest('tr').attr("id");
	$(	"#eliminar"	 ).attr("onclick","fx_accion('eliminar',"+id_padre+")");
	$("#msj_eliminar").html("¿Estas seguro de Eliminar a <h4 style = 'display:inline;'><span class = 'label label-danger'>"+hijos[0].innerHTML+"</span></h4>?");
}
function fx_error(valor){
	if(valor != "eliminar"){
		if($(" [name ='nom'  ]").val() == ''){
			$("[name ='nom'  ]").parent().addClass('has-error has-feedback').append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>');
		}
		if($(" [name ='ape'  ]").val() == ''){
			$("[name ='ape'  ]").parent().addClass('has-error has-feedback').append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>');
		}
		if($(" [name ='fnac' ]").val() == ''){
			$("[name ='fnac' ]").parent().addClass('has-error has-feedback').append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>');
		}
		if($(" [name ='ftra' ]").val() == ''){
			$("[name ='ftra' ]").parent().addClass('has-error has-feedback').append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>');
		}
		if($(" [name ='email']").val() == ''){
			$("[name ='email']").parent().addClass('has-error');
		}
	}
}
function fx_accion(valor) {
	fx_error(valor);
	if(typeof $('.has-error').get(0) == "undefined"){
		if(valor != "eliminar")
			var form = document.getElementById('form_usr');
		else
			var form = document.createElement("form");


		if(valor != "nuevo" && arguments.length > 1){
			var textbox2 			=	document.createElement("input");
			textbox2.value			=	arguments[1];
			textbox2.name			=	"id";
			textbox2.style.display 	=	"none";
			form.appendChild(textbox2);
		}
		var textbox 			=	document.createElement("input"); 
		form.method 			=	"POST";
		form.action 			=	"/usuarios-data";   
		textbox.value			=	valor;
		textbox.name			=	"accion";
		textbox.style.display 	=	"none";
		form.appendChild(textbox);
		if(valor == "eliminar")		document.body.appendChild(form);
		form.submit();
	}
}