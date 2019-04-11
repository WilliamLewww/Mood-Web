var gl;
var programList = [];
var joiner;

var SCREEN_WIDTH;
var SCREEN_HEIGHT;

function initialize() {
  var canvas = document.getElementById("glCanvas");
  gl = canvas.getContext("experimental-webgl");

  SCREEN_WIDTH = gl.canvas.width;
  SCREEN_HEIGHT = gl.canvas.height;

  createListeners();

  programList.push(createProgram(VERTEX_SHADER_1, FRAGMENT_SHADER_1));

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

var input_list = [];
function createListeners() {
  document.addEventListener('keydown', event => {
    if ([32, 37, 38, 39, 40].indexOf(event.keyCode) != -1) { event.preventDefault(); }
    if (input_list.indexOf(event.keyCode) == -1) { input_list.push(event.keyCode); }
  });

  document.addEventListener('keyup', event => {
    input_list.splice(input_list.indexOf(event.keyCode), 1);
  });
}