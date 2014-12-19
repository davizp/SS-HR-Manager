// sanservices_absence - Last Update: Friday, December 19th, 2014, 1:37:27 PM CST
require(["/assets/js/app.js"],function(){$(document).ready(function(){$("#fc-eventos").fullCalendar({header:{left:"prev,next today",center:"title",right:"none"},defaultDate:new Date,eventClick:function(a){$("#myModalLabel").html(a.title||"Evento"),$(".modal-body").html(a.msg||"Ninguno"),$("#myModal").modal()},editable:!1,eventLimit:!0}),$("#fc-aprobados").fullCalendar({header:{left:"prev,next today",center:"title",right:"none"},defaultDate:new Date,eventClick:function(a){$("#myModalLabel").html(a.title||"Evento"),$(".modal-body").html(a.msg||"Ninguno"),$("#myModal").modal()},editable:!1,eventLimit:!0})}),$("#fc-eventos").fullCalendar("addEventSource",{events:function(a,b,c,d){$.ajax({url:"/inicio",type:"POST",data:{accion:"eventos"},success:function(a){if("string"==typeof a)return $.ajax(this);for(var b=[],c=0;c<a.length;c++){var e="'"+a[c].id+"'",f=a[c].no,g="'"+a[c].fi+"'",h="'"+a[c].ff+"'",i=a[c].inf;console.log("addEventSource"),console.log(a),b.push({id:e,title:f,start:g,end:h,msg:i,allDay:!0})}d(b)}})}}),$("#fc-eventos").fullCalendar("addEventSource",{events:function(a,b,c,d){$.ajax({url:"/permisos",type:"POST",data:{accion:"feriados"},success:function(a){if("string"==typeof a)return $.ajax(this);var b=[],c=a[0].fec.split(",");console.log(a);for(var e=0;e<c.length;e++)b.push({title:"Feriado",start:new Date(c[e]),end:new Date(c[e]),msg:"<span class='glyphicon glyphicon-flag' style='font-size: 18px;'></span> Éste día es un feriado nacional.",allDay:!0,color:"#e74c3c",textColor:"white"});d(b)}})}}),$("#fc-eventos").fullCalendar("addEventSource",{events:function(a,b,c,d){$.ajax({url:"/inicio",type:"POST",data:{accion:"fc_eventos"},success:function(c){if("string"==typeof c)return $.ajax(this);for(var e=[],f=0;f<c.length;f++){var g=c[f].nom.split(" ")[0],h=new Date(a.format("MM/DD/YYYY")),i=new Date(b.format("MM/DD/YYYY")),j=new Date(c[f].fnac),k=[h.getFullYear(),j.getMonth()+1,j.getDate()].join("/"),l=new Date(c[f].ftra),m=[h.getFullYear(),l.getMonth()+1,l.getDate()].join("/");e.push({title:g+"'s Birthday",start:k,end:k,allDay:!0,msg:"<span class='glyphicon glyphicon-gift' style='color: rgb(213, 87, 87);font-size: 18px;'></span> Cumpleaños de "+c[f].nom,color:"#428bca",textColor:"white"}),h.getFullYear()!=i.getFullYear()&&(k="12"==h.getMonth()?[h.getFullYear(),j.getMonth()+1,j.getDate()].join("/"):[i.getFullYear(),j.getMonth()+1,j.getDate()].join("/"),e.push({title:g+"'s Birthday",start:k,end:k,allDay:!0,msg:"<span class='glyphicon glyphicon-gift' style='color: rgb(213, 87, 87);font-size: 18px;'></span> Cumpleaños de "+c[f].nom,color:"#428bca",textColor:"white"})),e.push({title:g+"'s Anniversary",start:m,end:m,allDay:!0,msg:"<span class='glyphicon glyphicon-globe' style='color: rgb(87, 114, 200);font-size: 18px;'></span> Nuestro Compañero "+c[f].nom+" cumple un año más con nosotros.",color:"#f1c40f",textColor:"black"}),h.getFullYear()!=i.getFullYear()&&(m="12"==h.getMonth()?[h.getFullYear(),l.getMonth()+1,l.getDate()].join("/"):[i.getFullYear(),l.getMonth()+1,l.getDate()].join("/"),e.push({title:g+"'s Birthday",start:m,end:m,allDay:!0,msg:"<span class='glyphicon glyphicon-globe' style='color: rgb(87, 114, 200);font-size: 18px;'></span> Nuestro Compañero "+c[f].nom+" cumple un año más con nosotros.",color:"#f1c40f",textColor:"black"}))}d(e)}})}}),"undefined"!=typeof $.fn.fullCalendar&&($(".loading-container").fadeOut(function(){$(this).remove()}),$(".container-fluid").hide().css("visibility","visible").fadeIn("slow")),$("#fc-aprobados").fullCalendar("addEventSource",{events:function(a,b,c,d){$.ajax({url:"/inicio",type:"POST",data:{accion:"fc_aprobados"},success:function(a){if("string"==typeof a)return $.ajax(this);for(var b=[],c=0;c<a.length;c++){var e=new Date(a[c].fp),f=new Date(a[c].ft),g=a[c].tp,h="#5cb85c";switch(g.toUpperCase()){case"permiso especial".toUpperCase():h="#e74c3c";break;case"Incapacidad".toUpperCase():h="#f0ad4e";break;case"día personal".toUpperCase():h="#5cb85c";break;case"día flotante".toUpperCase():h="#95a5a6"}b.push("undefined"==typeof a[c].nom?{title:g,start:e,end:f,allDay:!0,msg:"<span class='glyphicon glyphicon-ok-circle' style='color: rgb(30, 148, 36);font-size: 18px;'></span></span> ¡La solicitud de la fecha "+e.MDY()+" fue aprobada!",color:h,textColor:"white"}:{title:g+" - "+a[c].nom,start:e,end:f,allDay:!0,msg:"<span class='glyphicon glyphicon-ok-circle' style='color: rgb(30, 148, 36);font-size: 18px;'></span></span> Solicitud aprobada de "+a[c].nom,color:h,textColor:"white"})}d(b)}})}})});