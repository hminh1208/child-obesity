//
//L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//    }).addTo(mymap);

var mapboxAccessToken = 'pk.eyJ1IjoicGlud2hlZWwyMDE4IiwiYSI6ImNqZXhqMjRpdTE0NW0zM3BoY3Z6czVhbTMifQ.dfXmu3VcAXonqxvmL_P3LQ';
var map = L.map('mapid',{ zoomSnap: 0, wheelPxPerZoomLevel: 30 }).setView([-37.7, 145.3], 9);


L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.light',
    maxZoom: 14,
    minZoom: 9
}).addTo(map);

function style(feature){
	return{
	    weight: 2,
	    opacity: 1,
	    color: 'red',
	    dashArray: '3',
	    fillOpacity: 0.2
	}
};

var lastLayer;
// 1 LGA, 2 Suburb
var currentMapType = 1;

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.2
    });

    info.update(layer.feature.properties);
    
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
};

var geojson;

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    
    if(lastLayer)
    	lastLayer.target.setStyle({
            weight: 5,
            color: 'yellow',
            dashArray: '',
            fillOpacity: 0.2
        });
    
    info.update();
};

function zoomToFeature(e) {
	if(lastLayer)
		geojson.resetStyle(lastLayer.target);
		
    map.fitBounds(e.target.getBounds());
    e.target.setStyle({
        weight: 5,
        color: 'yellow',
        dashArray: '',
        fillOpacity: 0.2
    });
    
    lastLayer = e;
};

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
};

geojson = L.geoJson(neighborhoods, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

//detect zoom change
map.on('zoomend', function() {
	console.log(map.getZoom());
 if(map.getZoom() >= 12 && currentMapType == 1){
	 geojson.clearLayers();
	 geojson = L.geoJson(newgeofinal, {style: style,
 	    onEachFeature: onEachFeature}).addTo(map);
	 currentMapType = 2;
 }
 else if (map.getZoom() == 9 && currentMapType == 2){
	 geojson.clearLayers();
	 geojson = L.geoJson(neighborhoods, {style: style,
 	    onEachFeature: onEachFeature}).addTo(map);
	 currentMapType = 1;
 }
});

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Victoria Suburbs</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' : 'Hover over a suburb');
};

info.addTo(map);

//
$("#scroll-to-map").click(function(){
	$('html, body').animate({
        scrollTop: $("#index-bottom-map").offset().top
    }, 2000);
});