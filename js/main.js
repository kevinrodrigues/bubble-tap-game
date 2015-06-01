//add namespace..
var BUBBLE = {

	//set up some values..
	width: 320,
	height: 480,
	//
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
	} 
};