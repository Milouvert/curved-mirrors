class LinearFunction {
    a: number;
    b: number;

    /**
     * Builds a linear function from 2 points
     * @param x1 x component of point 1
     * @param y1 y component of point 1
     * @param x2 x component of point 2
     * @param y2 y component of point 2
     */
    constructor(x1: number, y1: number, x2: number, y2: number) {
        this.a = (y1 - y2) / (x1 - x2);
        this.b = y2 - this.a * x2
    }

    getY(x: number): number {
        return this.a * x + this.b;
    }

    getX(y: number): number {
        return (y - this.b) / this.a
    }

    intersect(func: LinearFunction): p5.Vector {
        let interX = (func.b - this.b) / (this.a - func.a)
        let interY = this.a * ((func.b - this.b) / (this.a - func.a)) + this.b
        return createVector(interX, interY);
    }
}