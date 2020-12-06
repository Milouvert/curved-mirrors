class ArrowObject {
  pos: p5.Vector;
  height: number;
  inverted: boolean;
  virtual: boolean;
  constructor(xPos: number, h: number, inverted?: boolean, virtual?: boolean) {
    this.pos = createVector(xPos, height / 2);
    this.height = abs(h);
    this.inverted = inverted ? inverted : false;
    this.virtual = virtual ? virtual : false;
  }

  public draw() {
    push()
    stroke(0)
    strokeWeight(2)
    if (this.virtual) strokeWeight(0.5)
    translate(this.pos.x, this.pos.y)
    if (this.inverted) {
      line(0, 0, 0, this.height)
      translate(0, this.height)
      rotate(radians(180))
    } else {
      line(0, 0, 0, -this.height)
      translate(0, -this.height);
    }
    // ratio this/arrow
    let legLength = map(this.height / arrow.height, 0, 1, 0.5, 2)
    drawArrow(0, 0, -90, legLength * 5)
    pop()
  }

  public cast(mirror: Mirror): ArrowObject {
    if (mirror.pos.x - this.pos.x == 0) return
    push()
    stroke("red")
    let cast1 = this.castRay1(mirror);
    line(this.pos.x, this.pos.y - this.height, cast1.rays[0].x, cast1.rays[0].y)
    let arrowAngle = createVector(1, 0).angleBetween(cast1.rays[0].copy().sub(this.pos.x, this.pos.y - this.height))
    drawArrow(mirror.pos.x + (this.pos.x - mirror.pos.x) / 2, (this.pos.y - this.height + cast1.rays[0].y) / 2, degrees(arrowAngle), 5)
    if (this.pos.x > mirror.pos.x) strokeWeight(0.5)
    line(cast1.rays[0].x, cast1.rays[0].y, cast1.rays[1].x, cast1.rays[1].y)
    drawArrow(mirror.pos.x / 2, cast1.rays[1].y, 180, 5)
    if (cast1.rays.length > 2) {
      push()
      strokeWeight(0.5)
      line(cast1.rays[0].x, cast1.rays[0].y, cast1.rays[2].x, cast1.rays[2].y)
      pop()
    }
    pop()

    push()
    stroke("green")
    let cast2 = this.castRay2(mirror)
    line(this.pos.x, this.pos.y - this.height, cast2.rays[0].x, cast2.rays[0].y)
    let distFirstArrow = mirror.pos.x - this.pos.x;
    drawArrow(this.pos.x + distFirstArrow / 2, this.pos.y - this.height, this.pos.x < mirror.pos.x ? 0 : 180, 5)
    if (this.pos.x > mirror.pos.x) strokeWeight(0.5)
    line(cast2.rays[0].x, cast2.rays[0].y, cast2.rays[1].x, cast2.rays[1].y)
    push()
    arrowAngle = createVector(-mirror.pos.x, 0).angleBetween(createVector(-mirror.pos.x, cast2.rays[1].y - cast2.rays[0].y));
    translate(cast2.rays[0].x, cast2.rays[0].y)
    rotate(radians(180) + arrowAngle)
    translate(dist(cast2.rays[0].x, cast2.rays[0].y, cast2.rays[1].x, cast2.rays[1].y) / 2, 0)
    drawArrow(0, 0, 0, 5)
    pop()
    if (cast2.rays.length > 2) {
      push()
      strokeWeight(0.5)
      line(cast2.rays[0].x, cast2.rays[0].y, cast2.rays[2].x, cast2.rays[2].y)
      pop()
    }
    pop()

    push()
    stroke("blue")
    let cast3 = this.castRay3(mirror);
    if (this.pos.x > mirror.pos.x) strokeWeight(0.5)
    line(this.pos.x, this.pos.y - this.height, cast3.rays[0].x, cast3.rays[0].y)
    let arrowX = this.pos.x + (cast3.rays[0].x - this.pos.x) / 2
    let arrowY = (this.pos.y - this.height + cast3.rays[0].y) / 2
    arrowAngle = createVector(1, 0).angleBetween(cast3.rays[0].copy().sub(createVector(this.pos.x, this.pos.y - this.height)))
    drawArrow(arrowX, arrowY, degrees(arrowAngle), 5);
    if (cast3.rays.length > 1) {
      push()
      strokeWeight(0.5)
      line(this.pos.x, this.pos.y - this.height, cast3.rays[1].x, cast3.rays[1].y)
      pop()
    }
    pop()

    // get di
    let distO: number = mirror.pos.x - this.pos.x
    let distI = pow((1 / mirror.F - 1 / distO), -1);
    let g = -distI / distO
    let inverted = g < 0
    let virtual = distI < 0 || this.pos.x > mirror.pos.x
    let heightI = abs(g) * this.height

    return new ArrowObject(mirror.pos.x - distI, heightI, inverted, virtual);
  }

  private castRay1(mirror: Mirror): { rays: p5.Vector[], func: LinearFunction } {
    let arr: p5.Vector[] = []
    let func: LinearFunction = new LinearFunction(this.pos.x, this.pos.y - this.height, mirror.pos.x - mirror.F, mirror.pos.y)

    // get intersect with mirror x
    let intY: number;
    arr.push(createVector(mirror.pos.x, intY = func.getY(mirror.pos.x)))

    // go back perpendicular to line (slope = 0)
    let perpenX = 0;
    let perpenY = intY;
    arr.push(createVector(perpenX, perpenY))
    if (this.pos.x > mirror.pos.x - mirror.F && this.pos.x < mirror.pos.x) {
      let virtualX = width;
      let virtualY = intY;
      arr.push(createVector(virtualX, virtualY))
    }
    return { rays: arr, func: func };
  }

  private castRay2(mirror: Mirror): { rays: p5.Vector[], func: LinearFunction } {
    let arr: p5.Vector[] = []
    let perpenX = mirror.pos.x;
    let perpenY = this.pos.y - this.height
    arr.push(createVector(perpenX, perpenY))

    // func from (mirror x, arrow height) to (f)
    let func = new LinearFunction(perpenX, perpenY, mirror.pos.x - mirror.F, mirror.pos.y)

    // get intersect with mirror x 
    arr.push(createVector(0, func.getY(0)))

    if (this.pos.x > mirror.pos.x - mirror.F && this.pos.x < mirror.pos.x) {
      arr.push(createVector(width, func.getY(width)))
    }

    return { rays: arr, func: func }
  }

  private castRay3(mirror: Mirror): { rays: p5.Vector[], func: LinearFunction } {
    let arr: p5.Vector[] = [];
    let func = new LinearFunction(this.pos.x, this.pos.y - this.height, mirror.pos.x - mirror.C, mirror.pos.y)

    // get intersect with wall/floor
    let y = height
    let x = func.getX(y)
    if (x < 0) {
      x = 0;
      y = func.getY(x)
    } else if (x > width) {
      x = width;
      y = func.getY(x)
    }
    arr.push(createVector(x, y))

    if (this.pos.x > mirror.pos.x - mirror.F && this.pos.x < mirror.pos.x) arr.push(createVector(func.getX(0), 0))
    
    return { rays: arr, func: func }
  }
}