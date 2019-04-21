var SCREEN_WIDTH = 1000;
var SCREEN_HEIGHT = 600;

var scaleX, scaleY, scaleMin;

var gl;
var programList = [];
var joiner;

var textureCount = 50;
var textureSheet = false;
var texture;

function initializeTextures() {
  textureSheet = new Image();
  textureSheet.src = "res/texture_sheet.png";
  textureSheet.addEventListener('load', function() {
    document.getElementById("loading-text").remove();
    initialize();

    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, textureSheet);
    //gl.generateMipmap(gl.TEXTURE_2D);
  });
}

function resize() {
  scaleX = (window.innerWidth / (SCREEN_WIDTH + 50));
  scaleY = (window.innerHeight / (SCREEN_HEIGHT + 50));
  scaleMin = Math.min(scaleX, scaleY);

  if (scaleMin <= 1.0) {
    gl.canvas.width = (SCREEN_WIDTH * scaleMin);
    gl.canvas.height = (SCREEN_HEIGHT * scaleMin);
  }
  else {
    scaleMin = 1.0;
    gl.canvas.width = SCREEN_WIDTH;
    gl.canvas.height = SCREEN_HEIGHT;
  }
}

function initialize() {
  var canvas = document.getElementById("glCanvas");
  gl = canvas.getContext("experimental-webgl");
  resize();

  createListeners();

  programList.push(createProgram(VERTEX_SHADER_1, FRAGMENT_SHADER_1));
  programList.push(createProgram(VERTEX_SHADER_2, FRAGMENT_SHADER_2));
  programList.push(createProgram(VERTEX_SHADER_3, FRAGMENT_SHADER_3));
  programList.push(createProgram(VERTEX_SHADER_4, FRAGMENT_SHADER_4));

  joiner = new Joiner();
  joiner.initialize();

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  mainLoop();
}

function mainLoop() {
  update();
  draw();
  //window.setTimeout(mainLoop, 1000 / 60);
  requestAnimationFrame(mainLoop);
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
var touch_position = [0, 0];
function createListeners() {
  gl.canvas.addEventListener("touchstart", event => {
    if (event.touches[0].clientX < gl.canvas.offsetLeft + (gl.canvas.width / 4)) { touch_position[0] = -1; }
    if (event.touches[0].clientX > gl.canvas.offsetLeft + (gl.canvas.width * (3 / 4))) { touch_position[0] = 1; }
    if (event.touches[0].clientY < gl.canvas.offsetTop + (gl.canvas.height / 4)) { touch_position[1] = -1; }
    if (event.touches[0].clientY > gl.canvas.offsetTop + (gl.canvas.height * (3 / 4))) { touch_position[1] = 1; }
  });

  gl.canvas.addEventListener("touchmove", event => {
    touch_position = [0, 0];
    if (event.touches[0].clientX < gl.canvas.offsetLeft + (gl.canvas.width / 4)) { touch_position[0] = -1; }
    if (event.touches[0].clientX > gl.canvas.offsetLeft + (gl.canvas.width * (3 / 4))) { touch_position[0] = 1; }
    if (event.touches[0].clientY < gl.canvas.offsetTop + (gl.canvas.height / 4)) { touch_position[1] = -1; }
    if (event.touches[0].clientY > gl.canvas.offsetTop + (gl.canvas.height * (3 / 4))) { touch_position[1] = 1; }
  });

  gl.canvas.addEventListener("touchend", event => {
    touch_position = [0, 0];
  });

  document.addEventListener('keydown', event => {
    if ([32, 37, 38, 39, 40].indexOf(event.keyCode) != -1) { event.preventDefault(); }
    if (input_list.indexOf(event.keyCode) == -1) { input_list.push(event.keyCode); }
  });

  document.addEventListener('keyup', event => {
    input_list.splice(input_list.indexOf(event.keyCode), 1);
  });

  document.getElementById('button-space').addEventListener('click', event => {
    joiner.handleDrawMethod();
  });

  document.getElementById('button-z').addEventListener('click', event => {
    joiner.handleTexture();
  });

  document.getElementById('indicator-order').addEventListener('click', event => {
    if ((toggleDrawSolid == 0 || toggleDrawSolid == 1)) {
      joiner.handleDrawOrder();
    }
  });

  document.getElementById('indicator-print-bsp').addEventListener('click', event => {
    joiner.handlePrintTree();
  });

  document.getElementById('indicator-third-person').addEventListener('click', event => {
    joiner.handleMinimap();
  });
}