/*Options*/

// The directory where your sheets are stored, relative to your HTML file
var imageDirectory="sprites/";
// Whether or not you want to expose animations as functions
var useHelperFunctions = true;
// The global object in which to store sprite classes. 
// e.g. window.myGame.DarkKnight, where DarkKnight is your MovieClip
var libObjName = "myGame";

/*End of options*/

function getPluginInfo(lang)
{
	pluginInfo = new Object();
	pluginInfo.id = "easeljs2";
	pluginInfo.name = "easeljs2";
	pluginInfo.ext = "js";
	pluginInfo.capabilities = new Object();
	pluginInfo.capabilities.canRotate = false;
	pluginInfo.capabilities.canTrim = true;
	pluginInfo.capabilities.canShapePad = true;
	pluginInfo.capabilities.canBorderPad = true;
	pluginInfo.capabilities.canStackDuplicateFrames = true;
	return pluginInfo;
}
var helperFunctions = null;
var symbolItem = null;
var symbolName = null;
var globalMeta = null;
var frameData = "";

function initializeVars()
{
	helperFunctions = null;
	symbolItem = null;
	symbolName = null;
	frameData = "";
}

function DetermineAnimationData()
{
	var	labelLayer = null;
	var controlLayer = null;
	var layers = symbolItem.timeline.layers;

	var i;
	for (i = 0; i < layers.length; i++)
	{
		cmpName = layers[i].name.toLowerCase();
		if (cmpName == "labels")
			labelLayer = layers[i];

		if (cmpName == "control")
			controlLayer = layers[i];
	}

	helperFunctions = null;

	if (labelLayer == null)
		return ""

	var labelFrame = null;
	var controlFrame = null;
	var labelIndex = 0;
	var controlIndex = 0;
	var frameNumber = 0;
	var hitSpan = false;
	var endFrameNumber = 0;

	var s = "";

	while (labelIndex < labelLayer.frames.length)
	{
		labelFrame = labelLayer.frames[labelIndex++];
		if (controlLayer)
			controlFrame = controlLayer.frames[controlIndex++];

		
		if (labelFrame.name != null)
		{
			if (hitSpan)
				s += ", ";
			else
				s += "{";

			endFrameNumber = frameNumber + labelFrame.duration - 1;
			beginFrame = frameNumber;
			endFrame = endFrameNumber;
			s += labelFrame.name + ":[" + beginFrame + "," + endFrame;
			if (controlFrame != null && controlFrame.name != null && controlFrame.name.length != 0)
				s += ", " + "\"" + controlFrame.name + "\"]";
			else
				s += ", true]";

			frameNumber = endFrameNumber + 1;
			labelIndex = frameNumber;
			controlIndex = labelIndex;

			if (!hitSpan)
				helperFunctions = "";

			if(useHelperFunctions) {
				helperFunctions += symbolName + "_p." + labelFrame.name + " = function(){\n";
				helperFunctions += "\tthis.gotoAndPlay(\""+labelFrame.name+"\");\n";
				helperFunctions += "}\n";
			}

			hitSpan = true;
		}
	}
	
	if (hitSpan)
		s += "}";


	return s;
}

function endSymbol(meta)
{
	var s = "";
	if (symbolItem != null)
	{
		symbolName = symbolName.replace(/\s+/g,"_");
		
		var animationData = DetermineAnimationData();
		var proto = symbolName + "_p";
		
		s += "\nvar "+symbolName + " = function() {\n";
		s += "\tthis.initialize();\n"
		s += "}\n";

		s += symbolName + "._SpriteSheet = new createjs.SpriteSheet({images: [spritesheetPath], "
		if (animationData != null && animationData.length != 0)
		{
			s += "frames: [" + frameData + "], ";
			s += " animations: " + animationData + "});\n";
		}
		else
		{
			s += "frames: [" + frameData + "]});\n";
		}
		
		s += "var " + proto + " = " + symbolName + ".prototype = new createjs.BitmapAnimation();\n";
		s += "" + proto + ".BitmapAnimation_initialize = " + proto + ".initialize;\n";
		s += "" + proto + ".initialize = function() {\n"
		s += "\tthis.BitmapAnimation_initialize(" + symbolName + "._SpriteSheet);\n";
		s += "\tthis.paused = false;\n";
		s += "}\n";

		if (helperFunctions != null)
			s += helperFunctions;
		
		s += "scope." + symbolName + " = " + symbolName + ";\n";

		// cleanup
		initializeVars();
	}
	return s;
}

function beginExport(meta)
{
	initializeVars();
	startFrameNumber = 0;
	globalMeta = meta;

	var str = "if (!window."+libObjName+") { window."+libObjName+" = {}; }\n(function(scope) {\n";
	str += "var spritesheetPath = \""+imageDirectory+meta.image+"\";\n";	

	return 	str;
}

function frameExport(frame)
{
	var s = "";
	if (symbolName != frame.symbolName)
	{
		s = endSymbol(globalMeta);

		symbolItem = frame.symbol;
		symbolName = frame.symbolName;
	}
	else
	{
		frameData += ",";
	}
	
	frameData += "[" + frame.frame.x + "," + frame.frame.y + "," + frame.frame.w + "," + frame.frame.h + ",0,";
	if (frame.trimmed)
	{
		frameData += (frame.registrationPoint.x - frame.offsetInSource.x) + "," + (frame.registrationPoint.y - frame.offsetInSource.y);
	}
	else
	{
		frameData += frame.registrationPoint.x + "," + frame.registrationPoint.y;
	}
	frameData += "]";
	
	return s;
}

function endExport(meta)
{
	var	s = endSymbol(globalMeta);
	
	globalMeta = null;
	
	s += "}(window."+libObjName+"));\n\n";

	return s;
}
