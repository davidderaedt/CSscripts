// (c) Copyright 2013 Adobe Systems, Inc. All rights reserved.
// author David Deraedt

#include "../../common/Utils.jsx"

var LayerExporter = (function () {

	/**
	Exports all layers of a given document to properly sized PNG or SVG files
	Warning: this script will modify the original file!
	@public
	@param {Document} doc The document to export
	@param {Folder} destFolder The destination folder for the image files
	@param {String} exportType Determines if layers should be converted to SVG or PNG files
	(This value should use ExportType constants)
	@param {Rect} customBounds A rectangle which determines the output file size.
	If null, the layer visible bounds are used.
	*/

	function exportLayers(doc, destFolder, defaultExportType, customBounds){
						
		var destPath = destFolder.path +"/"+ destFolder.name+"/";
						
		var artboard = doc.artboards[0];
		var originRect = artboard.artboardRect;

		var docName = normalizeName(getFileNamePart(doc.name));
		
		var n = doc.layers.length;
		
		var j;

		setLayersVisibility(doc, false);

		for ( j = 0 ; j < n ; j++){
			
			var l = doc.layers[j];
						
			l.visible = true;
			l.locked = false;

			//ignore empty layers
			if(l.pageItems.length==0) continue;			
			// also ignore items which width==0 (points etc)
			if(doc.visibleBounds[0] == doc.visibleBounds[2]) continue;			


			if(customBounds) artboard.artboardRect = customBounds;
			else artboard.artboardRect = doc.visibleBounds;
			
			var fileName = docName + "-" + normalizeName(l.name);
            
              var exportType =  defaultExportType;
              var nameEnd = l.name.substr(l.name.length-4);
              if(nameEnd ==".png") exportType = ExportType.PNG24;
              if(nameEnd ==".svg") exportType = ExportType.SVG;
              
			
			exportImage(doc, destPath + fileName, exportType);
								
			l.visible = false;
		}

		artboard.artboardRect = originRect;

		setLayersVisibility(doc, true);		
	}



	function exportImage(doc, dest, exportType) {
		
		var options;
		
		if(exportType == ExportType.SVG) {
			options = new ExportOptionsSVG();
			options.embedRasterImages = true;	
		}
		else if (exportType == ExportType.PNG24){
			options = new ExportOptionsPNG24();			
		}
	
		var fileSpec = new File(dest);
							   
		doc.exportFile( fileSpec, exportType, options );
		
	}


	var obj = {};
	obj.exportLayers = exportLayers;
	return obj;

}());
