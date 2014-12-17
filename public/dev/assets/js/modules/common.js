// Description:
//	Code here is available site wide
// 	Note: jQuery is available, so we dont need to
//	declare it as a dependency
// --------------------------------------------------*/

// This is the definition of the module
	define('common', function(){
		$(function () {
			console.log( "ready!" );

			// Date.prototype.YMD = function (f) {
			// 	var d = String (this.getDate()		),
			// 		m = String (this.getMonth()+1	),
			// 		y = String (this.getFullYear()	);

			// 	d = (d.length == 1)? "0"+d : d;
			// 	m = (m.length == 1)? "0"+m : m;
			// 	y = (y.length == 1)? "0"+y : y;

			// 	return [y,m,d].join(f||'/');
			// }

			Date.prototype.MDY = function (f) {
				var d = String (this.getDate()		),
					m = String (this.getMonth()+1	),
					y = String (this.getFullYear()	);

				d = (d.length == 1)? "0"+d : d;
				m = (m.length == 1)? "0"+m : m;
				y = (y.length == 1)? "0"+y : y;

				return [m,d,y].join(f||'/');
			}
			$(window).on('resize',function(){
				if($(document).width()-$('#sidebar-wrapper').width() - $('table').width() < 24 ){
					if(!$('table').parent().hasClass('t-responsive'))
						$('table').parent().wrapInner('<div class="t-responsive"></div>');
					
				}else
					if($('table').parent().hasClass('t-responsive'))
						$('table').parent().removeClass('t-responsive');
			});
			

			// $('tr').has('div').mouseenter(function(){ 
			// 	var x = $('td:has(div)',this).html();
			// 	var c = $(x)[0]; 
			// 	c.attr("style").css({'style':'height:"100% !important";'})
			// 	console.log($(c).css('height'))
			// 	// $(c).removeClass('flo');
				 
			// });



			$('td div.flo').each(function(){ 
				var x = $(this).html().split(',');
				
				var f = "";
				for (var v in x){
					var dw = ['Dom','Lun','Mar','Mie','Jue','Vie','Sab'];
					x[v] = new Date (x[v].trim().split('-').join('/'));
					f += dw[x[v].getDay()]+'	'+x[v].MDY('-')+',\n';

				}
				console.log(f);
				$(this).html(f);
				
			});

			// $('td input').each(function(){ 
			// 	$(this).multiDatesPicker({
			// 		dateFormat:		'mm-dd-yy',
			// 		maxPicks: 		$(this).val().split(',').length,
			// 		onSelect: 		function (e){
			// 			// console.log(e);
			// 			return false;
			// 		}
			// 	});
			// });

			

			// $('tr').has('input').mouseenter(function(){ 
			// 	var x = $('td:has(input)',this).html();
			// 	var c = $(x)[0].id; 
			// 	$('#ui-datepicker-div').css('display','block');
			// 	$('#'+c).focus();
			// 	$('#'+c).focus();
			// });

			// $('input').on('focus',function(e){
			// 	console.log(this);
			// 	 $(this).replaceWith($('<span>' + this.innerHTML + '</span>'));
			// });

			//$('tr').has('input').mouseleave(function(){ console.log(5); $('#ui-datepicker-div').css('display','none');});

			//$('.multidatepicker').multiDatesPicker('value',"'"+$('.multidatepicker').val()+"'");
			// $('.multidatepicker').multiDatesPicker('value',"'"+$('.multidatepicker').val()+"'");

			// var height 	= [],
			// 	width 	= [];
			// $('table').each(function(){
			// 	height.push($(this).height());
			// 	width.push($(this).width());
			// })
			//  var h_max = Math.max.apply( Math, height );
			//  var w_max = Math.max.apply( Math, width );

			// $('table').each(function(){
			// 	if($(this).height() < h_max)
			// 		$(this).height(h_max);
			// 	if($(this).width() < w_max)
			// 		$(this).width(w_max);
			// });

			// Date.prototype.DMY = function (f) {
			// 	var d = String (this.getDate()		),
			// 		m = String (this.getMonth()+1	),
			// 		y = String (this.getFullYear()	);

			// 	d = (d.length == 1)? "0"+d : d;
			// 	m = (m.length == 1)? "0"+m : m;
			// 	y = (y.length == 1)? "0"+y : y;

			// 	return [d,m,y].join(f||'/');
			// }
			// Date.prototype.time = function () {return this.toString().substring(16,24);}
			// Date.prototype.setDMY = function (d) {
			// 	var nd = (d.search("/") != -1)? d.split('/') :d.split('-'),
			// 		d = String (nd[0]	),
			// 		m = String (nd[1]-1	),
			// 		y = String (nd[2]	);

			// 	if(isNaN(d) || isNaN(m) || isNaN(y) )
			// 		return "Fecha Invalida";
			// 	this.setDate( String(nd[0])   )
			// 	this.setMonth( String(nd[1]-1) )
			// 	this.setFullYear( String(nd[2])   );
			// }

			  $('li a[href="/' + location.pathname.split("/")[1] + '"]').parent().addClass('active');

			if(!$(".table").hasClass("noDataTables")){
				if($(".table").hasClass("bSort"))
					t = $(".table").dataTable({
						"bSort" : false,
						  dom: 'T<"clear">lfrtip',
						"oLanguage": {
							"sSearch"		:	"Buscar:",
							"sLengthMenu"	:	"Mostrar _MENU_ registros",
							"sProcessing"	:	"Procesando...",
							"sInfo"			:	"Mostrando _START_ - _END_ de _TOTAL_ registros",
							"sInfoEmpty"	:	"Mostrando 0 - 0 de 0 registros",
							"sInfoFiltered"	:	"(filtrado de _MAX_ registros)",
							"sZeroRecords"	:	"No hay Resultados"
						}
					});
				else 
					t = $(".table").dataTable({
						  dom: 'T<"clear">lfrtip',
						"oLanguage": {
							"sSearch":			"Buscar:",
							"sLengthMenu":		"Mostrar _MENU_ registros",
							"sProcessing":		"Procesando...",
							"sInfo"	:			"Mostrando _START_ - _END_ de _TOTAL_ registros",
							"sInfoEmpty":		"Mostrando 0 - 0 de 0 registros",
							"sInfoFiltered": 	"(filtrado de _MAX_ registros)",
							"sZeroRecords":		"No hay Resultados"
						}
					});
				$(".dataTables_wrapper").prepend("<br/>");
			}

		});

		$(function () {
			bind_events();
			console.log("[Common]: Initiated");
			
			//Datepicker class --------------------------------------------------------------------
			var today = new Date();
				$(".datepicker").datepicker({ 
					dateFormat:		'mm-dd-yy',
					minDate:		new Date(today.getFullYear(),today.getMonth(),today.getDate()+1),
					beforeShowDay:	$.datepicker.noWeekends,
					onSelect: 		function( selectedDate ) {
										$(this).parent().removeClass('has-error has-feedback');
										$('.glyphicon.glyphicon-remove.form-control-feedback',$(this).parent()).remove();
									}
				}).val();

				/* * * * * * * * * * * * * * * * * * * * *
				 * MODAL FOCUS AND DATEPICKER (FIREFOX)
				 */
					var enforceModalFocusFn = $.fn.modal.Constructor.prototype.enforceFocus;
					$('.modal').has('input').on('show.bs.modal', function() {
						$.fn.modal.Constructor.prototype.enforceFocus = function(){};
					});
					$('.modal').has('input').on('hidden.bs.modal', function() {
						$.fn.modal.Constructor.prototype.enforceFocus = enforceModalFocusFn;
					});
				/* 
				 * * * * * * * * * * * * * * * * * * * * */

				// $(".datepicker-flotante").multiDatesPicker({ 
				// 	dateFormat:		'mm-dd-yy',
				// 	// beforeShowDay:	function(dt){return [dt.getDay() == 0 || dt.getDay() == 6, ""];},
				// 	maxDate:		today,
				// 	onSelect: 		function(){
				// 		var cant = $(".datepicker-flotante").multiDatesPicker('getDates').length;
						
				// 	}
				// }).val();
				$('.modal').on('hidden.bs.modal', function (e) {
					$('form').each(function(){ this.reset();})
					$('.has-error').removeClass('has-error').removeClass('has-feedback');
					$('.glyphicon.glyphicon-remove.form-control-feedback').remove();
				});

				$(".datepicker-normal").datepicker({ 
					dateFormat:		'mm-dd-yy',
					monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
					onSelect: 		function( selectedDate ) {
										$(this).parent().removeClass('has-error has-feedback');
										$('.glyphicon.glyphicon-remove.form-control-feedback',$(this).parent()).remove();
									}
				}).val();

				$(".datepicker-bday").datepicker({
					changeMonth:	true,
					changeYear:		true,
					yearRange:		'1935:'+(new Date).getFullYear(),
					dateFormat:		'mm-dd-yy',
					monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
					maxDate:		new Date(today.getFullYear()-16,today.getMonth(),today.getDate()),
					onSelect: 		function( selectedDate ) {
										$(this).parent().removeClass('has-error has-feedback');
										$('.glyphicon.glyphicon-remove.form-control-feedback',$(this).parent()).remove();
									}
				});
				
				$(".datepicker-trab").datepicker({
					changeMonth:	true,
					changeYear:		true,
					yearRange:		'1945:'+(new Date).getFullYear(),
					dateFormat:		'mm-dd-yy',
					monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
					minDate:		new Date("2005",today.getMonth(),today.getDate()),
					maxDate:		today,
					onSelect: 		function( selectedDate ) {
										$(this).parent().removeClass('has-error has-feedback');
										$('.glyphicon.glyphicon-remove.form-control-feedback',$(this).parent()).remove();
									}
				});


				$(".datepicker-year").datepicker({
					changeMonth:	true,
					changeYear:		true,
					yearRange:		'1945:'+(new Date).getFullYear(),
					dateFormat:		'mm-dd-yy',
					monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
					maxDate:		today,
					onSelect: 		function( selectedDate ) {
										$(this).parent().removeClass('has-error has-feedback');
										$('.glyphicon.glyphicon-remove.form-control-feedback',$(this).parent()).remove();
									}
				});/*================================================================================*/
				

				function date_string(dateObj){
					var month	=	dateObj.getUTCMonth() + 1, //months from 1-12
						day  	=	dateObj.getUTCDate(),
						year 	=	dateObj.getUTCFullYear();
						return [month,day,year].join("-");
				}

				//------------ ASIDE TOOGLE -----------------------------------------------------------
				$("#menu-toggle").click(function(e) {
					$("#wrapper").toggleClass("toggled");
					e.preventDefault();
				});
				
				//------------ SWITCH BUTTON -----------------------------------------------------------
				$(".switch").bootstrapSwitch();

				//------------ JQUERY-UI AUTOCOMPLETE INPUT  -------------------------------------------
				if(typeof availableTags != "undefined")
					$( "#buscar" ).autocomplete({source: availableTags});

				//------------ DROPDOWN XLS  -----------------------------------------------------------
				if(document.getElementById("drop_zone") != null){
					function handleFileSelect(evt) {
						evt.stopPropagation();
						evt.preventDefault();

						var files = evt.dataTransfer.files; // FileList object.
						document.getElementById("archivo").files = files;
						

						//fx_files(files);
					}

					// function to_json(wb) {
					// 	var result = {};
					// 	var i = 0;
					// 	var sheet_name_list =	wb.SheetNames,
					// 		sheet 			=	wb.Sheets[sheet_name_list[0]];
						
					// 		var roa = XLSX.utils.sheet_to_row_object_array(sheet);
					// 		if(roa.length > 0){
					// 			result[i++] = roa;
					// 		}
						
					// 	return result;
					// }
					function fx_files(files){
						// files is a FileList of File objects. List some properties.
						var output = [], output2 = [];
						// for (var i = 0, f; f = files[i]; i++) {
							f = files[0];
							var extension = String(f.name.substr(f.name.lastIndexOf("."),f.name.length));

							if(extension == ".xls" || extension == ".xlsx"){

								// output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
								// 			f.size, ' bytes, last modified: ',
								// 			f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
								// 			'</li>');
								output.push('<div class="icono-excel icono-excel-',extension.substring(1,5),'"> <div style="position: relative;top: 100%;text-align: center;">',
								escape(f.name), '</div> </div>');

								$("#drop_zone").css({
									"text-align"	:	"inherit",
									"font"			:	"inherit",
									"color"			:	"inherit"
								});
								document.getElementById('drop_zone').innerHTML = '<ul>' + output.join('') + '</ul>';
								output2 = [];
								console.log(f);
								// $("#drop_zone").css(styles[0]);
								//  var span = document.createElement('span');
								// span.innerHTML = ['<div class="icon-excel" <div>', escape(theFile.name), '</div> </div>'].join('');
								// document.getElementById('list').insertBefore(span, null);
								var read = new FileReader();
								//read.readAsBinaryString(f);read.onloadend=function(){console.log(read.result);}
								read.onload = function(e) {
										var data 			=	e.target.result,
											
											/* if binary string, read with type 'binary' WORKBOOK*/
											wb 				=	(extension == ".xls")
																?XLS.read(data , {type: 'binary'})
																:XLSX.read(data, {type: 'binary'});

										/*************************************************************************** 
										 * DO SOMETHING WITH workbook HERE 
										 *
										 */
										var sheet_name_list =	wb.SheetNames,
											sheet 			=	wb.Sheets[sheet_name_list[0]],			// Todos los Campos de la Página 1
											data 			=	(extension == ".xls")
																?XLS.utils.sheet_to_json(sheet, {header:1})
																:XLSX.utils.sheet_to_json(sheet, {header:1});		// Convertir a JSON
											var c 				=	data.length,									// COLUMNAS
												r 				=	data[0].length;									// FILAS
											sql				=	"INSERT IGNORE INTO %tabla %campos VALUES \n";

											console.log(data)
											console.log(c)
											console.log(r)
										
										for(var x = 0; x < c; x++){
											sql += "(";
											if(data[x] == undefined)
													continue;
											if(isNaN(data[x])){
												var d = new Date(Date.parse(data[x]));
												if(d != "Invalid Date")
													data[x] = "STR_TO_DATE('"+date_string(d)+"', '%m-%d-%Y')";
												else
													data[x] = "'"+data[x]+"'";
											}
											sql += data[x];
											// for(var x = 0; x < c; x++){
											// 	console.log('y: '+y+' , x:'+x)
											// 	if(data[y][x] == undefined)
											// 		continue;
											// 	if(isNaN(data[y][x])){
											// 		var d = new Date(Date.parse(data[y][x]));
											// 		if(d != "Invalid Date")
											// 			data[y][x] = "STR_TO_DATE('"+date_string(d)+"', '%m-%d-%Y')";
											// 		else
											// 			data[y][x] = "'"+data[y][x]+"'";
											// 	}

											// }
											//sql += data[y].join(",");

											sql += ",%idusuario";
											sql += "),\n"; 
										}
										sql = sql.slice(0,sql.length-2) + ";";	
										console.log(sql)								
								};
								read.readAsBinaryString(f);
							}
							else{
								output2.push('<li><strong>', escape(f.name), '</strong> <span class = "red">*Tiene una extensión incorrecta!</span></li>');
								$("#drop_zone").removeClass();
								$("#drop_zone").addClass("#drop_zone");
								document.getElementById("archivo").value = "";
							}
						// }//fin del for
						document.getElementById('list').innerHTML = '<ul>' + output2.join('') + '</ul>';
					}

					function handleDragOver(evt) {
						evt.stopPropagation();
						evt.preventDefault();
						evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
					}

					$("document").ready(function(){
						$("#archivo").change(function (){
							fx_files($(this)[0].files);
							if(document.getElementById("archivo").value == ""){
								$("#drop_zone").html('Arrastre AQUI un Archivo de EXCEL .XLS ó .XLSX');
								$("#drop_zone").attr("style","");
							}
							
						});
						$( "#cancelar" ).click(function(){
							$(this).parent().slideUp();
							$("#drop_zone").html('Arrastre AQUI un Archivo de EXCEL .XLS ó .XLSX');
							$("#drop_zone").attr("style","");
							$("#list").innerHTML = "";
						});
					});
					// Setup the dnd listeners.
					var dropZone = document.getElementById('drop_zone');
					dropZone.addEventListener('dragover', handleDragOver, false);
					dropZone.addEventListener('drop', handleFileSelect, false);

					var onDragEnter = function(event) {
						event.preventDefault();
						$("#drop_zone").css({border:"2px dashed green"});
					}, 
					onDragLeave = function(event) {
						event.preventDefault();
						$("#drop_zone").css({border:"2px dashed #bbb"});
					};
					$("#drop_zone").on("dragenter", onDragEnter).on("dragleave", onDragLeave);
				}
				//------------ ----------------  ----------------------------------------------------------

		});
	});
	var sql,t;
	var bind_events = function(){
		// Your binding events here
	};

	// function exportar(){
	// 	var t_nom = $("table")[0].id;
	// 	$("#"+t_nom).tableExport({type:'excel',escape:'true',tableName:t_nom});
	// }

	    var exportar = (function () {
        var uri = 'data:application/xls;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
        return function (table, name, filename) {
            // if (!table.nodeType) 
			table = document.getElementsByTagName('table')[0];
			var table_html 	= table.innerHTML,
				x 			= [];
				filename	= table.id;

			$(table_html).closest('thead').children().children().removeAttr('style').each(function( index ) {
				x.push("<td>"+ $( this ).text() + "</td>" );
			});

			var newtable = "<thead><tr>"+ x.join('') +"</tr></thead>" + document.getElementsByTagName('tbody')[0].innerHTML;// + $(table_html).closest("tbody");
			console.log(newtable);

			var ctx = { worksheet: name || 'Worksheet', table: newtable}

            // document.getElementById("dlink").href = uri + base64(format(template, ctx));
            // document.getElementById("dlink").download = filename;
            // document.getElementById("dlink").click();

			// $(ctx.table).closest('thead').children().children().removeAttr('style').each(function( index ) {
			// 	x.push("<td>"+ $( this ).text() + "</td>" );
			// });


			var link = document.createElement("a");
			// console.log(ctx);
			// $(ctx.table).closest('thead').children().children().removeAttr('style')
			link.href = uri + base64(format(template, ctx));
			link.download = filename+".xls";
			link.innerHTML = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

        }
    })();




function alerta(x){
	var p = x.parent();
	if(!x.val()){
		if(!(p.hasClass("has-error"))){
			p.addClass('has-error has-feedback');
			if(x.attr('type') != "email")
				p.append('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>');
		}

	}else{
		if(p.hasClass("has-error")){
			p.removeClass("has-error");
			$('.glyphicon.glyphicon-remove.form-control-feedback',p).remove();
		}
	}
}
//===================================================================================================
