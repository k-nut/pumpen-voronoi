import requests
import geojson
from geojson import Feature, FeatureCollection, Polygon, Point
from scipy.spatial import Voronoi

overpass_url = "https://overpass-api.de/api/interpreter"
query = '[out:json];area[name="Berlin"];node(area)[man_made=water_well];out;'
response = requests.post(overpass_url, data=query)

assert response.status_code == 200

data = response.json()

points = [[element['lon'], element['lat']] for element in data['elements']]
vor = Voronoi(points)

features = []
for region in vor.regions:
    # Do not try to include polygons which are open on the outside
    if -1 in region:
        continue
    points = [tuple(vor.vertices[index]) for index in region]
    polygon = Polygon([points])
    features.append(Feature(geometry=polygon))


for point in vor.points:
    features.append(Feature(geometry=Point(tuple(point))))

feature_collection = FeatureCollection(features)
with open("./voronoi.geojson", "w") as outfile:
    geojson.dump(feature_collection, outfile, indent=2)
