// sanservices_absence - Last Update: Friday, December 19th, 2014, 1:37:27 PM CST
require(["/assets/js/app.js"],function(){$(document).ready(function(){var a=new Date,b=a.getFullYear();$("#full-year").multiDatesPicker({numberOfMonths:[3,4],defaultDate:"1/1/"+b,maxDate:new Date(a.getFullYear(),11,31),minDate:new Date(a.getFullYear(),0,1)}),$.ajax({url:"/mant_feriados",type:"POST",data:{accion:"cargar"},success:function(a){if("string"==typeof a)return $.ajax(this);var b=a[0].fec.split(",");$("#full-year").multiDatesPicker("addDates",b)}}),$("#guardar").click(function(){var a={id:b,fec:$("#full-year").multiDatesPicker("getDates")};$.ajax({url:"/mant_feriados",type:"POST",data:a,success:function(a){if("string"==typeof a)return $.ajax(this);var b="danger",c="Error al guardar!";a.affectedRows&&(b="success",c="Se ha guardado correctamente!");var d='<div class="alert alert-'+b+' alert-dismissible" role="alert"> 										<button type="button" class="close" data-dismiss="alert"> 											<span aria-hidden="true">&times;</span><span class="sr-only">Close</span> 										</button> 										<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> 										</strong>'+c+"</strong>";$(".container-fluid").prepend(d),$("#confirmGuardar").modal("hide")}})}),$("#confirm").click(function(){$("#confirmGuardar").modal("show")})})});