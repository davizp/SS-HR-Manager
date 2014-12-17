require(['/assets/js/app.js','/assets/js/libs/sha512.js'],function(){
	
	mifuncion();

	$("#cambiar_password").submit(function( event ) {
		if((this["password1"].value.length >= 6) || (this["password1"].value.length >= 6) || (this["password1"].value.length >= 6)){
			if(this["password2"].value!=this["password3"].value){
				var strmsj = '<div class="alert alert-danger alert-dismissible" role="alert"> \
				<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> \
				<strong>Error!</strong> Contraseñas no Coinciden!</div>';
				$("#msj").html(strmsj);
				return false;
			}
			this["password1"].value = hex_sha512(this["password1"].value);
			this["password2"].value = hex_sha512(this["password2"].value);
			this["password3"].value = hex_sha512(this["password3"].value);
		}
	});
});


var mifuncion = function(){
	console.log('Password.js');
}

