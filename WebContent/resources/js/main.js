	$.validator.addMethod("australianDate", function(value, element) {
		console.log(value);
		if(value.match(/^\d\d\d\d-\d\d?-\d\d?$/) || value.match(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)){
			return true;
		}
		return value.match(/^\d\d\d\d-\d\d?-\d\d?$/);
	}, "Please enter a date in the format dd/mm/yyyy.");

	$.validator.addMethod("rangeDate", function(value, element) {	
	if(value.match(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/)){
		var parts = value.split(/\/|-|\./);
		value = parts[2]+"-"+parts[1]+"-"+parts[0];
	}
	
	var dob = new Date(value);
	var now = new Date();
	var yearDOB = dob.getFullYear();
	var monthDOB = dob.getMonth();
	var dayDOB = dob.getDate();
	var yearNOW = now.getFullYear();
	var monthNOW = now.getMonth();
	var dayNOW = now.getDate();
	
	if(yearNOW - yearDOB < 20 && yearNOW - yearDOB > 2)
		return true;
	else if((yearNOW - yearDOB) == 20){
		if (monthNOW - monthDOB < 0) {
			return true;
		}else if (monthNOW - monthDOB == 0) {
			if (dayNOW - dayDOB <= 0) {
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
	else if((yearNOW - yearDOB) == 2){
		if (monthNOW - monthDOB > 0) {
			return true;
		}else if (monthNOW - monthDOB == 0) {
			if (dayNOW - dayDOB >= 0) {
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
	else{
		return false;
	}
		
	
	return true;
}, "We only support child range between 2 and 20.");

(function($) {

	"use strict";
	$(".carousel-inner .item:first-child").addClass("active");
	/*
	 * Mobile menu click then remove ==========================
	 */
	$(".mainmenu-area #mainmenu li a").on("click", function() {
		$(".navbar-collapse").removeClass("in");
	});
	/*
	 * WoW js Active =================
	 */
	new WOW().init({
		mobile : true,
	});
	/*
	 * Scroll to top ===================
	 */
	$.scrollUp({
		scrollText : '<i class="fa fa-angle-up"></i>',
		easingType : 'linear',
		scrollSpeed : 900,
		animation : 'fade'
	});
	/*
	 * testimonials Slider Active =============================
	 */
	$('.testimonials').owlCarousel(
			{
				loop : true,
				margin : 0,
				responsiveClass : true,
				nav : true,
				autoplay : true,
				autoplayTimeout : 4000,
				smartSpeed : 1000,
				navText : [ '<i class="ti-arrow-left"></i>',
						'<i class="ti-arrow-right" ></i>' ],
				items : 1
			});
	/*
	 * testimonials Slider Active =============================
	 */
	$('.screen-slider').owlCarousel(
			{
				loop : true,
				margin : 0,
				responsiveClass : true,
				nav : true,
				autoplay : true,
				autoplayTimeout : 4000,
				smartSpeed : 1000,
				navText : [ '<i class="ti-arrow-left"></i>',
						'<i class="ti-arrow-right" ></i>' ],
				items : 1,
				animateIn : 'fadeIn',
				animateOut : 'fadeOut',
				center : true,
			});
	/*
	 * testimonials Slider Active =============================
	 */
	$('.clients').owlCarousel(
			{
				loop : true,
				margin : 30,
				responsiveClass : true,
				nav : true,
				autoplay : true,
				autoplayTimeout : 4000,
				smartSpeed : 1000,
				navText : [ '<i class="ti-arrow-left"></i>',
						'<i class="ti-arrow-right" ></i>' ],
				responsive : {
					0 : {
						items : 3,
					},
					600 : {
						items : 4
					},
					1000 : {
						items : 6
					}
				}
			});
	/*--------------------
	   MAGNIFIC POPUP JS
	   ----------------------*/
	var magnifPopup = function() {
		$('.work-popup').magnificPopup(
				{
					type : 'image',
					removalDelay : 300,
					mainClass : 'mfp-with-zoom',
					gallery : {
						enabled : true
					},
					zoom : {
						enabled : true, // By default it's false, so don't
						// forget to enable it

						duration : 300, // duration of the effect, in
						// milliseconds
						easing : 'ease-in-out', // CSS transition easing
						// function

						// The "opener" function should return the element from
						// which popup will be zoomed in
						// and to which popup will be scaled down
						// By defailt it looks for an image tag:
						opener : function(openerElement) {
							// openerElement is the element on which popup was
							// initialized, in this case its <a> tag
							// you don't need to add "opener" option if this
							// code matches your needs, it's defailt one.
							return openerElement.is('img') ? openerElement
									: openerElement.find('img');
						}
					}
				});
	};
	// Call the functions
	magnifPopup();

	// Background Parallax
	$('.header-area').parallax("50%", -0.4);
	$('.price-area').parallax("50%", -0.5);
	$('.testimonial-area').parallax("10%", -0.2);

	$('#accordion .panel-title a').prepend('<span></span>');

	// Function to animate slider captions
	function doAnimations(elems) {
		// Cache the animationend event in a variable
		var animEndEv = 'webkitAnimationEnd animationend';

		elems.each(function() {
			var $this = $(this), $animationType = $this.data('animation');
			$this.addClass($animationType).one(animEndEv, function() {
				$this.removeClass($animationType);
			});
		});
	}

	// Variables on page load
	var $myCarousel = $('.caption-slider'), $firstAnimatingElems = $myCarousel
			.find('.item:first').find("[data-animation ^= 'animated']");

	// Initialize carousel
	$myCarousel.carousel();

	// Animate captions in first slide on page load
	doAnimations($firstAnimatingElems);

	// Pause carousel
	$myCarousel.carousel('pause');

	// Other slides to be animated on carousel slide event
	$myCarousel.on('slide.bs.carousel', function(e) {
		var $animatingElems = $(e.relatedTarget).find(
				"[data-animation ^= 'animated']");
		doAnimations($animatingElems);
	});

	// Select all links with hashes
	$('.mainmenu-area a[href*="#"]')
	// Remove links that don't actually link to anything
	.not('[href="#"]').not('[href="#0"]').click(
			function(event) {
				// On-page links
				if (location.pathname.replace(/^\//, '') == this.pathname
						.replace(/^\//, '')
						&& location.hostname == this.hostname) {
					// Figure out element to scroll to
					var target = $(this.hash);
					target = target.length ? target : $('[name='
							+ this.hash.slice(1) + ']');
					// Does a scroll target exist?
					if (target.length) {
						// Only prevent default if animation is actually gonna
						// happen
						event.preventDefault();
						$('html, body').animate({
							scrollTop : target.offset().top
						}, 1000, function() {
							// Callback after animation
							// Must change focus!
							var $target = $(target);
							$target.focus();
							if ($target.is(":focus")) { // Checking if the
								// target was focused
								return false;
							} else {
								$target.attr('tabindex', '-1'); // Adding
								// tabindex for
								// elements not
								// focusable
								$target.focus(); // Set focus again
							}
							;
						});
					}
				}
			});

	/*
	 * Preloader Js ===================
	 */
	$(window).on("load", function() {
		$('.preloader').fadeOut(500);
	});

})(jQuery);

$(document)
		.ready(
				function() {
					
					$('#feature-page').css('display','none');
					
					$('#summary').css('display','none');

					$("#check-bmi-kid")
							.validate(
									{
										rules : {
											dob : {
												australianDate : true,
												rangeDate: true
												
											},
											weight : {
												required : true,
												range : [ 1, 200 ]
											},
											height : {
												required : true,
												range : [ 1, 200 ]
											},
										},
										messages : {
											
											weight : {
												required : "Current Weight cannot be empty",
												range : "Current weight must between	1.0 and 200.0"
											},
											height : {
												required : "Current Height cannot be empty",
												range : "Current weight must between	1.0 and 200.0"
											}
										},
										errorElement : "em",
										errorPlacement : function(error,
												element) {
											// Add the `help-block` class to the
											// error element
											error.addClass("help-block");

											// Add `has-feedback` class to the
											// parent div.form-group
											// in order to add icons to inputs
											element.parents().addClass(
													"has-feedback");

											if (element.prop("type") === "checkbox") {
												error.insertAfter(element
														.parent("label"));
											} else {
												error.insertAfter(element);
											}

											$(element).addClass("is-invalid")
													.removeClass("is-valid");

										},
										success : function(label, element) {
											// Add the span element, if doesn't
											// exists, and apply the icon
											// classes to it.
											if (!$(element).next("span")[0]) {
												// $( "<span class='glyphicon
												// glyphicon-ok
												// form-control-feedback'></span>"
												// ).insertAfter( $( element )
												// );
											}
										},
										highlight : function(element,
												errorClass, validClass) {
											$(element).parent().addClass(
													"has-error").removeClass(
													"has-success");
											$(element).addClass("is-invalid")
													.removeClass("is-valid");
										},
										unhighlight : function(element,
												errorClass, validClass) {
											$(element).parent().addClass(
													"has-success").removeClass(
													"has-error");
											$(element).addClass("is-valid")
													.removeClass("is-invalid");
										}
									});

					$('#input-check')
							.click(
									function() {
										if ($('#check-bmi-kid').valid()) {
											
											var weight = $('#input-weight').val();
											var height = $('#input-height').val();
											
											console.log(weight,height);
											
											var bmi = weight / height / height * 10000;
											if(bmi < 13.21253 || bmi > 35.10556){
												$("#check-bmi-kid").validate().showErrors({
									                "weight": "BMI result is invalid, please check Weight and Height.",
									                "height": "BMI result is invalid, please check Weight and Height."
									            });
												console.log('invalid bmi');
									            return false;
											}
											
											// create dob
											var from = $("#input-dob").val()
													.split("/");
											var dob = new Date(from[2] + "/"
													+ from[1] + "/" + from[0]);
											var now = new Date();

											var weeks = Math
													.round((now - dob) / 604800000);
											var weight = $('#input-weight')
													.val();
											var height = $('#input-height')
													.val();
											var gender = $('#input-gender')
													.val();
											var bmi = weight / height / height * 10000;

											$('#feature-page').css('display','block');
											$('#summary').css('display','block');
											
											$("#iFrame").attr(
													"src",
													"https://yke13.shinyapps.io/bmi_chart_v3/?age_weeks="
															+ weeks
															+ "&gender="
															+ gender
															+ "&bmi="+bmi.toFixed(2)+"&height="
															+ height
															+ "&weight="
															+ weight);
											
											$('html, body').animate({
										        scrollTop: $("#feature-page").offset().top
										    }, 2000);
											
											$('li').removeClass('active');
											$('#summary').addClass('active');
											
										}

									});
					
					$('#input-weight').focusin(function(){
						$("#check-bmi-kid").validate().resetForm();
					});
					
					$('#input-height').focusin(function(){
						$("#check-bmi-kid").validate().resetForm();
					});

					$('li').click(function(){
						$('li').removeClass('active');
						$(this).addClass('active');
					})
					
				});
