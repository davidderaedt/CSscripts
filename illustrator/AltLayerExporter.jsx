// (c) Copyright 2013 Adobe Systems, Inc. All rights reserved.
// author David Deraedt

var AltLayerExporter = (function () {

	/**
	Exports all layers of a given document to properly sized PNG, JPEG or SVG files
	The default export type can be overriden by adding the chosen type to the layer name
	@public
	@param {Document} doc The document to export
	@param {Folder} destFolder The destination folder for the image files
	@param {String} exportType Determines if layers should be converted to SVG, JPG or PNG files
	@param {Boolean} ignoreInvisible Determines if invisible layers should be ignored
	@param {String} namingFunc function taking the layer name as a parameter and returning the filename
	
	(This value should use ExportType constants)
	*/

	function exportLayers(doc, destFolder, ignoreInvisible, getLayerOptions) {
						
        if(!getLayerOptions) {
            getLayerOptions = function (lname) {
                return {
                    ignore:false,
                    exportType:"png",
                    name: lname,
                    useText: false
                }
            }
        }
						
		var destPath = destFolder.path + "/" + destFolder.name + "/";
		        		
		var n = doc.layers.length;
		
		var j;

        var destDoc = app.documents.add(DocumentColorSpace.RGB);
		
		for ( j = 0 ; j < n ; j++){
			
			var l = doc.layers[j];
						
			if (ignoreInvisible && l.visible == false) continue;
			var isLocked = l.locked;
			if(isLocked) l.locked = false;

			//ignore empty layers
			if(l.pageItems.length==0) continue;			
			// also ignore items which width==0 (points etc)
			if(doc.visibleBounds[0] == doc.visibleBounds[2]) continue;	
            
            		
            var layerOptions = getLayerOptions(l.name);		
            
            if(layerOptions.ignore) continue;
            
            copyLayer(l, destDoc);
            
            destDoc.artboards[0].artboardRect = destDoc.visibleBounds;
            

//            }
            
            var filename = layerOptions.name + "." + layerOptions.exportType;
            
            /*
			var fileName = namingFunc(l.name);
                        
            var nameParts = l.name.split(".");
            var nameEnd = nameParts[nameParts.length-1];
            if(nameEnd == "png") exportType = ExportType.PNG24;
            if(nameEnd == "svg") exportType = ExportType.SVG;
            if(nameEnd == "jpg") exportType = ExportType.JPEG;
            
            var useText = false;
            if(l.name.indexOf("-txt")>-1) useText = true;
            */
            
            
			exportImage(destDoc, destPath + filename, layerOptions.exportType, layerOptions.useText);
								
            destDoc.activeLayer.pageItems.removeAll();
            
            if(isLocked) l.locked = true;
								
		}
        
        destDoc.close(SaveOptions.DONOTSAVECHANGES);

	}
	
	
	function copyLayer(l, destDoc) {
        
        var n = l.pageItems.length;
        for (var i = 0; i < n; i++){
            l.pageItems[i].duplicate(destDoc.activeLayer, ElementPlacement.PLACEATEND);
        }
	}



	function exportImage(doc, dest, exportType, useText) {
		
        var options;
		var eType;
		if(exportType.toLowerCase() == "svg") {
			eType = ExportType.SVG;
			options = new ExportOptionsSVG();
            options.coordinatePrecision = 2; // 3 by default			
			options.embedRasterImages = true;
            options.fontType = SVGFontType.OUTLINEFONT;
            if(useText) {
                options.fontType = SVGFontType.SVGFONT;
                options.fontSubsetting = SVGFontSubsetting.None;
            }
            if(doc.variables.length>0) {
                options.includeVariablesAndDatasets = true;
            }
            options.cssProperties = SVGCSSPropertyLocation.STYLEELEMENTS;
            options.documentEncoding = SVGDocumentEncoding.UTF8;			
		}
		else if (exportType.toLowerCase() == "png") {
			eType = ExportType.PNG24;
			options = new ExportOptionsPNG24();
		}
		else if (exportType.toLowerCase() == "jpg") {
			eType = ExportType.JPEG;
			options = new ExportOptionsJPEG();
			options.qualitySetting = 90;
		}
	
		var fileSpec = new File(dest);
							   
		doc.exportFile( fileSpec, eType, options );		
	}


	var obj = {};
	obj.exportLayers = exportLayers;
	return obj;

}());

/*
var destFolder = Folder.selectDialog ("Select Destination Folder");
AltLayerExporter.exportLayers(app.activeDocument, destFolder, true);
*/