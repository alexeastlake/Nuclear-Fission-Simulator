class NeutronReflector {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
    this.COLOR = color(150, 150, 150);
  }
  
  draw() {
    fill(this.COLOR);
    rect(this.x, this.y, this.width, this.height);
  }
}