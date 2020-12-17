class Target {
  constructor(opts = {}) {
    let def = {
      col: 0,
      row: 0,
      x: 0,
      y: 0,
      radius: 20,
      id: 0,
      fillColor: "rgba(170, 209, 197,1)",
      strokeColor: "rgba(170, 209, 197,0.5)",
      mustBeIn: false,
      active: false,
      
      // need to be in opts
      c: null,
      grid: {},
      angle: 0,
      
    };

    Object.assign(this, def, opts);
    this.init();
  }

  init() {}

  update() {
    //couleurs pour target bleue
    if (this.mustBeIn == true) {
      this.fillColor = "rgba(170, 209, 197,1)";
      this.strokeColor = "rgba(170, 209, 197,0.5)";
    } else {
      //couleurs pour target rouge
      this.fillColor = "rgba(229, 76, 76,1)";
      this.strokeColor = "rgba(229, 76, 76,0.5)";
    }

    let c = this.ctx;
    c.lineJoin = "round";
    c.lineWidth = (this.radius * 2) / 3;
    c.fillStyle = this.fillColor;
    c.strokeStyle = this.strokeColor;
    c.save();

    c.beginPath();

    c.translate(this.col * this.grid.gap, this.row * this.grid.gap);
    c.rotate((Math.PI / 4) * this.angle);
    this.angle = this.angle + 0.02;
    c.rect(-this.radius / 2, -this.radius / 2, this.radius, this.radius);
    c.closePath();

    if (this.active == true) {
       //ajouter contour pour target active
      c.stroke();
    }

    c.fill();
    c.restore();
  }
}
