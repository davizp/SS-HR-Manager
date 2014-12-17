// Every page that just loads and use stuff(the ones that are not used anywhere else),
// needs to be wrapped with the require(['app.js']) first and then call any other
// script inside.
//
// The require to 'app.js' does not substitute the $(doc).ready()

require(['/'+app.system+'/assets/js/app.js'],function(){
	require([/* Any other file needed */],function(){
		$(document).ready(function(){
			// Code goes here
		});
	});
});