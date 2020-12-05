class Arrow {
    constructor(xPos, h, inverted, virtual) {
        this.pos = createVector(xPos, height / 2);
        this.height = abs(h);
        this.inverted = inverted ? inverted : false;
        this.virtual = virtual ? virtual : false;
    }
    draw() {
        push();
        stroke(0);
        strokeWeight(2);
        if (this.virtual)
            strokeWeight(0.5);
        translate(this.pos.x, this.pos.y);
        if (this.inverted) {
            line(0, 0, 0, this.height);
            translate(0, this.height);
            rotate(radians(180));
        }
        else {
            line(0, 0, 0, -this.height);
            translate(0, -this.height);
        }
        // ratio this/arrow
        let legLength = map(this.height / arrow.height, 0, 1, 0.5, 2);
        drawArrow(0, 0, -90, legLength * 5);
        pop();
    }
    cast(mirror) {
        if (mirror.pos.x - this.pos.x == 0)
            return;
        push();
        stroke("red");
        let cast1 = this.castRay1(mirror);
        line(this.pos.x, this.pos.y - this.height, cast1.rays[0].x, cast1.rays[0].y);
        if (this.pos.x > mirror.pos.x)
            strokeWeight(0.5);
        line(cast1.rays[0].x, cast1.rays[0].y, cast1.rays[1].x, cast1.rays[1].y);
        if (cast1.rays.length > 2) {
            push();
            strokeWeight(0.5);
            line(cast1.rays[0].x, cast1.rays[0].y, cast1.rays[2].x, cast1.rays[2].y);
            pop();
        }
        pop();
        push();
        stroke("green");
        let cast2 = this.castRay2(mirror);
        if (this.pos.x != mirror.pos.y - mirror.F) {
            line(this.pos.x, this.pos.y - this.height, cast2.rays[0].x, cast2.rays[0].y);
            let distFirstArrow = mirror.pos.x - this.pos.x;
            drawArrow(this.pos.x + distFirstArrow / 2, this.pos.y - this.height, this.pos.x < mirror.pos.x ? 0 : 180, 5);
            if (this.pos.x > mirror.pos.x)
                strokeWeight(0.5);
            line(cast2.rays[0].x, cast2.rays[0].y, cast2.rays[1].x, cast2.rays[1].y);
            let angle = createVector(-mirror.pos.x, 0).angleBetween(createVector(-mirror.pos.x, cast2.rays[1].y - cast2.rays[0].y));
            push();
            translate(cast2.rays[0].x, cast2.rays[0].y);
            rotate(radians(180) + angle);
            translate(dist(cast2.rays[0].x, cast2.rays[0].y, cast2.rays[1].x, cast2.rays[1].y) / 2, 0);
            drawArrow(0, 0, 0, 5);
            pop();
            if (cast2.rays.length > 2) {
                push();
                strokeWeight(0.5);
                line(cast2.rays[0].x, cast2.rays[0].y, cast2.rays[2].x, cast2.rays[2].y);
                pop();
            }
        }
        pop();
        push();
        stroke("blue");
        let cast3 = this.castRay3(mirror);
        if (this.pos.x > mirror.pos.x)
            strokeWeight(0.5);
        line(this.pos.x, this.pos.y - this.height, cast3.rays[0].x, cast3.rays[0].y);
        if (cast3.rays.length > 1) {
            push();
            strokeWeight(0.5);
            line(this.pos.x, this.pos.y - this.height, cast3.rays[1].x, cast3.rays[1].y);
            pop();
        }
        pop();
        // get intercept of cast1 and cast2
        let a = cast1.func.a;
        let c = cast1.func.b;
        let b = cast2.func.a;
        let d = cast2.func.b;
        let interX = (d - c) / (a - b);
        let interY = a * ((d - c) / (a - b)) + c;
        // get di
        let distO = mirror.pos.x - this.pos.x;
        let distI = pow((1 / mirror.F - 1 / distO), -1);
        let g = -distI / distO;
        let inverted = g < 0;
        let virtual = distI < 0 || this.pos.x > mirror.pos.x;
        let heightI = abs(g) * this.height;
        return new Arrow(mirror.pos.x - distI, heightI, inverted, virtual);
    }
    castRay1(mirror) {
        let arr = [];
        let func = getLinearFunction(this.pos.x, this.pos.y - this.height, mirror.pos.x - mirror.F, mirror.pos.y);
        let slope = func.a;
        let b = func.b;
        // get intersect with mirror x
        let intX = mirror.pos.x;
        let intY = slope * (intX) + b;
        arr.push(createVector(intX, intY));
        // go back perpendicular to line (slope = 0)
        let perpenX = 0;
        let perpenY = intY;
        arr.push(createVector(perpenX, perpenY));
        if (this.pos.x > mirror.pos.x - mirror.F && this.pos.x < mirror.pos.x) {
            let virtualX = width;
            let virtualY = intY;
            arr.push(createVector(virtualX, virtualY));
        }
        return { rays: arr, func: { a: 0, b: intY } };
    }
    castRay2(mirror) {
        let arr = [];
        let perpenX = mirror.pos.x;
        let perpenY = this.pos.y - this.height;
        arr.push(createVector(perpenX, perpenY));
        // go back to f
        // ax+b
        // get slope
        let x1 = perpenX;
        let y1 = perpenY;
        let x2 = mirror.pos.x - mirror.F;
        let y2 = mirror.pos.y;
        let slope = (y1 - y2) / (x1 - x2);
        // get b
        // y2 = slope * x2 + b
        // y2 - (slope * x2) = b
        let b = y2 - slope * x2;
        // get intersect with mirror x
        let intX = 0;
        let intY = slope * (intX) + b;
        arr.push(createVector(intX, intY));
        if (this.pos.x > mirror.pos.x - mirror.F && this.pos.x < mirror.pos.x) {
            let virtualX = width;
            let virtualY = slope * (virtualX) + b;
            arr.push(createVector(virtualX, virtualY));
        }
        return { rays: arr, func: { a: slope, b: b } };
    }
    castRay3(mirror) {
        let arr = [];
        // go to c
        // ax+b
        // get slope
        let x1 = this.pos.x;
        let y1 = this.pos.y - this.height;
        let x2 = mirror.pos.x - mirror.C;
        let y2 = mirror.pos.y;
        let slope = x1 - x2 != 0 ? (y1 - y2) / (x1 - x2) : 50;
        // get b
        // y2 = slope * x2 + b
        // y2 - (slope * x2) = b
        let b = y2 - slope * x2;
        // get intersect with mirror x
        let intY = height;
        let intX = (intY - b) / slope;
        arr.push(createVector(intX, intY));
        if (this.pos.x > mirror.pos.x - mirror.F && this.pos.x < mirror.pos.x) {
            let virtualY = 0;
            let virtualX = (virtualY - b) / slope;
            arr.push(createVector(virtualX, virtualY));
        }
        return { rays: arr, func: { a: slope, b: b } };
    }
}
class Mirror {
    constructor(xPos, F) {
        this.pos = createVector(xPos, height / 2);
        this.F = F;
        this.C = 2 * F;
        this.height = 400 - 20;
    }
    draw() {
        push();
        stroke(0);
        line(this.pos.x, this.pos.y - (this.height / 2), this.pos.x, this.pos.y + (this.height / 2));
        translate(this.pos.x, this.pos.y - (this.height / 2));
        drawAngle(10, 225);
        translate(0, this.height);
        drawAngle(10, 135);
        translate(0, -(this.height / 2));
        // draw f pt
        strokeWeight(5);
        translate(-this.F, 0);
        point(0, 0);
        push();
        noStroke();
        textSize(15);
        textStyle(ITALIC);
        textFont('Georgia');
        text('f', -2.5, 15);
        pop();
        translate(-this.F, 0);
        point(0, 0);
        push();
        noStroke();
        textSize(15);
        textStyle(ITALIC);
        textFont('Georgia');
        text('c', -2.5, 15);
        pop();
        pop();
    }
}
function drawAngle(l, a) {
    push();
    rotate(radians(a));
    line(0, 0, l, 0);
    pop();
}
/**
 * Draws an arrow at specified x and y coordinates, with specified angle and leg length.
 * @param x x-coordinate in px
 * @param y y-coordinate in px
 * @param angle angle in degrees (0 is left)
 * @param legLength length of arrow legs in px
 */
function drawArrow(x, y, angle, legLength = 10) {
    push();
    translate(x, y);
    rotate(radians(90));
    rotate(radians(angle));
    push();
    rotate(radians(45));
    line(0, 0, legLength, 0);
    pop();
    push();
    rotate(radians(135));
    line(0, 0, legLength, 0);
    pop();
    pop();
}
/**
 * Finds and returns slope (a param) and y-intercept of linear function
 * @param x1 x component of point 1
 * @param y1 y component of point 1
 * @param x2 x component of point 2
 * @param y2 y component of point 2
 */
function getLinearFunction(x1, y1, x2, y2) {
    // get slope
    let slope = (y1 - y2) / (x1 - x2);
    // get y-intercept
    let b = y2 - slope * x2;
    return { a: slope, b: b };
}
let arrow, mirror;
function setup() {
    createCanvas(windowWidth, windowHeight);
    mirror = new Mirror(width / 2, 100);
    arrow = new Arrow(mirror.pos.x - mirror.C, 50, false, false);
}
function draw() {
    background(220);
    // draw principal axis
    push();
    strokeWeight(0.5);
    stroke(0);
    line(0, height / 2, width, height / 2);
    pop();
    arrow.pos.x = mouseX;
    arrow.draw();
    let newArrow = arrow.cast(mirror);
    if (newArrow)
        newArrow.draw();
    mirror.draw();
    // print text on upper right
    textFont('Georgia');
    textStyle(ITALIC);
    textSize(10);
    translate(width - 150, 0);
    scale(2);
    fill("#00000011");
    stroke("#00000022");
    if (newArrow) {
        rect(0, 0, 100, 66);
    }
    else {
        rect(0, 0, 100, 38);
    }
    // ho
    fill(0);
    push();
    text("h", 10, 15);
    push();
    textSize(7);
    text("o", 16, 15 + textAscent() / 2);
    pop();
    text(`= ${arrow.height.toFixed(2)}`, 20, 15);
    pop();
    // do
    push();
    text("d", 10, 28);
    push();
    textSize(7);
    text("o", 16, 28 + textAscent() / 2);
    pop();
    text(`= ${(mirror.pos.x - arrow.pos.x).toFixed(2)}`, 20, 28);
    pop();
    if (newArrow) {
        // hi
        push();
        text("h", 10, 41);
        push();
        textSize(7);
        text("i", 16, 41 + textAscent() / 2);
        pop();
        text(`= ${newArrow.height.toFixed(2)}`, 20, 41);
        pop();
        // di
        push();
        text("d", 10, 54);
        push();
        textSize(7);
        text("i", 16, 54 + textAscent() / 2);
        pop();
        text(`= ${(mirror.pos.x - newArrow.pos.x).toFixed(2)}`, 20, 54);
        pop();
    }
}
// resize with window
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    mirror.pos.x = width / 2;
}
