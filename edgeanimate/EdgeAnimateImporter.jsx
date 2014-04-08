// (c) Copyright 2013 Adobe Systems, Inc. All rights reserved.
// author David Deraedt

#include "../common/Utils.jsx"

var EdgeAnimateImporter = (function () {


	/**
	Imports the given itemsData array to a given EdgeAnimate project
	The project's xxx_edge.js dom array will also be modified to properly place
	each image onto the project's stage.
	Warning: this script will modify the original an file
	@public
	@param {File} anFile The destination Edge Animate project file
	@param {Array} itemsData Array of item objects as exported by LayerDataExtractor	
	*/

	function importToAnimate(anFile, itemsData){
		
		var destFolder = anFile.parent;
		
		var anName = getFileNamePart(anFile.name);

		var imgFolder = new Folder(destFolder.path +"/"+ destFolder.name + "/images/");
		if(!imgFolder.exists) imgFolder.create();
		var dest = imgFolder.absoluteURI+"/";

		var outputTxt = processItems(itemsData);
				
		// edge animate code generation
		//log("OUTPUT: " + outputTxt);
		var edgeFile = new File(destFolder.absoluteURI+"/" + anName + "_edge.js");
		var edgeFileString = getFileString(edgeFile.absoluteURI);	
		var newFileString = edgeFileString.replace("dom: [", "dom: [" + outputTxt);
		saveTextFile(newFileString, edgeFile);
		
	}


	function processItems(itemsData){
		
		var outputTxt = "";
		
		var n = itemsData.length;
		
		for ( var j = n-1 ; j >= 0 ; j--){
			
			var item = itemsData[j];			

			if ( (!item.filename) && item.items) {
				// TODO: correct group coords
				outputTxt += outputGroupData(item.name, item.x, item.y, item.width, item.height);
				outputTxt += processItems(item.items);
				outputTxt += "]},";
			}
			else outputTxt += addItemData(item);		
		}		
	
		return outputTxt;
	}


	function addItemData(item){
			
		var txt = "";
		
		txt += "\t\t{\n\t\t\tid:'" + item.name + "',\n";
		txt += "\t\t\ttype:'image',\n";
		txt += "\t\t\trect:[" + "'" + item.x + "', '" + item.y + "', '" + item.width + "px', '" + item.height + "px', " + "'auto','auto'],\n";
		txt += "\t\t\tfill:[\"rgba(0,0,0,0)\",im+\"" + item.filename +"\",'0px','0px'" + "]\n";
		txt += "\t\t},\n";
		return txt;		
	}


	function outputGroupData(name, x, y, w, h){

		var txt = "";
				
		txt += "\t\t{\n\t\t\tid:'" + name + "',\n";
		txt += "\t\t\ttype:'group',\n";
		txt += "\t\t\trect:[" + "'" + x + "', '" + y + "', '" + w + "px', '" + h + "px', " + "'auto','auto'],\n";
		txt += "\t\tc:[\n";
		return txt;		
	}


	var obj = {};
	obj.doImport = importToAnimate;
	return obj;
	
}());

