

function selectVisibleIn(layer){
	
	var idsetd = charIDToTypeID( "setd" );
	var desc2 = new ActionDescriptor();
	var idnull = charIDToTypeID( "null" );
	var ref1 = new ActionReference();
	var idChnl = charIDToTypeID( "Chnl" );
	var idfsel = charIDToTypeID( "fsel" );
	ref1.putProperty( idChnl, idfsel );
	desc2.putReference( idnull, ref1 );
	var idT = charIDToTypeID( "T   " );
	var ref2 = new ActionReference();
	var idChnl = charIDToTypeID( "Chnl" );
	var idChnl = charIDToTypeID( "Chnl" );
	var idTrsp = charIDToTypeID( "Trsp" );
	ref2.putEnumerated( idChnl, idChnl, idTrsp );
	var idLyr = charIDToTypeID( "Lyr " );
	ref2.putName( idLyr, layer.name );
	desc2.putReference( idT, ref2 );
	
	executeAction( idsetd, desc2, DialogModes.NO );    
}
