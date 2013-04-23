#target photoshop


(function (){
	
		if (app.documents.length==0) return;
				
		var doc = app.activeDocument;
		doc.artLayers.add();
		
		var docW = doc.width.value;
		var docH = doc.height.value;
		
		var colWidth = 6;
		
		var n = docW / colWidth;

		var opacity = 100;

		for ( var i = 0 ; i < n ; i ++){
			
			var x = i*colWidth;
			var red = Math.ceil(Math.random()*255);
			var light = (red/2) + Math.ceil(Math.random()*red/2);
			var sh = docH;
			drawRect(x, 0, colWidth, sh, [red, light, light, opacity]);
			
		}

		doc.selection.deselect();
			
		function drawRect(x, y, w, h, color){
			
			$.writeln (color);
			var region = [[x, y], [x+w, y], [x+w, y+h], [x, y+h]];
			doc.selection.select(region);
			var fillColor = new SolidColor();
			fillColor.rgb.red = color[0];
			fillColor.rgb.green = color[1];
			fillColor.rgb.blue = color[2];			
			doc.selection.fill(fillColor, ColorBlendMode.NORMAL, color[3], false);
		}
		
		
})();