// sanservices_absence - Last Update: Friday, December 19th, 2014, 1:37:27 PM CST
function show_alerta(a){$(".alert		").alert(),$("#parrafo	").html(a),$(".bs-example").slideDown()}function fx_tconcedido(a){var b=$("#fpermiso").val().split("-").join("/"),c=a.val(),d=0,e=new Date(b);if(dayofweek=e.getDay(),b){d=e+c;for(var f=new Date(b);0!=c;e.setDate(e.getDate()+1)){f=new Date(e.getTime()+864e5);var g=f.getDay();if(6!=g&&0!=g){if(d_fer[0].fec.search(f.MDY())>-1)continue;0==d_disp&&c--;for(var h=0;h<d_disp.length;h++){var i=new Date(d_disp[h].fp).getTime(),j=new Date(d_disp[h].ft).getTime();f.getTime()>=i&&f.getTime()<j||c--}}}$("#ftrabajo").val(date_string(e))}else show_alerta("Ingrese una Fecha de Permiso."),error_alerta=1;return 0==c?(a.css("display","none"),$("#tconcedido2").css("display","inline"),void $("#tconcedido2").focus()):void 0}function string_date(a){var b=a.split("-"),c=b[1];b[1]=b[0],b[0]=c;var d=b.join("-"),e=new Date(d);return e}function date_string(a){var b=a.getUTCMonth()+1,c=a.getUTCDate(),d=a.getUTCFullYear();return[b,c,d].join("-")}function fx_flotante(a){var b=a.text();-1!=b.search(/Flotante/i)?($("#gflotante").slideDown(),$("#flotante").attr("required",""),$(".datepicker-flotante").multiDatesPicker("resetDates"),$("#tconcedido2").attr("disabled","disabled")):($("#gflotante").css("display","none"),"disabled"==$("#tconcedido2").attr("disabled")&&$("#tconcedido2").removeAttr("disabled"),$("#tconcedido2").val(""),$("#flotante").val(""))}var d_disp=[],d_fer=[];require(["/assets/js/app.js"],function(){mifuncion(),$("#badge_dper").html(vdper),$("#aceptar").click(function(){switch($(".bs-example").slideUp(),error_alerta){case 1:setTimeout(function(){$("#fpermiso").focus()},400);break;case 2:document.location.href="/";break;case 3:setTimeout(function(){$("#ftrabajo").focus()},400);break;case 4:setTimeout(function(){$("#flotante").focus()},400)}}),$(document).on("keypress","#tconcedido2",function(a){var b=("undefined"!=typeof a.key?String(a.key):String.fromCharCode(a.keyCode)).replace(/[^0-9]+/g,""),c=this.value.length,d=20,e=Number(this.value+b);return console.log(b),-1!=$("[name='tipo_permiso']:checked").parent().text().search(/Personal/i)&&(d=vdper),2>c&&d>=e&&0!=e&&(this.value+=b),c=this.value.length,c&&fx_tconcedido($("#tconcedido2")),8==a.keyCode?!0:!1}),$("#form1").submit(function(){var a=$("#departamento").val(),b=$("#fpermiso").val(),c=$("#ftrabajo").val(),d=($("#tconcedido2").val(),$("#flotante").val()),e=$("input[name=tipo_permiso]:checked","#form1").parent().text().trim();return console.log("dep : "+a+"\n fper : "+b+"\n ftra : "+c),null==a||""==b||""==c||-1!=e.search(/Flotante/i)&&""==d?(null==a&&(show_alerta("No Tiene Departamento Asignado!"),error_alerta=2),-1!=e.search(/Flotante/i)&&""==d?(show_alerta("No Tiene Fecha del día Flotante!"),error_alerta=4):""==b?(show_alerta("No Tiene Fecha del Permiso!"),error_alerta=1):""==c&&(show_alerta("No Tiene Fecha de Retorno!"),error_alerta=3),console.log("SUBMIT"),!1):("disabled"==$("#tconcedido2").attr("disabled")&&$("#tconcedido2").removeAttr("disabled"),!0)}),$.ajax({url:"/permisos",type:"POST",data:{accion:"feriados"},success:function(a){if(console.log(a),"string"==typeof a)return $.ajax(this);d_fer=a;for(var b=new Date,c=a[0].fec.split(","),d=[],e=0;e<c.length;e++){var f=new Date(c[e]).getTime(),g=new Date([b.getMonth(),b.getDate(),b.getFullYear()].join("/")).getTime();g>=f&&d.push(c[e])}$("#full-year").multiDatesPicker("addDates",d),$(".datepicker-flotante").multiDatesPicker({dateFormat:"mm-dd-yy",changeMonth:!0,monthNamesShort:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],beforeShowDay:function(a){var b=jQuery.datepicker.formatDate("mm/dd/yy",a);return-1!=d.indexOf(b)?[!0]:[0==a.getDay()||6==a.getDay(),""]},maxDate:"today",onSelect:function(){var a=$(".datepicker-flotante").multiDatesPicker("getDates").length;$("#tconcedido2").val(a),fx_tconcedido($("#tconcedido2")),jQuery(this).multiDatesPicker("show")}}).val()}}),$.ajax({url:"/permisos",type:"POST",data:{accion:"dp_aprobados"},success:function(a){return"string"==typeof a?$.ajax(this):(d_disp=a,void $(".datepicker").datepicker("option","beforeShowDay",function(b){var c=jQuery.datepicker.formatDate("mm/dd/yy",b),d=new Date(c).getTime();if(6==new Date(c).getDay()||0==new Date(c).getDay())return[!1];if(d_fer[0].fec.search(c)>-1)return[!1];for(var e=0;e<a.length;e++){var f=new Date(a[e].fp).getTime(),g=new Date(a[e].ft).getTime();if(d>=f&&g>d)return[!1]}return[!0]}))}})});var error_alerta=0,mifuncion=function(){console.log("Permisos.js")};