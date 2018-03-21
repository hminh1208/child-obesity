/**
 * 
 */

var targetData = new Date("Mar 24, 2018 00:00:00").getTime();

var x = setInterval(function() {

	// Get todays date and time
	var now = new Date().getTime();

	// Find the distance between now an the count down date
	var distance = targetData - now;

	// Time calculations for days, hours, minutes and seconds
	var days = Math.floor(distance / (1000 * 60 * 60 * 24));
	var hours = Math.floor((distance % (1000 * 60 * 60 * 24))
			/ (1000 * 60 * 60));
	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((distance % (1000 * 60)) / 1000);

	// Display the result in the element with id="demo"
	$('#days').text(days);
	$('#hours').text(hours);
	$('#minutes').text(minutes);
	$('#seconds').text(seconds);

	// If the count down is finished, write some text
	if (distance < 0) {
		clearInterval(x);
	}
	
}, 1000);


