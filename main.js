import L from "leaflet";
import * as d3 from "d3";

import "leaflet/dist/leaflet.css";
import "./main.css"

var map = L.map('map').setView([52.505, 13.41], 11);

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
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

const mapLayer = {
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
    svg
      .style("width", map.getSize().x + 'px')
      .style("height", map.getSize().y + 'px')
      .style("margin-left", topLeft.x + "px")
      .style("margin-top", topLeft.y + "px");
    svg.selectAll("g").attr("transform", "translate(" + -topLeft.x + "," + -topLeft.y + ")");
    return svg;
}

function drawLayer(){
  positionSvg();
  var bounds = map.getBounds();
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
}

fetch('https://overpass-api.de/api/interpreter', {
  method: "POST",
  body: "[out:json];area[name='Berlin'];node(area)[loc_name='Plumpe'];out;"
}).then(response => response.json())
  .then(function(json){
  points = json.elements;
  map.addLayer(mapLayer);
});

