let cv, c;

let GRID = {
  gap: 30,
  margin: 10,
  pointRadius: 2,
};

let LVL = {
  number: 0,
  separationCol: 0,
};

let MOUSE = {
  x: 0,
  y: 0,
  drag: false,
  mapped: { x: 0, y: 0 },
  pressed: false,
  dotId: 0,

  drawPointer() {
    c.arc(this.mapped.x, this.mapped.y, 10, 0, 2 * Math.PI);
    c.fill();
  },
};

let DOTS = [];
let TARGETS = [];
let AREA;

window.addEventListener("load", async() => {


  let lvlConfigs = await SETUP.preload([0]);

  console.log(lvlConfigs)

  //arrow function
  initCanvas();
  initListeners();




  AREA = new Area({
    ctx: c,
    grid: GRID,
    dots: DOTS,
  });

  for (let i = 0; i < 5; i++) {
    let newDot = createDot(cv.width - cv.width / 10, (i / 10) * cv.height);
    AREA.addDot(newDot);
  }
  update();

  const urlParameter = new URLSearchParams(window.location.search);
  this.ID = urlParameter.get("player");
  console.log(this.ID);

  this.appHasStarted = false;
  // DATABASE.ref("in_and_out_v1").on("value", this.onValueChanged.bind(this));


  DATABASE.ref("level_0").once("value", (snapshot) => {
    console.log("once", snapshot.val());
  });

  DATABASE.ref("level_0/lvl").on("value", (snapshot) => {
    console.log("on lvl", snapshot.val());
  });

  SEND_MESSAGE("level_0", lvlConfigs[0]);

  lvlConfigs[0].lvl.separationCol = 4;

  SEND_MESSAGE("level_0", lvlConfigs[0]);

});

function onValueChanged(snapshot) {
  if (!this.appHasStarted) {
    this.appHasStarted = true;
  } else {
    console.log("snapshot", snapshot.val());
  }
}

function drawSeparationLine() {
  let { x, y } = snapToGrid(MOUSE.x, MOUSE.y);
  let { col } = posToGrid(MOUSE.x, MOUSE.y);
  c.save();

  c.beginPath();
  c.moveTo(x, 0);
  c.lineTo(x, cv.height);

  LVL.separationCol = col;
  c.stroke();

  c.restore();
}



function initListeners() {
  window.addEventListener("resize", resizeCanvas);
  let saveButton = document.getElementById("getJson");
  saveButton.addEventListener("click", saveJson);

  window.addEventListener("keydown", (event) => {
    // console.log(event.key);
    // let collided = AREA.checkCollision(MOUSE.mapped.x, MOUSE.mapped.y);
    if (event.keyCode == 79) {
      newTarget = createTarget(MOUSE.mapped.x, MOUSE.mapped.y);
      newTarget.mustBeIn = false;
    } else if (event.keyCode == 73) {
      newTarget = createTarget(MOUSE.mapped.x, MOUSE.mapped.y);
      newTarget.mustBeIn = true;
    } else if (event.keyCode == 65) {
      let newDot = createDot(MOUSE.mapped.x, MOUSE.mapped.y);
      AREA.addDot(newDot);
    }
  });

  window.addEventListener("mousemove", (event) => {
    MOUSE.x = event.pageX;
    MOUSE.y = event.pageY;
    mouseDragged();
    checkTargetCollision();
  });

  window.addEventListener("mousedown", mouseDown);
  window.addEventListener("mouseup", mouseUp);
}

function checkTargetCollision() {
  for (let target of Object.values(TARGETS)) {
    let collided = AREA.checkCollision(
      target.col * GRID.gap,
      target.row * GRID.gap
    );

    if (collided == true && target.mustBeIn == true) {
      target.active = true;
      //console.log("target is active");
    } else if (collided == false && target.mustBeIn == false) {
      target.active = true;
    } else if (collided == true && target.mustBeIn == false) {
      target.active = false;
    } else if (collided == false && target.mustBeIn == true) {
      target.active = false;
    }
  }
}

function initCanvas() {
  cv = document.querySelector("#main-canvas");
  c = cv.getContext("2d");
  resizeCanvas();
}


function createDot(x, y) {
  let { col, row } = posToGrid(x, y);
  let dotId = DOTS.length;
  let newDot = new Dot({ dotId, row, col, ctx: c, grid: GRID });
  DOTS.push(newDot);
  // dotId++;
  return newDot;
}

function createTarget(x, y) {
  let { col, row } = posToGrid(x, y);
  let targetId = TARGETS.length;
  let newTarget = new Target({ targetId, row, col, ctx: c, grid: GRID });
  TARGETS.push(newTarget);
  return newTarget;
}

function posToGrid(x, y) {
  let col = Math.round(x / GRID.gap);
  let row = Math.round(y / GRID.gap);
  return { row, col };
}

function gridToPos(col, row) {
  let x = col * GRID.gap;
  let y = row * GRID.gap
  return { x, y };
}

function snapToGrid(x, y) {
  let { col, row } = posToGrid(x, y);
  return gridToPos(col, row);
}


function drawGrid() {
  let margin = GRID.gap;
  let nCol = Math.ceil(cv.width / GRID.gap);
  let nRow = Math.ceil(cv.height / GRID.gap);

  c.fillStyle = "rgba(0,0,0,0.3)";

  for (let col = 0; col < nCol; col++) {
    for (let row = 0; row < nRow; row++) {
      c.beginPath();

      let {x, y} = gridToPos(col, row);

      c.arc(x, y, GRID.pointRadius, 0, 2 * Math.PI);
      c.fill();
    }
  }
}

function drawDots() {
  for (let dot of Object.values(DOTS)) {
    dot.update();
  }
}

function drawTargets() {
  for (let target of Object.values(TARGETS)) {
    target.update();
  }
}

function update() {
  c.fillStyle = "white";
  c.fillRect(0, 0, cv.width, cv.height);

  c.save();
  c.translate(GRID.margin, GRID.margin);
  drawGrid();
  AREA.update();
  drawDots();
  drawTargets();

  c.fillStyle = "blue";
  c.beginPath();

  MOUSE.mapped = UTILS.screenToWorld(MOUSE.x, MOUSE.y, {
    pixelDensity: 1,
    context: c,
  });
  MOUSE.drawPointer();

  drawSeparationLine();

  c.restore();

  requestAnimationFrame(update);
}

function resizeCanvas() {
  cv.width = window.innerWidth;
  cv.height = window.innerHeight;
  cv.style.width = `${cv.width}px`;
  cv.style.height = `${cv.height}px`;
}

function mouseDown() {
  let dots = Object.values(DOTS);
  MOUSE.pressed = true;

  if (dots.length > 0) {
    for (var i = 0; i < dots.length; i++) {
      var dot = dots[i];
      //nbr de colonnes
      colMouseIsIn = Math.round(MOUSE.mapped.x / GRID.gap);
      rowMouseIsIn = Math.round(MOUSE.mapped.y / GRID.gap);

      if (dot.col == colMouseIsIn && dot.row == rowMouseIsIn) {
        MOUSE.dotId = dot.dotId;

        // MOUSE.drag indique que la souris est sur un DOT
        MOUSE.drag = true;
      }
    }
  }
}

function mouseDragged() {
  if (MOUSE.drag == true && MOUSE.pressed == true) {
    let activeDot = DOTS[MOUSE.dotId];
    activeDot.x = MOUSE.mapped.x;
    activeDot.y = MOUSE.mapped.y;
    //console.log(activeDot.row, activeDot.col);
    activeDot.update();
    AREA.update();
  }
}

function mouseUp() {
  MOUSE.pressed = false;
  MOUSE.drag = false;
}

function saveJson() {
  // console.log(TARGETS);
  // const TEST_JSON_OBJECT = TARGETS;
  const database = { lvl: LVL, targets: TARGETS, dots: DOTS };

  downloadObjectAsJson(database, "level_" + LVL.number);
}

function downloadObjectAsJson(exportObj, exportName) {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(exportObj));
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}
