/**
 * 
 */
function toDate(selector) {
	var from = $(selector).val().split("-");
	return new Date(from[0], from[1] - 1, from[2]);
}

function numberofDate(month, birthYear) {
	console.log('a ', month, birthYear);

	if (month == 1 | month == 3 | month == 5 | month == 7 | month == 8
			| month == 10 | month == 12) {
		return 31;
	} else if (month == 2 | month == 4 | month == 6 | month == 9 | month == 11) {
		return 30;
	} else {
		if ((birthYear % 4 == 0 && birthYear % 100 == 0)
				|| birthYear % 400 == 0)
			return 29;
		else
			return 28;
	}
}

$(function() {
	
	$("hidden-summary").fadeOut('slow');
	
	$("#learn-more").click(function(){
		
		$("#iFrame").attr("src", "https://yke13.shinyapps.io/bmi_chart_v2/");
		
		$('html,body').animate({
	        scrollTop: $("#bottom-iframe").offset().top},
	        'slow');
	});
	
	$('#input-check').click(
			function() {
				var month = []

				var currentDate = new Date($.now());
				var dob = toDate('#input-dob');

				var y = currentDate.getFullYear() - dob.getFullYear();
				var m = currentDate.getMonth() - dob.getMonth();
				var d = currentDate.getDate() - dob.getDate();
				var age_month = (y * 12 + m);
				console.log(age_month);
				if (d > 0) {
					var diff = numberofDate(dob.getMonth() + 1, dob
							.getFullYear());
					console.log(diff);
					age_month = age_month
							+ d
							/ numberofDate(dob.getMonth() + 1, dob
									.getFullYear());
				} else if (d < 0) {
					age_month = age_month
							- (dob.getDate() - currentDate.getDate())
							/ numberofDate(dob.getMonth(), dob.getFullYear());
				}

				$.ajax(
						{
							url : "rest/bmiservice/check/" + age_month.toFixed(1) + "/"
									+ $('#input-weight').val() + "/" + $('#input-height').val() + "/"
									+ $('#input-gender').val(),
							context : document.body
						}).done(function(data) {
					console.log('status', data);
					var text = "Your child is currently " + (parseInt(age_month / 12)) + " years and " + (parseInt(age_month - parseInt(age_month / 12) * 12)) + " months olds.\nFor a child this age, height and gender, ";
					
					if($('#input-gender').val() == 0)
						text = text + "He";
					else
						text = text + "She";
						
					if (data === 3 ) {
						text = text + " might be a little overweight.";
					}
					else if (data === 2) {
						text = text + " is at a normal weight.";
					}
					else if (data === 1) {
						text = text + " might be a little underweight.";
					}else if (data === 1){
						text = "Sorry. We are not enough data to calculate your kid yet."
					}
					
					$('#quote-text').text(text);
					$("#hidden-summary").fadeTo(1000,1);

				});
			});
	
});