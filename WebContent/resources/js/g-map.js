var selectSport;
var selectSuburb;
var map;
var autocomplete;
var searchInput = document.getElementById('pac-card');

var sportFacilitiesList = [];
var sportFacilitiesMarker = [];

var infowindow;

var selectData = [];

$(document).ready(function() {
	
	jQuery.ajax({
		url : "rest/facility/all/suburb",
		dataType : 'json',
		success : function(response) {
			$('#selectedMultiple').empty();
			for (var i = 0; i < response.length; i++) {
				selectData = response;
				$('#suburbSelect').append('<option value="'+selectData[i].suburbName+'_'+selectData[i].postCode+'">'+selectData[i].suburbName+', ' + selectData[i].postCode + '</option>');
			}
			
			selectSuburb = new SlimSelect({
				select : '#suburbSelect'
			});
		}
	});
	
	selectSport = new SlimSelect({
		select : '#selectedMultiple',
		placeholder: 'Please select the suburb before using this function'
	});
	
	selectSport.disable();
	
	$('#suburbSelect').change(function(){
		jQuery.ajax({
			url : "https://maps.googleapis.com/maps/api/geocode/json?&address=" + selectSuburb.selected()+'&key=AIzaSyA4h0hNg9UtSxtO6cLXzTNB4dI-MihXpsA',
			dataType : 'json',
			success : function(response) {
				if(response.status == "OK"){
					console.log(response.results[0].geometry.location);
					
					var place = response.results[0];

					sportFacilitiesList = [];

					// clear marker before loading new suburb
					clearMarker();
					sportFacilitiesMarker = [];

					// close info window before loading new suburb
					if (infowindow) {
						infowindow.close();
					}

					var suburb;
					var postCode;
					
					for (var i = 0; i < place.address_components.length; i++) {
						if(place.address_components[i].types[0] == "postal_code"){
							postCode = place.address_components[i].long_name;
						}else if(place.address_components[i].types[0] == "locality"){
							suburb = place.address_components[i].long_name;
						}
					}
					
					loadingSportFacilities(suburb, postCode);

					if (!place.geometry) {
						// User entered the name of a Place that was not suggested and
						// pressed the Enter key, or the Place Details request failed.
						window
								.alert("No details available for input: '" + place.name
										+ "'");
						return;
					}

					// If the place has a geometry, then present it on a map.
						map.setCenter(place.geometry.location);
						map.setZoom(13); // Why 17? Because it looks good.
				}
			}
		});
	});
	
	$('#selectedMultiple').change(function(){
		//reflect marker on the map based on selection
		if($('#selectedMultiple :selected').length != 0){
			loadingMarkerToMap(selectSport.selected());
		}else{
			loadingMarkerToMap(null);
		}
		
		//disabled all option when there are 3 selected
		if($('#selectedMultiple :selected').length == 3){
			$('#selectedMultiple option').not(':selected').each(function(){
				$(this).attr( "disabled",'disabled' );
			});
			selectSport = new SlimSelect({
				select : '#selectedMultiple',
				placeholder: 'Please select upto 3 sports to view on the map'
			});
		}else if($('#selectedMultiple :selected').length < 3){
			$('#selectedMultiple option').not(':selected').each(function(){
				$(this).removeAttr( "disabled");
			});
			selectSport = new SlimSelect({
				select : '#selectedMultiple',
				placeholder: 'Please select upto 3 sports to view on the map'
			});
		}
	});
	
});

function initMap() {
	infowindow = new google.maps.InfoWindow({
		content : ''
	})

	map = new google.maps.Map(document.getElementById('map'), {
		center : {
			lat : -37.814,
			lng : 144.963
		},
		mapTypeControl : false,
		zoom : 12
	});

	var options = {
		types : [ '(cities)' ],
		componentRestrictions : {
			country : 'au'
		}
	};

	map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInput);
}

function loadingSportFacilities(suburb, postCode) {
	// $.ajax(
	// {
	// url : "rest/facility/all/sport_facilities/" + postCode + "/" + suburb
	// }).done(function(data) {
	// sportFacilitiesList = data;
	// });

	jQuery.ajax({
		url : "rest/facility/all/sport_facilities/" + postCode + "/" + suburb,
		dataType : 'json',
		success : function(response) {
			sportFacilitiesList = response;

			loadingMarkerToMap(null);
		}
	});
	
	// prepare data for dropdown selection
	jQuery.ajax({
		url : "rest/facility/all/sport_type/" + postCode + "/" + suburb,
		dataType : 'json',
		success : function(response) {
			$('#selectedMultiple').empty();
			for (var i = 0; i < response.length; i++) {
				selectData = response;
				$('#selectedMultiple').append('<option value="'+selectData[i]+'">'+selectData[i]+'</option>');
			}
		}
	});

	selectSport = new SlimSelect({
		select : '#selectedMultiple',
		placeholder: 'Please select upto 3 sports to view on the map'
	});
	selectSport.enable();
	
}

function refreshSelectList(){
	for (var i = 0; i < selectData.length; i++) {
		
	}
}

function loadingMarkerToMap(sportList) {

	clearMarker();
	
	sportFacilitiesMarker = [];

	for (var i = 0; i < sportFacilitiesList.length; i++) {

		var willAddToMap = true;
		
		if(sportList){
			
			console.log(sportList)
			
			willAddToMap = false;
			
			for (var j = 0; j < sportList.length; j++) {
				if(sportFacilitiesList[i].sportListAndType.includes(sportList[j])){
					willAddToMap = true;
					break;
				}
			}
		}
		
		if(willAddToMap){
			var marker = new google.maps.Marker({
				map : map,
				position : {
					lat : sportFacilitiesList[i].latitude,
					lng : sportFacilitiesList[i].longitude
				}
			});

			// google.maps.event.addListener(marker, 'click', function() {
			// infowindow.setContent('<div><strong>' + sportFacilitiesList[i].name +
			// '</strong></div>');
			// infowindow.open(map, this);
			// });

			bindInfoWindow(marker, map, infowindow, '<div><b>'
					+ sportFacilitiesList[i].name + "</b><br>"
					+ sportFacilitiesList[i].address
					+ "<br>This facility contains "
					+ sportFacilitiesList[i].sportListAndType + "<div");

			sportFacilitiesMarker.push(marker);
		}
	}
}

function clearMarker() {
	for (var i = 0; i < sportFacilitiesMarker.length; i++) {
		sportFacilitiesMarker[i].setMap(null);
	}
}

var bindInfoWindow = function(marker, map, infowindow, html) {
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(html);
		infowindow.open(map, marker);
	});
}

function loadingSportDropDownList() {

}