var logStr="";
function log(pStr){
    logStr+=pStr+"</br>";
}

function main(){
		
	if ( app.documents.length == 0 ) {	
		$.writeln("No active doc");		
		return;		
	}

	drawStuff();
	
	return logStr;
}


function drawStuff() {
	
	var doc = app.activeDocument;
	var canRect = doc.artboards[doc.artboards.getActiveArtboardIndex()].artboardRect;
	var boardW = canRect[2] - canRect[0];
	var boardH = -canRect[3] + canRect[1];

    
	if(doc.selection.length == 0) {
	   alert("Nothing selected");
	} else {
	   fillWithItem(app.activeDocument.selection[0], boardW, boardH);
    }
	
}


function fillWithItem(shape, width, height) {

    var itemWidth = shape.width;
    var itemHeight = shape.height;
    
    var col;
    var row; 
    var colCount = Math.ceil(width / itemWidth) ;
    var rowCount =  Math.ceil(height / itemHeight) ;
    
    var count = 0;
    
    
    for (col = 0; col < colCount ; col++) {
        
        for (row = 0; row < rowCount ; row++) {
            
            var c = shape.duplicate(app.activeDocument, ElementPlacement.PLACEATEND);
            
            var xpos = col * itemWidth;
            var ypos =  (row * itemHeight) * -1;
            
            c.position = [xpos, ypos];
          
            count++;
        }
    }
    log( count + " shapes created");
}


main();
