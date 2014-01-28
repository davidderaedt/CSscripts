#include "../../edgeanimate/EdgeAnimateImporter.jsx"
#include "../export-layers-v1/LayerDataExtractor.jsx"
#include "../export-layers-v1/LayerExporter.jsx"

#target illustrator

function doExport(useSVG) {

	if ( app.documents.length > 0 ) {
		
		var doc = app.activeDocument;
		var docFile = doc.fullName;

		if(!doc.saved){
			Window.alert("This script needs to modify your document. Please save it before running this script.");
			return;
		}

		var anFile = File.openDialog ("Select the .an file of the destination Edge Animate project.");	
		if(!anFile) return;
		
		
		var exportType = useSVG ? ExportType.SVG : ExportType.PNG24;
		
		
		var itemsData = LayerDataExtractor.exportLayersData(doc, exportType);
		$.writeln(itemsData);		

		var destFolder = anFile.parent;
		var imgFolder = new Folder(destFolder.path +"/"+ destFolder.name + "/images/");
		if(!imgFolder.exists) imgFolder.create();
		var dest = imgFolder.absoluteURI+"/";

		LayerExporter.exportLayers(doc, imgFolder, exportType);
		
		EdgeAnimateImporter.doImport(anFile, itemsData);
		

		// Close and reopen original
		// (necessary since the script needs to modify the original file)	
		doc.close(SaveOptions.DONOTSAVECHANGES);
		doc = null;
		app.open(docFile);

	}

}