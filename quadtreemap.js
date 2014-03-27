function quadtreeMap(opts) {
  // opts should contain:
  // 
  // {
  //   x: number,
  //   y: number,
  //   width: number, 
  //   height: number, 
  //   quadtree: [a d3.geom.quadtree], 
  //   rootSelection: [a D3 selection of a <g> under which to render the quads]
  // }

  var quadtreemap = {
    selectedQuad: null,
    quadIndex: 0
  };

  function childNodesToQuads(rootNode, parentQuad, depth) {
    var quads = [];

    if (!rootNode.leaf) {
      var width = parentQuad.width/2;
      var height = parentQuad.height/2;

      function addChildToQuads(childQuads, child, i) {
        if (!child.leaf) {
          var isBottom = i > 1;
          var isRight = (i % 2 === 1);

          var childQuad = {
            id: createQuadId(),
            x: parentQuad.x + (isRight ? width : 0),
            y: parentQuad.y + (isBottom ? height : 0),
            width: width,
            height: height,
            depth: depth,
            quadtreenode: child,
          };
          
          childQuads.push(childQuad);
          childQuads = childQuads.concat(
            childNodesToQuads(child, childQuad, depth + 1));
        }
        return childQuads;
      }

      quads = rootNode.nodes.reduce(addChildToQuads, quads);      
    }

    return quads;
  }

  quadtreemap.render = function render(quads) {
    opts.rootSelection.selectAll('.map-node').data(quads).enter().append('rect')
      .classed('map-node', true)
      .attr({
        id: function id(d) { return d.id; },
        x: function x(d) { return d.x; },
        y: function y(d) { return d.y; },
        width: function width(d) { return d.width; },
        height: function height(d) { return d.height }
      })
      .on('click', function notifyQuadSelected(d) {
        selectQuad(d);
        var event = new CustomEvent('quadtreemap-quadSelected', {detail: d});
        document.dispatchEvent(event);
      });
  };

  function selectQuad(quad) {
    if (quadtreemap.selectedQuad) {
      d3.select('#' + quadtreemap.selectedQuad.id).classed('selected', false);
    }
    quadtreemap.selectedQuad = quad;
    d3.select('#' + quadtreemap.selectedQuad.id).classed('selected', true);
  }

  function getNextQuadIndex() {
    quadtreemap.quadIndex += 1;
    return quadtreemap.quadIndex;
  }

  function createQuadId() {
    return 'quad-' + getNextQuadIndex();
  }

  ((function init() {
    var rootQuad =  {
      id: 'root-quad',
      x: opts.x,
      y: opts.y,
      width: opts.width,
      height: opts.height,
    };

    var quads = childNodesToQuads(opts.quadtree, rootQuad, 0);
    quads.unshift(rootQuad);

    quadtreemap.render(quads);
  })());

  return quadtreeMap;
}

