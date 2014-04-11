#include AltLayerExporter.jsx
#include DataExtractor.jsx
#include ../../common/Utils.jsx
#include ../../common/json2.js
#include "../../edgeanimate/EdgeAnimateImporter.jsx"
#include HTMLExporter.jsx

$.exportLayersAndData = function (imageParams, outputParams, destFolder, ignoreHidden, doc) {
    
    if(!doc) doc = app.activeDocument;
    if(!ignoreHidden) ignoreHidden=true;
    
    if(!destFolder) destFolder = Folder.selectDialog ("Select Destination Folder");
    if(!destFolder) return;
    
    if(!outputParams){
        outputParams = {
            createJSON:false,
            toHTML:false,
            sepCss:false,
            toEdgeAnimate:false
        }
    }
    
    //safe naming    
    var reg = new RegExp("\\s", "g");
    var namingFunc = function(lname) {
        return lname.replace(reg, "-");
    };        
    
    // name-to-file-type logic
    function readLayerParams(lName) {
                
        var obj = {
            name:lName,
            exportType: null,
            svgFont: imageParams.svgFont,
            jpgQuality: imageParams.jpgQuality,
            precision: imageParams.precision,
            embedImages: imageParams.embedImages,
            svgCssPropLoc: imageParams.svgCssPropLoc
        };          
       
        var nameParts = lName.split(".");
        
        if(nameParts.length > 1) obj.exportType = nameParts[1];
        
        obj.name = namingFunc(nameParts[0]);
        
        return obj;
    }
    
      
    AltLayerExporter.exportLayers(app.activeDocument, destFolder, ignoreHidden, readLayerParams);

    var data = DataExtractor.getLayersCoords(doc, readLayerParams, ignoreHidden);
    
    if(outputParams.createJSON){
        var text = JSON.stringify(data, null, '\t');
        var filepath = destFolder.absoluteURI + "/data.json";
        saveTextFile(text, filepath);    
    }
    
    if(outputParams.toHTML){
        var htmlFolder = destFolder.parent;
        HTMLExporter.generateFrom(data, htmlFolder, destFolder.name, outputParams.sepCss);
    }
    
    if(outputParams.toEdgeAnimate){
        var anFile = File.openDialog ("Select the .an file of the destination Edge Animate project.");	
        if(anFile) EdgeAnimateImporter.doImport(anFile, data.layers);
    }
    
    return data;
}
