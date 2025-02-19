// fast Voronoi diagram with Hoff's algorithm
// basic implementation credit sandorlevi, 2016

function preload() {
  // crunch_sound =
}

cells = [];
n = 30;
hover_cells = 5;
ss = 800;
function setup() {
  r = dist(0, 0, ss, ss);
  console.log(r);
  createCanvas(ss, ss, WEBGL);
  colorMode(RGB, 1);
  noStroke();
  //orthographic projection at center
  ortho(-ss / 2, ss / 2, -ss / 2, ss / 2, 0, r);
  for (let i = 0; i < n; i++) {
    cells[i] = new Cell(random(ss), random(ss), random(-1, 1), random(-1, 1));
  }
  console.log(cells);
}

let oldMouseX = 0;
let oldMouseY = 0;

colors = ["#FDB347", "#FFC72C", "#FFB74C", "#F4A460", "#CD7F32"];

/*
let oldMouseX = 0;
let oldMouseY = 0;
function draw() {
  for (let i = 0; i < cells.length; i++) {
    c = i / cells.length;
    // color logic goes here
    color_i = c % colors.length;
    color = colors[color_i];
    fill(color);
*/

function draw() {
  for (let i = 0; i < cells.length; i++) {
    c = i / cells.length;

    fill(colors[i % colors.length]);
    thisCell = cells[i];
    thisCell.show();
    thisCell.update();
  }
  // CLICK LOGIC: fills clicked cell with blue
  // fill("#60a5fa");
  if (mouseIsPressed) {
    // Create a new cell at mouse position with random velocity
    cell = new Cell(mouseX, mouseY, random(-3, 3), random(-3, 3));

    // Create hover_cells additional cells in a 200x200 area around mouse
    // These cells have no velocity (static)
    for (let i = 0; i < hover_cells; i++) {
      cells.push(
        new Cell(
          random(mouseX - 100, mouseX + 100),
          random(mouseY - 100, mouseY + 100),
          0,
          0
        )
      );
    }

    // Display the mouse cell
    cell.show();
  }
  //
  /*if(cells.length > 50){
  cells.shift()
  }*/
  //cells.push(cell)
}

class Cell {
  constructor(x, y, sx, sy) {
    this.x = x;
    this.y = y;
    this.sx = sx;
    this.sy = sy;
  }
  //actual voronoi here
  show() {
    push(); // Saves current drawing settings
    translate(this.x - ss / 2, this.y - ss / 2, 0); // Moves drawing position to cell's location

    // Setup for drawing a cone
    let a = 0; // Starting angle
    let s = 100; // Number of triangles to make
    let p = TWO_PI / s; // Angle between each triangle (360° ÷ 10)

    beginShape(); // Start drawing a custom shape
    for (let i = 0; i < s; i++) {
      // For each triangle:
      vertex(0, 0, 0); // Point 1: Center point
      vertex(r * cos(a), r * sin(a), -r); // Point 2: Edge point
      vertex(r * cos(a + p), r * sin(a + p), -r); // Point 3: Next edge point
      a += p; // Move to next angle
    }
    endShape(); // Finish the shape

    // Draw white dot at center
    // fill(1, 1, 1);
    // ellipse(0, 0, 5, 5);

    pop(); // Restore original drawing settings
  }

  update() {
    // return
    // Update position based on speed
    this.x += this.sx;
    this.y += this.sy;

    // Bounce off horizontal walls by reversing x speed
    if (this.x < 0 || this.x > width) {
      this.sx = -this.sx;
    }
    // Bounce off vertical walls by reversing y speed
    if (this.y < 0 || this.y > height) {
      this.sy = -this.sy;
    }
  }
}
