jQuery(document).ready(function($) {
	$('form').on('submit', function(event) {
		if (!/^\s*[a-zA-Z,\s]+\s*$/.test($('#name').val())) {
			$('#span1').css({"opacity" : "1", "color" : "red"});
			$('#name').css({border: "1px solid red"});
			event.preventDefault();
		}
		if (!/^[a-z0-9]+([-._][a-z0-9]+)*@([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,4}$/.test($('#email').val())) {
			$('#span2').css({"opacity" : "1", "color" : "red"});
			$('#email').css({border: "1px solid red"});
			event.preventDefault();
		}
		if (!/^[0]{1}[19]{1}[0-9]{8,9}$/.test( $('#phone').val() ) ) {
			$('#span3').css({"opacity" : "1", "color" : "red"});
			$('#phone').css({border: "1px solid red"});
			event.preventDefault();			
		}

		// $('name').blur(function (event) {
      	
		// 	$('#span1').css({"opacity" : "1", "color" : "red"});
		// 	$('#name').css({border: "1px solid red"});
		// });
	});

	
});