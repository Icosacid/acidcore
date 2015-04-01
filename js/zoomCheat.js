/**
 * zoomCheat.js
 * 		by
 * Alexandre Andrieux @2014
 *
 * zoomCheat.js function rescales the main display div to fit the whole display by preserving the height/width ratio
 *
 * NEEDS JQUERY to be loaded first
 * and the existence of a <body> child div with the id #whole (otherwise, you know, just change the selectors...)
 * #whole width and height must be specified, they will define the ratio
 *
 */

var finalRatio;

jQuery(document).ready(function(){
	var bodyWidthPX = jQuery('body').css('width');
	var bodyHeightPX = jQuery('body').css('height');
	var wholeWidthPX = jQuery('#whole').css('width');
	var wholeHeightPX = jQuery('#whole').css('height');
	
	var bodyWidth = bodyWidthPX.substr(0,bodyWidthPX.length-2);
	var bodyHeight = bodyHeightPX.substr(0,bodyHeightPX.length-2);
	var wholeWidth = wholeWidthPX.substr(0,wholeWidthPX.length-2);
	var wholeHeight = wholeHeightPX.substr(0,wholeHeightPX.length-2);
	// #whole should be around 1010px * 544px to fit most desktop screen resolution (or with equivalent ratio)
	
	// Which of the height and width is the smallest compared to the standard values?
	var ratioWidth = bodyWidth / wholeWidth;
	var ratioHeight = bodyHeight / wholeHeight;
	
	// The #whole div will be scaled based on the smallest of those 2 values
	// It will also be centered in body
	if (ratioHeight < ratioWidth){
		// Height is the base for rescale
		reScale(ratioHeight);
		// centering #whole
		var newWidth = ratioHeight * wholeWidth;
		jQuery('#whole').css('left',(bodyWidth-newWidth)/2+"px");
	}
	else{
		// Width is the base for rescale
		reScale(ratioWidth);
		// Centering #whole
		var newHeight = ratioWidth * wholeHeight;
		jQuery('#whole').css('top',(bodyHeight-newHeight)/2+"px");
	}
	
});

function reScale(ratio){
	console.log("#whole div rescaled with ratio "+ratio);
	var whole = jQuery('#whole');
	whole.css('transform','scale('+ratio+')');
	whole.css('-webkit-transform','scale('+ratio+')');
	whole.css('-webkit-transform-origin','0 0');
	whole.css('-moz-transform','scale('+ratio+')');
	whole.css('-moz-transform-origin','0 0');
	whole.css('-o-transform','scale('+ratio+')');
	whole.css('-o-transform-origin','0 0');
	whole.css('-ms-transform','scale('+ratio+')');
	whole.css('-ms-transform-origin','0 0');
	
	finalRatio = ratio;
}