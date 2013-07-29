#include AltLayerExporter.jsx
#include DataExtractor.jsx
#include ../common/Utils.jsx
#include ../common/json2.js

$.exportLayersAndData = function (exportType, ignoreHidden, namingFunc, doc, destFolder) {
    
    if(!doc) doc = app.activeDocument;
    if(!destFolder) destFolder = Folder.selectDialog ("Select Destination Folder");
    if(!destFolder) return;
    
    var reg = new RegExp("\\s", "g");    
    
    if(!namingFunc) namingFunc = function(lname) {return lname.replace(reg, "-");};
    
    AltLayerExporter.exportLayers(doc, destFolder, exportType, ignoreHidden, namingFunc);

    var data = DataExtractor.getLayersCoords(doc);

    
    var ext = "svg"
    if(exportType==ExportType.PNG24) ext = "png";
    else if(exportType==ExportType.JPEG) ext = "jpg";
        
                            
    var count = data.layers.length;
    for ( var i = 0 ; i < count ; i++) {
        var l = data.layers[i];
        l.filename = l.name.replace(reg, "-");
        if(l.name.indexOf(".")===-1) l.filename += "." + ext;
    }
        
    
    var text = JSON.stringify(data, null, '\t');
    var filepath = destFolder.absoluteURI + "/data.json";
    saveTextFile(text, filepath);
            
}



var myDoc = app.activeDocument;

//var prefix = normalizeName(getFileNamePart(myDoc.name)) + "-";
//var naming = function (lName){
//    return prefix + normalizeName(lName);
//}

$.exportLayersAndData(ExportType.SVG, true, null, myDoc);
