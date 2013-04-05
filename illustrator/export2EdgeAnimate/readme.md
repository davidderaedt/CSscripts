Illustrator to Edge Animate exporter
---------

>WARNING: This script is meant to be used by an upcoming (unofficial) panel / extension. If you are not a developer, you probably want to use the extension directly:

[DOWNLOAD THE PANEL HERE](https://dl.dropbox.com/u/112869/IllustratorEdgeAnimateExporter.zxp)

The underlying script exports the active Illustrator document to an Edge Animate project. Each layer is converted to a SVG or PNG file placed in the project's "images" folder. The project's `xxx_edge.js` dom array will also be modified to properly place each image onto the project's stage.

Note that only top level layers are exported. Each layer's content is flattened to a bitmap (PNG24) or vector (SVG) data, whatever its content. If your file doesn't use layers, consider using my `distributeSelectionToLayers.jsx` script which does exaclty that.


Known Issues

* Hidden layers will be ignored by the animate project but still exported in the image folder
* SVG export is slow, much slower than PNG.

Possible roadmap

* Symbols conversion (AI symbol to Animate symbol)
* Optionnaly export artboard size to stage size
* Optionnaly export in a div/group
* Allow sub-layers / sub-items grouped into divs/groups
* … your idea go here !
