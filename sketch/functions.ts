/**
 * Draws an arrow at specified x and y coordinates, with specified angle and leg length.
 * @param x x-coordinate in px
 * @param y y-coordinate in px
 * @param angle angle in degrees (0 is left)
 * @param legLength length of arrow legs in px
 */
function drawArrow(x: number, y: number, angle: number, legLength: number = 10): void {
    push()
    translate(x, y);
    rotate(radians(90))
    rotate(radians(angle));
    push()
    rotate(radians(45))
    line(0, 0, legLength, 0)
    pop()
    push()
    rotate(radians(135))
    line(0, 0, legLength, 0)
    pop()
    pop()
}

/**
 * Describes linear function of form `ax+b`
 */
interface linearFunction {
    a: number,
    b: number
}

/**
 * Finds and returns slope (a param) and y-intercept of linear function 
 * @param x1 x component of point 1
 * @param y1 y component of point 1
 * @param x2 x component of point 2
 * @param y2 y component of point 2
 */
function getLinearFunction(x1: number, y1: number, x2: number, y2: number): linearFunction {
    // get slope
    let slope = (y1 - y2) / (x1 - x2)

    // get y-intercept
    let b = y2 - slope * x2;
    
    return {a: slope, b: b}
}