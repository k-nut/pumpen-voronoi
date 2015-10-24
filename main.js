requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'bower_components',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../app'
    }
});

// Start the main app logic.
requirejs(['lodash/lodash', 'd3/d3', 'leaflet/dist/leaflet'],
function   (lodash,         d3,      leaflet) {
  var map = L.map('map').setView([52.505, 13.41], 11);

  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
}).addTo(map);

  var svg, points, path, voronoi;

  var mapLayer = {
    onAdd: function(map) {
      map.on('viewreset moveend', drawLayer);
      svg = setUpSVG();
    }
  };

  var voronoi = d3.geom.voronoi()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });

  function polygon(d) {
      return "M" + d.join("L") + "Z";
  }


  function setUpSVG(){
      var bounds = map.getBounds();
      var topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
      var bottomRight = map.latLngToLayerPoint(bounds.getSouthEast());
      var svg = d3.select(map.getPanes().overlayPane).append("svg")
        .attr('id', 'overlay')
        .attr("class", "leaflet-zoom-hide")
        .style("width", map.getSize().x + 'px')
        .style("height", map.getSize().y + 'px')
        .style("margin-left", topLeft.x + "px")
        .style("margin-top", topLeft.y + "px");
      path = svg.append("g").selectAll("path");
      return svg;
  }

  d3.json('data.json', function(json){
    points = json.elements;
  });

         
  map.addLayer(mapLayer);
  //drawLayer();
  //

  function drawLayer(){
    var convertedPoints = points.map(function(p){
      var latlng = new L.LatLng(p.lat, p.lon);
      return map.latLngToLayerPoint(latlng);
    });



    svg.selectAll("circle").remove();
    var svgPoints = svg.selectAll("circle")
                        .data(convertedPoints)
                        .enter();

    svgPoints.append("circle")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .attr("r", 2);


    path = path
      .data(voronoi(convertedPoints), polygon);

  path.exit().remove();

  path.enter().append("path")
      .attr("class", "part")
      .attr("d", polygon);

                        
  
  voronoi(convertedPoints).forEach(function(d) { d.point.cell = d; });
  }


});
