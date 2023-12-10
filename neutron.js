class Neutron {
  constructor(x, y, diameter) {
    this.pos = createVector(x, y);
    this.v = createVector(random([-2, 2]) * random(0, 5), random([-2, 2]) * random(0, 5));
    
    this.diameter = diameter;
    this.COLOR = color(100, 100, 100);
    
    this.life = 255;
    this.DECAY_RATE = 1;
  }
  
  draw() {
    fill(this.COLOR);
    ellipse(this.pos.x, this.pos.y, this.diameter);
  }
  
  update() {
    this.pos.add(this.v);
    this.life -= this.DECAY_RATE;
  }
}