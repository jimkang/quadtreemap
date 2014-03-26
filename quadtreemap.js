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

  var quadtreemap = {};

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
            name: (isBottom ? 'bottom' : 'top') + depth,
            x: parentQuad.x + (isRight ? width : 0),
            y: parentQuad.y + (isBottom ? height : 0),
            width: width,
            height: height
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
        id: function name(d) { return d.name; },
        x: function x(d) { return d.x; },
        y: function y(d) { return d.y; },
        width: function width(d) { return d.width; },
        height: function height(d) { return d.height }
      });
  };

  ((function init() {
    var rootQuad =  {
      name: 'root-quad',
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

