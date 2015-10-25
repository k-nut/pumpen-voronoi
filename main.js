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

  var points, voronoi;
  var svg;
  var path;
  var svgPoints;

  // set up svg
  function createSvg(){
    svg = d3.select(map.getPanes().overlayPane).append("svg")
            .attr('id', 'overlay')
            .attr("class", "leaflet-zoom-hide");
    path      = svg.append("g").classed("paths",  true).selectAll("path");
    svgPoints = svg.append("g").classed("points", true).selectAll("circle");
  }

  var mapLayer = {
    onAdd: function(map) {
      map.on('viewreset moveend', drawLayer);
      createSvg();
      positionSvg();
      drawLayer();
    }
  };

  voronoi = d3.geom.voronoi()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });

  function polygon(d) {
    if (d){
      return "M" + d.join("L") + "Z";
      }
  }


  function positionSvg(){
      var bounds = map.getBounds();
      var topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
      var bottomRight = map.latLngToLayerPoint(bounds.getSouthEast());
      svg
        .style("width", map.getSize().x + 'px')
        .style("height", map.getSize().y + 'px')
        .style("margin-left", topLeft.x + "px")
        .style("margin-top", topLeft.y + "px");
      svg.selectAll("g").attr("transform", "translate(" + -topLeft.x + "," + -topLeft.y + ")");
      return svg;
  }

  d3.json('data.json', function(json){
    points = json.elements;
    map.addLayer(mapLayer);
  });

         

  function drawLayer(){
    positionSvg();
    var bounds = map.getBounds();
      var topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
    var drawLimit = bounds.pad(0.4);

    var filteredPoints = points.filter(function(p) {
      var latlng = new L.LatLng(p.lat, p.lon);
      return drawLimit.contains(latlng);
    });

    var convertedPoints = filteredPoints.map(function(p){
      var latlng = new L.LatLng(p.lat, p.lon);
      return map.latLngToLayerPoint(latlng);
    });

    svg.selectAll(".points circle").remove();
    var svgPoints2 = svgPoints
                        .data(convertedPoints)
                        .enter();

    svgPoints2.append("circle")
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
