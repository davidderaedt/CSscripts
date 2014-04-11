var HTMLExporter = (function () {
    
    
    var le = "\n";
    var tab = "\t";    
    var imgFolderName="images";
    var createSizeProps=true;
    var separateCSS;
    
    
	function generateFrom(compData, destFolder, pImgFolderName, pSepCSS){

        imgFolderName = pImgFolderName;
        separateCSS = pSepCSS;
        
		output = processData(compData);
        
        
		var htmlFile = new File(destFolder.absoluteURI+"/index.html");
        saveTextFile(output.html, htmlFile);
        
        if(pSepCSS){
            var cssFile = new File(destFolder.absoluteURI+"/styles.css");
            saveTextFile(output.css, cssFile);        
        }
		
	}
    
    
    function processData(data){
        
        var itemsData = data.layers;
        var compName = data.name.split(".")[0];
        
        var txtData = processItems(itemsData, "");
                  
        var htmlTxt="";
        var mainDiv = '<div id="' + compName + '">' + le + txtData.html + le + "</div>" + le;
        
        if(separateCSS){
            htmlTxt="<!DOCTYPE>"+le+"<html>"+le+"<head>"+le+"<link href='styles.css' rel='stylesheet' >"+le+"</head>"+le+"<body>"+le+mainDiv+le+"</body>"+le+"</html>";
        }
        else {
            htmlTxt="<!DOCTYPE>"+le+"<html>"+le+"<body>"+le+"<style>"+le+txtData.css+le+"</style>"+le+mainDiv+le+"</body>"+le+"</html>";
        }
        
        return {
            html:htmlTxt,
            css:txtData.css
        }
    }
    
    
    function processItems(itemsData, stab){
        
        var htmltxt = "";
        var cssTx = "";
        
        for (var i=itemsData.length-1; i>=0 ; i--){
        
            var item = itemsData[i];
            var isDiv = (item.type=="div");
            var isText = (item.type =="txt");
            if(!item.visible) continue;
            
            if (isDiv) {
                htmltxt += stab + '\t<div id="' + item.name + '">' ;
                if(item.items.length>0){
                    var subData = processItems(item.items, stab+tab);
                    htmltxt += le + subData.html + tab + "</div>" + le;
                    cssTx += subData.css + le;
                }
                else htmltxt += stab + "</div>" + le;
            } else if (isText) {
                var find = '\r';
                var re = new RegExp(find, 'g');                
                var htmlTxt = item.text.replace(re, "<br>");
                htmltxt +=  stab + tab + '<p id="' + item.name + '">' + htmlTxt + '</p>' + le;
            } 
            
            else {
                htmltxt +=  stab + tab + '<img id="' + item.name + '" src="' + imgFolderName+'/' + item.filename + '"/>' + le;
            }
            
            
            // CSS
           cssTx += getCSS(item, isDiv, isText);
        }
        
        
        return {html:htmltxt, css:cssTx};
    
    }
    
    function getCSS(item, isDiv, isText){
        var cssTxt ="";
        cssTxt += "#" + item.name + "{" + le;
        cssTxt += tab + "position:absolute;" + le;
        cssTxt += tab + "left:"+ Math.round(item.x) + "px;" + le;
        cssTxt += tab + "top:" + Math.round(item.y) + "px;" + le;
        
        if(createSizeProps){
            cssTxt += tab + "width:" + Math.round(item.width) + "px;" + le;
            cssTxt += tab + "height:" + Math.round(item.height) + "px;" + le;    
        }

        if(item.bgdColor){ 
            cssTxt += tab + "background-color:" + item.bgdColor + ";" + le;
            if(item.opacity) cssTxt += tab + "opacity:" + item.opacity + ";" + le;
        } 


        if(isText) { 
            cssTxt += tab + "font-family:" + item.fontFamily + ";" + le;
            cssTxt += tab + "font-size:" + item.fontSize + ";" + le;
            cssTxt += tab + "color:" + item.fontColor + ";" + le;
            cssTxt += tab + "font-weight:" + item.fontStyle + ";" + le;
            if(item.align !="left")  cssTxt += tab + "text-align:" + item.align + ";" + le;
            cssTxt += tab + "margin:0px;" + le;
        }


        cssTxt += "}" + le + le;
        
        return cssTxt;
        
    }
    
	var obj = {};
	obj.generateFrom = generateFrom;
	return obj;
	
}());    