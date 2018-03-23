/**
 * 
 */

(function() {
	'use strict';
	window.addEventListener('load', function() {
		// Fetch all the forms we want to apply custom Bootstrap validation
		// styles to
		var forms = document.getElementsByClassName('needs-validation');
		// Loop over them and prevent submission
		var validation = Array.prototype.filter.call(forms, function(form) {
			form.addEventListener('submit', function(event) {
				if (form.checkValidity() === false) {
					event.preventDefault();
					event.stopPropagation();
				}
				form.classList.add('was-validated');
			}, false);
		});
	}, false);
	
	$('#tracking-add-kid-modal').on(
			'hidden.bs.modal',
			function(e) {
				$('#tracking-add-kid-form')[0].reset();
				$('#tracking-add-kid-form').removeClass( "was-validated" );
			});
	
	$('#tracking-add-kid-modal').on(
			'show.bs.modal',
			function(e) {
				$('#tracking-add-kid-form')[0].reset();
			});

	$("#tracking-add-kid").click(function() {
		$('#tracking-add-kid-modal').modal('toggle');
		$('#weight-row').show();
		$('#height-row').show();
		$('#tracking-add-kid-form\\:tracking-kid-info-modal-savebtn').hide();
		$('#tracking-add-kid-form\\:tracking-kid-info-modal-addbtn').show();
		console.log('modal222');
	});
	
//	$.ajax({
//		  url: "rest/kidservice/kid/1",
//		  context: document.body
//		}).done(function(data) {
//		  console.log(data.name);
//		});

	$('.gavatar').click(function(){
		console.log($(this).attr('id'));
		$.ajax({
			  url: "rest/kidservice/kid/" + $(this).attr('id'),
			  context: document.body
			}).done(function(data) {
				console.log(data.name);
				$('#tracking-kid-info-id').val(data.id);
				$('#tracking-kid-info-name').val(data.name);
				$('#tracking-kid-info-dob').val(data.dob);
				$('#tracking-kid-info-gender').val(data.gender);
			});
	});
	
	$("#tracking-kid-info-edit").click(function() {
		$('#tracking-add-kid-modal').modal('toggle');
		$('#tracking-add-kid-form\\:input-name').val($('#tracking-kid-info-name').val());
		var parts = $('#tracking-kid-info-dob').val().split('/');
		$('#tracking-add-kid-form\\:input-dob').val(parts[2]+"-"+parts[1]+"-"+parts[0]);
		$('#tracking-add-kid-form\\:input-gender').val($('#tracking-kid-info-gender').val());
		$('#weight-row').hide();
		$('#height-row').hide();
		$('#tracking-add-kid-form\\:tracking-kid-info-modal-addbtn').hide();
		$('#tracking-add-kid-form\\:tracking-kid-info-modal-savebtn').show();
		
	});
	
})();


