class Neutron {
  constructor(x, y, diameter) {
    this.x = x;
    this.y = y;
    
    this.vx = random([-2, 2]) * random(0, 5);
    this.vy = random([-2, 2]) * random(0, 5);
    
    this.diameter = diameter;
    this.COLOR = color(100, 100, 100);
    
    this.life = 255;
    this.DECAY_RATE = 1;
  }
  
  draw() {
    fill(this.COLOR);
    ellipse(this.x, this.y, this.diameter);
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    
    this.life -= this.DECAY_RATE;
  }
}