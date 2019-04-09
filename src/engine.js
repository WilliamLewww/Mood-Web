var gl;
var programList = [];
var joiner;

function initialize() {
  var canvas = document.getElementById("glCanvas");
  gl = canvas.getContext("experimental-webgl");

  programList.push(createProgram(VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE));

  joiner = new Joiner();
  joiner.initialize();

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  mainLoop();
}

function mainLoop() {
  update();
  draw();
  window.setTimeout(mainLoop, 1000 / 60);
}

function update() {
  joiner.update();
}

function draw() {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  joiner.draw();
}

function createProgram(vertexSource, fragmentSource) {
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(vertexShader, vertexSource);
  gl.shaderSource(fragmentShader, fragmentSource);

  gl.compileShader(vertexShader);
  gl.compileShader(fragmentShader);

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  return program;
}