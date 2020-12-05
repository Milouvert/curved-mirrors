class Mirror {
    pos: p5.Vector;
    F: number;
    C: number;
    height: number;
    constructor(xPos: number, F: number) {
      this.pos = createVector(xPos, height/2);
      this.F = F
      this.C = 2*F
      this.height = 400 - 20
    }
    
    draw() {
      push()
      stroke(0)
      line(this.pos.x, this.pos.y-(this.height/2), this.pos.x, this.pos.y+(this.height/2))
      translate(this.pos.x, this.pos.y-(this.height/2))
      drawAngle(10, 225)
      translate(0, this.height)
      drawAngle(10, 135)
      translate(0, -(this.height/2));
      // draw f pt
      strokeWeight(5);
      translate(-this.F, 0)
      point(0,0)
      
      push()
      noStroke()
      textSize(15)
      textStyle(ITALIC);
      textFont('Georgia');
      text('f', -2.5, 15);
      pop()
      
      translate(-this.F, 0)
      point(0,0)
      
      push()
      noStroke()
      textSize(15)
      textStyle(ITALIC);
      textFont('Georgia');
      text('c', -2.5, 15);
      pop()
      
      pop()
    }
  }
  
  function drawAngle(l, a) {
    push()
    rotate(radians(a))
    line(0, 0, l, 0)
    pop()
  }