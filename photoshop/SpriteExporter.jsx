// (c) Copyright 2012 Adobe Systems, Inc. All rights reserved.
// Written by David Deraedt
// PHOTOSHOP SPRITESHEET EXPORTER

#include "../common/Utils.jsx"


var SpriteExporter = (function () {


	var layerIndex = 0 ;
	var totalFrames = 0;
	var exporter;

	/**
	* Parses a phothoshop document to create spritesheets
	* using a data exporter object
	* @srcDoc photoshop document to parse
	* @pExporter data exporter
	* @imgFolderDestination path to the folder of the image file to be created
	* @dataFileDestination path to the data file to be created
	*/

	function doExport (srcDoc, pExporter, imgFolderDestination, dataFileDestination) {
		
		exporter = pExporter;
		
		// Switch to pixel units
		var strtRulerUnits = app.preferences.rulerUnits;
		if (strtRulerUnits != Units.PIXELS) {
		  app.preferences.rulerUnits = Units.PIXELS;
		}
		
		// Sprite size
		var w = srcDoc.width ;
		var h = srcDoc.height ;

		// Get the total number of layers
		getTotalLayers(srcDoc.layers);
		//$.writeln("totalFrames: " + totalFrames);

		// Compute Sheet size
		var cols = Math.ceil(Math.sqrt(totalFrames));
		var rows = Math.ceil(totalFrames/cols);
		//$.writeln("total rows: " + rows);
		
		// Create a copy of the current doc
		var destDoc = srcDoc.duplicate("tmp", false);
		 
		 // Make it the size of the sprite
		destDoc.resizeCanvas (cols*w, rows*h, AnchorPosition.TOPLEFT);
		
		// Select this new doc
		app.activeDocument = destDoc;
		
		// Get the spriteSheet name from the document name
		var imageName = srcDoc.name.split(".")[0];
		
		// Start data output	
		exporter.beginExport(imageName);
		

		// Process each sprite	
		for (var i = 0 ; i < destDoc.layerSets.length ; i++) {
			var spriteSet = destDoc.layerSets[i];
			//$.writeln("set: " + i + "> " + spriteSet.allLocked);
			if(spriteSet.allLocked) spriteSet.allLocked = false;
			if(spriteSet.visible == false) spriteSet.visible = true;
			
			var destName = spriteSet.name;
			processSprite(destDoc, spriteSet.layerSets, destName, cols, rows, w, h);		
		}
		
		// End data output
		exporter.endExport();
		
		// save the image file
		savePng(destDoc, imgFolderDestination + imageName + ".png" );
		
		// save the data file
		saveTextFile(exporter.getOutput(), dataFileDestination );    	
		
		 // Close doc
		destDoc.close(SaveOptions.DONOTSAVECHANGES);

		// Release refs
		srcDoc = null;
		destDoc = null;

		// Restore orginal unit preferences
		if (strtRulerUnits != app.preferences.rulerUnits) {
		  app.preferences.rulerUnits = strtRulerUnits;
		}

	}



	function getTotalLayers(layerList){
			
		for (var i = 0 ; i < layerList.length ; i++) {
			var layer = layerList[i];

			if(layer.typename=="LayerSet") {
				getTotalLayers(layer.layers);
			}
			else {
				totalFrames++;
			}		
		}
		
		return totalFrames;
	}


	function processSprite(doc, layerSets, destName, cols, rows, w, h) {

		// stores the frame count for this sprite
		var frameCount = 0 ;
		
		exporter.addSprite(destName);
		
		// Parse all animation layer sets
		for( var n = 0 ; n < layerSets.length ; n++){
			
			var set = layerSets[n];
			set.allLocked=false;
			var setName = set.name;
			//$.writeln("Set: " + setName);
			
			exporter.addAnimation(setName);
			   
			// Parse all frame layers
			for( var i = 0 ; i < set.layers.length ; i++){
				
				var layer = set.layers[i];
				//$.writeln("layer: " + layer.name);
				
				// discard text layers
				if (layer.kind == LayerKind.TEXT) {
					layerIndex++;
					frameCount++;
					continue;
				}
				
				// select the next layer
				doc.activeLayer = layer;
				doc.activeLayer.allLocked=false;
				
				// move the sprite layer
				var destx = (layerIndex % cols) * w;
				var desty = (Math.floor(layerIndex/cols)) * h;
				doc.activeLayer.translate(destx, desty);
							
				// export frame data
				exporter.addFrame(frameCount, layer.name, Number(destx),  Number(desty), Number(w), Number(h));
							
				layerIndex++;
				frameCount++;
			}
	 
			exporter.endAnimation();
		}
		
		// add Data to exporter
		exporter.exportSprite();	
	}



	function savePng(doc, filepath) {
				
		var pngFile = new File(filepath);
		var pngFileOptions = new PNGSaveOptions();
		doc.saveAs (pngFile, pngFileOptions, true, Extension.LOWERCASE);
	}


	return {doExport:doExport};

}());


