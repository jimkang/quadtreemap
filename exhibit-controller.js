function exhibitController() {
  var exhibit = {
    points: [],
    displayedPointRange: [0, 100],
    maxNumberOfPoints: 1000
  };

  var mapWidth = 0;
  var mapHeight = 0;

  ((function captureMapDimensions() {
    var mapEl = d3.select('#quadmap').node();
    mapWidth = mapEl.clientWidth;
    mapHeight = mapEl.clientHeight;
  })());

  function createPointRandomly() {
    return [
      ~~(Math.random() * mapWidth),
      ~~(Math.random() * mapHeight)
    ];
  }

  exhibit.displayedPoints = function displayedPoints() {
    return exhibit.points.slice(
      exhibit.displayedPointRange[0], exhibit.displayedPointRange[1]);
  };

  exhibit.points = d3.range(exhibit.maxNumberOfPoints).map(createPointRandomly);
  // exhibit.points = [
  //   [mapWidth - 1, mapHeight - 1], 
  //   [mapWidth - 10, mapHeight - 10], 
  //   [mapWidth - 100, mapHeight - 100]
  // ];

  exhibit.quadtree = exampleQuadtree(mapWidth, mapHeight, 
    exhibit.displayedPoints());

  exhibit.quadmap = quadtreeMap(mapWidth, mapHeight, exhibit.quadtree, 
    d3.select('#quadroot'));

  renderQuadtreePoints(exhibit.displayedPoints(), d3.select('#pointroot'));

  return exhibit;
}

var theExhibit = exhibitController();

