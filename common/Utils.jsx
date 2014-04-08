// (c) Copyright 2012 Adobe Systems, Inc. All rights reserved.
// Written by David Deraedt

function clog(pText){
	$.writeln(pText);
}


var _logtxt="";
function flog(pText){
	_logtxt+=pText+"\n";
}
function makeLog(pAppName){
    var supportDir = new Folder(Folder.userData.absoluteURI+"/"+pAppName);
    if(!supportDir.exists) supportDir.create();
    var _logFile = new File(supportDir.absoluteURI+"/log.txt");
    saveTextFile(_logtxt, _logFile);   
}

function inspectObj(obj){
	var txt = "";
	for (var z in obj) {
		txt += z + ":" + obj[z] + "\n";
	}
	return txt;
}


function inspectArray(pArray){
	
	var n = pArray.length;

	for ( var i = 0 ; i < n ; i ++){
		var obj = pArray[i];
		log(inspectObj(obj));	
		log("***");	
	}

}


function processTemplate(template, rep) {
	
	var txt = template;
	
	for( var z in rep) {
		
		var reg = new RegExp("@{"+z+"}", "g");
		txt = txt.replace (reg, rep[z]);
	}
	
	return txt;
}



function normalizeName(name){
	
	var reg = new RegExp("\\s", "g");		
	return name.replace(reg, "_");
}


function setLayersVisibility(doc, visible) {
	
	var n = doc.layers.length;
	for ( var i = 0 ; i < n ; i++){
		var l = doc.layers[i];
		l.visible = visible;
	}
}


/*

	FILE UTILS
*/

function getFileString(path){
	
	var txt ="" ;
	var file = new File(path);
	if(!file.exists){
		alert("no such file");
	}
	else{
		file.open("r");	
		txt = file.read();		
		file.close();
		return txt;	
	}
}

function getFileNamePart(filename){
	var index = filename.lastIndexOf (".");
	return filename.substring (0, index);
	
}

function getFileNameExtPart(filename){
	var index = filename.lastIndexOf (".");
	return filename.substring (index+1);
}



// hack to get the script parent
function getParentDir() {
   var where;
   try {
      var FORCEERROR = FORCERRROR;
   }
   catch( err ) {
      where = File(err.fileName);
   }
   return where.parent;
}


function saveTextFile(pText, filepath) {
		
    // get OS specific linefeed
    var fileLineFeed; 
    if ($.os.search(/windows/i) != -1) {
            fileLineFeed = "Windows";
    } else {
		fileLineFeed = "Unix";
	}
	
	
    fileOut = new File(filepath);
    fileOut.lineFeed = fileLineFeed;
    fileOut.open("w", "TEXT", "????");
    fileOut.write(pText);
    fileOut.close();
}


