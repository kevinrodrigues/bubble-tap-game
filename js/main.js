//add namespace..
var BUBBLE = {

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
		this.ratio = this.width / this.height;

		//these update when the screen is resized..
		this.currentWidth = this.width;
		this.currentHeight = this.height;

		//this is our canvas element..
		this.canvas = document.getElementsByTagName('canvas')[0];

		//setting this so the browser doesn't default to 320..
		this.canvas.width = this.width;
		this.canvas.height = this.height;

		//get the canvas context "2d" so we
		//can interact with it's api..
		this.ctx = this.canvas.getContext('2d');

		//call resize method..
		this.resize();
	},
	resize: function() {

		this.currentHeight = window.innerHeight;

		//resize width in porportion to the new height..
		this.currentWidth = this.currentHeight * this.ratio;


		//add in extra remove for address bar so we can hide it..
		if (this.android || this.ios) {
			document.body.style.height = (window.innerHieght + 50) + 'px';
		}
	}
};