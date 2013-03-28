#include "../LayerExporter.jsx"

#target illustrator

function main() {

	if ( app.documents.length > 0 ) {
		
		var doc = app.activeDocument;
		var docFile = doc.fullName;

		if(!doc.saved){
			Window.alert("This script needs to modify your document. Please save it before running this script.");
			return;
		}

		var destFolder = Folder.selectDialog ("Select Destination Folder");
		if(!destFolder) return;
				
		LayerExporter.exportLayers(doc, destFolder, ExportType.SVG);


		// Close and reopen original
		// necessary since the script needs to modify the original file
		doc.close(SaveOptions.DONOTSAVECHANGES);
		doc = null;
		app.open(docFile);

	}

}
main();