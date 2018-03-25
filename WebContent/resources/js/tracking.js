/**
 * 
 */


var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

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
	$('#tracking-kid-info-add-bmi').prop('disabled', true);

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

	// Init DataTable
	var table = $('#tracking-bmi-historical-table').DataTable( {
		"language": {
			"zeroRecords": "There are no BMI record. Try to add 1"
	    }});
	
	// Init Chart
	var ctx = document.getElementById("myChart").getContext('2d');
	var myChart = new Chart(ctx, {
		  type: 'line',
		  data: {
		    labels: [],
		    datasets: [{ 
		        data: [],
		        label: "BMI progress",
		        borderColor: "#3e95cd",
		        fill: false
		      }]
		  },
		  options: {
		    title: {
		      display: true,
		      text: 'BMI progress chart'
		    }
		  }
		});
	
	$('.gavatar').click(function() {
		console.log($(this).attr('id'));
		var id = $(this).attr('id');
		
		// Set up for Add BMI record
		$('#tracking-add-bmi-form\\:input-add-bmi-kid-id').val(id);
		
		var oldSelect = $(this).parent().find('.selected');
		oldSelect.removeClass('selected');
		oldSelect.addClass('default');
		$(this).removeClass('default');
		$(this).addClass('selected');
		
		
		
		if (id == 'tracking-add-kid' || id == 'tracking-add-all') {
			return;
		}
		
		if(table != null)
			table.destroy();
		
		// AJAX call for kid historical table
		table = $('#tracking-bmi-historical-table').DataTable( {
			"bRetrieve" : true,
			"language": {
				"zeroRecords": "There are no BMI record. Try to add 1"
		    },
	        "ajax": {
	            "url": "rest/bmiservice/bmis/"+ id,
	            "cache": "true",
	            "dataSrc": ""
	          },
	        "columns": [
	        	 { "data": "weight" },
	        	 { "data": "height" },
	        	 { "data": "inputDate" }
	        ]
	    });
		
		// AJAX call for kid info
		$.ajax({
			url : "rest/kidservice/kid/" + $(this).attr('id'),
			context : document.body
		}).done(function(data) {
			console.log(data.name);
			$('#tracking-kid-info-id').val(data.id);
			$('#tracking-kid-info-name').val(data.name);
			$('#progress-title').text(data.name+"'s Progress");
			$('#tracking-kid-info-dob').val(data.dob);
			$('#tracking-kid-info-gender').val(data.gender);
			$('#tracking-kid-info-edit').prop('disabled', false);
			$('#tracking-kid-info-delete').prop('disabled', false);
			$('#tracking-kid-info-add-bmi').prop('disabled', false);
		});
		
		// AJAX call for chart data
		$.ajax({
			url : "rest/bmiservice/bmis/"+ id,
			context : document.body
		}).done(function(data) {
			
			var labels = [];
			var dataLine = [];
			
			labels.push(0);
			dataLine.push(0);
			
			$.each(data, function(index) {
				var date = data[index].inputDate;
	            labels.push(date.substring(0,6)+date.substring(8,10));
				dataLine.push(data[index].weight / data[index].height /data[index].height * 10000);
	        });
			
			var ctx = document.getElementById("myChart").getContext('2d');
			var myChart = new Chart(ctx, {	
				  type: 'line',
				  data: {
				    labels: labels,
				    datasets: [{ 
				        data: dataLine,
				        label: "BMI progress",
				        borderColor: "#3e95cd",
				        fill: false,
				        borderWidth: 0,
				        backgroundColor: '#3e95cd'
				      }
				    ]
				  },
				  options: {
				    title: {
				      display: true,
				      text: 'BMI progress chart'
				    },
				    legend: {
			            display: true,
			            fillStyle: '#3e95cd',
			        }
				  }
				});
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

	//
	$("#tracking-kid-info-add-bmi").click(function() {
		$('#tracking-add-bmi-modal').modal('toggle');
	});
	
	$("#iFrame").attr("src", "https://yke13.shinyapps.io/bmi_chart_v2/");

	var kidId = getUrlParameter('id');
	if (kidId != null) {
		$('#'+kidId).click();
	}else{
		$('#tracking-kid-info-name').val("");
		$('#tracking-kid-info-dob').val("");
		$('#tracking-kid-info-gender').val(2);
	}
	
	$('#tracking-add-bmi-form\\:input-add-bmi-input-date').prop('max', function(){
        return new Date().toJSON().split('T')[0];
    });
	
	$('#tracking-add-bmi-form\\:input-add-bmi-input-date').val(new Date().toDateInputValue());
	
})();

