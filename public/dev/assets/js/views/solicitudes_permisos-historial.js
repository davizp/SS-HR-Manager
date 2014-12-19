require(['/assets/js/app.js'],function(){
    
    mifuncion();

	$(document).ready(function() {
		// var btn = '<div style = "display:inline-block">'+
		// '<label style="margin-right:15px;" >Filtrar por: </label>'+
		// '<button type="button" id="b_apr" style="margin-right:15px;" class="btn btn-success">Aprobados	</button>'+
		// '<button type="button" id="b_rec" style="margin-right:15px;" class="btn btn-danger ">Rechazados	</button>'+
		// '<button type="button" id="b_tod" style="margin-right:15px;" class="btn btn-default">Todos		</button>'+
		// '</div>';

		var btn = '<label style="margin-right:15px;" >Filtrar por: </label>'+
		'<div class="btn-group" role="group" aria-label="..." style = "display:inline-block; margin-right:15px;">'+
			'<button type="button" id="b_apr"  class="btn btn-default"><span class="glyphicon glyphicon-ok green  "></span> Aprobados	</button>'+
			'<button type="button" id="b_rec"  class="btn btn-default"><span class="glyphicon glyphicon-remove red"></span> Rechazados	</button>'+
			'<button type="button" id="b_tod"  class="btn btn-default">Todos		</button>'+
		'</div>';

		$(".dataTables_length").prepend(btn);
		$(".date_filter").css({display:"block"});

		if($.fn.dataTable != "undefined"){
			$('.loading-container').fadeOut(function() {
				$(this).remove();
			});
			$('.container-fluid').css({'display':'block'});
		}

		$( "#startDate" ).datepicker({
			defaultDate: 	"+1w",
			dateFormat:		'mm-dd-yy',
			changeMonth:	true,
			changeYear:		true,
			onSelect: 		function( selectedDate ) {
								$( "#endDate" ).datepicker( "option", "minDate", selectedDate );
								fx_fecha();
			}
		});

		$( "#endDate" ).datepicker({
			defaultDate: 	"+1w",
			dateFormat:		'mm-dd-yy',
			changeMonth:	true,
			changeYear:		true,
			onSelect: 		function( selectedDate ) {
								$( "#startDate" ).datepicker( "option", "maxDate", selectedDate );
								fx_fecha();

			}
		});
		function fx_reset(){
			$('#startDate').val('');
			$( '#endDate' ).val('');

			$( "#startDate" ).datepicker( "option", "maxDate", "" );
			$(  "#endDate"	).datepicker( "option", "minDate", "" );
			
			fx_fecha();
		}
		$('#reset').on('click',function(e){
			fx_reset();
		});
		function fx_fecha() {
			
			$.fn.dataTableExt.afnFiltering.push(
			    function( settings, aData, dataIndex ) {
					var i 		= 	$('#startDate').val(),
						f		= 	$( '#endDate' ).val(),
						d 		=	aData[2];

					var fi 		= new Date(String(i).split('-').join('/')),
						ff 		= new Date(String(f).split('-').join('/')),
						fd 		= new Date(String(d).split('-').join('/'));


			        if ( i == "" && f == "" )
					{
						//console.log("( i == '' && f == '' )");
						return true;
					}
					else if ( fi <= fd && f == "")
					{
						//console.log("( fi <= fd && f == '')");
						return true;
					}
					else if ( ff >= fd && i == "")
					{
						//console.log("( ff >= fd && i == '')");
						return true;
					}
					else if ( ff >= fd && fi <= fd)
					{
						//console.log("ff >= fd && fi <= fd");
						return true;
					}

					return false;
			        
			    }//fin de la func
			);
			t.fnDraw();
        };

		$('#b_apr').click( function() {
			t.fnFilter("green");
		} );

		$('#b_rec').click( function() {
			t.fnFilter("red");
		} );

		$('#b_tod').click( function() {
			t.fnFilter("");
		} );

		$(".dataTables_wrapper").before();
		

	} );

});

var mifuncion = function(){
	console.log('Solicitudes_permisos-historial.js');
}