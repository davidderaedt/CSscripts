function drawLine(doc, name, start, stop) {
	
	var startPoint = new PathPointInfo(); 
	startPoint.anchor = start; 
	startPoint.leftDirection = start; 
	startPoint.rightDirection = start; 
	startPoint.kind = PointKind.CORNERPOINT;
	
	var stopPoint = new PathPointInfo(); 
	stopPoint.anchor = stop; 
	stopPoint.leftDirection = stop; 
	stopPoint.rightDirection = stop; 
	stopPoint.kind = PointKind.CORNERPOINT;
	
	
	var spi = new SubPathInfo();
	spi.closed = false;
	spi.operation = ShapeOperation.SHAPEADD; 
	spi.entireSubPath = [startPoint, stopPoint];
	var line = doc.pathItems.add(name, [spi]); 
	line.strokePath(ToolType.PENCIL); 
	line.remove();
}


function drawPolygon(doc, name, color, coords){
	
	var spi = new SubPathInfo();
	spi.closed = false;
	spi.operation = ShapeOperation.SHAPEADD; 
	spi.entireSubPath = coords;
	var poly = doc.pathItems.add(name, [spi]); 
	poly.strokePath(ToolType.PENCIL); 
	var c = new SolidColor();
	c.rgb.red = color.r;
	c.rgb.green = color.g;
	c.rgb.blue = color.b;
	poly.fillPath (c, ColorBlendMode.NORMAL, color.a, false, 0, true, true);
	//poly.remove();
	return poly;
}


function drawRect(doc, name, color, x, y, w, h){
	
	var tl = createCornerPoint([x, y]);
	var tr = createCornerPoint([x+w, y]);
	var br = createCornerPoint([x+w, y+h]);
	var bl = createCornerPoint([x, y+h]);	
	var coords = [tl, tr, br, bl];
	
	drawPolygon(doc, name, color, coords);
	
	function createCornerPoint(pAnchor){
		var p = new PathPointInfo();
		p.rightDirection = p.leftDirection = p.anchor = pAnchor;
		p.kind = PointKind.CORNERPOINT;	
		return p;
	}

}