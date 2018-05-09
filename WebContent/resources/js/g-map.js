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

var currentLocationMarker;
var DarkSkyAPIKey = '8eae2674f730a59184acdd74c73660cc';
var sportInTable;
var currentFacilityOption = 'all';

var currentMapType;

$(document).ready(function() {
    
	// Two type of flow explore or suggest
    currentMapType = getUrlParameter('type');
    //EXPLORE MODE - START BY DEFAULT
    if (currentMapType == null || currentMapType == 'explore') {
    	$('#instructionExploreModal').modal('show');
    	currentMapType = 'explore'
    	$('#suburbSelect').css('display','block');
    	
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
    		placeholder: 'Please select your suburb first'
    	});
    	
    	selectSport.disable();
    	
    	
	}
    //SUGGEST MODE - ONLY START FROM CALORIES PAGE
    else if(currentMapType == 'suggest'){
    	$('#instructionSuggestModal').modal('show');
    	$('#suburbSelect').css('display','none');
    	
    	jQuery.ajax({
    		url : "rest/facility/all/sport_type",
    		dataType : 'json',
    		success : function(response) {
    			$('#selectedMultiple').empty();
    			for (var i = 0; i < response.length; i++) {
    				selectData = response;
    				$('#selectedMultiple').append('<option value="'+selectData[i]+'">'+selectData[i]+'</option>');
    			}
    			
    			selectSport = new SlimSelect({
    	    		select : '#selectedMultiple',
    	    		placeholder: 'Please select your favourite sports'
    	    	});
    			
    			selectSport.set(getUrlParameter('sport').split(','))
    		}
    	});
    	
    	
    	
    }
    
    
    //Start Init Facilities Table
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
    });
	//End Init Facilities Table
	
	$('#suburbSelect').change(function(){
		
		var suburbName = selectSuburb.selected();
		
		if(suburbName == "BANGHOLME_3175")
			suburbName = "BANGHOLME";
		
		jQuery.ajax({
			url : "https://maps.googleapis.com/maps/api/geocode/json?&address=" + suburbName+'&key=AIzaSyA4h0hNg9UtSxtO6cLXzTNB4dI-MihXpsA',
			dataType : 'json',
			success : function(response) {
				console.log(response.status);
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
				if(response.status == "ZERO_RESULTS"){
					
				}
			}
		});
	});
	
	$('#selectedMultiple').change(function(){
		if (currentMapType == 'suggest') {
			loadingSportFacilities_suggest();
			return;
		}
		
		//reflect marker on the map based on selection
		if($('#selectedMultiple :selected').length != 0){
			loadingMarkerToMap(selectSport.selected(), currentFacilityOption);
		}else{
			loadingMarkerToMap(null, currentFacilityOption);
		}
		
		//disabled all option when there are 3 selected
		if($('#selectedMultiple :selected').length == 3){
			$('#selectedMultiple option').not(':selected').each(function(){
				$(this).attr( "disabled",'disabled' );
			});
			selectSport = new SlimSelect({
				select : '#selectedMultiple',
				placeholder: 'Filter results by sports'
			});
		}else if($('#selectedMultiple :selected').length < 3){
			$('#selectedMultiple option').not(':selected').each(function(){
				$(this).removeAttr( "disabled");
			});
			selectSport = new SlimSelect({
				select : '#selectedMultiple',
				placeholder: 'Filter results by sports'
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
	      map.setZoom(13);
	      
	      currentLocation = place.geometry.location
	     
	      var image = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
	      if (currentLocationMarker) {
	    	  currentLocationMarker.setMap(null);
	      }
	      currentLocationMarker = new google.maps.Marker({
	    	  position: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()},
	    	  map: map,
	    	  icon: image
	      });
	      bindInfoWindow(currentLocationMarker, map, infowindow, "Your Entered Address Is Here", -1);
		     
	     if (currentMapType == 'explore') {
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
	     }else if (currentMapType == 'suggest'){
	    	 loadingSportFacilities_suggest()
	     }
    } else {
      document.getElementById('autocomplete').placeholder = 'Enter a city';
    }
}

//SUGGEST MODE
function loadingSportFacilities_suggest(){
	var lat = 0;
	var lng = 0;
	
	if (currentLocation) {
		lat = currentLocation.lat();
		lng = currentLocation.lng();
	}
	
	var sport = selectSport.selected();
	console.log('Suggest Mode');
	console.log("rest/facility/all/sport_facilities_suggest/"+sport.toString().replace('/','-')+"/"+lat+"/"+lng);
	
	jQuery.ajax({
		url : "rest/facility/all/sport_facilities_suggest/"+sport.toString().replace('/','-')+"/"+lat+"/"+lng,
		dataType : 'json',
		success : function(response) {
			sportFacilitiesList = response;
			
			loadingMarkerToMap(null, currentFacilityOption);
		}
	});
}

//EXPLORE MODE
function loadingSportFacilities(suburb, postCode) {
	
	var lat = 0;
	var lng = 0;
	
	if (currentLocation) {
		lat = currentLocation.lat();
		lng = currentLocation.lng();
	}
	
	console.log('Explore Mode');
	console.log("rest/facility/all/sport_facilities/" + postCode + "/" + suburb + "/" + lat + "/" + lng);
	
	jQuery.ajax({
		url : "rest/facility/all/sport_facilities/" + postCode + "/" + suburb + "/" + lat + "/" + lng,
		dataType : 'json',
		success : function(response) {
			sportFacilitiesList = response;
			
			loadingMarkerToMap(null, currentFacilityOption);
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
		placeholder: 'Filter results by sports'
	});
	selectSport.enable();
	
}

function refreshSelectList(){
	for (var i = 0; i < selectData.length; i++) {
		
	}
}

function loadingMarkerToMap(sportList, weatherFilter) {

	console.log('loadingMarkerToMap',sportList, weatherFilter);
	
	clearMarker();
	
	//List of Marker will be added to the map
	sportFacilitiesMarker = [];
	
	//List of Facility will be in the Table
	sportInTable = [];
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
			willAddToMap = true;
			sportInTable.push(sportFacilitiesList[i]);
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
	updateTable(sportInTable, weatherFilter);
	
	if (sportInTable.length == 0) {
		$( "#danger-weather-alert" ).fadeIn( "slow");
		setTimeout(function(){
			$( "#danger-weather-alert" ).fadeOut( "slow");
		}, 5000);
	}
	
}

function updateTable(sportInTable, filter){
	
	var tempSportInTable = [];
	
	console.log('updateTable',filter,sportInTable);
	
	if(filter == 'indoor'){
		for (var i = 0; i < sportInTable.length; i++) {
			if (sportInTable[i].sportListAndType.indexOf('indoor') != -1) {
				tempSportInTable.push(sportInTable[i]);
			}
		}
	}else{
		tempSportInTable = sportInTable;
	}
	
	table.destroy();
	if (currentLocation) {
		table = $('#sport-table').DataTable({
	        "data": tempSportInTable,
	        "bLengthChange": false,
	        "bFilter": false,
	        "pageLength": 7,
	        "order": [[ 3, "asc" ]],
	        "columns": [
	        	 { "data": "name", "width": "25%" },
	            { "data": "address", "width": "35%" },
	            { "data": "sportListAndType", "width": "30%" },
	            { "data": "distance", "width": "10%" }
	        ],
			"columnDefs":[{
				"targets": [ 3 ],
                "visible": true
			}]
	    });
	}else{
		table = $('#sport-table').DataTable({
	        "data": tempSportInTable,
	        "bLengthChange": false,
	        "bFilter": false,
	        "pageLength": 7,
	        "columns": [
	            { "data": "name", "width": "25%" },
	            { "data": "address", "width": "35%" },
	            { "data": "sportListAndType", "width": "30%" },
	            { "data": "distance", "width": "10%" }
	        ],
			"columnDefs":[{
				"targets": [ 3 ],
                "visible": false
			}]
	    });
	}
	
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

function onScroll(event){
    var scrollPos = $(document).scrollTop();
    
    $('#primary-menu a').each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
       
        if (refElement.position().top <= scrollPos + 10 && refElement.position().top + refElement.height() > scrollPos - 10 && currLink.parent().css('display') != 'none') {
            $('#primary-menu ul li').removeClass("active");
            currLink.parent().addClass("active");
            console.log(currLink.parent().attr('id'));
//            if (currLink.parent().attr('id') == 'summary') {
//				$('#myBtn').css('display', 'block') ;
//			}else{
//				$('#myBtn').css('display', 'none');
//			}
        }
        else{
            currLink.parent().removeClass("active");
        }
    });
}

function numbertoDay(number){
	if (number >= 7) {
		number = number - 7;
	}
	
	switch(number){
		case 1: return '<p>Monday</p>'
		case 2: return '<p>Tuesday</p>'
		case 3: return '<p>Wednesday</p>'
		case 4: return '<p>Thursday</p>'
		case 5: return '<p>Friday</p>'
		case 6: return '<p>Saturday</p>'
		case 0: return '<p>Sunday</p>'
	}
}

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