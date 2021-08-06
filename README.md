# pumpen-voronoi
Berlin's public water pumps on a voronoi map

- [Map](http://k-nut.github.io/pumpen-voronoi/)
- Related: [Pumpen with their official "Versorgungsradius" (Map)](http://pumpen-radius.k-nut.eu/)

![Screenshot](https://raw.githubusercontent.com/k-nut/pumpen-voronoi/master/screenshot.png)


## Setup

Install the dependencies with yarn or npm by running

```
yarn install
```

## Develop
When you made changed to your files, run
```bash
yarn build
```
Then start a local server (e.g. `python3 -m http.server`) to serve the files.


## Building
Create a build with
```bash
yarn build
```


## Inspiration

Very much inspired by [Chris Zetter's tutorial](http://chriszetter.com/blog/2014/06/15/building-a-voronoi-map-with-d3-and-leaflet/)
and [Mike Bostock's example](http://bl.ocks.org/mbostock/406036.)
