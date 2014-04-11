var DataExtractor = (function () {
    

    function convertPos(point) {
        if (app.coordinateSystem === CoordinateSystem.DOCUMENTCOORDINATESYSTEM) {
            point = app.activeDocument.convertCoordinate(point, CoordinateSystem.DOCUMENTCOORDINATESYSTEM, CoordinateSystem.ARTBOARDCOORDINATESYSTEM);
        }
        return point;
    }



    function getItemCoords(item) {
        
        //flog("getItemCoords() " + item.name);
        
        var vb = item.visibleBounds;
       

        var p1 = convertPos([vb[0], vb[1]]);
        var p2 = convertPos([vb[2], vb[3]]);
        
        var coords = {
            x: (p1[0]).toFixed(2),
            y: (p1[1] * -1).toFixed(2),
            r: (p2[0]).toFixed(2),
            b: (p2[1] * -1).toFixed(2)
        };
        coords.width = (item.width).toFixed(2);//(coords.r-coords.x).toFixed(2);//
        coords.height = (item.height).toFixed(2);//(coords.b-coords.y).toFixed(2);
                
        return coords;
    }


    function getItemsCoords(items) {
        
        var coords = getItemCoords(items[0]); 
            
        var gcoords = coords;
        
        var maxRight =  right;
        var maxBottom =  bottom;
        
        var count = items.length; 
        
        for (var i = 1; i < count; i++) {
            
            coords = getItemCoords(items[i]);

            var right =  coords.x + coords.width;
            var bottom =  coords.y + coords.height;
            //logtxt += coords.x + " vs " + gcoords.x +"\n" ;
            if(parseFloat(coords.x) < parseFloat(gcoords.x)) gcoords.x = coords.x;
            if(parseFloat(coords.y) < parseFloat(gcoords.y)) gcoords.y = coords.y;
            
            if(parseFloat(coords.r) > parseFloat(gcoords.r)) gcoords.r = coords.r;
            if(parseFloat(coords.b) > parseFloat(gcoords.b)) gcoords.b = coords.b;                
        }


        gcoords.width = (gcoords.r - gcoords.x).toFixed(2);
        gcoords.height = (gcoords.b - gcoords.y).toFixed(2);
        
        
        return gcoords;

    }


    function getLayersCoords(doc, getLayerParams, ignoreHidden) {
        
        var i = doc.artboards.getActiveArtboardIndex();
        var artb = doc.artboards[i];
        
        var data = {
                    name:doc.name,
                    width: Math.ceil(artb.artboardRect[2] - artb.artboardRect[0]),
                    height: Math.ceil(artb.artboardRect[1] - artb.artboardRect[3]),
                    layers:[]
                    };
        
        var count = doc.layers.length;
        
        for (var i = 0 ; i < count ; i++){
            
            var l = doc.layers[i];
            
            if(ignoreHidden && l.visible ==false) continue;
            
            var params = getLayerParams(l.name);
            
            if(params == null) continue;
            if(l.pageItems.length==0) continue;
            
            var d = getItemsCoords(l.pageItems);
            d.layername = l.name;
            d.name = params.name;
            
            if(params.exportType){    
                d.type = params.exportType;
                d.filename = params.name + "." + params.exportType;
            } else{
                d.type="div";
            }
            
            d.visible = l.visible;
            
            // export items data
            d.items=[];
            for ( var j = 0 ; j < l.pageItems.length ; j++){
                
                var item = l.pageItems[j];
                
                if(ignoreHidden && item.hidden) continue;
                
                // image file (aka normal) items
                if(item.name.indexOf(".")>0){
                    
                    var itemParams = getLayerParams(item.name);

                    var it = getItemCoords(item);
                    it.x -= d.x;
                    it.y -= d.y;
                    it.layername = item.name;
                    it.name = itemParams.name;
                    it.type = itemParams.exportType;
                    it.filename = itemParams.name + "." + itemParams.exportType;
                    it.visible = ! item.hidden;
                    d.items.push(it);
                                        
                }
                
                // other (aka special) items
                else {
                    
                    // "background" items are just meant to specify the background color of the parent layer
                    if(item.name =="#bgd") {
                        var col ;
                        if(item.fillColor.typename =="SpotColor") col = item.fillColor.spot.color;
                        else col = item.fillColor;
                        d.bgdColor = colTohex(col);
                        if(item.opacity<100) d.opacity = item.opacity /100;                        
                    }
                    
                    // text items carry text info over to the desc file
                    else if (item.name.indexOf("=text")>0) {
                        var it = getItemCoords(item);
                        it.type="txt";
                        it.name = item.name.split("=")[0];
                        it.x -= d.x;
                        it.y -= d.y;         
                        var tf = item;
                        var tr = tf.textRange;
                        var ca = tr.characterAttributes;
                        it.fontSize = ca.size;

                        var col ;
                        if(ca.fillColor.typename =="SpotColor") col = ca.fillColor.spot.color;
                        else col = ca.fillColor

                        it.fontColor = colTohex(col);
                        it.fontFamily = ca.textFont.family;
                        it.fontStyle = ca.textFont.style;
                        var align ="left";
                        if( tr.paragraphAttributes.justification==Justification.RIGHT) align = "right";
                        if( tr.paragraphAttributes.justification==Justification.CENTER) align = "center";
                        it.align = align;
                        it.text=tf.contents;
                        d.items.push(it);
                    }
                }
            }
            
            data.layers.push(d);        
        }
            
        return data;
        
    }
    
    function colTohex(col){
        
        function toHex(c) {
            var rhex = c.toString(16);
            return rhex.length === 1 ? "0" + rhex : rhex;
        }        
        return "#" + toHex(col.red) + toHex(col.green) + toHex(col.blue);
    }    

    var o = {};
    o.getLayersCoords = getLayersCoords;
    o.getItemsCoords = getItemsCoords;
    
    return o;

}());

