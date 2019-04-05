var totalTimeSeconds = 0;
var gl;

function initialize() {
  var canvas = document.getElementById("glCanvas");
  gl = canvas.getContext("experimental-webgl");
  if (!gl) { alert("Unable to initialize WebGL. Your browser may not support it."); }

  if (gl) {
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    mainLoop();
  }
}

function mainLoop() {
  draw();
  window.setTimeout(mainLoop, 1000 / 60);
}

function draw() {
  gl.clearColor(0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}