var five = require("johnny-five");
var pixel = require("node-pixel");

var Raspi = require("raspi-io").RaspiIO;

const { normal } = require('color-blend')

const Color = require('color');

var opts = {};
opts.port = process.argv[2] || "";
opts.io = new Raspi();
opts.repl = false

var board = new five.Board(opts);
var strip = null;

var stripLength = 30;

var cycler = false;


function startLights(){
    console.log("Strip ready, starting lights");
	patternSolid('ffffff');
	//patternTwo();
}

function setPattern(pattern, colorHex){
    clearInterval(cycler);
    if(pattern == 'pulse'){
        patternPulse(colorHex);
    }
    else if(pattern == 'bounce'){
        patternBounce(colorHex);
    }
    else if(pattern == 'solid'){
        patternSolid(colorHex);
    }
}

function setColor(color){
    clearInterval(cycler);
    strip.color("#"+color);
    strip.show();
}

function powerOff(){
    clearInterval(cycler);
    strip.off();
}

function patternPulse(colorHex){
	var stepDistance = 1/stripLength;
	var i = 0;
	
	
	cycler = setInterval(function(){
		try{
			var step = 0;
			if(i >= stripLength && i < stripLength*2){
				var past = i - stripLength;
				step = stripLength - past;
			}
			else if(i >= stripLength){
				i = 0;
				step = 0;
			}
			else{
				step = i;
			}
			let colorObject = Color('#'+colorHex);
			var darkenAmt = 1 - (step*stepDistance);
			colorObject = colorObject.darken(darkenAmt)
			let colorRgb = colorObject.rgb().color;
			var color = "rgb("+Math.round(colorRgb[0])+", "+Math.round(colorRgb[1])+","+ Math.round(colorRgb[2])+")"
			strip.color(color)
			strip.show();
			i++;
		}
		catch(e){
			console.log('missed a round');
		}
	}, 30);
}

function patternBounce(colorHex){

	//First, do our color conversion...
	var colorOneObj = Color('#'+colorHex);
	var colorOne = colorOneObj.rgb().color;
	var colorOne = {r: Math.round(colorOne[0]), g: Math.round(colorOne[1]), b: Math.round(colorOne[2]), a: .5};
	colorTwoObj = colorOneObj.lighten(.25);
	var colorTwo = colorTwoObj.rgb().color;
	colorTwo = {r: Math.round(colorTwo[0]), g: Math.round(colorTwo[1]), b: Math.round(colorTwo[2]), a: .5};
	
	var i = 0;
	cycler = setInterval(function(){
		var step = 0;
		if(i >= stripLength && i < stripLength*2){
			var past = i - stripLength;
			step = stripLength - past;
		}
		else if(i >= stripLength){
			i = 0;
			step = 0;
		}
		else{
			step = i;
		}

		try{
			var pixels = {};
			for(var j = -3; j < 0; j++){
				var pixel = step + j;
				if(pixel >= 0 && pixel < stripLength){
					
					var prev = pixel - 1;
					var next = pixel + 1;
					var prevColor = pixels[prev] || colorOne;
					var nextColor = pixels[next] || colorTwo;
					
					var color = normal(prevColor, nextColor);
					
					pixels[pixel] = color;
								
				}
			}
			for(var j = 3; j >= 0; j--){
				var pixel = step + j;
				if(pixel >= 0 && pixel < stripLength){
					if(j == 0){
						pixels[pixel] = colorTwo;
					}
					else{
						//we need to fade our pixels from color one to color two over the range
						//We do this by blending the previous color with the next one
						
						var prev = pixel - 1;
						var next = pixel + 1;
						var prevColor = pixels[prev] || colorTwo;
						var nextColor = pixels[next] || colorOne;

						var color = normal(nextColor, prevColor);
						pixels[pixel] = color;
					}					
				}
			}
			//Set the base color
			var parsedColorOne = "rgb("+colorOne.r+","+colorOne.g+","+colorOne.b+")";
			strip.color(parsedColorOne);
			for(var k in Object.keys(pixels)){
				var colorObj = Object.values(pixels)[k];
				var color = colorObj.r+", "+colorObj.g+", "+colorObj.b;
				//console.log(color);
				strip.pixel(Object.keys(pixels)[k]).color('rgb('+color+')');

			}
			strip.show();
			i++;
		}
		catch(e){
			console.log('Pattern two missed frame');
		}
		//Now set the movement of the other pixels...
	}, 30);
}



function patternSolid(colorHex){
	var colorOne = Color('#'+colorHex).rgb().color;
	strip.color(colorOne);
	strip.show();
}







//Helper functions




board.on("ready", function() {

    console.log("Board ready, lets add light");

    strip = new pixel.Strip({
        color_order: pixel.COLOR_ORDER.GRB,
        board: this,
        controller: "I2CBACKPACK",
        strips: [stripLength],
    });

    strip.on("ready", function() {
    	startLights();
    });
});


setInterval(function(){ console.log('still running') }, 1000 * 60 * 30);








//All module exports listed below

exports['setPattern'] = setPattern;
exports['setColor'] = setColor;
exports['powerOff'] = powerOff;
