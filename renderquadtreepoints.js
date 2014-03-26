function renderQuadtreePoints(opts) {
  // opts should contain:
  // 
  // {
  //   points: array of 2-element arrays, representing a point,
  //   rootSelection: [D3 selection of a <g> under which to render the points],
  //   x: number (left bound of the points),
  //   y: number (top bound of the points),
  //   width: number (total width of the points field), 
  //   height: number (total width of the points field),
  // }  
  // 
  // This function will try to keep the labels in the field defined by x, y, 
  // width, and height, but it will not box in points.

  var estimatedLabelWidth = 40;
  var estimatedLabelHeight = 15;

  function labelX(d) {
    var x = d[0] + opts.x;
    if (x - estimatedLabelWidth/2 < opts.x) {
      x = opts.x + estimatedLabelWidth/2;
    }
    if (x + estimatedLabelWidth/2 > opts.x + opts.width) {
      x = opts.width - estimatedLabelWidth/2;
    }
    return x;
  }

  function labelY(d) {
    var y = d[1] + opts.y;
    if (y - estimatedLabelHeight/2 < opts.y) {
      y = opts.y + estimatedLabelHeight/2;
    }
    if (y + estimatedLabelHeight/2 > opts.y + opts.width) {
      y = opts.width - estimatedLabelHeight/2;
    }
    return y;
  }

  function selectPoint(d) {
    d3.select(this).attr('fill', 'green');
  }

  var dots = opts.rootSelection.selectAll('.point').data(opts.points);

  dots.enter().append('circle')
    .attr('id', function identity(d) {
      return 'quad_point_' + d[0] + '_' + d[1];
    })
    .attr('class', 'point')
    .attr('fill', function getColor(d) { 
      return '#fff';
    })
    .on('click', selectPoint);

  dots
    .attr('class', 'dot')
    .attr('cx', function(d) { return d[0] + opts.x; })
    .attr('cy', function(d) { return d[1] + opts.y; })
    .attr('r', 3); 

  // var labels = opts.rootSelection.selectAll('.pointlabel').data(opts.points);
  // labels.enter().append('text')
  //   .classed('pointlabel', true)
  //   .attr('text-anchor', 'middle');

  // labels
  //   .attr('x', labelX)
  //   .attr('y', labelY)
  //   .attr('fill', '#ddd')
  //   .text(function getText(d) {
  //     return d[0] + ', ' + d[1];
  //   }
  //   .bind(this));

}
