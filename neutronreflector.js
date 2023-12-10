class NeutronReflector {
  constructor(x, y, width, height) {
    this.pos = createVector(x, y);
    this.width = width;
    this.height = height;
    
    this.COLOR = color(150, 150, 150);
  }
  
  draw() {
    fill(this.COLOR);
    rect(this.pos.x, this.pos.y, this.width, this.height);
  }
}