/*
This FlashPro plugin will export spritesheet 
data for createJS as JSON file
*/

function getPluginInfo(lang)
{
	pluginInfo = new Object();
	pluginInfo.id = "easeljs-json";
	pluginInfo.name = "easeljs-json";
	pluginInfo.ext = "json";
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
var firstSymbol = true;

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
				s += ", \n";
			else
				s += "{\n";

			endFrameNumber = frameNumber + labelFrame.duration - 1;
			beginFrame = frameNumber;
			endFrame = endFrameNumber;
			s += '"'+labelFrame.name + "\":[" + beginFrame + "," + endFrame;

			if (controlFrame != null && controlFrame.name != null && controlFrame.name.length != 0) {				
				s += ", " + "\"" + controlFrame.name + "\"]";
			}
			else {
				s += ", true]";
			}


			frameNumber = endFrameNumber + 1;
			labelIndex = frameNumber;
			controlIndex = labelIndex;

			if (!hitSpan)
				helperFunctions = "";

			hitSpan = true;
		}
	}
	
	if (hitSpan)
		s += "\n}";


	return s;
}

function endSymbol(meta)
{
	var s = "";
	if (symbolItem != null)
	{
		symbolName = symbolName.replace(/\s+/g,"_");

		if(firstSymbol==false) {
			s += ",\n";
		}
		firstSymbol=false;

		s += '\n"'+symbolName+'":{';

		
		var animationData = DetermineAnimationData();

		s += "\"images\": [\"" + meta.image + "\"],\n "
		if (animationData != null && animationData.length != 0)
		{
			s += "\"frames\": [\n" + frameData + "],\n ";
			s += "\"animations\":" + animationData + "\n";
		}
		else
		{
			s += "\"frames\": [" + frameData + "]\n";
		}

		s+='\n}\n';

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
	return 	"{\n";
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
		frameData += ",\n";
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
	
	s += "}\n\n";

	return s;
}
