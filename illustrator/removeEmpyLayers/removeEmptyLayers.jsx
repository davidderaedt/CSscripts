var logStr="";
function log(pStr){
    logStr+=pStr+"</br>";
}

var removable;

function main(){
		
	if ( app.documents.length == 0 ) {	
		return;		
	}

	doStuff();
	
	return logStr;
}




function doStuff() {

	var doc = app.activeDocument;
    var docLayers = doc.layers;
    
    removable = [];
    markAsRemovableIn(docLayers);
    removeLayers(removable);
}


function markAsRemovableIn(layers) {

    var lCount = layers.length;
    
    var i;
    for ( i = 0 ; i < lCount; i++){
    
        var layer = layers[i];
        
        if(layer.layers.length > 0){
            markAsRemovableIn(layer.layers);
        } else if(layer.pageItems.length==0) {
            removable.push(layer);
        }
        
    }    	

}

function removeLayers(layers) {
    
    var lCount = layers.length;
    
    var i;
    for ( i = 0 ; i < lCount; i++) {
        var layer = layers[i];
        layer.remove();
        
    }    
}




main();
