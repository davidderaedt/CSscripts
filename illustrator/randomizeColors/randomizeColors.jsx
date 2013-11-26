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
	
	var doc = app.activeDocument;
	var canRect = doc.artboards[0].artboardRect;
	var boardW = canRect[2];
	var boardH = -canRect[3];

	var swatches = doc.swatches.getSelected();
    
    if(doc.selection.length==0) {
	   alert("No items selected");        
    } else if(swatches.length == 0) {
	   alert("Please select swatches");
	} else {
	   randomizeColor(doc.selection, swatches);
    }
	
}

function randomizeColor (items, swatches) {

    var count = items.length;
    
    for (i = 0; i < count ; i++) {                
        var c = items[i];
        var swatchIndex = Math.round( Math.random() * ( swatches.length - 1 ) );
        c.fillColor = swatches[ swatchIndex ].color;
    
        var swatchIndex2 = Math.round( Math.random() * ( swatches.length - 1 ) );            
        c.strokeColor = swatches[ swatchIndex2 ].color;
    }
}

main();
