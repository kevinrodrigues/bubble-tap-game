var BUBBLE = BUBBLE || {};

// http://paulirish.com/2011/requestanimationframe-for-smart-animating
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

//add namespace..
BUBBLE = {

	//set up some values..
	width: 320,
	height: 480,
	scale: 1,
	nextBubble: 100,
	offset: {
		top:0,
		left:0
	},
	score: {
		taps:0,
		hit:0,
		escaped: 0,
		accuracy:0
	},
	entities:[], // keeps track of our touches, bubbles, particles etc.
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

		//draw some things :)
		BUBBLE.draw.clear();
		BUBBLE.draw.rect(120,120,150, 'green');
		BUBBLE.draw.circle(100,100,50, 'rgba(255,0,0,0.5)');
		BUBBLE.draw.text('Hello World', 100, 100, 10, '#000');


		//detect listen events..
		window.addEventListener('click', function (e) {
			e.preventDefault();
			BUBBLE.Input.set(e);
		}, false);

		//detect touch events..
		window.addEventListener('touchstart', function(e){
			e.preventDefault();

			//get the first touch from the events array called touches..
			BUBBLE.Input.set(e.touches[0]);
		}, false);

		window.addEventListener('touchmove', function(e){
			//just stop default behaviour..
			e.preventDefault();
		}, false);

		window.addEventListener('touchend', function(e){
			//stop default behaviour..
			e.preventDefault();
		}, false);


		//start game loop..
		BUBBLE.loop();

	},
	update: function() {
		var i,
			checkCollision = false, // check for collisions if user tapped game.
			hit;

		//decrease
		BUBBLE.nextBubble -= 1;




		//get new instance of Touch if tapped is true..
		if (BUBBLE.Input.tapped) {

			BUBBLE.score.taps += 1;
			BUBBLE.entities.push(new BUBBLE.touch(BUBBLE.Input.x, BUBBLE.Input.y));

			//update tab to false so we can cycle back..
			BUBBLE.Input.tabbed = false;
			checkCollision = true;

		}

		//loop through all entities and update..
		for (i = 0; i < BUBBLE.entities.length; i++) {
			BUBBLE.entities[i].update();

			//delete from array if flag is true..
			if (BUBBLE.entities[i].remove) {
				BUBBLE.entities.splice(i, 1);
			}

		}

		if (BUBBLE.time <= 0) {
			console.log('game over');
		}

		//if the counter is less the zero..
		if (BUBBLE.nextBubble < 0) {
			//put a new instance of bubble into our entities array..
			BUBBLE.entities.push(new BUBBLE.bubble());

			//reset the counter with a random value..
			BUBBLE.nextBubble = (Math.random() * 100) + 100;
		}


		for (i = 0; i < BUBBLE.entities.length; i ++) {
			BUBBLE.entities[i].update();

			if (BUBBLE.entities[i].type === 'bubble' && checkCollision) {
				hit = BUBBLE.collides(BUBBLE.entities[i], {x: BUBBLE.Input.x, y: BUBBLE.Input.y, r: 7});
				BUBBLE.entities[i].remove = hit;

				if (hit) {
					BUBBLE.score.hit += 1;
					console.log(BUBBLE.score.hit);
				}
			}

			//delete from array if set to true;
			if (BUBBLE.entities[i].remove) {
				BUBBLE.entities.splice(i, 1);
			}
		}

		BUBBLE.score.accuracy = (BUBBLE.score.hit / BUBBLE.score.taps) * 100;
		BUBBLE.score.accuracy = isNaN(BUBBLE.score.accuracy) ? 0 : ~~(BUBBLE.score.accuracy);



	},
	render: function() {

		var i;

		BUBBLE.draw.rect(0, 0, BUBBLE.width, BUBBLE.height, '#036');

		for (i = 0; i < BUBBLE.entities.length; i++) {
			BUBBLE.entities[i].render();
		}

		BUBBLE.draw.text('Hit: ' + BUBBLE.score.hit, 20, 30, 14, '#fff');
		BUBBLE.draw.text('Escaped: ' + BUBBLE.score.escaped, 20, 50, 14, '#fff');
		BUBBLE.draw.text('Accuracy: ' + BUBBLE.score.accuracy + '%', 20, 70, 14, '#fff');

	},
	loop: function() {

		requestAnimFrame(BUBBLE.loop);


		BUBBLE.update();
		BUBBLE.render();

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

		BUBBLE.scale = BUBBLE.currentWidth / BUBBLE.width;
		BUBBLE.offset.top = BUBBLE.canvas.offsetTop;
		BUBBLE.offset.left = BUBBLE.canvas.offsetLeft;

		window.setTimeout(function() {
			window.scrollTo(0,1);
		}, 1);
	}
};

//drawing to the canvas..
BUBBLE.draw = {

	clear: function() {
		
		BUBBLE.ctx.clearRect(0, 0, BUBBLE.width, BUBBLE.height);
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
	text: function(string, x, y, size, col) {

		BUBBLE.ctx.font = 'bold ' + size + 'px';
		BUBBLE.ctx.fillSTyle = col;
		BUBBLE.ctx.fillText(string, x, y);
	}

};

BUBBLE.Input = {

	x:0,
	y:0,
	tapped: false,
	set: function(data) {

		var offsetTop = BUBBLE.canvas.offsetTop,
			offsetLeft = BUBBLE.canvas.offsetLeft,
			scale = BUBBLE.currentWidth / BUBBLE.width;

		// console.log('input' + this);

		this.x = (data.pageX - offsetLeft) / BUBBLE.scale;
		this.y = (data.pageY - offsetTop) / BUBBLE.scale;
		this.tapped = true;

		BUBBLE.draw.circle(this.x, this.y, 10, 'red');
	}
};

//draws circles, fades it out and removes them..
BUBBLE.touch = function(x, y) {
	// console.log(this);

	this.type = 'touch'; //require this later.
	this.x = x; //the x coordinate.
	this.y = y; //the y coordinate.
	this.r = 5; //radius.
	this.opacity = 1; //initial start value.
	this.fade = 0.05; // fade value rate.
	this.remove = false; // flag for removing this entity.

	// console.log(this);

	this.update = function() {
		this.opacity -= this.fade;
		//if its less then 0 then remove it.
		this.remove = (this.opacity < 0) ? true : false;
	};

	this.render = function() {
		BUBBLE.draw.circle(this.x, this.y, this.r, 'rgba(255,0,0' + this.opacity + ')');
	};
};

BUBBLE.bubble = function() {

	this.type = 'bubble';
	this.r = (Math.random() * 20) + 10;
	this.speed = (Math.random() * 3) + 1;

	this.x = (Math.random() * (BUBBLE.width) - this.r);
	this.y = BUBBLE.height + (Math.random() * 100) + 100; // start off screen.

	
	this.remove = false;

	this.update = function() {

		//move up 1px.
		this.y -= 1;

		//if off screen, flag for removal.
		if (this.y < -10) {
			BUBBLE.score.escaped += 1; //update score if bubble escapes.
			this.remove = true;
			console.log(BUBBLE.score.escaped);
		}
	};

	this.render = function() {
		BUBBLE.draw.circle(this.x, this.y, this.r, 'rgba(255,255,255,1)');
	};
};

//checks to see if circles overlap from...
//http://mathworld.wolfram.com/Circle-CircleIntersection.html
BUBBLE.collides = function(a, b) {

	var distanceSquared,
		radiiSquared;

	distanceSquared = ( ((a.x - b.x) * (a.x - b.x)) + ((a.y - b.y) * (a.y - b.y)));

    radiiSquared = (a.r + b.r) * (a.r + b.r);

    if (distanceSquared < radiiSquared) {
        return true;
    } else {
        return false;
    }
};

// BUBBLE.touch();
window.addEventListener('load', BUBBLE.init, false);
window.addEventListener('resize', BUBBLE.resize, false);
