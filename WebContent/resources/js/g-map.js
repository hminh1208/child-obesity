$( document ).ready(function() {
	

});

var map;
var autocomplete;
var searchInput = document.getElementById('pac-input');

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      mapTypeControl: false,
      zoom: 8
    });
    
    var options = {
    		  types: ['(cities)'],
    		  componentRestrictions: {country: 'au' }
    		};
    
    autocomplete = new google.maps.places.Autocomplete(searchInput, options);
    
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInput);
    
    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          window.alert("No details available for input: '" + place.name + "'");
          return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);  // Why 17? Because it looks good.
        }

      });
  }