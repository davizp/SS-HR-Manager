// sanservices_absence - Last Update: Monday, December 15th, 2014, 4:36:44 PM CST
function form_nuevo(){$("#modal_tipos_permisos_titulo").text("Nuevo Tipo de Permiso"),$("#form_tipos_permisos")[0].reset(),$("#guardar").attr("onclick","fx_accion('nuevo')"),$("[name='tipo_permiso']").focus()}function form_editar(a){$("#modal_tipos_permisos_titulo").text("Editar Tipo de Permiso");var b=a.closest("tr").children(),c=a.closest("tr").attr("id");$("[name='tipo_permiso']").val(b[0].innerHTML),$("#guardar").attr("onclick","fx_accion('editar',"+c+")")}function form_eliminar(a){var b=a.closest("tr").children(),c=a.closest("tr").attr("id");$("#eliminar").attr("onclick","fx_accion('eliminar',"+c+")"),$("#msj_eliminar").html("¿Estas seguro de Eliminar a <h4 style = 'display:inline;'><span class = 'label label-danger'>"+b[0].innerHTML+"</span></h4>?")}function fx_accion(a){if("eliminar"!=a)var b=document.getElementById("form_tipos_permisos");else var b=document.createElement("form");if("nuevo"!=a&&arguments.length>1){var c=document.createElement("input");c.value=arguments[1],c.name="id",c.style.display="none",b.appendChild(c)}var d=document.createElement("input");b.method="POST",b.action="/tipos_permisos-data",d.value=a,d.name="accion",d.style.display="none",b.appendChild(d),"eliminar"==a&&document.body.appendChild(b),b.submit()}require(["/assets/js/app.js"],function(){mifuncion(),$("#form_tipos_permisos").submit(function(){$("#guardar").click()}),$("#form").submit(function(){var a="",b=["tipos_permisos","(tipo_permiso,reg_id_usuario)"],c=document.createElement("input");a=sql.replace("%tabla",b[0]).replace("%campos",b[1]),c.type="password",c.style.display="none",c.name="sql",c.value=a,document.getElementById("form").appendChild(c)})});var mifuncion=function(){console.log("Tipos_Permisos.js")};