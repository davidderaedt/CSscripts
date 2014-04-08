#include ExportLayersAndData.jsx

var imageParams = {
    precision: 1,
    svgFont: false,
    jpgQuality: 100,
    embedImages: true
};

var outputParams = {
    createJSON:true,
    toHTML:true,
    sepCss:true,
    toEdgeAnimate:false
};

var data = $.exportLayersAndData(imageParams, outputParams);

//makeLog("IllustratorLayerExporter");
