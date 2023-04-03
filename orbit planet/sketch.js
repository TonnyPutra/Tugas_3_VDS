let planets = []
let sun
let numPlanets = 4
let G = 120
let destabilise = 0.15


function preload(){
  sun_ = loadImage("sun.png")
  mercury_ = loadImage("mercury.png")
  venus_ = loadImage("venus.png")
  earth_ = loadImage("earth.png")
  mars_ = loadImage("mars.png")
  moon_ = loadImage("moon.png")
  space = loadImage("space.jpg")
  return planetimage = [mercury_, venus_ , earth_ , mars_]
}

function setup() {
  createCanvas(windowWidth,windowHeight)
  sun = new Body(50,createVector(0,0),createVector(0,0))
  b=15
  mass_=[15,25,27,17]
  for (let i = 0; i < numPlanets; i++) {
    let mass = mass_[i]
    let radius = sun.d+b
    let angle = PI
    let planetPos = createVector(radius * cos(angle), radius * sin(angle))
    b+=75
    let planetVel = planetPos.copy()
    if (random(1) < 0.1) planetVel.rotate(-HALF_PI)
    else planetVel.rotate(HALF_PI)
    planetVel.normalize()
    planetVel.mult( sqrt((G * sun.mass)/(radius)) ) 
    planetVel.mult( random( 1-destabilise, 1+destabilise) ) 
    planets.push( new Body(mass, planetPos, planetVel) )
  }

  // let moon_mass = 13
  // let moon_radius = planets[2].d+15
  // let angle = PI
  // let moonPos = createVector(moon_radius * cos(angle), moon_radius * sin(angle))
  // let moonVel = moonPos.copy()
  // if (random(1) < 0.1) moonVel.rotate(-HALF_PI)
  // else moonVel.rotate(HALF_PI)
  // moonVel.normalize()
  // moonVel.mult( sqrt((G * planets[2].mass)/(moon_radius)) )
  // moonVel.mult( random( 1-destabilise, 1+destabilise) )
  // moon = new Body(moon_mass,moonPos,moonVel)
}

function windowResized() {
 resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background('#2F00B2')
  let name = ['Mercury', 'Venus', 'Earth', 'Mars']
  image(space,0,0,width,height)
  translate(width/2, height/2)
  for (let i = numPlanets-1; i >= 0; i--) {
    sun.attract(planets[i])
    planets[i].move()
    planets[i].show(planetimage[i])
    text(String(name[i]),planets[i].pos.x,planets[i].pos.y)
  }
  // planets[2].attract(moon)
  // moon.move()
  // moon.show(moon_)
  translate(-sun.mass, -sun.mass)
  sun.show(sun_)
  text('sun',sun.pos.x,sun.pos.y)
  textSize(25)
}


function Body(_mass, _pos, _vel){
  this.mass = _mass
  this.pos = _pos
  this.vel = _vel
  this.d = this.mass*2
  this.path = []
  this.pathLen = Infinity

  this.show = function(pic) {
    stroke(0,50)
    for (let i = 0; i < this.path.length-2; i++) {
      
      line(this.path[i].x, this.path[i].y, this.path[i+1].x, this.path[i+1].y,)
      stroke("white")
    }
    fill(255); noStroke()
    image(pic,this.pos.x, this.pos.y, this.d, this.d)
  }


  this.move = function() {
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.path.push(createVector(this.pos.x,this.pos.y))
    if (this.path.length > 200) this.path.splice(0,1)
  }

  this.applyForce = function(f) {
    this.vel.x += f.x / this.mass
    this.vel.y += f.y / this.mass
  }

  this.attract = function(child) {
    let r = dist(this.pos.x, this.pos.y, child.pos.x, child.pos.y)
    let f = (this.pos.copy()).sub(child.pos)
    f.setMag( (G * this.mass * child.mass)/(r * r) )
    child.applyForce(f)
  }
}