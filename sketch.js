// Canvas and grid constants
const width = 700;
const height = 700;
const backgroundColor = [10, 10, 10];
const gridSize = 50;
const frames = 60;

// Grid for nuclei
let nucleiGrid;

// Nuclei constants
const nucleiNum = 1000;
const nucleiDensity = 75;
const nucleiDiameter = 10;
const nucleiColor = [200, 100, 50];

// Array for neutrons
let neutrons = [];

// Neutron constants
const neutronDiameter = 5;
const neutronColor = [100, 100, 100];
const neutronNumOnMouseClick = 5;

// Array of neutron reflectors
let neutronReflectors = [];

// Neutron reflector constants
const addNeutronReflectors = true;
const neutronReflectorWidth = 5;
const neutronReflectorColor = [75, 75, 75];

// Constants for bounds of neutron reflectors
let xLeftBound;
let xRightBound;
let yTopBound;
let yBottomBound;

function setup() { 
  createCanvas(width, height);
  frameRate(frames);
  
  noStroke();
  
  // Creates neutron reflectors if constant specifies
  if (addNeutronReflectors) {
    neutronReflectors.push(new NeutronReflector(0, 0, width, neutronReflectorWidth, neutronReflectorColor));
    neutronReflectors.push(new NeutronReflector(0, 0, neutronReflectorWidth, height, neutronReflectorColor));
    neutronReflectors.push(new NeutronReflector(width - neutronReflectorWidth, 0, neutronReflectorWidth, height, neutronReflectorColor));
    neutronReflectors.push(new NeutronReflector(0, height - neutronReflectorWidth, width, neutronReflectorWidth, neutronReflectorColor));
  }
  
  // Calculates bounds for neutron reflectors
  xLeftBound = neutronReflectorWidth + nucleiDiameter;
  xRightBound = width - neutronReflectorWidth - nucleiDiameter;
  yTopBound = neutronReflectorWidth + nucleiDiameter;
  yBottomBound = height - neutronReflectorWidth - nucleiDiameter;
  
  // Initializes nuclei grid
  nucleiGrid = new Array(width / gridSize);
  
  for (let i = 0; i < nucleiGrid.length; i++) {
    nucleiGrid[i] = new Array(height / gridSize);
    
      for (let j = 0; j < nucleiGrid[i].length; j++) {
        nucleiGrid[i][j] = [];
      }
  }
  
  // Creates nuclei and places them in grid
  for (let i = 0; i < nucleiNum; i++) {
    let x = map(randomGaussian(width / 2, nucleiDensity), 0, width, xLeftBound, xRightBound, true);
    let y = map(randomGaussian(width / 2, nucleiDensity), 0, width, yTopBound, yBottomBound, true);
    
    let nucleus = new Nuclei(x, y, nucleiDiameter, nucleiColor)
    
    let r = floor(nucleus.x / gridSize);
    let c = floor(nucleus.y / gridSize);
    
    nucleiGrid[r][c].push(nucleus);
  }
}

function draw() {
  background(backgroundColor);
  
  // Updates all neutrons
  for (let i = neutrons.length - 1; i >= 0; i--) {
    neutrons[i].update();
    
    if (neutrons[i].life <= 0) {
      neutrons.splice(i, 1);
    }
  }
  
  // Checks for collisions
  checkCollisions();
  
  // Draws all neutrons
  for (let i = neutrons.length - 1; i >= 0; i--) {
    neutrons[i].draw();
  }
  
  // Draws all nuclei
  for (let i = 0; i < nucleiGrid.length; i++) {
    let r = nucleiGrid[i];
    
    for (let j = 0; j < r.length; j++) {
      let c = r[j];
      
      for (let k = 0; k < c.length; k++) {
        c[k].draw();
      }
    }
  }
  
  // Draws all neutron reflectors
  for (let i = 0; i < neutronReflectors.length;i++) {
    neutronReflectors[i].draw();
  } 
}

function mouseClicked() {
  // Creates new neutrons upon mouse click
  for (let i = 0; i < neutronNumOnMouseClick; i++) {
    neutrons.push(new Neutron(mouseX, mouseY, neutronDiameter, neutronColor));
  }
}

function checkCollisions() {
  if (addNeutronReflectors) {
    // If there are neutron reflectors, calculates reflections
    for (let i = 0; i < neutrons.length; i++) {
      let neutron = neutrons[i];

      if (neutron.x <= xLeftBound) {
        neutron.x = xLeftBound;
        neutron.vx = -(neutron.vx);
      } else if (neutron.x >= xRightBound) {
        neutron.x = xRightBound;
        neutron.vx = -(neutron.vx);
      } else if (neutron.y <= yTopBound) {
        neutron.y = yTopBound;
        neutron.vy = -(neutron.vy);
      } else if (neutron.y >= yBottomBound) {
        neutron.y = yBottomBound;
        neutron.vy = -(neutron.vy);
      }
    }
  } else {
    // If no neutron reflectors, removes neutrons that are off screen
    for (let i = neutrons.length - 1; i >= 0; i--) {
      let neutron = neutrons[i];

      if (neutron.x < 0 || neutron.x > width || neutron.y < 0 || neutron.y > height) {
        neutrons.splice(i, 1);
      }
    }
  }
  
  for (let i = 0; i < neutrons.length; i++) {
    // Calculates location in grid of neutron
    let neutron = neutrons[i];
    
    let r = floor(neutron.x / gridSize);
    let c = floor(neutron.y / gridSize);
    
    // Creates array of nuclei to check, from current neutron cell and its adjacent cells
    let nucleiToCheck = [];
    let cellNuclei = nucleiGrid[r][c];
    
    nucleiToCheck = nucleiToCheck.concat(cellNuclei);
    
    if (r - 1 >= 0) {
        nucleiToCheck = nucleiToCheck.concat(nucleiGrid[r - 1][c]);
    }
    
    if (r + 1 < nucleiGrid.length) {
        nucleiToCheck = nucleiToCheck.concat(nucleiGrid[r + 1][c]);
    }
    
    if (c - 1 >= 0) {
        nucleiToCheck = nucleiToCheck.concat(nucleiGrid[r][c - 1]);
    }
    
    if (c + 1 < nucleiGrid[r].length) {
        nucleiToCheck = nucleiToCheck.concat(nucleiGrid[r][c + 1]);
    }
    
    // Checks if neutron collided with any nearby nuclei
    for (let j = 0; j < cellNuclei.length; j++) {
      if (dist(cellNuclei[j].x, cellNuclei[j].y, neutron.x, neutron.y) <= ((nucleiDiameter / 2) + (neutronDiameter / 2))) {
        splitNucleus(r, c, j);
        neutrons.splice(i, 1);
        
        break;
      }
    }
  }
}

function splitNucleus(r, c, k) {
  // Removes nucleus with specified indexes, creates neutrons
  let nucleus = nucleiGrid[r][c][k];
  
  for (let i = 0; i < round(random(2, 3)); i++) {
    neutrons.push(new Neutron(nucleus.x, nucleus.y, neutronDiameter, neutronColor));
  }
  
  nucleiGrid[r][c].splice(k, 1);
}