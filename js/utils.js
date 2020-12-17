const UTILS = {
  screenToWorld(x, y, opts) {
    let defaults = {
      pixelDensity: window.devicePixelRatio,
      context: undefined,
      matrix: undefined,
    };

    opts = Object.assign(defaults, opts);

    let matrix = opts.matrix || opts.context.getTransform();
    let imatrix = matrix.invertSelf();
    let px = opts.pixelDensity;

    x *= px;
    y *= px;

    return {
      x: x * imatrix.a + y * imatrix.c + imatrix.e,
      y: x * imatrix.b + y * imatrix.d + imatrix.f,
    };
  },
};
