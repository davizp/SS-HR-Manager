require(['/assets/js/app.js'],function(){
	
	mifuncion();
	$(function(){


		$('#editor').wysiwyg();
		
		$('#para').tokenize();

		if($.fn.tokenize != "undefined"){
			$('.loading-container').fadeOut(function() {
				$(this).remove();
			});
			$('.container-fluid').css({'display':'block'});
		}
		$('input[class="span2"]').click(function(e){
			$(this).focus();
			return false;
		});



		$('#enviar').click(function(){

			var data =	{
							para	: $('#para').val() || "",
							asunto	: $('#asunto').val(),
							titulo	: $('#titulo').val(),
							editor	: $('#editor').html()
						};
			
			console.log("Enviar");
			fx_error(data);
			if(typeof $('.has-error').get(0) == "undefined"){
				$('#correo_modal').modal("show");
				$.ajax({
					url: '/correo',
					type: "POST",
					data: data,
					success: function(r) {
						$('#correo_modal').modal("hide");
						var clase = (r.r == "Mensaje Enviado")?'success':'danger';
						
						var msj = '<div class="alert alert-'+ clase +' alert-dismissible" role="alert"> \
										<button type="button" class="close" data-dismiss="alert"> \
											<span aria-hidden="true">&times;</span><span class="sr-only">Close</span> \
										</button> \
										<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> \
										</strong>' +  r.r	+ '</strong>'
									'</div>';
						$(".container-fluid").prepend(msj);
						$btn.button('reset');
					}
				});//ajax
			}// fin del if
		});
		$(document).on('keypress',function(e){
			console.log("keypress")
			if($('#editor').html() != "" && $('#editor').parent().hasClass('has-error')){
				$("#editor").parent().removeClass('has-error has-feedback');
				$('div[data-target = "#editor"] > .glyphicon.glyphicon-remove.form-control-feedback').remove();
			}
			if($('#para').val() != ""){
				$(".Tokenize").parent().removeClass('has-error has-feedback').closest('span').remove();
				$('div.col-lg-12 > .glyphicon.glyphicon-remove.form-control-feedback').remove();
			}
		});
		$('#para').change(function() {
		  alert( "Handler for .change() called." );
		});
		

	});// READY
});


var mifuncion = function(){
	console.log('Correo.js');
}

function fx_error(d){
	for(v in d){
		if(d[v] == "" ){
			if(v != "para")
				$("#"+ v).parent().addClass('has-error has-feedback').append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>');
			else
				$(".Tokenize").parent().addClass('has-error has-feedback').append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true" style="margin-left:-19px;left: 96%;"></span>');
		}//if
	}//for
}

