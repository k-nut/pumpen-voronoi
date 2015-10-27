# pumpen-voronoi
Berlin's public water pumps on a voronoi map

![Screenshot](https://raw.githubusercontent.com/k-nut/pumpen-voronoi/master/screenshot.png)


## Update data
All the data is in the `data.json` file.
If you want to update to the current state you need to query the openstreetmap [overpass turbo api ](http://overpass-turbo.eu/s/cjg)
```
pip install httpie
sh ./download.sh
```

## Setup
Install the dependencies with bower by running 
```
bower install
```

## Inspiration
Very much inspired by [Chris Zetter's tutorial](http://chriszetter.com/blog/2014/06/15/building-a-voronoi-map-with-d3-and-leaflet/)
and [Mike Bostock's example](http://bl.ocks.org/mbostock/406036.)
