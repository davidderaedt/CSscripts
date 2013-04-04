// Test script for SpriteExporter and EaselJSExporter

// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop

#include "../EaselJSExporter.jsx"
#include "../SpriteExporter.jsx"

// in case we double clicked the file
app.bringToFront();

// debug level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
$.level = 1;



var libFileName = "spriteLib.js";

// Check if we have a doc to work with
if (app.documents.length == 0){
	alert ("No document opened");
}
else {
	
	// Let the user select its destination and save
	var destF =  Folder.selectDialog ("Select Destination");
	
	if(destF){	
		var folderName = destF.absoluteURI+"/";
		var fileDest = folderName + libFileName;
		SpriteExporter.doExport(app.activeDocument, EaselJSExporter, folderName, fileDest);
	}
}


