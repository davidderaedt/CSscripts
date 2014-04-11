// (c) Copyright 2013 Adobe Systems, Inc. All rights reserved.
// author David Deraedt

var AltLayerExporter = (function () {

	/**
	Exports all layers of a given document to properly sized PNG, JPEG or SVG files
	@public
	@param {Document} doc The document to export
	@param {Folder} destFolder The destination folder for the image files
	@param {String} exportType Determines if layers should be converted to SVG, JPG or PNG files
	@param {Boolean} ignoreInvisible Determines if invisible layers should be ignored
	@param {Function} getLayerParams function taking the layer name as a parameter and returning export params
	*/

	function exportLayers(doc, destFolder, ignoreInvisible, getExportParams) {
        
        var n = doc.layers.length;
		
        var j;

        var destDoc = app.documents.add(DocumentColorSpace.RGB);
		
		for ( j = 0; j < n; j++){
			
            var l = doc.layers[j];

            if (ignoreInvisible && l.visible == false) continue;

            var isLocked = l.locked;
            if(isLocked) l.locked = false;

            //ignore empty layers
            if(l.pageItems.length==0) continue;

            // also ignore items which width==0 (points etc)
            if(doc.visibleBounds[0] == doc.visibleBounds[2]) continue;	

            
            var exportParams = getExportParams(l.name);        
            
            // export the layer itself if an eportType was specified
            if (exportParams && exportParams.exportType){
                copyLayer(l, destDoc);
                destDoc.artboards[0].artboardRect = destDoc.visibleBounds;
                exportImage(destDoc, destFolder, exportParams);
                destDoc.activeLayer.pageItems.removeAll();                
            }                

            
            // parse items
            for (var i = 0 ; i < l.pageItems.length ; i++){
                var item = l.pageItems[i];
                //flog("Processing " + item.name + " data");
                if (ignoreInvisible && item.hidden) continue;
                exportParams = getExportParams(item.name);
                // export item if an eportType was specified
                if(exportParams && exportParams.exportType){
                    item.duplicate(destDoc.activeLayer, ElementPlacement.PLACEATEND);
                    destDoc.artboards[0].artboardRect = destDoc.visibleBounds;
                    exportImage(destDoc, destFolder, exportParams);
                    destDoc.activeLayer.pageItems.removeAll();                
                }
            }
            
            
            if(isLocked) l.locked = true;
								
		}
        
        destDoc.close(SaveOptions.DONOTSAVECHANGES);

	}
	
	
	function copyLayer( l, destDoc) {
        
        var n = l.pageItems.length;
        for (var i = 0; i < n; i++){
            l.pageItems[i].duplicate(destDoc.activeLayer, ElementPlacement.PLACEATEND);
        }
        
	}



	function exportImage(doc, destFolder, exportParams) {
				
        var dest = destFolder.path + "/" + destFolder.name + "/" + exportParams.name + "." + exportParams.exportType;
				
        var options;
        var exportType = exportParams.exportType.toLowerCase();
		var eType;
		
		if(exportType == "svg") {			
			eType = ExportType.SVG;
			options = new ExportOptionsSVG();
            options.coordinatePrecision = exportParams.precision; // 3 by default			
			options.embedRasterImages = exportParams.embedImages;
            options.fontType = SVGFontType.OUTLINEFONT;
            if(exportParams.svgFont) {
                options.fontType = SVGFontType.SVGFONT;
                options.fontSubsetting = SVGFontSubsetting.None;
            }
            if(doc.variables.length>0) {
                options.includeVariablesAndDatasets = true;
            }
            var cssPropLoc = SVGCSSPropertyLocation.PRESENTATIONATTRIBUTES;
            if(exportParams.svgCssPropLoc == 1 ) cssPropLoc =SVGCSSPropertyLocation.STYLEELEMENTS;
            else if (exportParams.svgCssPropLoc == 2 ) cssPropLoc =SVGCSSPropertyLocation.STYLEATTRIBUTES;
            options.cssProperties = cssPropLoc;
            options.documentEncoding = SVGDocumentEncoding.UTF8;
            		
		} else if (exportType == "png") {			
			eType = ExportType.PNG24;
			options = new ExportOptionsPNG24();
            options.artBoardClipping=true;
			
		} else if (exportType == "jpg") {			
			eType = ExportType.JPEG;
			options = new ExportOptionsJPEG();
			options.qualitySetting = exportParams.jpgQuality;		
            options.artBoardClipping=true;
		} else {
		  // unsupported exportTypes are ignored
		  return;
		}
	
		var fileSpec = new File(dest);
							   
		doc.exportFile( fileSpec, eType, options );		
	}


	var obj = {};
	obj.exportLayers = exportLayers;
	return obj;

}());

