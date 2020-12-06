let arrow: ArrowObject, mirror: Mirror;

function setup() {
  createCanvas(windowWidth, windowHeight);
  mirror = new Mirror(width / 2, 100)
  arrow = new ArrowObject(mirror.pos.x-mirror.C, 50, false, false);
}

function draw() {
  background(220);

  // draw principal axis
  push();
  strokeWeight(0.5);
  stroke(0)
  line(0, height / 2, width, height / 2)
  pop();

  arrow.pos.x = mouseX

  arrow.draw()
  let newArrow = arrow.cast(mirror);
  if (newArrow) newArrow.draw()

  mirror.draw()

  // print text on upper right

  textFont('Georgia');
  textStyle(ITALIC);
  textSize(10);

  translate(width - 150, 0)
  scale(2)
  fill("#00000011")
  stroke("#00000022")
  if (newArrow) {
    rect(0,0, 100, 66)
  } else {
    rect(0,0, 100, 38)
  }
  // ho
  fill(0)
  push()

  text("h", 10, 15)
  push()
  textSize(7)
  text("o", 16, 15+textAscent()/2)
  pop()
  text(`= ${arrow.height.toFixed(2)}`, 20, 15)

  pop()

  // do
  push()

  text("d", 10, 28)
  push()
  textSize(7)
  text("o", 16, 28+textAscent()/2)
  pop()
  text(`= ${(mirror.pos.x - arrow.pos.x).toFixed(2)}`, 20, 28)

  pop()

  if (newArrow) {

  // hi
  push()

  text("h", 10, 41)
  push()
  textSize(7)
  text("i", 16, 41+textAscent()/2)
  pop()
  text(`= ${newArrow.height.toFixed(2)}`, 20, 41)

  pop()

  // di
  push()

  text("d", 10, 54)
  push()
  textSize(7)
  text("i", 16, 54+textAscent()/2)
  pop()
  text(`= ${(mirror.pos.x - newArrow.pos.x).toFixed(2)}`, 20, 54)

  pop()
}
}

// resize with window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  mirror.pos = createVector(width/2, height/2)
  arrow.pos.y = height/2
}