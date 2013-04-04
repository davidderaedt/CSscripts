Flash Pro CS6 EaselJS Plugins
=================


Install flash pro plugins simply by copying the JSFL files in
*/Applications/Adobe Flash CS6/Common/Configuration/Sprite Sheet Plugins*
…or the equivalent path on Windows.

`easeljs2` works just like the original exporter, except that it stores classes in an object (`myGame`, by default) rather than in the global `window` object and it exposes the spritesheet folder as a variable named `spritesheetPath` in the generated JS file.

The JSFL file exposes various options at the top of the file, such as the default destination folder for the spritesheet, or the ability to get rid of methods which expose animations (see comments for more informations).


`easeljs-json` simply exports all data in JSON format rather than in a javascript file.

