function pointOnCircle(cx, cy, r, angle) {
	var x, y;
	
	x = cx + r * Math.cos(angle* Math.PI / 180.0);
	y = cy + r * Math.sin(angle* Math.PI / 180.0);
	
	return {x: x, y: y}
}


function arc(svg, cx, cy, r, offsetAngle, angle, right_to_left, path) {
	var fullAngle = (angle + offsetAngle);
	var large_arc, sweep;
	
	var statPoint = pointOnCircle(cx, cy, r, offsetAngle); 
	var endPoint = 	pointOnCircle(cx, cy, r, fullAngle);
	   
	large_arc = (angle > 180) ? 1 : 0;
	
	if ( right_to_left ) {
		sweep = (angle > 0) ? 1 : 0;
		path.move(statPoint.x, statPoint.y ).arc(r,r, 0, large_arc, sweep,  endPoint.x, endPoint.y )
		
	} else {
		sweep = (angle > 0) ? 0 : 1;
		path.move( endPoint.x, endPoint.y ).arc(r,r, 0, large_arc, sweep, statPoint.x, statPoint.y)
		
	}
	
} 

function sectionPath(svg, params ) {
	var cx = params.cx;
	var cy = params.cy;
	var inR = params.inR;
	var outR = params.outR;
	var angle = params.angle;
	var offsetAngle = params.offsetAngle;
	
	var path = svg.createPath(); 
	var p1 = pointOnCircle( cx, cy, outR, angle+offsetAngle);
	var p2 = pointOnCircle( cx, cy, inR, offsetAngle);
	

	if ( angle >= 359 ) {
		angle = 359.9;
		arc(svg, cx, cy, inR, offsetAngle, angle, true, path);
		arc(svg, cx, cy, outR, offsetAngle, angle, false, path);	
	} else {
		arc(svg, cx, cy, inR, offsetAngle, angle, true, path);
		path.line(p1.x, p1.y);	
		arc(svg, cx, cy, outR, offsetAngle, angle, false, path);
		path.line( p2.x, p2.y );
	}
	
	return path;
}

function drawSection( svg, params ) {
	var id = params.id;
	var cx = params.cx;
	var cy = params.cy;
	var inR = params.inR;
	var outR = params.outR;
	var angle = params.angle;
	var offsetAngle = params.offsetAngle;
	var style = params.style;
	
	var path = sectionPath(svg, params);	
	
	var p = svg.path( null, path, style)
	
	p.id = id;
	
	$(p).data("id", id);
}
		
function drawSectorDiagram(svg, nodes) {
	var i = 0;
	var len = nodes.length;
	
	$.each(nodes, function(key, value) {
		if ( !value.isRoot )
			drawSection(svg, value.getNodeParams() );
	})
}