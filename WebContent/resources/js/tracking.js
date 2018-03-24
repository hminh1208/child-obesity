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

	$('#tracking-kid-info-edit').prop('disabled', true);
	$('#tracking-kid-info-delete').prop('disabled', true);

	$('#tracking-add-kid-modal').on('hidden.bs.modal', function(e) {
		$('#tracking-add-kid-form')[0].reset();
		$('#tracking-add-kid-form').removeClass("was-validated");
	});

	$('#tracking-add-kid-modal').on('show.bs.modal', function(e) {
		$('#tracking-add-kid-form')[0].reset();
	});

	$("#tracking-add-kid").click(function() {
		$('#tracking-add-kid-modal').modal('toggle');
		console.log('modal222');
	});

	// $.ajax({
	// url: "rest/kidservice/kid/1",
	// context: document.body
	// }).done(function(data) {
	// console.log(data.name);
	// });

	$('.gavatar').click(function() {
		console.log($(this).attr('id'));
		$.ajax({
			url : "rest/kidservice/kid/" + $(this).attr('id'),
			context : document.body
		}).done(function(data) {
			console.log(data.name);
			$('#tracking-kid-info-id').val(data.id);
			$('#tracking-kid-info-name').val(data.name);
			$('#tracking-kid-info-dob').val(data.dob);
			$('#tracking-kid-info-gender').val(data.gender);
			$('#tracking-kid-info-edit').prop('disabled', false);
			$('#tracking-kid-info-delete').prop('disabled', false);
		});
	});

	$("#tracking-kid-info-edit").click(
			function() {
				$('#tracking-edit-kid-modal').modal('toggle');
				$('#tracking-edit-kid-form\\:input-id').val(
						$('#tracking-kid-info-id').val());
				$('#tracking-edit-kid-form\\:input-name').val(
						$('#tracking-kid-info-name').val());
				var parts = $('#tracking-kid-info-dob').val().split('/');
				$('#tracking-edit-kid-form\\:input-dob').val(
						parts[2] + "-" + parts[1] + "-" + parts[0]);
				$('#tracking-edit-kid-form\\:input-gender').val(
						$('#tracking-kid-info-gender').val());
			});

	var modalConfirm = function(callback) {

		$("#tracking-kid-info-delete").on("click", function() {
			$("#mi-modal").modal('show');
		});

		$("#modal-btn-si").on("click", function() {
			callback(true);
			$("#mi-modal").modal('hide');
		});

		$("#modal-btn-no").on("click", function() {
			callback(false);
			$("#mi-modal").modal('hide');
		});
	};

	modalConfirm(function(confirm) {
		if (confirm) {
			console.log('yes');
			$.ajax(
					{
						url : "rest/kidservice/delete/"
								+ $('#tracking-kid-info-id').val(),
						context : document.body
					}).done(function(data) {
				alert('Delete successfully');
				window.location.reload();
			});
		} else {
		}
	});

	window.onload = function() {
		$('#tracking-kid-info-name').val("");
		$('#tracking-kid-info-dob').val("");
		$('#tracking-kid-info-gender').val(2);
	}

})();
