class Nuclei {
  constructor(x, y, diameter, color) {
    this.x = x;
    this.y = y;
    
    this.diameter = diameter;
    this.color = color;
  }
  
  draw() {
    fill(this.color);
    ellipse(this.x, this.y, this.diameter);
  } 
}