var BUBBLE = BUBBLE || {};

//add namespace..
BUBBLE = {

	//set up some values..
	width: 320,
	height: 480,

	//populate values later..
	ratio: null,
	currentWidth: null,
	currentHeight: null,
	canvas: null,
	ctx: null,

	init: function() {
		
		//porportion of width to height..
		BUBBLE.ratio = BUBBLE.width / BUBBLE.height;

		//these update when the screen is resized..
		BUBBLE.currentWidth = BUBBLE.width;
		BUBBLE.currentHeight = BUBBLE.height;

		//this is our canvas element..
		BUBBLE.canvas = document.getElementsByTagName('canvas')[0];

		//setting this so the browser doesn't default to 320..
		BUBBLE.canvas.width = BUBBLE.width;
		BUBBLE.canvas.height = BUBBLE.height;

		//get the canvas context "2d" so we
		//can interact with it's api..
		BUBBLE.ctx = BUBBLE.canvas.getContext('2d');

		//call resize method..
		BUBBLE.resize();



	},
	resize: function() {

		BUBBLE.currentHeight = window.innerHeight;

		//resize width in porportion to the new height..
		BUBBLE.currentWidth = BUBBLE.currentHeight * BUBBLE.ratio;

		//add in extra remove for address bar so we can hide it..
		if (BUBBLE.android || BUBBLE.ios) {
			document.body.style.height = (window.innerHieght + 50) + 'px';
		}

		//set the new canvas size from our initial value of 320x480..
		BUBBLE.canvas.style.width = BUBBLE.currentWidth + 'px';
		BUBBLE.canvas.style.height = BUBBLE.currentHeight + 'px';

		window.setTimeout(function() {
			window.scrollTo(0,1);
		}, 1);
	}
};

window.addEventListener('load', BUBBLE.init, false);
window.addEventListener('resize', BUBBLE.resize, false);
