var doc = app.activeDocument;

//params
promoteToLayers = true; // will transform each item to a layer
    
if (documents.length > 0){
        
    var saveOpts = new IllustratorSaveOptions();
    
    saveOpts.embedLinkedFiles = true;
    saveOpts.fontSubsetThreshold = 0.0
    saveOpts.pdfCompatible = false;
     
    var count = doc.layers.length;
    
    var originalFilePath = doc.path;
    var originalFile = new File(originalFilePath);
    
    
    var fileList = [];
    
    // duplicate as many docs as layers
    for (i=0; i < count; i++){
        
        var index = i;
        var layer = doc.layers[i];
        
        if(layer.locked) layer.locked = false;
        if(!layer.visible) layer.visible = true;

        docName = layer.name+".ai";    
        var newFile = new File ( doc.path + "/" + docName );
        doc.saveAs( newFile, saveOpts );
        fileList.push(newFile);

    }
    
    // open the docs
    for(var j = 0 ; j < count ; j++){
        
        var file = fileList[j];
        app.open (file);
        
        var curDoc = app.activeDocument;
        var layerKillList = [];
        
        // mark all layers but the one we want to keep
        for( var k = 0 ; k < count ; k++){                    
            if(k!=j) layerKillList.push(curDoc.layers[k]);
        }
        // remove them
        for( var l = 0 ; l < layerKillList.length ; l++) {
            layerKillList[l].remove();
        }
        
        if(promoteToLayers) {
            // promote items to layers
            promoteItemsToLayers(curDoc, curDoc.layers[0]);
            // remove the last (empty) layer
            curDoc.layers[curDoc.layers.length-1].remove();    
        }
    
        curDoc.save();
    
    }
    
    alert("done!");
}


function promoteItemsToLayers(doc, layer){

    var items = layer.pageItems;

    var n = items.length;

    for ( var a = n-1 ; a >=0 ; a--) {

        var item = items[a];
        var wasLocked = item.locked;
        var wasHidden = item.hidden;
        
        if(wasLocked) item.locked = false;
        if(wasHidden) item.hidden = false;
        
        var newlayer = doc.layers.add();
        item.move(newlayer,ElementPlacement.PLACEATBEGINNING);
        
        if(wasLocked) newlayer.locked = true;
        if(wasHidden) newlayer.visible = false;
        
        newlayer.name = item.name;
    }
}
