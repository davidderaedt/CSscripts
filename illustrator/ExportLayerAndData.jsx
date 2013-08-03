#include AltLayerExporter.jsx
#include DataExtractor.jsx
#include ../common/Utils.jsx
#include ../common/json2.js

$.exportLayersAndData = function (defaultExportType, ignoreHidden, namingFunc, doc, destFolder) {
    
    if(!doc) doc = app.activeDocument;
    if(!destFolder) destFolder = Folder.selectDialog ("Select Destination Folder");
    if(!destFolder) return;
    
    var reg = new RegExp("\\s", "g");
        
    if(!namingFunc) namingFunc = function(lname) {return lname.replace(reg, "-");};
    
    
    function readLayerOptions(lName) {
        var obj = {};
        obj.ignore = lName.substring(lName.length-1) == "!";
        var nameParts = lName.split(".");
        if(nameParts.length > 1) obj.exportType = nameParts[1];
        else obj.exportType = defaultExportType;
        
        obj.name = namingFunc(nameParts[0]);
        
        obj.useText = (lName.indexOf("-txt")>-1)
        return obj;
    }
    
    
    AltLayerExporter.exportLayers(doc, destFolder, ignoreHidden, readLayerOptions);

    var data = DataExtractor.getLayersCoords(doc, readLayerOptions); 
    
    var text = JSON.stringify(data, null, '\t');
    var filepath = destFolder.absoluteURI + "/data.json";
    saveTextFile(text, filepath);
            
}

var myDoc = app.activeDocument;

$.exportLayersAndData("svg", true, null, myDoc);
