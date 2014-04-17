function exhibitController() {
  var displayedPointRange = [0, 100];
  var maxNumberOfPoints = 1000;
  var padding = 8;
  var detailsBox = d3.select('.details-box');
  var mapWidth = 0;
  var mapHeight = 0;

  ((function captureMapDimensions() {
    var mapEl = d3.select('#quadmap').node();

    mapWidth = mapEl.clientWidth;
    if (mapWidth < 1) {
      // This is necessary on Firefox.
      mapWidth = mapEl.parentElement.clientWidth;
    }

    mapHeight = mapEl.clientHeight;
    if (mapHeight < 1) {
      // This is necessary on Firefox.
      mapHeight = mapEl.parentElement.clientHeight;
    }

    mapWidth -= (2 * padding);
    mapHeight -= (2 * padding);
  })());

  function createPointRandomly() {
    return [
      ~~(Math.random() * mapWidth),
      ~~(Math.random() * mapHeight)
    ];
  }

  function displayedPoints() {
    return points.slice(displayedPointRange[0], displayedPointRange[1]);
  }

  var points = d3.range(maxNumberOfPoints).map(createPointRandomly);
  var quadtree = exampleQuadtree(mapWidth, mapHeight, displayedPoints());

  var quadmap = createQuadtreeMap({
    quadtree: quadtree, 
    x: padding, 
    y: padding, 
    width: mapWidth, 
    height: mapHeight, 
    quadRootSelection: d3.select('#quadroot'),
    pointRootSelection: d3.select('#pointroot'),
    prefix: 'beefy'
  });

  document.addEventListener('quadtreemap-quadSelected', reportSelectedQuad);
  document.addEventListener('quadtreemap-pointSelected', reportSelectedPt);

  function reportSelectedQuad(e) {
    var quad = e.detail;
    var report = quadtreeNodeReport(quad.sourceNode);
    detailsBox.text(JSON.stringify(report, null, '  '));
  }

  function reportSelectedPt(e) {
    var point = e.detail;
    detailsBox.text(JSON.stringify(point));    
  }

  function addPoints() {
    var previousUpperBound = displayedPointRange[1];
    displayedPointRange[1] += 100;
    var newPoints = points.slice(previousUpperBound, displayedPointRange[1]);
    newPoints.forEach(quadtree.add);
    quadtree.updateLabels();
    quadmap.render();
  }

  d3.select('#add-points-button').on('click', addPoints);

  quadmap.render();
 
  return {
    points: points,
    quadtree: quadtree,
    quadmap: quadmap
  };
}

var theExhibit = exhibitController();
