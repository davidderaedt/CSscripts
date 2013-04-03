// (c) Copyright 2012 Adobe Systems, Inc. All rights reserved.
// Written by David Deraedt

#include "../common/Utils.jsx"

// An EASELJS data exporter for use with SpriteExporter

var EaselJSExporter = (function () {

	// Default frequency for all animations
	var defaultFrequency = 4;

	// Path to the folder containing the spriteSheets, relative to the HTML page
	var spriteSheetFolder = "sprites";

	// Library name (the object holding sprite classes in the window object).
	var libName = "spriteLib";


	var le = "\n";
	var spriteName ="";
	var animsTxt = "";
	var frameTxt = "";
	var outputTxt = "";
	var spritesTxt ="";
	var imageName="";

	var exporter={};

	var template1;
	var template2;


	exporter.beginExport = function (pImageName){
		
		imageName = pImageName;
		
		var where;
		try {
		  var FORCEERROR = FORCERRROR;
		}
		catch( err ) {
		  where = File(err.fileName);
		}
		var dir =  where.parent;
	   
		template1 = getFileString(dir + "/template1.txt");
		template2 = getFileString(dir + "/template2.txt");		
		
	}


	exporter.addSprite = function(name){
		spriteName=name;
		animsTxt = "";
		framesTxt = "";
	}

	exporter.addAnimation = function(name){
		
		animsTxt += le+"\t" + name + ":{ frames:[";
	}

	exporter.addFrame = function(frameCount, name, destx, desty, w, h){
		// Add frames : x, y, width, height, imageIndex, regX, regY
		framesTxt += le+"\t[" + destx + ", " + desty + ", " + w + ", " + h + ", 0, 0, 0],";
		
		// Add frame index to animation data
		animsTxt += frameCount + ", ";
		
		// Multiply frames as specified by the name
		var sepIndex = name.indexOf(" x");
		if(sepIndex>-1) {
			var repeat = Number(name.slice(sepIndex+2));
			for (var j = 0 ; j < repeat-1 ; j++)  animsTxt += frameCount + ", ";
		}
	}


	exporter.endAnimation = function(){
		animsTxt += "], frequency:" + defaultFrequency + ", next:true},";	
	}


	exporter.exportSprite = function(){

		var data={
				spriteName: spriteName,
				frameData: "[" + framesTxt + "]",
				animationData: "{" + animsTxt + "}"
			};
	
		spritesTxt += processTemplate(template2, data) + le;
		
	}


	exporter.endExport = function () {

		var data = {
				libName: libName,
				imageName: imageName,
				folder: spriteSheetFolder,
				sprites: spritesTxt
			};
	
		outputTxt = processTemplate(template1, data);
	}

	exporter.getOutput = function(){
		return outputTxt;
	}

	return exporter;

}());
