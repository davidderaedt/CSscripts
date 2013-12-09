#include ExportLayersAndData.jsx

var globalParams = {
    exportType: "svg",
    precision: 2,    
    svgFont: false,
    jpgQuality: 100,
    embedImages: true
};

$.exportLayersAndData(globalParams, true);
