export class KalmanFilter {
  private k: number;
  constructor(
    public x: number,
    private q: number = 0.2,
    private r: number = 1,
    private p: number = 1) {}

  update(value) {
    this.p = this.p + this.q;
    this.k = this.p / (this.p + this.r);
    this.x = this.x + this.k * (value - this.x);
    this.p = (1 - this.k) * this.p;
    return this.x;
  }
}
