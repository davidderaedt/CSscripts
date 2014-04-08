function appendToSelNames(suffix) {
    
    
    var items = app.selection;
    var n = items.length;
    
    for ( var i = 0; i < n ; i ++) {
        var item = items[i];
        var index = item.name.lastIndexOf(".");
        
        if (index == -1){
            item.name += suffix;
        }
        else {
            var firstPart = item.name.substr(0, index);
            //log += firstPart +  suffix+", ";
            item.name = firstPart + suffix;
        }
        
    }
    
    // forces refresh
    app.selection=[];    
}


function appendToAllLayers(suffix){

    var doc = app.activeDocument;
    var n = doc.layers.length;
    for ( var i = 0; i < n ; i ++) {
        
        var layer = doc.layers[i];
        var index = layer.name.lastIndexOf(".");
        
        if (index == -1){
            layer.name += suffix;
        }
        else {
            var firstPart = layer.name.substr(0, index);
            //log += firstPart +  suffix+", ";
            layer.name = firstPart + suffix;
        }        
    }
    

}

//appendToSelNames(".svg");
//appendToAllLayers("");