class Nuclei {
  constructor(x, y, diameter) {
    this.pos = createVector(x, y);
    
    this.diameter = diameter;

    this.COLOR = color(200, 100, 100);
  }
  
  draw() {
    fill(this.COLOR);
    ellipse(this.pos.x, this.pos.y, this.diameter);
  } 
}