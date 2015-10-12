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
requirejs(['lodash/lodash', 'd3/d3'],
function   (lodash,         d3) {
  console.log(_.map([1,2,3], function(x){ return x*12}));
});
