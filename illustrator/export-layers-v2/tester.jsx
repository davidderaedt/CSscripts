#include ExportLayersAndData.jsx

var imageParams = {
    precision: 1,
    svgFont: false,
    jpgQuality: 100,
    embedImages: true,
    svgCssPropLoc:0 // 0 = presentation att, 1 = style el, 2 = style att
};

var outputParams = {
    createJSON:true,
    toHTML:true,
    sepCss:true,
    toEdgeAnimate:false
};

var data = $.exportLayersAndData(imageParams, outputParams);

//makeLog("IllustratorLayerExporter");
