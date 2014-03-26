function exhibitController() {
  var exhibit = {
    points: [],
    displayedPointRange: [0, 100],
    maxNumberOfPoints: 1000,
    padding: 8,
    detailsBox: d3.select('.details-box')
  };

  var mapWidth = 0;
  var mapHeight = 0;

  ((function captureMapDimensions() {
    var mapEl = d3.select('#quadmap').node();
    mapWidth = mapEl.clientWidth - 2 * exhibit.padding;
    mapHeight = mapEl.clientHeight - 2 * exhibit.padding;
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

  exhibit.quadmap = quadtreeMap({
    x: exhibit.padding, 
    y: exhibit.padding, 
    width: mapWidth, 
    height: mapHeight, 
    quadtree: exhibit.quadtree, 
    rootSelection: d3.select('#quadroot')
  });

  renderQuadtreePoints({
    points: exhibit.displayedPoints(),
    rootSelection: d3.select('#pointroot'),
    x: exhibit.padding,
    y: exhibit.padding,
    width: mapWidth, 
    height: mapHeight,
  });

  document.addEventListener('quadtreemap-quadSelected', reportSelectedQuad);

  function reportSelectedQuad(e) {
    console.log(e.detail);
    exhibit.detailsBox.text(JSON.stringify(e.detail, null, '  '));
  }

  return exhibit;
}

var theExhibit = exhibitController();

