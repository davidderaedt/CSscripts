var logStr="";
function log(pStr){
    logStr+=pStr+"</br>";
}

function main(){
		
	if ( app.documents.length == 0 ) {	
		return;		
	}

	doStuff();
	
	return logStr;
}


function doStuff() {

    var pat = "c#";

	var doc = app.activeDocument;
    var layers = doc.layers;
    
    doRename(pat, layers);
}


function doRename(pat, layers) {
    
    var lCount = layers.length;
    
    var i;
    for ( i = 0 ; i < lCount; i++){
    
        var layer = layers[i];
        var newName = pat.replace("#", i+1);
        layer.name = newName;//"bla-" + i;
        
    }
    	
}


main();
