// sanservices_absence - Last Update: Monday, September 29th, 2014, 3:24:58 PM CST
function show_alerta(a){$(".alert").alert(),$("#parrafo").html(a),$(".bs-example").slideDown()}function fx_tconcedido(a){var b=$("#fpermiso").val(),c=a.val(),d=0,e=new Date(b),f=e.getDay();if(b){d=e+c;for(var g=0;c>g;g++)f=e.getDay(),6==f||0==f?(e.setDate(e.getDate()+2),g--):e.setDate(e.getDate()+1);f=e.getDay(),(6==f||0==f)&&e.setDate(e.getDate()+2),$("#ftrabajo").val(date_string(e))}else show_alerta("Ingrese una Fecha de Permiso."),error_alerta=1;return 0==c?(a.css("display","none"),$("#tconcedido2").css("display","inline"),void $("#tconcedido2").focus()):void 0}function string_date(a){var b=a.split("/"),c=b[1];b[1]=b[0],b[0]=c;var d=b.join("/"),e=new Date(d);return e}function date_string(a){var b=a.getUTCMonth()+1,c=a.getUTCDate(),d=a.getUTCFullYear();return[b,c,d].join("/")}function fx_flotante(a){switch(a.parent().children().attr("class","btn btn-default"),a.attr("class","btn btn-primary"),Number(a.val())){case 2:$("#gflotante").slideDown();break;default:$("#gflotante").css("display","none")}}require(["/assets/js/app.js"],function(){mifuncion(),$("#aceptar").click(function(){switch($(".bs-example").slideUp(),error_alerta){case 1:setTimeout(function(){$("#fpermiso").focus()},400)}}),$("#colaborador").focus()});var error_alerta=0,mifuncion=function(){console.log("Solicitudes.js")};