requirejs.config({
  baseUrl: 'bower_components',
});

// Start the main app logic.
requirejs(['lodash/lodash', 'd3/d3', 'leaflet/dist/leaflet'],
  function   (lodash,         d3,      leaflet) {
    var map = L.map('map').setView([52.505, 13.41], 11);

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      maxZoom: 18,
    }).addTo(map);




    var myIcon = L.divIcon({
        iconSize: new L.Point(50, 50),
        html: 'foo bar'
    });

    const request = new XMLHttpRequest();
    const style = {
      "color": "#ff7800",
      "weight": 2,
      "opacity": 0.65,
      "fill": false,
      "icon": myIcon,
    };

    request.open("GET", "voronoi.geojson");
    request.addEventListener('load', function(event) {
      if (request.status >= 200 && request.status < 300) {
        const data = JSON.parse(request.responseText);
        L.geoJson(data, {style}).addTo(map);
      } else {
        console.warn(request.statusText, request.responseText);
      }
    });
    request.send();
  });
