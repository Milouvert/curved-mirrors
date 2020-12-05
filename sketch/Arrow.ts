class Arrow {
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

  public cast(mirror: Mirror): Arrow {
    if (mirror.pos.x - this.pos.x == 0) return
    push()
    stroke("red")
    let cast1 = this.castRay1(mirror);
    line(this.pos.x, this.pos.y - this.height, cast1.rays[0].x, cast1.rays[0].y)
    if (this.pos.x > mirror.pos.x) strokeWeight(0.5)
    line(cast1.rays[0].x, cast1.rays[0].y, cast1.rays[1].x, cast1.rays[1].y)
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
    if (this.pos.x != mirror.pos.y - mirror.F) {
      line(this.pos.x, this.pos.y - this.height, cast2.rays[0].x, cast2.rays[0].y)
      let distFirstArrow = mirror.pos.x-this.pos.x;
      drawArrow(this.pos.x+distFirstArrow/2, this.pos.y-this.height, this.pos.x < mirror.pos.x?0:180, 5)
      if (this.pos.x > mirror.pos.x) strokeWeight(0.5)
      line(cast2.rays[0].x, cast2.rays[0].y, cast2.rays[1].x, cast2.rays[1].y)
      let angle = createVector(-mirror.pos.x, 0).angleBetween(createVector(-mirror.pos.x, cast2.rays[1].y-cast2.rays[0].y));
      push()
      translate(cast2.rays[0].x, cast2.rays[0].y)
      rotate(radians(180)+angle)
      translate(dist(cast2.rays[0].x, cast2.rays[0].y, cast2.rays[1].x, cast2.rays[1].y)/2, 0)
      drawArrow(0, 0, 0, 5)
      pop()
      if (cast2.rays.length > 2) {
        push()
        strokeWeight(0.5)
        line(cast2.rays[0].x, cast2.rays[0].y, cast2.rays[2].x, cast2.rays[2].y)
        pop()
      }
    }
    pop()

    push()
    stroke("blue")
    let cast3 = this.castRay3(mirror);
    if (this.pos.x > mirror.pos.x) strokeWeight(0.5)
    line(this.pos.x, this.pos.y - this.height, cast3.rays[0].x, cast3.rays[0].y)
    if (cast3.rays.length > 1) {
      push()
      strokeWeight(0.5)
      line(this.pos.x, this.pos.y - this.height, cast3.rays[1].x, cast3.rays[1].y)
      pop()
    }
    pop()

    // get intercept of cast1 and cast2
    let a = cast1.func.a
    let c = cast1.func.b
    let b = cast2.func.a
    let d = cast2.func.b

    let interX = (d - c) / (a - b)
    let interY = a * ((d - c) / (a - b)) + c

    // get di
    let distO: number = mirror.pos.x - this.pos.x
    let distI = pow((1 / mirror.F - 1 / distO), -1);
    let g = -distI / distO
    let inverted = g < 0
    let virtual = distI < 0 || this.pos.x > mirror.pos.x
    let heightI = abs(g) * this.height

    return new Arrow(mirror.pos.x - distI, heightI, inverted, virtual);
  }

  private castRay1(mirror: Mirror): { rays: p5.Vector[], func: linearFunction } {
    let arr: p5.Vector[] = []
    let func: linearFunction = getLinearFunction(this.pos.x, this.pos.y-this.height, mirror.pos.x-mirror.F, mirror.pos.y)
    let slope = func.a
    let b = func.b

    // get intersect with mirror x
    let intX = mirror.pos.x
    let intY = slope * (intX) + b
    arr.push(createVector(intX, intY))

    // go back perpendicular to line (slope = 0)
    let perpenX = 0;
    let perpenY = intY;
    arr.push(createVector(perpenX, perpenY))
    if (this.pos.x > mirror.pos.x - mirror.F && this.pos.x < mirror.pos.x) {
      let virtualX = width;
      let virtualY = intY;
      arr.push(createVector(virtualX, virtualY))
    }
    return { rays: arr, func: { a: 0, b: intY } };
  }

  private castRay2(mirror: Mirror): { rays: p5.Vector[], func: linearFunction } {
    let arr: p5.Vector[] = []
    let perpenX = mirror.pos.x;
    let perpenY = this.pos.y - this.height
    arr.push(createVector(perpenX, perpenY))

    // go back to f
    // ax+b
    // get slope
    let x1 = perpenX;
    let y1 = perpenY;
    let x2 = mirror.pos.x - mirror.F
    let y2 = mirror.pos.y
    let slope = (y1 - y2) / (x1 - x2)
    // get b
    // y2 = slope * x2 + b
    // y2 - (slope * x2) = b
    let b = y2 - slope * x2

    // get intersect with mirror x
    let intX = 0
    let intY = slope * (intX) + b
    arr.push(createVector(intX, intY))

    if (this.pos.x > mirror.pos.x - mirror.F && this.pos.x < mirror.pos.x) {
      let virtualX = width;
      let virtualY = slope * (virtualX) + b;
      arr.push(createVector(virtualX, virtualY))
    }

    return { rays: arr, func: { a: slope, b: b } }
  }

  private castRay3(mirror: Mirror): { rays: p5.Vector[], func: linearFunction } {
    let arr: p5.Vector[] = [];
    // go to c
    // ax+b
    // get slope
    let x1 = this.pos.x;
    let y1 = this.pos.y - this.height;
    let x2 = mirror.pos.x - mirror.C
    let y2 = mirror.pos.y
    let slope = x1 - x2 != 0 ? (y1 - y2) / (x1 - x2) : 50
    // get b
    // y2 = slope * x2 + b
    // y2 - (slope * x2) = b
    let b = y2 - slope * x2

    // get intersect with mirror x
    let intY = height
    let intX = (intY - b) / slope
    arr.push(createVector(intX, intY))

    if (this.pos.x > mirror.pos.x - mirror.F && this.pos.x < mirror.pos.x) {
      let virtualY = 0;
      let virtualX = (virtualY - b) / slope;
      arr.push(createVector(virtualX, virtualY))
    }
    return { rays: arr, func: { a: slope, b: b } }
  }
}