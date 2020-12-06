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