function createQuadtreePointsMap(opts) {
  // opts should contain:
  // 
  // {
  //   rootSelection: [D3 selection of a <g> under which to render the points],
  //   x: number (left bound of the points),
  //   y: number (top bound of the points),
  //   width: number (total width of the points field), 
  //   height: number (total width of the points field),
  //   prefix: string
  // }  
  // 
  // This function will try to keep the labels in the field defined by x, y, 
  // width, and height, but it will not box in points.

  var estimatedLabelWidth = 40;
  var estimatedLabelHeight = 15;
  var oneAtATimeSelector = createOneAt('selected');
  var labeler = createQuadtreeLabeler('map-');

  function prefixedIdForNode(node) {
    var fullId = labeler.elementIdForNode(node);
    if (opts.prefix) {
      fullId = (opts.prefix + '-' + fullId);
    }
    return fullId;
  }

  function pointToQuad(pt) {
    var sourceNode = {
      leaf: true,
      point: pt
    };

    labeler.setLabelOnNode(sourceNode);

    return {
      sourceNode: sourceNode,
    };
  }

  function elementIdForQuad(quad) {
    return prefixedIdForNode(quad.sourceNode);
  }

  function selectPoint(d) {
    var node = d.sourceNode;
    oneAtATimeSelector.selectElementWithId(prefixedIdForNode(node));
    var event = new CustomEvent('quadtreemap-pointSelected', {detail: d});
    document.dispatchEvent(event);
  }

  function render(points) {
    var quads = points.map(pointToQuad);
    var dots = opts.rootSelection.selectAll('.point')
      .data(quads, elementIdForQuad);

    dots.enter().append('circle').attr({
      id: elementIdForQuad,
      r: 3,
      class: 'dot'
    })
    .on('click', selectPoint);

    dots.attr({
      cx: function cx(d) { return d.sourceNode.point[0] + opts.x; },
      cy: function cy(d) { return d.sourceNode.point[1] + opts.y; },
    });
  }

  return {
    render: render,
    selectPointElExclusively: oneAtATimeSelector.selectElementWithId,
    prefixedIdForNode: prefixedIdForNode
  };
}
