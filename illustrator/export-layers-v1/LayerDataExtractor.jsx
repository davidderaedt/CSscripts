// (c) Copyright 2013 Adobe Systems, Inc. All rights reserved.
// author David Deraedt

#include "../../common/Utils.jsx"

var LayerDataExtractor = (function () {

	/**
	Exports all layers data of a given document to an array of objects
	describing items and positions
	Warning: this script will modify the original file!
	@public
	@param {Document} doc The document to export
	@param {String} exportType Determines if layers should be converted to SVG or PNG files
	(This value should use ExportType constants)
	*/

	function exportLayersData(doc, exportType){
						
						
		var docName = normalizeName(getFileNamePart(doc.name));
		
		var itemsData = [];

		var n = doc.layers.length;
		
		var j;

		for ( j = n-1 ; j >= 0 ; j--){
			
			var l = doc.layers[j];
			
			l.locked = false;

			if(l.pageItems.length==0) continue;			
			// TODO : ignoring invisible should be optional
			if(l.visible == false) continue;

			var fileName = docName + "-" + normalizeName(l.name);

			// In order to group items, we need to select them
			l.hasSelectedArtwork = true;

			// Need to group since there is no way to get the position of an item collection
			if(doc.selection.length>1) {
				item = groupSelection(l);
				// TODO ungroup
			} else {
				item = doc.selection[0];		
			}
			
			// unselect
			doc.selection = null;


			var itemData = getItemData(item, fileName, exportType);
			
			itemsData.push(itemData);			
		}
		

		return itemsData;
		
	}



	function groupSelection(layer){
		
		var sel = app.activeDocument.selection;
		var newGroup = layer.groupItems.add();	
		//log(layer.name + ':' + sel.length);
		for ( i = 0; i < sel.length; i++ ) {
			var newItem = sel[i];
			newItem.moveToEnd( newGroup );
		}
		return newGroup;
	}




	function getItemData(item, name, exportType){
		
		var pos = item.position;

		if(app.coordinateSystem == CoordinateSystem.DOCUMENTCOORDINATESYSTEM){
			pos = app.activeDocument.convertCoordinate (item.position, CoordinateSystem.DOCUMENTCOORDINATESYSTEM, CoordinateSystem.ARTBOARDCOORDINATESYSTEM);
		}

		var ext = "png";
		if (exportType==ExportType.SVG) ext = "svg";

		return {
				x: (pos[0]).toFixed(2),
				y: (pos[1]).toFixed(2)*-1,
				width: item.width.toFixed(2),
				height: item.height.toFixed(2),
				name: name,
				ext: ext
			};
	}


	var obj = {};
	obj.exportLayersData = exportLayersData;
	return obj;

}());
