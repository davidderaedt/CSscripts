

function replaceCurrentSO(filePath){
    
    var idplacedLayerReplaceContents = stringIDToTypeID( "placedLayerReplaceContents" );
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    desc.putPath( idnull, new File(filePath) );
    executeAction( idplacedLayerReplaceContents, desc, DialogModes.NO );    
} 


function replaceAllSmartObjects(filePath) {
    
    var doc = app.activeDocument;
    
    var layers = doc.artLayers;
    
    var i;
    for (i = 0; i < layers.length; i++) {
        var l = layers[i];
        if (l.kind == LayerKind.SMARTOBJECT) {
            //log(l.name + ' is a smartObject'); 
            doc.activeLayer = l;
            replaceCurrentSO(filePath);
        }
    }
}


var path =  "/Users/dderaedt/Creative Cloud Files/paperjs.png";

replaceAllSmartObjects(path);
