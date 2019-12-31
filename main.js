//console.log('reading js file...!');
var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 100;

var c = canvas.getContext('2d');
var isPaused = false;
var isFilled = true;
var isDrawWithMouse = true;

var mouse = { x: canvas.width/2, y: canvas.height/2}
var startRadius = 5;
var maxRadius = 50;
var minRadius = 2;

var particlesArray = [];
var noOfParticles = 50;
var minNoOfParticles = 20;
var maxNoOfParticles = 400;
var particlePathRadius = 150;
var particleSpacing = 50;

var particleSpeed = 10;

var colorArray = [
					'#0477bf',
					'#024873',
					'#05f240',
					'#f28705',
					'#f24405'
					];

canvas.addEventListener('mousedown', 
						function(event) {
						mouse.x = event.x;
						mouse.y = event.y;

						});

window.addEventListener('resize', 
						function(event) {
							canvas.width = window.innerWidth;
							canvas.height = window.innerHeight;						
							init();
						});

function Particle(x, y, velocity, radius, radians, pathOffset) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.minRadius = radius;
	this.radians = radians;
	this.velocity = velocity;
	this.color = colorArray[Math.floor(Math.random() * colorArray.length) ];
	this.pathOffset = pathOffset;
	this.lastMouse = {x: x, y: y};
	

	this.draw = function () {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.strokeStyle = this.color;
		if (isFilled) {
			//c.fillStyle = this.color;
			c.fill();
		}
		c.stroke();		
	}
	
	this.update = function () {
		//Bounce off edges
		//if (this.x + radius > canvas.width || this.x - (radius) < 0){
		//	this.dx = -this.dx;
		//}
		//if (this.y + radius > canvas.height || this.y - (radius) < 0){
		//	this.dy = -this.dy;
		//}
		
		const lastPoint = { x: this.x, y: this.y};
		this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05;
		this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05;
		
		//Circular movement
		this.x = this.lastMouse.x + Math.cos(2 * Math.PI * this.radians)*(particlePathRadius + pathOffset);
		this.y = this.lastMouse.y + Math.sin(2 * Math.PI * this.radians)*(particlePathRadius + pathOffset);
		
		//Move points over time
		this.radians = (this.radians + this.velocity);

		//Increase radius if close to mouse pointer
		if (mouse.x - this.x < 50 && mouse.x - this.x > -50 &&
			mouse.y - this.y < 50 && mouse.y - this.y > -50 &&
			this.radius < maxRadius){
			this.radius += 1;
		}
		
		//Decrease radius if away from mouse pointer
		else if (this.radius > this.minRadius) {
			this.radius -= 1;
		}
		
		this.draw(lastPoint);
		
		this.draw = function(lastPoint) {
				c.beginPath();
				c.strokeStyle = this.color;
				c.lineWidth = this.radius;
				c.moveTo(lastPoint.x, lastPoint.y);
				c.lineTo(this.x, this.y);
				c.stroke();
			c.closePath();
			}
		};
	
}

function addParticles(){
	for (var i = 0; i < noOfParticles; i++){
		var x = Math.abs((Math.random() * canvas.width - minRadius*4)) + minRadius*2;
		var y = Math.abs((Math.random() * canvas.height - minRadius*4)) + minRadius*2;
		var velocity = (Math.random() - 1) * .01;
		var radius = (Math.random() * startRadius) + 1;
		var radians = (Math.random() * 2 * Math.PI);
		var offset = (Math.random() - 1) * particleSpacing;
	
		var particle = new Particle(x, y, velocity, radius, radians, offset);
		particlesArray.push(particle);
	}
}

function init(){
	particlesArray = [];	
	addParticles();
}

function animate(){
// 	requestAnimationFrame(animate);
	c.fillStyle = '#FFFFFF0D';
	c.fillRect(0, 0, canvas.width, canvas.height);
	c.fill();
	if (!isPaused){
		for (var i = 0; i < particlesArray.length; i++){
			particlesArray[i].update();
		}
	}
}

function addManyParticles(){
	element = document.getElementById('btnMakeItRain');
	if (element.innerHTML == 'Make it rain'){
		noOfParticles = maxNoOfParticles;
		element.innerHTML = 'Reset';
	}
	else{
		noOfParticles = minNoOfParticles;
		element.innerHTML = 'Make it rain';
	}
	init();
}

function setPaused() { 
	isPaused = !isPaused; 
	element = document.getElementById('btnPause');
	if (isPaused) { element.innerHTML = 'Resume'; }
	else { element.innerHTML = 'Pause'; }
}

function setFill() { 
	isFilled = !isFilled; 
	element = document.getElementById('btnFill');
	if (isFilled) { element.innerHTML = 'Pen'; }
	else { element.innerHTML = 'Paint'; }
}

function moveWithMouse(event) {
	mouse.x = event.x;
	mouse.y = event.y;
}

function setDrawWithMouse() { 
	isDrawWithMouse = !isDrawWithMouse; 
	element = document.getElementById('btnDrawWithMouse');
	
	if (isDrawWithMouse) { 
		element.innerHTML = 'On Click'; 
		canvas.addEventListener('mousemove', moveWithMouse);
	}
	else { 
		element.innerHTML = 'Move With Mouse'; 
		canvas.removeEventListener('mousemove', moveWithMouse);
	}

}
function makeCircleSmaller() { particlePathRadius -= 10; }

function makeCircleLarger() { particlePathRadius += 10; }

// animate();
setDrawWithMouse();
init();
setInterval(animate, particleSpeed);
