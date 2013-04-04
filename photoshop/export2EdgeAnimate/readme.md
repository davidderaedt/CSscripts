# Photoshop To Edge Animate Exporter


>WARNING: This is an early preview for an upcoming (unofficial) panel / extension. This script will modify the original .an file so please backup and use at you own risk! 

Feeling adventurous? You can try the panel here:

[DOWNLOAD EDGE ANIMATE EXTENSION PREVIEW](https://dl.dropbox.com/u/112869/panel-and-testfiles.zip)

## Description

This script exports the active Photoshop document to an Edge Animate project. Each layer is converted to a PNG file placed in the project's "images" folder. The project's `xxx_edge.js` dom array will also be modified to properly place each image onto the project's stage.

The script is recursive, meaning that layer groups will be correctly parsed and converted to a corresponding group (div) in the Edge Animate project.

##Known issues

* Adjustement layers are not supported
* Text is always rasterized
* Edge animate groups are placed in the top left corner of the stage and artificially scaled at 500px * 500px. Items should however be correctly positionned