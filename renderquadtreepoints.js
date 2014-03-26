function renderQuadtreePoints(points, rootSelection) {
  var dots = rootSelection.selectAll('.point').data(points);

  dots.enter().append('circle')
    .attr('id', function identity(d) {
      return 'quad_point_' + d[0] + '_' + d[1];
    })
    .attr('class', 'point')
    .attr('fill', function getColor(d) { 
      return '#fff';
      // return pointColorForIndex(this.indexForCoords(d[0], d[1]));
    }
    // .bind(this))
    // .on('click', function showCorrespondingPointInTree(d) {
    //   this.nodesTree.camera
    //     .panToElement(d3.select('#point_' + d[0] + '_' + d[1]));
    // }
    // .bind(this));
    );

  dots
    .attr('cx', function(d) { return d[0]; })
    .attr('cy', function(d) { return d[1]; })
    .attr('r', 3); 

  var labels = rootSelection.selectAll('.pointlabel').data(points);
  labels.enter().append('text')
    .classed('pointlabel', true)
    .attr('text-anchor', 'middle');

  labels
    .attr('x', function(d) { return d[0]; })
    .attr('y', function(d) { return d[1] - 10; })
    .attr('fill', '#ddd')
    .text(function getText(d) {
      return d[0] + ', ' + d[1];
      // return this.indexForCoords(d[0], d[1]);
    }
    .bind(this));
}
