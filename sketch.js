// Canvas and grid variables
const SIM_WIDTH = 700;
const SIM_HEIGHT = 700;
const CANVAS_WIDTH = 700;
const CANVAS_HEIGHT = 900;
const GRID_SIZE = 50;
const FRAMERATE = 60;
let backgroundColor;

// Nuclei variables
const NUCLEI_NUM = 1000;
const NUCLEI_DENSITY = 75;
const NUCLEUS_DIAMETER = 10;
let nucleiGrid;
let nucleusColor;

// Neutron variables
const NEUTRON_MOUSECLICK_NUM = 5;
const NEUTRON_DIAMETER = 5;
let neutrons;

// Neutron reflector variables
const ADD_NEUTRON_REFLECTORS = true;
const NEUTRON_REFLECTOR_WIDTH = 5;
let neutronReflectors;

// Simulation bounds variables for neutron reflectors
const X_LEFT_BOUND = Y_TOP_BOUND = NEUTRON_REFLECTOR_WIDTH;
const X_RIGHT_BOUND = SIM_WIDTH - NEUTRON_REFLECTOR_WIDTH;
const Y_BOTTOM_BOUND = SIM_HEIGHT - NEUTRON_REFLECTOR_WIDTH;

function setup() { 
  // Canvas and grid variables
  backgroundColor = color(10, 10, 10);

  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  frameRate(FRAMERATE);
  noStroke();

  neutronReflectors = [];
  neutrons = [];
  
  // Creates neutron reflectors if constant specifies
  if (ADD_NEUTRON_REFLECTORS) {
    neutronReflectors.push(new NeutronReflector(0, 0, SIM_WIDTH, NEUTRON_REFLECTOR_WIDTH));
    neutronReflectors.push(new NeutronReflector(0, 0, NEUTRON_REFLECTOR_WIDTH, SIM_HEIGHT));
    neutronReflectors.push(new NeutronReflector(SIM_WIDTH - NEUTRON_REFLECTOR_WIDTH, 0, NEUTRON_REFLECTOR_WIDTH, SIM_HEIGHT));
    neutronReflectors.push(new NeutronReflector(0, SIM_HEIGHT - NEUTRON_REFLECTOR_WIDTH, SIM_WIDTH, NEUTRON_REFLECTOR_WIDTH));
  }
  
  // Initializes nuclei grid
  nucleiGrid = new Array(SIM_WIDTH / GRID_SIZE);
  
  for (let i = 0; i < nucleiGrid.length; i++) {
    nucleiGrid[i] = new Array(SIM_HEIGHT / GRID_SIZE);
    
      for (let j = 0; j < nucleiGrid[i].length; j++) {
        nucleiGrid[i][j] = [];
      }
  }
  
  // Creates nuclei and places them in grid
  for (let i = 0; i < NUCLEI_NUM; i++) {
    let x = map(randomGaussian(SIM_WIDTH / 2, NUCLEI_DENSITY), 0, SIM_WIDTH, X_LEFT_BOUND + (NUCLEUS_DIAMETER / 2), X_RIGHT_BOUND - (NUCLEUS_DIAMETER / 2), true);
    let y = map(randomGaussian(SIM_WIDTH / 2, NUCLEI_DENSITY), 0, SIM_WIDTH, Y_TOP_BOUND + (NUCLEUS_DIAMETER / 2), Y_BOTTOM_BOUND - (NUCLEUS_DIAMETER / 2), true);
    
    let nucleus = new Nuclei(x, y, NUCLEUS_DIAMETER, nucleusColor)
    
    let r = floor(nucleus.x / GRID_SIZE);
    let c = floor(nucleus.y / GRID_SIZE);
    
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
  if ((mouseX > X_LEFT_BOUND + NEUTRON_DIAMETER / 2 && mouseX < X_RIGHT_BOUND - NEUTRON_DIAMETER / 2) && (mouseY > Y_TOP_BOUND + NEUTRON_DIAMETER / 2 && mouseY < Y_BOTTOM_BOUND - NEUTRON_DIAMETER / 2)) {
    for (let i = 0; i < NEUTRON_MOUSECLICK_NUM; i++) {
      neutrons.push(new Neutron(mouseX, mouseY, NEUTRON_DIAMETER));
    }
  }
}

function checkCollisions() {
  if (ADD_NEUTRON_REFLECTORS) {
    // If there are neutron reflectors, calculates reflections
    for (let i = 0; i < neutrons.length; i++) {
      let neutron = neutrons[i];

      if (neutron.x <= X_LEFT_BOUND + (NEUTRON_DIAMETER / 2)) {
        neutron.x = X_LEFT_BOUND + (NEUTRON_DIAMETER / 2);
        neutron.vx = -(neutron.vx);
      }
      
      if (neutron.x >= (X_RIGHT_BOUND - NEUTRON_DIAMETER / 2)) {
        neutron.x = X_RIGHT_BOUND - (NEUTRON_DIAMETER / 2);
        neutron.vx = -(neutron.vx);
      }
      
      if (neutron.y <= (Y_TOP_BOUND + NEUTRON_DIAMETER / 2)) {
        neutron.y = Y_TOP_BOUND + (NEUTRON_DIAMETER / 2);
        neutron.vy = -(neutron.vy);
      }
      
      if (neutron.y >= (Y_BOTTOM_BOUND - NEUTRON_DIAMETER / 2)) {
        neutron.y = Y_BOTTOM_BOUND - (NEUTRON_DIAMETER / 2);
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
  
  for (let i = neutrons.length - 1; i >= 0; i--) {
    // Calculates location in grid of neutron
    let neutron = neutrons[i];
    
    let r = floor(neutron.x / GRID_SIZE);
    let c = floor(neutron.y / GRID_SIZE);
    
    // Creates array of cell indexes to check, from current neutron cell and its adjacent cells
    let cellsToCheck = [];
    
    cellsToCheck.push([r, c]);
    
    if (r - 1 >= 0) {
      cellsToCheck.push([r - 1, c]);
    }
    
    if (r + 1 < nucleiGrid.length) {
      cellsToCheck.push([r + 1, c]);
    }
    
    if (c - 1 >= 0) {
      cellsToCheck.push([r, c - 1]);
    }
    
    if (c + 1 < nucleiGrid[r].length) {
      cellsToCheck.push([r, c + 1]);
    }
    
    // Checks if neutron collided with any nearby nuclei
    for (let j = cellsToCheck.length - 1; j >= 0; j--) {
      let cellNuclei = nucleiGrid[cellsToCheck[j][0]][cellsToCheck[j][1]]

      for (let k = cellNuclei.length - 1; k >= 0; k--) {
        if (dist(cellNuclei[k].x, cellNuclei[k].y, neutron.x, neutron.y) <= ((NUCLEUS_DIAMETER / 2) + (NEUTRON_DIAMETER / 2))) {
          splitNucleus(cellsToCheck[j][0], cellsToCheck[j][1], k);
          neutrons.splice(i, 1);
          
          break;
        }
      }
    }
  }
}

function splitNucleus(r, c, k) {
  // Removes nucleus with specified indexes, creates neutrons
  let nucleus = nucleiGrid[r][c][k];
  
  for (let i = 0; i < round(random(2, 3)); i++) {
    neutrons.push(new Neutron(nucleus.x, nucleus.y, NEUTRON_DIAMETER));
  }
  
  nucleiGrid[r][c].splice(k, 1);
}