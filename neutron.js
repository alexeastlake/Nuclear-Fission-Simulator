class Neutron {
  constructor(x, y, diameter, color) {
    this.x = x;
    this.y = y;
    
    this.vx = random([-2, 2]) * random(0, 5);
    this.vy = random([-2, 2]) * random(0, 5);
    
    this.diameter = diameter;
    this.color = color;
    
    this.life = 255;
    this.decayRate = 1;
  }
  
  draw() {
    fill(this.color);
    ellipse(this.x, this.y, this.diameter);
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    
    this.life -= this.decayRate;
  }
}