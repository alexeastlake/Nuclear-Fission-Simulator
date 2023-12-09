class Nuclei {
  constructor(x, y, diameter) {
    this.x = x;
    this.y = y;
    
    this.diameter = diameter;

    this.COLOR = color(200, 100, 100);
  }
  
  draw() {
    fill(this.COLOR);
    ellipse(this.x, this.y, this.diameter);
  } 
}