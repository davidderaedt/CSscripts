#target photoshop

#include "../PrimitiveShapes.jsx"

(function (){
	
	if (app.documents.length==0) return;
			
	var doc = app.activeDocument;
	var l = doc.artLayers.add();
	
	var docW = doc.width.value;
	var docH = doc.height.value;
	
	var colWidth = 6;
	
	var n = 10;


	var x1 = 0;
	var y1 = 0;
	var x2 = 0;
	var y2 = 0;
	var coords=[];
	
	for ( var i = 0 ; i < n ; i ++){
		
		x1 = x2;
		y1 = y2;
		x2 = Math.random() * docW;
		y2 = Math.random() * docH;
				
		//drawLine(doc, "p"+i, [x1, y1], [x2, y2]);

		
		var p = [x2, y2];
		var pt =  new PathPointInfo(); 
		pt.anchor = p; 
		pt.leftDirection = p; 
		pt.rightDirection = p; 
		pt.kind = PointKind.CORNERPOINT;
		coords.push(pt);
		
	}


	var p = drawPolygon(doc, "poly", {r:255, g:255, b:255, a:100}, coords);
	
	pathtoVectorMask() ;
})();


function pathtoVectorMask() {
     function cTID(s) { return app.charIDToTypeID(s); };
     function sTID(s) { return app.stringIDToTypeID(s); };
 
	var desc27 = new ActionDescriptor();
	var ref11 = new ActionReference();
	ref11.putClass( cTID('Path') );
	desc27.putReference( cTID('null'), ref11 );
	var ref12 = new ActionReference();
	ref12.putEnumerated( cTID('Path'), cTID('Path'), sTID('vectorMask') );
	desc27.putReference( cTID('At  '), ref12 );
	var ref13 = new ActionReference();
	ref13.putEnumerated( cTID('Path'), cTID('Ordn'), cTID('Trgt') );
	desc27.putReference( cTID('Usng'), ref13 );
     executeAction( cTID('Mk  '), desc27, DialogModes.NO );
};