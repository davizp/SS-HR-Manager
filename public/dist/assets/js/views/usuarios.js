// sanservices_absence - Last Update: Monday, December 15th, 2014, 4:36:44 PM CST
function form_nuevo(){$("#modal_usr_titulo").text("Nuevo Usuario"),$("#form_usr	 ")[0].reset(),$("#guardar    ").attr("onclick","fx_accion('nuevo')"),$("[name='nom']").focus()}function form_editar(a){$("#modal_usr_titulo").text("Editar Usuario");var b=a.closest("tr").children(),c=a.closest("tr").attr("id");$(" [name ='nom'  ]").val(b[0].innerHTML),$(" [name ='ape'  ]").val(b[1].innerHTML),$(" [name ='fnac' ]").val(b[2].innerHTML),$(" [name ='ftra' ]").val(b[3].innerHTML),$(" [name ='email']").val(b[4].innerHTML),$(" [name ='dep'  ]").val(b[5].getAttribute("value")),Number(b[6].getAttribute("value"))?$(".switch").bootstrapSwitch("state",!0):$(".switch").bootstrapSwitch("state",!1),$("[name='per']").val(b[7].innerHTML),$("#guardar").attr("onclick","fx_accion('editar',"+c+")")}function form_eliminar(a){var b=a.closest("tr").children(),c=a.closest("tr").attr("id");$("#eliminar").attr("onclick","fx_accion('eliminar',"+c+")"),$("#msj_eliminar").html("¿Estas seguro de Eliminar a <h4 style = 'display:inline;'><span class = 'label label-danger'>"+b[0].innerHTML+"</span></h4>?")}function fx_accion(a){if(console.log(arguments[1]),"eliminar"!=a)var b=document.getElementById("form_usr");else var b=document.createElement("form");if("nuevo"!=a&&arguments.length>1){var c=document.createElement("input");c.value=arguments[1],c.name="id",c.style.display="none",b.appendChild(c)}var d=document.createElement("input");b.method="POST",b.action="/usuarios-data",d.value=a,d.name="accion",d.style.display="none",b.appendChild(d),"eliminar"==a&&document.body.appendChild(b),b.submit()}require(["/assets/js/app.js"],function(){mifuncion()});var mifuncion=function(){console.log("Usuarios.js")};