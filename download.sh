http --form POST overpass-api.de/api/interpreter data="[out:json];area[name="Berlin"];node(area)[man_made=water_well];out;" > data.json
