var selectSport;
var selectSuburb;
var map;
var table;
var searchInput = document.getElementById('pac-card');
var autocomplete;
var autocompleteInput= document.getElementById('pac-input');

var sportFacilitiesList = [];
var sportFacilitiesMarker = [];

var infowindow;

var selectData = [];
var currentLocation;


$(document).ready(function() {
	
	table = $('#sport-table').DataTable({
		"bLengthChange": false,
		"bFilter": false
	});
	
	$('#sport-table tbody').on( 'click', 'tr', function () {
		var index = table.row( this ).index();
		
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            
            google.maps.event.trigger(sportFacilitiesMarker[index], 'click');
        }
    } );
	
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
	
	
	
	/*
	 * Detect location button has been disabled due to SSL certificate issues
	 */
//	$('#current-location').click(function(){
//		var $this = $(this);
//	    var loadingText = '<i class="fa fa-spinner fa-spin"></i>';
//	    if ($(this).html() !== loadingText) {
//	      $this.data('original-text', $(this).html());
//	      $this.html(loadingText);
//	    }
//	      
//		 if (navigator.geolocation) {
//		        navigator.geolocation.getCurrentPosition(function(position) {
//		          var pos = {
//		            lat: position.coords.latitude,
//		            lng: position.coords.longitude
//		          };
//		          
//		          currentLocation = pos;
//		          
//		          $this.html($this.data('original-text'));
//		          
//			  		var image = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
//				     var currentLocationMarker = new google.maps.Marker({
//				       position: {lat: position.coords.latitude, lng: position.coords.longitude},
//				       map: map,
//				       icon: image
//				     });
//				     bindInfoWindow(currentLocationMarker, map, infowindow, "You are here", -1);
//				     
//				 	jQuery.ajax({
//						url : "https://maps.googleapis.com/maps/api/geocode/json?latlng="+position.coords.latitude+","+position.coords.longitude+"&key=AIzaSyA4h0hNg9UtSxtO6cLXzTNB4dI-MihXpsA",
//						dataType : 'json',
//						success : function(response) {
//							var suburb;
//							var postCode;
//							for (var i = 0; i < response.results[0].address_components.length; i++) {
//								if(response.results[0].address_components[i].types[0] == "postal_code"){
//									postCode = response.results[0].address_components[i].long_name;
//								}else if(response.results[0].address_components[i].types[0] == "locality"){
//									suburb = response.results[0].address_components[i].long_name;
//								}
//								
//								selectSuburb.set((suburb + "_" + postCode).toUpperCase());
//							}
//						}
//					});
//		          
//		        }, function() {
//		          handleLocationError(true, infoWindow, map.getCenter());
//		        });
//		      } else {
//		        // Browser doesn't support Geolocation
//		        handleLocationError(false, infoWindow, map.getCenter());
//		      }
//		 
//	});
	
});

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }

function initMap() {
	infowindow = new google.maps.InfoWindow({
		content : ''
	});

	map = new google.maps.Map(document.getElementById('map'), {
		center : {
			lat : -37.814,
			lng : 144.963
		},
		mapTypeControl : false,
		zoom : 12
	});

	var options = {
		
		componentRestrictions : {
			country : 'au'
		}
	};
	
	autocomplete = new google.maps.places.Autocomplete(autocompleteInput, options);
	autocomplete.addListener('place_changed', onPlaceChanged);

	map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInput);
}

function onPlaceChanged() {
	var place = autocomplete.getPlace();
    if (place.geometry) {
      map.panTo(place.geometry.location);
      map.setZoom(15);
      
     console.log(place.geometry.location.lat(),place.geometry.location.lng());
      
     currentLocation = place.geometry.location
     
     var image = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
     var currentLocationMarker = new google.maps.Marker({
       position: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()},
       map: map,
       icon: image
     });
     bindInfoWindow(currentLocationMarker, map, infowindow, "You are here", -1);
	     
	 	jQuery.ajax({
			url : "https://maps.googleapis.com/maps/api/geocode/json?latlng="+place.geometry.location.lat()+","+place.geometry.location.lng()+"&key=AIzaSyA4h0hNg9UtSxtO6cLXzTNB4dI-MihXpsA",
			dataType : 'json',
			success : function(response) {
				var suburb;
				var postCode;
				for (var i = 0; i < response.results[0].address_components.length; i++) {
					if(response.results[0].address_components[i].types[0] == "postal_code"){
						postCode = response.results[0].address_components[i].long_name;
					}else if(response.results[0].address_components[i].types[0] == "locality"){
						suburb = response.results[0].address_components[i].long_name;
					}
					
					selectSuburb.set((suburb + "_" + postCode).toUpperCase());
				}
			}
		});
      
    } else {
      document.getElementById('autocomplete').placeholder = 'Enter a city';
    }
}

function loadingSportFacilities(suburb, postCode) {
	// $.ajax(
	// {
	// url : "rest/facility/all/sport_facilities/" + postCode + "/" + suburb
	// }).done(function(data) {
	// sportFacilitiesList = data;
	// });
	
	jQuery.ajax({
		url : "rest/facility/all/sport_facilities/" + postCode + "/" + suburb + "/" + currentLocation.lat() + "/" + currentLocation.lng(),
		dataType : 'json',
		success : function(response) {
			sportFacilitiesList = response;
			
//			updateTableSportFacility();
			
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
	
	//List of Marker will be added to the map
	sportFacilitiesMarker = [];
	
	//List of Facility will be in the Table
	var sportInTable = [];
	var realIndex = 0;

	for (var i = 0; i < sportFacilitiesList.length; i++) {

		var willAddToMap = true;
		
		// if no sprt specified, displays alls facilities
		if(sportList){
			willAddToMap = false;
			
			for (var j = 0; j < sportList.length; j++) {
				if(sportFacilitiesList[i].sportListAndType.indexOf(sportList[j]) != -1){
					willAddToMap = true;
					sportInTable.push(sportFacilitiesList[i]);
					break;
				}
			}
		}else{
			sportInTable = sportFacilitiesList;
		}
		
		if(willAddToMap){
			var marker = new google.maps.Marker({
				map : map,
				position : {
					lat : sportFacilitiesList[i].latitude,
					lng : sportFacilitiesList[i].longitude
				}
			});

			bindInfoWindow(marker, map, infowindow, '<div><b>'
					+ sportFacilitiesList[i].name + "</b><br>"
					+ sportFacilitiesList[i].address
					+ "<br>This facility contains "
					+ sportFacilitiesList[i].sportListAndType + "<div", realIndex);
			realIndex = realIndex + 1;
			sportFacilitiesMarker.push(marker);
		}
	}
	
	//update Table Facilities
	updateTable(sportInTable);
	
}

function updateTable(sportInTable){
	table.destroy();
	table = $('#sport-table').DataTable({
        "data": sportInTable,
        "bLengthChange": false,
        "bFilter": false,
        "columns": [
            { "data": "name" },
            { "data": "address" },
            { "data": "sportListAndType" },
            { "data": "distance" }
        ]
    });
}

function clearMarker() {
	for (var i = 0; i < sportFacilitiesMarker.length; i++) {
		sportFacilitiesMarker[i].setMap(null);
	}
}

var bindInfoWindow = function(marker, map, infowindow, html, index) {
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(html);
		infowindow.open(map, marker);
		map.setCenter(marker.getPosition()); 
		if(index != -1){
			table.rows().deselect();
			table.row(index).select();
		}
	});
}

function loadingSportDropDownList() {

}