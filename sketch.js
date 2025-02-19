// fast Voronoi diagram with Hoff's algorithm
// basic implementation credit sandorlevi, 2016

cells = [];
n = 30;
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

function draw() {
  for (let i = 0; i < cells.length; i++) {
    c = i / cells.length;
    fill(0.5 * sqrt(c), 0.2, 0.2);
    thisCell = cells[i];
    thisCell.show();
    thisCell.update();
  }
  //fills moused cell with blue
  fill(0, 0, 1);
  if (mouseX - oldMouseX > 5 || mouseY - oldMouseY > 5) {
    cell = new Cell(mouseX, mouseY, random(-3, 3), random(-3, 3));
    for (let i = 0; i < n; i++) {
      cells[n + i] = new Cell(
        random(mouseX - 100, mouseX + 100),
        random(mouseY - 100, mouseY + 100),
        0,
        0
      );
    }
    cell.show();
    oldMouseX = mouseX;
    oldMouseY = mouseY;
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
    push();
    translate(this.x - ss / 2, this.y - ss / 2, 0);
    let a = 0;
    let s = 10;
    let p = TWO_PI / s;
    beginShape();
    for (let i = 0; i < s; i++) {
      //draws triangles away from center
      vertex(0, 0, 0);
      vertex(r * cos(a), r * sin(a), -r);
      vertex(r * cos(a + p), r * sin(a + p), -r);
      a += p;
    }
    endShape();
    fill(1, 1, 1);
    ellipse(0, 0, 5, 5);
    pop();
  }

  update() {
    this.x += this.sx;
    this.y += this.sy;
    if (this.x < 0 || this.x > width) {
      this.sx = -this.sx;
    }
    if (this.y < 0 || this.y > height) {
      this.sy = -this.sy;
    }
  }
}
