#target photoshop

#include "PrimitiveShapes.jsx"

(function (){
	
	if (app.documents.length==0) return;
			
	var doc = app.activeDocument;
	doc.artLayers.add();
	
	var docW = doc.width.value;
	var docH = doc.height.value;
	
	var colWidth = 6;
	
	var n = 100;


	
	for ( var i = 0 ; i < n ; i ++){

		var x = Math.random()*docW;
		var y = Math.random()*docH;

		var w = Math.random()*docW;
		var h = Math.random()*docH;

		var b = Math.random()*255;		
		
		drawRect(doc, "rect"+i, {r:0, g:0, b:b, a:100}, x, y, w, h );
		
	}


		
		
})();