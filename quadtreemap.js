function quadtreeMap(width, height, quadtree, rootSelection) {
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
    rootSelection.selectAll('.map-node').data(quads)
      .enter().append('rect')
        .attr('class', 'map-node')
        .attr('x', function(d) { return d.x; })
        .attr('y', function(d) { return d.y; })
        .attr('width', function(d) { return d.width; })
        .attr('height', function(d) { return d.height; });

    rootSelection.selectAll('.map-node-label').data(quads)
      .enter().append('text').text(function (d) { return d.name; })
        .attr('x', function(d) { return d.x + d.width/3; })
        .attr('y', function(d) { return d.y + d.height/2; })
        .attr('fill', '#fff');
  };

  ((function init() {
    var rootQuad =  {
      name: 'root-quad',
      x: 0,
      y: 0,
      width: width,
      height: height
    };

    var quads = childNodesToQuads(quadtree, rootQuad, 0);
    quads.unshift(rootQuad);

    quadtreemap.render(quads);
  })());

  return quadtreeMap;
}

