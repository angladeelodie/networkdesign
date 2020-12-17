class Area {
  constructor(opts = {}) {
    let def = {
      id: 0,
      color: "rgba(145, 137, 76, 0.2)",
      // need to be in opts
      ctx: null,
      dotsId: [],
      grid: {},
      dots: {},
      path: new Path2D(),
    };

    Object.assign(this, def, opts);
    this.init();
  }

  init() {}

  getDotById(id) {
    return this.dots[id];
  }

  addDot(dot) {
    this.dotsId.push(dot.dotId);
    this.computePath();
  }

  computePath() {
    if (!this.dotsId.length) return;

    let c = this.ctx;

    // let lastDot = this.getDotById(this.dotsId[this.dotsId.length-1]);
    let dotsId = [...this.dotsId];

    this.path = new Path2D();
    
    let firstDot = this.getDotById(dotsId.shift());

    let row = firstDot.row;
    let col = firstDot.col;

    this.path.moveTo(col * this.grid.gap, row * this.grid.gap);

    for (let dotId of dotsId) {
      let currDot = this.getDotById(dotId);
      row = currDot.row;
      col = currDot.col;

      this.path.lineTo(col * this.grid.gap, row * this.grid.gap);

    }
  }

  checkCollision(x, y) {
    return this.ctx.isPointInPath(this.path, x, y);
  }

  update() {
    this.computePath();
    c.fillStyle = this.color;
    c.beginPath();

    c.fill(this.path);
    
    
  }
}
