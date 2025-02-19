// fast Voronoi diagram with Hoff's algorithm
// basic implementation credit sandorlevi, 2016

cells = [];
n = 30;
hover_cells = 5;
ss = 800;
let pushAwayStartTime = 0;
let isPushing = false;
let colorSchemeIndex = 0;
let colorButton;

const colorSchemes = [
  ["#FDB347", "#FFC72C", "#FFB74C", "#F4A460", "#CD7F32"], // Original warm
  ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"], // Playful pastels
  ["#2C3E50", "#E74C3C", "#ECF0F1", "#3498DB", "#2980B9"], // Corporate cool
  ["#8E44AD", "#9B59B6", "#BE90D4", "#BF55EC", "#9A12B3"], // Purple haze
  ["#1B1B1B", "#373737", "#747474", "#A6A6A6", "#E3E3E3"], // Monochrome
];

function setup() {
  r = dist(0, 0, ss, ss);
  console.log(r);
  createCanvas(ss, ss, WEBGL);
  colorMode(RGB, 1);
  noStroke();
  //orthographic projection at center
  ortho(-ss / 2, ss / 2, -ss / 2, ss / 2, 0, r);
  for (let i = 0; i < n; i++) {
    cells[i] = new Cell(
      random(ss),
      random(ss),
      random(-1, 1),
      random(-1, 1),
      false
    );
  }

  // Create color scheme button
  colorButton = createButton("Change Colors");
  colorButton.position(10, 10);
  colorButton.mousePressed(() => {
    colorSchemeIndex = (colorSchemeIndex + 1) % colorSchemes.length;
  });

  console.log(cells);
}

let oldMouseX = 0;
let oldMouseY = 0;

function draw() {
  for (let i = 0; i < cells.length; i++) {
    c = i / cells.length;

    fill(
      colorSchemes[colorSchemeIndex][i % colorSchemes[colorSchemeIndex].length]
    );
    thisCell = cells[i];
    thisCell.show();
    thisCell.update();
  }

  if (mouseIsPressed) {
    if (!isPushing) {
      pushAwayStartTime = millis();
      isPushing = true;
    }

    // Create a new cell at mouse position with random velocity
    cell = new Cell(mouseX, mouseY, random(-3, 3), random(-3, 3), true);

    // Create hover_cells additional cells in a 200x200 area around mouse
    for (let i = 0; i < hover_cells; i++) {
      cells.push(
        new Cell(
          random(mouseX - 100, mouseX + 100),
          random(mouseY - 100, mouseY + 100),
          0,
          0,
          true
        )
      );
    }

    // Push away existing cells that weren't created by clicking
    if (millis() - pushAwayStartTime < 3000) {
      for (let cell of cells) {
        if (!cell.fromClick) {
          // Only push cells that weren't created by clicking
          let dx = cell.x - mouseX;
          let dy = cell.y - mouseY;
          let dist = sqrt(dx * dx + dy * dy);
          if (dist < 300) {
            // Push cells within 300 pixels
            let pushForce = map(dist, 0, 300, 10, 0);
            cell.sx += (dx / dist) * pushForce;
            cell.sy += (dy / dist) * pushForce;
          }
        }
      }
    }

    // Display the mouse cell
    cell.show();
  } else {
    isPushing = false;
  }
}

class Cell {
  constructor(x, y, sx, sy, fromClick) {
    this.x = x;
    this.y = y;
    this.sx = sx;
    this.sy = sy;
    this.fromClick = fromClick;
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

    pop(); // Restore original drawing settings
  }

  update() {
    // Update position based on speed
    this.x += this.sx;
    this.y += this.sy;

    // Add friction to gradually slow down cells
    this.sx *= 0.95;
    this.sy *= 0.95;

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
