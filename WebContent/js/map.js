

//var mymap = L.map('mapid').setView([51.505, -0.09], 13);
//
//L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//    }).addTo(mymap);

var mapboxAccessToken = 'pk.eyJ1IjoicGlud2hlZWwyMDE4IiwiYSI6ImNqZXhqMjRpdTE0NW0zM3BoY3Z6czVhbTMifQ.dfXmu3VcAXonqxvmL_P3LQ';
var map = L.map('mapid').setView([37.8, -96], 4);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.light'
}).addTo(map);

function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

L.geoJson(newgeofinal).addTo(map);