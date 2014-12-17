require(['/assets/js/libs/jquery.js','/assets/js/libs/superslides.js','/assets/js/libs/sha512.js',,'/assets/js/libs/bootstrap.js'],function(){
	
	mifuncion();
	
	$(".login").submit(function( event ) {
		this["password"].value = hex_sha512(this["password"].value);
	});


	$(document).ready(function(){
		
		$(document).on('init.slides', function() {
			$('.loading-container').fadeOut(function() {
				$(this).remove();
			});
		});
		// var h = $('<div></div>');
		// h.height($(window).height() - 98);
		// h.width($(window).width());

		// $(window).on('resize',function(){
		// 	h.height($(window).height() - 98);
		// 	h.width($(window).width());
		// });
		// console.log($(h).height());
			setTimeout(function(){
			$('#slides').superslides({
				hashchange: false,
				play: 4000,
				scrollable: false,
				pagination: false,
				animation: 'fade'
				// inherit_height_from : h,
				// inherit_width_from : h
			});
		}, 50);

			$('#slides').on('mouseenter', function() {
				$(this).superslides('stop');
				// console.log('Stopped')
			});
			$('#slides').on('mouseleave', function() {
				setTimeout(function(){
					$('#slides').superslides('start');
				}, 4000);
				// console.log('Started')
			});

		

	});


	// $(document).ready(function() {
	// 	$(document).on('init.slides', function() {
	// 		$('.loading-container').fadeOut(function() {
	// 			$(this).remove();
	// 		});
	// 	});

	// 	$('#slides').superslides({
	// 		slide_easing: 'easeInOutCubic',
	// 		slide_speed: 800,
	// 		pagination: true,
	// 		hashchange: true,
	// 		scrollable: true
	// 	});

	// });


});




var mifuncion = function(){
	console.log('Index');
}

