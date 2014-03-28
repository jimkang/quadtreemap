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

    mapWidth -= (2 * exhibit.padding);
    mapHeight -= (2 * exhibit.padding);
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
  document.addEventListener('quadtreepoints-pointSelected', reportSelectedPt);

  function reportSelectedQuad(e) {
    var quad = e.detail;
    var quadtreenode = 
      cleanNodeForPresentation(decircularizeQuadtreeNode(quad.quadtreenode));
    exhibit.detailsBox.text(JSON.stringify(quadtreenode, null, '  '));
  }

  function reportSelectedPt(e) {
    var point = e.detail;
    exhibit.detailsBox.text(JSON.stringify(point));    
  }

  function decircularizeQuadtreeNode(node) {
    var safeNode = _.omit(node, 'nodes', 'parent');

    if (node.nodes) {
      safeNode.nodes = node.nodes.map(function cleanChild(child) {
        return _.omit(child, 'nodes', 'parent');
      });
    }
    return safeNode;
  }

  // Assumes circular refs have been removed from node.
  function cleanNodeForPresentation(node) {
    ['point', 'x', 'y'].forEach(function removePropertyIfEmpty(property) {
      if (!node[property]) {
        delete node[property];
      }
      if (node.nodes) {
        node.nodes.forEach(cleanNodeForPresentation);
      }
    });
    return node;
  }
 
  return exhibit;
}


var theExhibit = exhibitController();

