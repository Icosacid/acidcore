/**
 * spreadSVG.js
 * 		by
 * Alexandre Andrieux @2014
 *
 * spreadSVG.js is a library of graphics effects you can spread in your DOM
 * It will insert <svg> components in the background of the node of your choice
 * On your way down, feel free to read comments and discover the design possibilities
 * 
 * NEEDS JQUERY to be loaded first
 */

function spreadSVG(selector, layoutType, extraArgArray) {

	var width = jQuery(selector).css('width');
	width = width.substr(0, width.length-2);
	var height = jQuery(selector).css('height');
	height = height.substr(0, height.length-2);
	
	var htmlCode = "";
	var svgOpen = '<svg xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">';
	var svgClose = '</svg>';
	var blackBackground = '<svg xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;background:black;"></svg>'
	
	if (layoutType == 1) {/* Background rotation circle */
		var rotRadius = 0.7*Math.min(width, height)/2;
		var circleRadius = 30;
		
		htmlCode = htmlCode.concat(svgOpen);
		htmlCode = htmlCode.concat('<circle class="innerCircle" stroke="rgba(255,255,255,0.5)" stroke-width="2" fill="rgba(0,0,0,0.3)" />');
		htmlCode = htmlCode.concat(svgClose);
		
		// Insert before child nodes to display as a background
		jQuery(selector).prepend(htmlCode);
		var angle = 0;
		var centerLeft = width/2;
		var centerTop = height/2;
		var time = 0;
		jQuery(selector + ' .innerCircle').attr('r', circleRadius);
		
		setInterval(function() {
			angle += 50/360;
			var localLeft = centerLeft + rotRadius * Math.cos(angle);
			var localTop = centerTop - rotRadius * Math.sin(angle);
			jQuery(selector + ' .innerCircle').attr('cx', localLeft);
			jQuery(selector + ' .innerCircle').attr('cy', localTop);
		}, 50);
	} else if (layoutType == 2) {/* Orbiting circle */
		
		var rotXRadius = 0.7*Math.min(width, height)/2;
		var rotYRadius = 0.4*Math.min(width, height)/2;
		htmlCode = htmlCode.concat(svgOpen);
		htmlCode = htmlCode.concat('<circle class="innerCircle" stroke="rgba(255,255,255,0.5)" stroke-width="2" fill="rgba(250,150,0,1)" />');
		htmlCode = htmlCode.concat(svgClose);
		// Insert before child nodes to display as a background
		jQuery(selector).prepend(htmlCode);
		var angle = 0;
		var centerLeft = width/2;
		var centerTop = height/2;
		var time = 0;
		var front = false;
		var done = false;
		
		setInterval(function() {
		
			angle += 8/360*2*Math.PI;
			
			var moduloAngle = angle % (2*Math.PI);
			if (moduloAngle < Math.PI) {
				done = (front == false);
				front = false;
			} else {
				done = (front == true);
				front = true;
			}
			if (front && !done) {
				//Remove from back and put front
				//console.log("front and not done yet");
				jQuery(selector + ' .innerCircle').remove();
				//In front
				jQuery(selector).append(htmlCode);
				done = true;
			}
			if (!front && !done) {
				//console.log("back and not done yet");
				jQuery(selector + ' .innerCircle').remove();
				//Behind
				jQuery(selector).prepend(htmlCode);
				done = true;
			}
			var localLeft = centerLeft + rotXRadius * Math.cos(angle);
			var localTop = centerTop - rotYRadius * Math.sin(angle);
			var circleRadius = 25 - 12 * Math.sin(angle);
			jQuery(selector + ' .innerCircle').attr('cx', localLeft);
			jQuery(selector + ' .innerCircle').attr('cy', localTop);
			jQuery(selector + ' .innerCircle').attr('r', circleRadius);
		}, 60);
	} else if (layoutType == 3) {/* Library of randomly generated shapes */
		var randomPath = "";
		
		htmlCode = htmlCode.concat(svgOpen);
		
		if(extraArgArray[0] == 1) {/* Grey shapes */
			var thisPath = pathCreator(width/2, height/2, [0,359], 8, 100, width/10, 'close', false);
			htmlCode = htmlCode.concat('<path class="randomPath" d="' + thisPath + '" stroke="rgba(0,0,0,0.3)" stroke-width="' + 0 + '" fill="rgba(0,0,0,0.15)" />');
		} else if (extraArgArray[0] == 2) {/* Blue triangles with regular mesh */
			var thisPath = pathCreator(width/2, height/2, [0,359], 3, 500, width/30, 'notclose', false);
			htmlCode = htmlCode.concat('<path class="randomPath" d="' + thisPath + '" stroke="rgba(0,0,0,0.7)" stroke-width="' + Math.floor(width/500 + 1) + '" fill="rgba(150,50,190,0.2)" />');
		} else if (extraArgArray[0] == 3) {/* Grey shapes with 5 possible angles */
			var thisPath = pathCreator(width/2, height/2, [0, 359], 5, 100, width/15, 'close', false);
			htmlCode = htmlCode.concat('<path class="randomPath" d="' + thisPath + '" stroke="rgba(0,0,0,0.3)" stroke-width="' + Math.floor(width/500 + 1) + '" fill="rgba(0,0,0,0.15)" />');
		} else if (extraArgArray[0] == 4) {/* Micro blue triangles */
			var thisPath = pathCreator(width/2, height/2, [0, 360], 3,700,width/100,'close',false);
			htmlCode = htmlCode.concat('<path class="randomPath" d="' + thisPath + '" stroke="rgba(0,0,0,0.8)" stroke-width="' + Math.floor(width/500 + 1) + '" fill="rgba(50,150,190,0.4)" />');
		} else if (extraArgArray[0] == 5) {/* Blue harsh pattern */
			var thisPath = pathCreator(width/2, height/2, [0, 360], 20, 700, width/100, 'close', false);
			htmlCode = htmlCode.concat('<path class="randomPath" d="' + thisPath + '" stroke="rgba(0,0,0,0.8)" stroke-width="' + Math.floor(width/500 + 1) + '" fill="rgba(50,150,190,0.4)" />');
		} else if (extraArgArray[0] == 6) {/* Blue map - smooth */
			var thisPath = pathCreator(width/2, height/2, [0, 360], -1, 700, width/100, 'close', true, 30);
			htmlCode = htmlCode.concat('<path class="randomPath" d="' + thisPath + '" stroke="rgba(0,0,0,0.8)" stroke-width="' + Math.floor(width/500 + 1) + '" fill="rgba(50,150,190,0.4)" />');
		} else if (extraArgArray[0] == 7) {/* Blue map - crunchy */
			var thisPath = pathCreator(width/2, height/2, [0, 360], -1, 700, width/100, 'close', true, 60);
			htmlCode = htmlCode.concat('<path class="randomPath" d="' + thisPath + '" stroke="rgba(0,0,0,0.8)" stroke-width="' + Math.floor(width/500 + 1) + '" fill="rgba(50,150,190,0.4)" />');
		} else if (extraArgArray[0] == 8) {/* Red map - half crunchy */
			var thisPath = pathCreator(width/2, height/2, [0, 360], -1, 700, width/100, 'notclose', true, 25);
			htmlCode = htmlCode.concat('<path class="randomPath" d="' + thisPath + '" stroke="rgba(0,0,0,0.8)" stroke-width="' + Math.floor(width/500 + 1) + '" fill="rgba(200,0,0,0.4)" />');
		} else if (extraArgArray[0] == 9) {/* Blue map - mappy */
			var thisPath = pathCreator(width/2, height/2, [0, 360], -1, 700, width/100, 'notclose', true, 15);
			htmlCode = htmlCode.concat('<path class="randomPath" d="' + thisPath + '" stroke="rgba(0,0,0,0.8)" stroke-width="' + Math.floor(width/500 + 1) + '" fill="rgba(50,150,190,0.4)" />');
		} else if (extraArgArray[0] == 10) {/* Strokes from center */
			var thisPath = pathCreator(width/2, height/2, [0, 360], -1, 300, width/250, 'notclose', true, 15);
			htmlCode = htmlCode.concat('<path class="randomPath" d="' + thisPath + '" stroke="rgba(0,0,0,0.8)" stroke-width="' + Math.floor(width/500 + 1) + '" fill="transparent" />');
		} else if (extraArgArray[0] == 11) {/* Strokes from center - short radius */
			var thisPath = pathCreator(width/2, height/2, [0, 360], -1, 70, width/300, 'notclose', true, 15);
			htmlCode = htmlCode.concat('<path class="randomPath" d="' + thisPath + '" stroke="rgba(0,0,0,0.8)" stroke-width="' + Math.floor(width/500 + 1) + '" fill="transparent" />');
		} else if (extraArgArray[0] == 12) {/* Cracks starting from top left corner */
			var thisPath = pathCreator(0, 0, [270, 360], -1, 500, width/400, 'notclose', true, 10);
			htmlCode = htmlCode.concat('<path class="randomPath" d="' + thisPath + '" stroke="rgba(0,0,0,0.3)" stroke-width="' + Math.floor(width/700 + 1) + '" fill="transparent" />');
		} else if (extraArgArray[0] == 13) {/* Cracks starting from bottom right corner */
			var thisPath = pathCreator(width-1,height-1,[90,180],-1,500,width/400,'notclose',true,10);
			htmlCode = htmlCode.concat('<path class="randomPath" d="'+thisPath+'" stroke="rgba(0,0,0,0.3)" stroke-width="'+Math.floor(width/700+1)+'" fill="transparent" />');
		}
		if (extraArgArray[0] == 14) {/* White shape like == 1 in negative */
			jQuery(selector).prepend(blackBackground);
			var thisPath = pathCreator(width/2, height/2, [0, 359], 8, 100, width/10, 'close', false);
			htmlCode = htmlCode.concat('<path class="randomPath" d="' + thisPath + '" stroke="rgba(255,255,255,0.35)" stroke-width="' + 0 + '" fill="rgba(255,255,255,0.3)" />');
		}
		
		htmlCode = htmlCode.concat(svgClose);
		
		/* Insert before child nodes to display as a background */
		jQuery(selector).prepend(htmlCode);
	} else if (layoutType == 4) {/* Painting by my mum put in my old rum */
		
		jQuery(selector).css('background','black');
		
		htmlCode = htmlCode.concat(svgOpen);
		var howManyDoUwant = 10;
		
		var circlesXYmaxR = [];
		circlesXYmaxR = generateCirclesDataWithNoOverlapPlease(howManyDoUwant, width, height);
		for (var i = 0; i < howManyDoUwant; i++) {
		
			var numberOfCircles = 3 + Math.floor(Math.random()*4);
			var isItWhite = (Math.random() > 0.1);
			var circleColor = (isItWhite ? "rgba(255,255,255,1)" : "rgba(150,0,0,1)");
			
			var thickBase = 7;
			var narrowBase = 2;
			
			var centerX = circlesXYmaxR[0][i];
			var centerY = circlesXYmaxR[1][i];
			var maxRadius = circlesXYmaxR[2][i];
			
			var localCenterX = centerX;
			var localCenterY = centerY;
			
			/*** Like the painting my mum did and put in my old room, but randoOoOoOmly generated, mouahahaha ***/
			for (var j = 0; j < numberOfCircles; j++) {
				// Randomize central point
				// Linear function of the circle number, with little randomization around this value
				var circleRadius = maxRadius/numberOfCircles * (j + 1) * (0.8 + (1.2 - 0.8)*Math.random());
				var previousCircleRadius;
				// Randomize thickness, thick or narrow
				// Multiplied by a function increading with the radius
				var thickness = ((Math.random() > 0.3) ? thickBase : narrowBase) * (0.5 + (1 - 0.5)*(j + 1)/numberOfCircles);
				
				if (j == 0) {
					// First step is plain circle
					circleRadius = circleRadius * (0.5 + (1 - 0.5)*Math.random());
					previousCircleRadius = circleRadius;
					htmlCode = htmlCode.concat('<circle class="mumCircle" cx="' + centerX + '" cy="' + centerY + '" r="' + circleRadius + '" stroke="' + circleColor + '" stroke-width="' + narrowBase + '" fill="' + circleColor + '" />');
				} else if (j == numberOfCircles-1) {
					// Last circle has the same center and is thick
					var finalOffset = Math.sqrt(Math.pow(localCenterX - centerX, 2) + Math.pow(localCenterY - centerY, 2));
					// The last circle shouldn't intersect the previous
					var lastRadius = Math.max(maxRadius, finalOffset + previousCircleRadius);
					htmlCode = htmlCode.concat('<circle class="mumCircle" cx="' + centerX + '" cy="' + centerY + '" r="' + lastRadius + '" stroke="' + circleColor + '" stroke-width="' + thickBase + '" fill="transparent" />');
				} else {
					offsetAngleDeg = 360*Math.random();
					offsetAmplitude = maxRadius/numberOfCircles;
					localCenterX = localCenterX + offsetAmplitude*Math.cos(offsetAngleDeg*Math.PI/180);
					previousCircleRadius = circleRadius;
					htmlCode = htmlCode.concat('<circle class="mumCircle" cx="' + localCenterX + '" cy="' + localCenterY + '" r="' + circleRadius + '" stroke="' + circleColor + '" stroke-width="' + thickness + '" fill="transparent" />');
				}
			}
		}
		
		htmlCode = htmlCode.concat(svgClose);
		
		// Insert before child nodes to display as a foreground
		jQuery(selector).append(htmlCode);
	} else if (layoutType == 5) {/* Rectangle fractal lvl 1 */
		
		htmlCode = htmlCode.concat(svgOpen);
		
		var horizStepLength = width/50;
		var verticStepLength = height/50;
		var X1 = 0;
		var Y1 = 0;
		var X2 = width;
		var Y2 = 0;
		var X3 = width;
		var Y3 = height;
		var X4 = 0;
		var Y4 = height;
		var horizAngleRad = 0;
		var verticAngleRad = 0;
		var maxRect = 41;
		var strokeColor = 'rgba(0,0,0,0.7)';
		var strokeWidth = 2;
		
		if (extraArgArray[0] == 1) {
			//Default
		} else if (extraArgArray[0] == 2) {
			maxRect = 200;
		} else if (extraArgArray[0] == 3) {
			maxRect = 100;
		} else if (extraArgArray[0] == 4) {
			strokeColor = 'rgba(255,255,255,0.95)';
			strokeWidth = 10;
			jQuery(selector).prepend(blackBackground);
			horizStepLength = width/10;
			verticStepLength = height/10;
			maxRect = 7;
		} else if(extraArgArray[0] == 5) {
			strokeColor = 'rgba(0,0,0,0.05)';
			strokeWidth = 5;
			horizStepLength = width/20;
			verticStepLength = height/20;
			maxRect = 15;
		}
		
		/** Like the little concentric rectangle drawing I did in class when I was young **/
		for (var i = 0; i < maxRect; i++) {
			// Compute new vertices
			var sizeHoriz = Math.sqrt(Math.pow(X2 - X1, 2) + Math.pow(Y2 - Y1, 2));
			var sizeVertic = Math.sqrt(Math.pow(X3 - X2, 2) + Math.pow(Y3 - Y2, 2));
			
			var increaseX1by = horizStepLength * Math.cos(horizAngleRad);
			var increaseY1by = - horizStepLength * Math.sin(horizAngleRad);
			var increaseX2by = verticStepLength * Math.cos(verticAngleRad-Math.PI/2);
			var increaseY2by = - verticStepLength * Math.sin(verticAngleRad-Math.PI/2);
			var increaseX3by = horizStepLength * Math.cos(horizAngleRad-Math.PI);
			var increaseY3by = - horizStepLength * Math.sin(horizAngleRad-Math.PI);
			var increaseX4by = verticStepLength * Math.cos(verticAngleRad-3*Math.PI/2);
			var increaseY4by = - verticStepLength * Math.sin(verticAngleRad-3*Math.PI/2);
			
			X1 = parseFloat(X1) + parseFloat(increaseX1by);
			Y1 = parseFloat(Y1) + parseFloat(increaseY1by);
			X2 = parseFloat(X2) + parseFloat(increaseX2by);
			Y2 = parseFloat(Y2) + parseFloat(increaseY2by);
			X3 = parseFloat(X3) + parseFloat(increaseX3by);
			Y3 = parseFloat(Y3) + parseFloat(increaseY3by);
			X4 = parseFloat(X4) + parseFloat(increaseX4by);
			Y4 = parseFloat(Y4) + parseFloat(increaseY4by);
			
			// Increase angles for next time
			var verticIncreaseDistance = Math.sqrt(Math.pow(increaseX2by, 2) + Math.pow(increaseY2by, 2));
			var horizIncreaseDistance = Math.sqrt(Math.pow(increaseX1by, 2) + Math.pow(increaseY1by, 2));
			
			if (extraArgArray[0] == 2) {
				horizAngleRad += Math.atan(verticIncreaseDistance/sizeHoriz);
				verticAngleRad += Math.atan(horizIncreaseDistance/sizeVertic);
			} else {
				horizAngleRad -= Math.atan(verticIncreaseDistance/sizeHoriz);
				verticAngleRad -= Math.atan(horizIncreaseDistance/sizeVertic);
			}
			
			// Draw rectangle
			var thePath = "";
			thePath = thePath.concat("M"+X1+","+Y1+" ");
			thePath = thePath.concat("L"+X2+","+Y2+" ");
			thePath = thePath.concat("L"+X3+","+Y3+" ");
			thePath = thePath.concat("L"+X4+","+Y4+" ");
			thePath = thePath.concat("Z");
			htmlCode = htmlCode.concat('<path class="fractRect" d="' + thePath + '" stroke="' + strokeColor + '" stroke-width="' + strokeWidth + '" fill="transparent" />');
		}
		
		htmlCode = htmlCode.concat(svgClose);
		
		if (extraArgArray[0] !== 5) {
			// Insert after child nodes to display as a foreground
			jQuery(selector).append(htmlCode);
		} else {
			// But not for == 5
			jQuery(selector).prepend(htmlCode);
		}
	} else if (layoutType == 6) {/* SVG generated words with possible ornaments */
		// extraArgArray[0] should be a letter, like 'E'
		// extraArgArray[1] should be the XbottomLeft coordiate
		// extraArgArray[2] should be the YbottomLeft coordiate
		// extraArgArray[3] should be the width of the letter in px
		// extraArgArray[4] should be the height of the letter in px
		// extraArgArray[5] should be the design type of letter
		// extraArgArray[6] should be the rgba color of paths
		// extraArgArray[7] should be the stoke width of paths
		console.log("Layout Type 6 called");
		htmlCode = htmlCode.concat(svgOpen);
		
		// Draw word
		var thisPath = wordCreator(extraArgArray[0], extraArgArray[1], extraArgArray[2], extraArgArray[3], extraArgArray[4], extraArgArray[5]);
		htmlCode = htmlCode.concat('<path class="letterPath" d="' + thisPath + '" stroke="' + extraArgArray[6] + '" stroke-width="' + extraArgArray[7] + '" stroke-linecap="round" fill="rgba(0,0,0,0)" />');
		
		htmlCode = htmlCode.concat(svgClose);
		// Display as foreground
		jQuery(selector + " svg").last().after(htmlCode);
	} else if (layoutType == 7) {
		console.log("Layout Type 7 called");
		// extraArgArray[0] is the stroke width
		htmlCode = htmlCode.concat(svgOpen);
		var col1 = "rgb(100,47,120)";
		var col2 = "rgb(45,66,134)";
		var col3 = "rgb(43,51,86)";
		
		var col1 = "#666";
		var col2 = "#aaa";
		var col3 = "#888";
		
		htmlCode = htmlCode.concat('<path class="icosacidron" d="' + icosacidron(width, height, extraArgArray[1]) + '" stroke="black" stroke-width="' + extraArgArray[0] + '" stroke-linecap="round" fill=' + col1 + ' transform = "rotate(0 ' + width/2 + ' ' + height/2 + ')"/>');
		htmlCode = htmlCode.concat('<path class="icosacidron" d="' + icosacidron(width, height, extraArgArray[1]) + '" stroke="black" stroke-width="' + extraArgArray[0] + '" stroke-linecap="round" fill=' + col2 + ' transform = "rotate(120 ' + width/2 + ' ' + height/2 + ')"/>');
		htmlCode = htmlCode.concat('<path class="icosacidron" d="' + icosacidron(width, height, extraArgArray[1]) + '" stroke="black" stroke-width="' + extraArgArray[0] + '" stroke-linecap="round" fill=' + col3 + ' transform = "rotate(240 ' + width/2 + ' ' + height/2 + ')"/>');
		htmlCode = htmlCode.concat(svgClose);
		jQuery(selector).append(htmlCode);
		
	
	} else if (layoutType == 8) {
		console.log("Layout Type 8 called");
		// extraArgArray[0] is the stroke width
		htmlCode = htmlCode.concat(svgOpen);
		var col1 = "rgb(100,47,120)";
		var col2 = "rgb(45,66,134)";
		var col3 = "rgb(43,51,86)";
		
		var col1 = "#666";
		var col2 = "#aaa";
		var col3 = "#888";
		var col4 = "#333";
		var col0 = "#000";
		
		//htmlCode = htmlCode.concat('<path class="icosacidron" d="' + icosacross(width, height, extraArgArray[1]) + '" stroke="black" stroke-width="' + extraArgArray[0] + '" stroke-linecap="round" fill=' + col1 + ' transform = "rotate(0 ' + width/2 + ' ' + height/2 + ')"/>');
		/*htmlCode = htmlCode.concat('<path class="icosacidron" d="' + icosacross(width, height, extraArgArray[1]) + '" stroke="black" stroke-width="' + extraArgArray[0] + '" stroke-linecap="round" fill=' + col1 + ' transform = "rotate(45 ' + width/2 + ' ' + height/2 + ')"/>');
		htmlCode = htmlCode.concat('<path class="icosacidron" d="' + icosacross(width, height, extraArgArray[1]) + '" stroke="black" stroke-width="' + extraArgArray[0] + '" stroke-linecap="round" fill=' + col2 + ' transform = "rotate(135 ' + width/2 + ' ' + height/2 + ')"/>');
		htmlCode = htmlCode.concat('<path class="icosacidron" d="' + icosacross(width, height, extraArgArray[1]) + '" stroke="black" stroke-width="' + extraArgArray[0] + '" stroke-linecap="round" fill=' + col3 + ' transform = "rotate(225 ' + width/2 + ' ' + height/2 + ')"/>');
		htmlCode = htmlCode.concat('<path class="icosacidron" d="' + icosacross(width, height, extraArgArray[1]) + '" stroke="black" stroke-width="' + extraArgArray[0] + '" stroke-linecap="round" fill=' + col4 + ' transform = "rotate(315 ' + width/2 + ' ' + height/2 + ')"/>');*/
		
		htmlCode = htmlCode.concat('<path class="icosacidron" d="' + icosacross(width, height, extraArgArray[1]) + '" fill=' + col0 + ' transform = "rotate(45 ' + width/2 + ' ' + height/2 + ')"/>');
		htmlCode = htmlCode.concat('<path class="icosacidron" d="' + icosacross(width, height, extraArgArray[1]) + '" fill=' + col0 + ' transform = "rotate(135 ' + width/2 + ' ' + height/2 + ')"/>');
		htmlCode = htmlCode.concat('<path class="icosacidron" d="' + icosacross(width, height, extraArgArray[1]) + '" fill=' + col0 + ' transform = "rotate(225 ' + width/2 + ' ' + height/2 + ')"/>');
		htmlCode = htmlCode.concat('<path class="icosacidron" d="' + icosacross(width, height, extraArgArray[1]) + '" fill=' + col0 + ' transform = "rotate(315 ' + width/2 + ' ' + height/2 + ')"/>');
		htmlCode = htmlCode.concat(svgClose);
		jQuery(selector).append(htmlCode);
	
	} else { console.log("layoutType not recognized"); }
	
}

function SVGclear(selector) {/* Clean function */
	jQuery(selector+" svg").remove();
}

function randomizeAngleDeg(range) {
	// range is the number of possible angles
	return Math.floor(Math.random()*range + 0)*360/range;
}
function randomizeAngleRad(range) {
	// range is the number of possible angles
	return Math.floor(Math.random()*range + 0)*2*Math.PI/range;
}
function pathCreator(Xstart, Ystart, angleStartRangeArrayDeg, angleRange, linesNumber, stepLength, closePath, areAnglesSmooth, maxDeviationDeg) {
	// Xstart and Ystart are the initial position coordinates (in pixels)
	// angleStartRangeArrayDeg = [minAngle,maxAngle], in degrees
	// angleRange is the number of possible angles ex: angleRange==4 ----> 0°, 90°, 180° or 270°
	// linesNumber is the number of lines
	// stepLength is the length of one line
	// closePath is a string, if == 'close' the path is closed, otherwise not
	// areAnglesSmooth is a boolean dictating how a new angle is calculated, angleRange is neglected in this case
	// maxDeviationDeg is used if areAnglesSmooth is true, it specifies the max value of the difference between 2 successive angles
	
	var localX = Xstart;
	var localY = Ystart;
	var stepLength = Math.max(Math.floor(stepLength), 1);//To avoid being 0 and drawing nothing
	var newPath = "";
	newPath = newPath.concat("M" + Xstart + "," + Ystart + " ");
	
	// Randomize the lines
	if (!areAnglesSmooth) {

		for (var i=0; i < linesNumber; i++) {
			var localAngle = randomizeAngleRad(angleRange);
			localX = localX + parseFloat(stepLength*Math.cos(localAngle));
			localY = localY - parseFloat(stepLength*Math.sin(localAngle));
			
			newPath = newPath.concat("L" + localX + "," + localY + " ");
		}
	} else {
		var localAngle = randomBetween(angleStartRangeArrayDeg[0], angleStartRangeArrayDeg[1]);
		for (var i = 0; i < linesNumber; i++) {
			localAngle = generateNewAngleDeg(localAngle,maxDeviationDeg);
			localX = localX + parseFloat(stepLength*Math.cos(localAngle*Math.PI/180));
			localY = localY - parseFloat(stepLength*Math.sin(localAngle*Math.PI/180));
			
			newPath = newPath.concat("L" + localX + "," + localY + " ");
		}
	}
	if (closePath == 'close') {
		newPath = newPath.concat("Z");
	}
	
	return newPath;
}
function wordCreator(word, XbottomLeft, YbottomLeft, wordWidth, wordHeight, designType) {
	
	var wordLength = word.length;
	var splitedSpace = wordWidth / wordLength;
	var letterOwnSpace = 0.7 * splitedSpace;
	var newPath = "";
	
	for (var i = 0; i < wordLength; i++) {
		var letterOffset = XbottomLeft + splitedSpace * i;
		newPath = newPath.concat(letterCreator(word[i], letterOffset, YbottomLeft, letterOwnSpace, wordHeight, designType));
	}
	
	return newPath;
}
function letterCreator(letter, XbottomLeft, YbottomLeft, width, height, designType) {
	
	// A letter is contained within a square with width = 1 and height = 2
	// It is rescaled based on width and height given
	// An arrayObject contains substructures, parts of letters
	// Letter coordinates are usual oriented X, Y axis, with the Y axis up (and not down)
	
	var newPath = "";
	var arrayObject = [];
	
	if (letter == 'A') {
		arrayObject = [  [[0,0],[0.5,2],[1,0]]  ,  [[0.25,1],[0.75,1]]  ];
	} else if (letter == 'B') {
		arrayObject = [  [[0,0],[0,2],[0.8,2],[1,1.8],[1,1.2],[0.8,1],[0,1]]  ,  [[0.8,1],[1,0.8],[1,0.2],[0.8,0],[0,0]]  ];
	} else if (letter == 'C') {
		arrayObject = [  [[1,0],[0,0],[0,2],[1,2]]  ];
	} else if (letter == 'D') {
		arrayObject = [  [[0,0],[0,2],[0.8,2],[1,1.8],[1,0.2],[0.8,0],[0,0]]  ];
	} else if (letter == 'E') {
		arrayObject = [  [[1,2],[0,2],[0,1]]  ,  [[1,1],[0,1],[0,0],[1,0]]  ];
	} else if (letter == 'R') {
		arrayObject = [  [[0,0],[0,2],[0.8,2],[1,1.8],[1,1.2],[0.8,1],[0,1]]  ,  [[0.6,1],[1,0]]  ];
	} else if (letter == 'V') {
		arrayObject = [  [[0,2],[0.5,0],[1,2]]  ];
	} else if (letter == 'v') {
		arrayObject = [  [[0,1],[0.5,0],[1,1]]  ];
	} else if(letter == 'e') {
		arrayObject = [  [[0,0.5],[1,0.5],[1,1],[0,1],[0,0],[1,0]]  ];
	} else if(letter == 'r') {
		arrayObject = [  [[0,0],[0,1]] , [[0,0.8],[0.2,1],[1,1]]  ];
	} else { console.log('Letter not recognized'); }

	// Apply design type
	if (designType == 'bramblesSpring') {
		arrayObject = bramblesCreator(arrayObject, 'spring');
	}
	else if (designType == 'bramblesGravity') {
		arrayObject = bramblesCreator(arrayObject, 'gravity');
	} else {}
	
	for (var i = 0; i < arrayObject.length; i++) {
		// First point, start the path declaration with moveTo instruction M
		var Xstart = XbottomLeft + arrayObject[i][0][0]*width;
		var Ystart = YbottomLeft - arrayObject[i][0][1]*height/2;
		// (Because letter coordinates are with Y up positive and between 0 and 2)
		
		newPath = newPath.concat("M" + Xstart + "," + Ystart + " ");
		// Go through substructures
		for (var j = 1; j < arrayObject[i].length; j++) {
			var newX = XbottomLeft + arrayObject[i][j][0]*width;
			var newY = YbottomLeft - arrayObject[i][j][1]*height/2;
			newPath = newPath.concat("L" + newX + "," + newY + " ");
		}
	}
	
	return newPath;
}
function bramblesCreator(arrayObject, physicsModel) {
	/** This function just created a new, bigger array with different coordinates **/
	/** Remember that the arrayObjects are coordinate arrays in the cartesian system with Y up positive **/
	
	var brambledArray = [];
	// Each branch will be splited for the calculation of local targets
	var branchSplitLength = 0.03;
	var launchOffsetX = 0.1;
	var launchOffsetY = 0.1;
	var initialSpeed = 0.1;
	var timeEffect = 1;
	// Random bramble launch angle
	var launchAngle = randomBetween(0, 2*Math.PI);
	
	/** Spring model **/
	// Physics model: spring, the acceleration is given by the
	// distance between bramble point and local target point
	///////var springRigidity = randomBetween(1,2);
	var springRigidity = 0.5;
	
	/** Gravity model **/
	var gravity = 0.008;
	var distanceProtector = 0.1;//Distance calculated in acc will be rendered superior to this threshold to prevent particles from going away
	var accelerationProtector = 0.02;
	
	
	for (var i = 0; i < arrayObject.length; i++) {
	
		// Declare branch package array
		brambledArray[i] = [];
		// Local branch package
		// Acceleration, speed and position buffers are reinitialized
		var Xacc = 0;
		var Yacc = 0;
		
		var Xspeed = initialSpeed * Math.cos(launchAngle);
		var Yspeed = initialSpeed * Math.sin(launchAngle);;
		var X = arrayObject[i][0][0] + launchOffsetX;
		var Y = arrayObject[i][0][1] + launchOffsetY;
		var localTargetX = arrayObject[i][0][0]; 
		var localTargetY = arrayObject[i][0][1];
		
		// First departure bramble coordinates
		brambledArray[i].push([X,Y]);
		
		// Go through substructures
		for (var j = 1; j < arrayObject[i].length; j++) {
			// Local branch
			
			// Note: for each j [x,y] value there will be 10 computed [x,y] new values
			
			// Each point (starting from the second, j=1) is the new global target
			var departureX = arrayObject[i][j-1][0];
			var departureY = arrayObject[i][j-1][1];
			var arrivalX = arrayObject[i][j][0];
			var arrivalY = arrayObject[i][j][1];
			
			var branchLength = Math.sqrt(Math.pow(arrivalX-departureX, 2) + Math.pow(arrivalY-departureY, 2));
			var branchSplit = Math.floor(branchLength/branchSplitLength);
			// This branch will be splited in 'branchSplit' local target points
			
			// Put in first bramble point
			for (var splitIndex = 0; splitIndex < branchSplit; splitIndex++) {
				// Compute local target position
				// (add 1 to index because first target mustn't be starting point)
				var localTargetX = departureX + (arrivalX - departureX)*(splitIndex + 1)/branchSplit;
				var localTargetY = departureY + (arrivalY - departureY)*(splitIndex + 1)/branchSplit;
				
				var localDistance = Math.sqrt(Math.pow(localTargetX - X, 2)+Math.pow(localTargetY - Y, 2));
				var localAngleRad = segmentAngleRad(X, Y, localTargetX, localTargetY);
				
				// Now comes the physics
				if (physicsModel == 'spring') {
					// Spring model: acceleration is proportional to the distance between current bramble point and current target point
					var acc = springRigidity * localDistance;
					Xacc = acc * Math.cos(localAngleRad);
					Yacc = acc * Math.sin(localAngleRad);
				} else if (physicsModel == 'gravity') {
					localDistance = Math.max(localDistance, distanceProtector);
					var acc = gravity / Math.pow(localDistance, 2);
					Xacc = acc * Math.cos(localAngleRad);
					Yacc = acc * Math.sin(localAngleRad);
					Xacc = Math.min(Math.max(Xacc, -accelerationProtector),accelerationProtector);
					Yacc = Math.min(Math.max(Yacc, -accelerationProtector),accelerationProtector);
				}
				
				// Common to all forces
				Xspeed = Xspeed + Xacc*timeEffect;
				Yspeed = Yspeed + Yacc*timeEffect;
				X = X + Xspeed*timeEffect;
				Y = Y + Yspeed*timeEffect;
				// Add new position to bramble array
				brambledArray[i].push([X,Y]);
			}
			
		}
	}
	
	return brambledArray;
	
}
function randomBetween(min, max){
	var result = min + Math.random()*(max - min);
	return result;
}
function generateNewAngleDeg(oldAngleDeg, maxDeviationDeg) {
	// Starting from the old angle value, modified within a certin range defined by maxDeviationDeg
	var result = oldAngleDeg + randomBetween(-maxDeviationDeg, maxDeviationDeg);
	return result;
}
function segmentAngleRad(Xstart, Ystart, Xtarget, Ytarget) {
	var result;// Will range between 0 and 2PI
	if (Xstart == Xtarget) {
		if (Ystart == Ytarget) {
			result = 0; 
		} else if (Ystart < Ytarget) {
			result = Math.PI/2;
		} else if (Ystart > Ytarget) {
			result = 3*Math.PI/2;
		} else {}
	} else if (Xstart < Xtarget) {
		result = Math.atan((Ytarget-Ystart)/(Xtarget-Xstart));
	} else if(Xstart > Xtarget) {
		result = Math.PI + Math.atan((Ytarget-Ystart)/(Xtarget-Xstart));
	}
	
	return (result + 2*Math.PI) % (2*Math.PI);
}
function generateCirclesDataWithNoOverlapPlease(howMany, divWidth, divHeight) {
	var Xarray = [];
	var Yarray = [];
	var maxRarray = [];
	var iterations = 0;
	Xarray[0] = Math.floor(divWidth*Math.random());
	Yarray[0] = Math.floor(divHeight*Math.random());
	maxRarray[0] = divWidth/30 + divWidth/15*Math.random();
	for (var i = 1; i < howMany; i++) {
		var isOk = false;
		while(!isOk) {
			// Propose
			var potentialCenterX = Math.floor(divWidth*Math.random());
			var potentialCenterY = Math.floor(divHeight*Math.random());
			var potentialMaxRadius = divWidth/30 + divWidth/15*Math.random();
			var doesItOverlap = false;
			// Check
			for (var j = 0; j < i; j++) {
				// Check this circle proximity
				var distance = Math.sqrt(Math.pow(potentialCenterX - Xarray[j],2)+ Math.pow(potentialCenterY - Yarray[j],2));
				var radiusSum = maxRarray[j] + parseFloat(potentialMaxRadius);
				console.log("Distance: " + distance + "           RadiusSum: " + radiusSum);
				if(distance <= radiusSum) {
					doesItOverlap = true;
				} else {}
				iterations++;
			}
			isOk = !doesItOverlap;
			if (isOk) {
				// Add ifOk
				Xarray[i] = potentialCenterX; 
				Yarray[i] = potentialCenterY; 
				maxRarray[i] = potentialMaxRadius; 
			}
		}
	}
	console.log("Circles data generated after " + iterations + " iterations");
	return [Xarray, Yarray, maxRarray];
}
function icosacidron(width, height, r) {
	var r = r || Math.min(width, height) * 0.2;
	var icosacidron = "";
	var expand = r * 0.9;
	var thickness = r * 0.5;
	var foot = thickness * 2.5;
	var footSole = foot * 0.1;
	var cheatAdjustment = 1.1 * thickness * Math.sin(2*Math.PI/360 * 30);
	
	// Leg is drawn anticlockwise
	icosacidron = icosacidron.concat("M" + width/2 + "," + height/2 + " ");
	// Line 1
	icosacidron = icosacidron.concat("m" + r*Math.cos(2*Math.PI/360 * (-30)) + "," + (-r*Math.sin(2*Math.PI/360 * (-30))) + " ");
	// Line 2 (straight)
	icosacidron = icosacidron.concat("l" + (-r*Math.sqrt(3) - expand) + "," + 0 + " ");
	// Line 3 (foot)
	icosacidron = icosacidron.concat("c " + footSole + " " + foot/4 + ", " + footSole + " " + foot/2 + ", " + 0 + " " + foot + " ");
	// Line 4 (longest curve)
	icosacidron = icosacidron.concat("c " + expand + " " + (thickness-foot) + ", " + (2*expand) + " " + (thickness-foot) + ", " + (r*Math.sqrt(3) + expand + cheatAdjustment) + " " + (thickness-foot) + " ");
	
	//icosacidron = icosacidron.concat("Z");
	
	return icosacidron;
}
function icosacross(width, height, r) {
	var r = r || Math.min(width, height) * 0.15;
	var icosacidron = "";
	var expand = r * 0.9;
	var thickness = r * 0.5;
	var foot = thickness * 2.5;
	var footSole = foot * 0.1;
	var cheatAdjustment = 1.1 * thickness * Math.sin(2*Math.PI/360 * 30);
	
	// Leg is drawn anticlockwise
	icosacidron = icosacidron.concat("M" + width/2 + "," + height/2 + " ");
	// Line 1
	icosacidron = icosacidron.concat("m" + 0 + "," + (-thickness/2) + " ");
	// Line 2 (straight)
	icosacidron = icosacidron.concat("l" + (-r*Math.sqrt(3) - expand) + "," + 0 + " ");
	// Line 3 (foot)
	icosacidron = icosacidron.concat("c " + footSole + " " + foot/4 + ", " + footSole + " " + foot/2 + ", " + 0 + " " + foot + " ");
	// Line 4 (longest curve)
	icosacidron = icosacidron.concat("c " + expand + " " + (thickness-foot) + ", " + (2*expand) + " " + (thickness-foot) + ", " + (r*Math.sqrt(3) + expand + cheatAdjustment) + " " + (thickness-foot) + " ");
	
	//icosacidron = icosacidron.concat("Z");
	
	return icosacidron;
}