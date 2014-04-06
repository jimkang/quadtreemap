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
    x: padding, 
    y: padding, 
    width: mapWidth, 
    height: mapHeight, 
    quadtree: quadtree, 
    rootSelection: d3.select('#quadroot')
  });

  renderQuadtreePoints({
    points: displayedPoints(),
    rootSelection: d3.select('#pointroot'),
    x: padding,
    y: padding,
    width: mapWidth, 
    height: mapHeight,
  });

  document.addEventListener('quadtreemap-quadSelected', reportSelectedQuad);
  document.addEventListener('quadtreepoints-pointSelected', reportSelectedPt);

  function reportSelectedQuad(e) {
    var quad = e.detail;
    var report = quadtreeNodeReport(quad.quadtreenode);
    detailsBox.text(JSON.stringify(report, null, '  '));
  }

  function reportSelectedPt(e) {
    var point = e.detail;
    detailsBox.text(JSON.stringify(point));    
  }
 
  return exhibit;
}

var theExhibit = exhibitController();
