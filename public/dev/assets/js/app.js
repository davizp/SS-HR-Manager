/*
// RequireJS Setup
// Date: August 2014
// Description:
// 	This is the first JS file that's loaded.
// 	Takes care of the require.config which has
// 	the js paths and at the end calls the common module
// -----------------------------------------------------
*/

// Rule of thumb:
// 	Define: If you want to declare a module other parts of your application will depend on.
// 	Require: If you just want to load and use stuff.

require.config({
	baseUrl: '/assets/js/',
	paths: {
		// The Libraries we use
		jquery: [
			// '//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
			'libs/jquery'
		],
		jqueryui: [
			'libs/jquery-ui'
		],
		multidatespicker: [
			'libs/multidatespicker'
		],
		jquery_base64: [
			'libs/base64'
		],
		// tableExport: [
		// 	'libs/tableExport'
		// ],
		sha512: [
			'libs/sha512'
		],
		jquery_dataTables:[
			'libs/dataTables'
		],
		xls:[
			'libs/xls'
		],
		xlsx:[
			'libs/xlsx'
		],
		jszip:[
			'libs/jszip'
		],
		superslides:[
			'libs/superslides'
		],
		fullcalendar:[
			'libs/fullcalendar'
		],
		iconpicker:[
			'libs/iconpicker'
		],
		tokenize:[
			'libs/tokenize'
		],
		wysiwyg:[
			'libs/wysiwyg'
		],
		// Bootstrap
		bootstrap: 'libs/bootstrap',

		// Modules
		common: 	'modules/common'
	},
	waitSeconds: 0,
	shim: {
		jquery_dataTables: 	['jquery'],
		wysiwyg : ['jquery'],
		fullcalendar: 	['jquery'],
		tokenize : ['jquery'],
		bootstrap: 	['jquery'],
		iconpicker: ['jquery','bootstrap'],
		jqueryui: ['jquery'],
		superslides : ['jquery'],
		multidatespicker : ['jquery','jqueryui'],
		// tableExport : ['jquery','jquery_base64'],
		jquery_base64 : ['jquery','jszip'],
		common: 	['jquery','jqueryui','bootstrap','jquery_base64','jquery_dataTables','jszip','xls','xlsx','superslides','multidatespicker','fullcalendar','iconpicker','wysiwyg','tokenize']
	}
});

// Defining global module with jQuery dependency and requiring the common js
define(['common'], function() {});