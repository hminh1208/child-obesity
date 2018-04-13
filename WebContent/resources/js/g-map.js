var select;
var map;
var autocomplete;
var searchInput = document.getElementById('pac-input');

var sportFacilitiesList = [];
var sportFacilitiesMarker = [];

var infowindow;

var selectData = [];

$(document).ready(function() {
	select = new SlimSelect({
		select : '#selectedMultiple'
	});
	
	$('#selectedMultiple').change(function(){
		//reflect marker on the map based on selection
		if($('#selectedMultiple :selected').length != 0){
			loadingMarkerToMap(select.selected());
		}else{
			loadingMarkerToMap(null);
		}
		
		//disabled all option when there are 3 selected
		if($('#selectedMultiple :selected').length == 3){
			$('#selectedMultiple option').not(':selected').each(function(){
				$(this).attr( "disabled",'disabled' );
			});
			select = new SlimSelect({
				select : '#selectedMultiple'
			});
		}else if($('#selectedMultiple :selected').length < 3){
			$('#selectedMultiple option').not(':selected').each(function(){
				$(this).removeAttr( "disabled");
			});
			select = new SlimSelect({
				select : '#selectedMultiple'
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

	autocomplete = new google.maps.places.Autocomplete(searchInput, options);

	map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInput);

	autocomplete.addListener('place_changed', function() {
		var place = autocomplete.getPlace();

		sportFacilitiesList = [];

		// clear marker before loading new suburb
		clearMarker();
		sportFacilitiesMarker = [];

		// close info window before loading new suburb
		if (infowindow) {
			infowindow.close();
		}

		loadingSportFacilities(place.address_components[0].long_name,
				place.address_components[4].long_name);

		if (!place.geometry) {
			// User entered the name of a Place that was not suggested and
			// pressed the Enter key, or the Place Details request failed.
			window
					.alert("No details available for input: '" + place.name
							+ "'");
			return;
		}

		// If the place has a geometry, then present it on a map.
		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(17); // Why 17? Because it looks good.
		}

	});
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