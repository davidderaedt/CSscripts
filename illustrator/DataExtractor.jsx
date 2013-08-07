var DataExtractor = (function () {
    

    function convertPos(point) {
        if (app.coordinateSystem === CoordinateSystem.DOCUMENTCOORDINATESYSTEM) {
            point = app.activeDocument.convertCoordinate(point, CoordinateSystem.DOCUMENTCOORDINATESYSTEM, CoordinateSystem.ARTBOARDCOORDINATESYSTEM);
        }
        return point;
    }



    function getItemCoords(item) {
        
        var vb = item.visibleBounds;

        var p1 = convertPos([vb[0], vb[1]]);
        var p2 = convertPos([vb[2], vb[3]]);
     
        return {
            x: (p1[0]).toFixed(2),
            y: (p1[1] * -1).toFixed(2),
            r: (p2[0]).toFixed(2),
            b: (p2[1] * -1).toFixed(2),
            width: (item.width).toFixed(2),
            height: (item.height).toFixed(2)
        };
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


    function getLayersCoords(doc, getLayerParams) {
        
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
            var params = getLayerParams(l.name);
            
            if(params == null) continue;
            if(l.pageItems.length==0) continue;
            
            var d = getItemsCoords(l.pageItems);
            d.layername = l.name;
            d.name = params.name;
            d.filename = params.name + "." + params.exportType;
            
            d.visible = l.visible;
            
            if(l.textFrames.length>0) {
                var t = l.textFrames[0];
                var tr = t.textRange
                var ca = tr.characterAttributes;
                d.fontSize = ca.size;
                d.fontColor = colTohex(ca.fillColor);
                d.fontFamily = ca.textFont.family;
                d.text=t.contents;
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

/*
#include ../common/json2.js

var d = DataExtractor.getLayersCoords(app.activeDocument);
var s = JSON.stringify(d, null, "\t");
s;
*/