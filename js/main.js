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


		//detect ios or andriod..
		BUBBLE.ua = navigator.userAgent.toLowerCase();
		BUBBLE.andriod = BUBBLE.ua.indexOf('android') > -1 ? true : false;
		BUBBLE.ios = (BUBBLE.ua.indexOf('iphone') > -1 || BUBBLE.ua.indexOf('ipad') > -1) ? true : false;


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

//drawing to the canvas..
BUBBLE.draw = {

	clear: function() {
		
		BUBBLE.cta.clearRect(0, 0, BUBBLE.width, BUBBLE.height);
	},
	rect: function(x, y, w, h, col) {

		BUBBLE.ctx.fillStyle = col;
		BUBBLE.ctx.fillRect(x,y,w,h);
	},
	circle: function(x, y, r, col) {
		
		BUBBLE.ctx.fillStyle = col;
		BUBBLE.ctx.beginPath();
		BUBBLE.ctx.arc(x + 5, y + 5, r, 0, Math.PI * 2, true);
		BUBBLE.ctx.closePath();
		BUBBLE.ctx.fill();
	},
	
};

window.addEventListener('load', BUBBLE.init, false);
window.addEventListener('resize', BUBBLE.resize, false);
