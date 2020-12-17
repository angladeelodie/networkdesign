class Dot {
  constructor(opts = {}) {
    let def = {
      col: 0,
      row: 0,
      x: 0,
      y: 0,
      radius: 20,
      id: 0,
      fillColor: "rgba(219, 199, 49, 1)",
      strokeColor: "rgba(219, 199, 49, 0.5)",
    // need to be in opts
      ctx: null,
      grid: {},
    };

    Object.assign(this, def, opts);

    this.init();
  }

  init() {
    this.x = this.col * this.grid.gap;
    this.y =  this.row * this.grid.gap;
  }

  update() {
    let c = this.ctx;
    c.lineJoin = "round";
    c.lineWidth = this.radius*2/3;
    c.fillStyle = this.fillColor;
    c.strokeStyle = this.strokeColor;

    this.col = Math.round(this.x / this.grid.gap);
    this.row = Math.round(this.y / this.grid.gap);
    
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    c.fill();
    c.stroke();
  }
}
