var cameraSpeed = 1.0;
var canPrintTree = true;

var toggleDrawSolid = 0;
var canToggleDrawSolid = true;

var toggleDrawOrder = 0;
var canToggleDrawOrder = true;

var toggleDrawMethod = 0;
var canToggleDrawMethod = true;

var toggleMinimap = true;
var canToggleMinimap = true;

function Joiner() {
	this.initialize = () => {
		this.positionList = getVerticesFromID('map-data');
		this.colorList = getColorFromID('color-data');
		this.tree = getBinaryTreeFromID('tree-data');

		this.wallArray = [];

		var colorIndex = 0;
		for (var x = 0; x < this.positionList.length; x += 2) {
			this.wallArray.push(new Wall(this.positionList[x], this.positionList[x + 1],
										[this.colorList[colorIndex], this.colorList[colorIndex + 1], this.colorList[colorIndex + 2], 255]
			));
			colorIndex += 3;
		}

		this.cameraPosition = [50, 50];
		this.cameraAngle = [0];
		this.cameraProperties = [this.cameraPosition, this.cameraAngle];

		this.firstPerson = new FirstPerson(this.cameraProperties);
		this.firstPerson.initialize(this.wallArray, this.tree);

		this.thirdPerson = new ThirdPerson(this.cameraProperties);
		this.thirdPerson.initialize(this.wallArray, this.tree);
	}

	this.update = () => {
		if (canToggleMinimap && input_list.indexOf(17) != -1) {
			toggleMinimap = !toggleMinimap;
			if (toggleMinimap) { document.getElementById('indicator-third-person').setAttribute('class', 'green'); }
			else { document.getElementById('indicator-third-person').setAttribute('class', 'red'); }
			canToggleMinimap = false;
		}
		if (!canToggleMinimap && input_list.indexOf(17) == -1) { canToggleMinimap = true; }

		if (input_list.indexOf(16) != -1) {
			cameraSpeed = 2.0;
			document.getElementById('indicator-move-fast').setAttribute('class', 'green');
		}
		else {
			cameraSpeed = 1.0;
			document.getElementById('indicator-move-fast').setAttribute('class', 'red');
		}

		if (input_list.indexOf(37) != -1 || input_list.indexOf(38) != -1 || input_list.indexOf(39) != -1 || input_list.indexOf(40) != -1) {
			document.getElementById('indicator-move').setAttribute('class', 'green');
		}
		else { document.getElementById('indicator-move').setAttribute('class', 'red'); }

		if ((input_list.indexOf(37) != -1 && input_list.indexOf(39) == -1) || touch_position[0] == -1) { this.cameraAngle[0] += 1 * cameraSpeed; }
		if ((input_list.indexOf(39) != -1 && input_list.indexOf(37) == -1) || touch_position[0] == 1) { this.cameraAngle[0] -= 1 * cameraSpeed; }
		if ((input_list.indexOf(38) != -1 && input_list.indexOf(40) == -1) || touch_position[1] == -1) {
			this.cameraPosition[0] += Math.cos(degreeToRadians(-this.cameraAngle[0])) * cameraSpeed;
			this.cameraPosition[1] += Math.sin(degreeToRadians(-this.cameraAngle[0])) * cameraSpeed;
		}
		if ((input_list.indexOf(40) != -1 && input_list.indexOf(38) == -1) || touch_position[1] == 1) {
			this.cameraPosition[0] -= Math.cos(degreeToRadians(-this.cameraAngle[0])) * cameraSpeed;
			this.cameraPosition[1] -= Math.sin(degreeToRadians(-this.cameraAngle[0])) * cameraSpeed;
		}

		if (canPrintTree && input_list.indexOf(13) != -1) {
			printBinaryTree(this.tree);
			canPrintTree = false;
			document.getElementById('indicator-print-bsp').setAttribute('class', 'green');
		}
		if (canToggleDrawMethod && input_list.indexOf(32) != -1) {
			if (toggleDrawMethod == 0) {
				toggleDrawMethod += 1;
				document.getElementById('indicator-method-bsp').setAttribute('class', 'red');
				document.getElementById('indicator-method-first').setAttribute('class', 'green');
			}
			else {
				if (toggleDrawMethod == 1) {
					toggleDrawMethod += 1;
					document.getElementById('indicator-method-first').setAttribute('class', 'red');
					document.getElementById('indicator-method-last').setAttribute('class', 'green');
				}
				else { 
					if (toggleDrawMethod == 2) {
						toggleDrawMethod = 0;
						document.getElementById('indicator-method-last').setAttribute('class', 'red');
						document.getElementById('indicator-method-bsp').setAttribute('class', 'green');
					}
				}
			}
			canToggleDrawMethod = false;
		}
		if (!canToggleDrawMethod && input_list.indexOf(32) == -1) { canToggleDrawMethod = true; }

		if (canToggleDrawSolid && input_list.indexOf(90) != -1) {
			if (toggleDrawSolid == 0) {
				toggleDrawSolid += 1;
				document.getElementById('indicator-texture-solid').setAttribute('class', 'red');
				document.getElementById('indicator-texture-wireframe').setAttribute('class', 'green');
			}
			else {
				if (toggleDrawSolid == 1) {
					toggleDrawSolid += 1;
					document.getElementById('indicator-texture-wireframe').setAttribute('class', 'red');
					document.getElementById('indicator-texture-textured').setAttribute('class', 'green');
					document.getElementById('interval-container').setAttribute('class', 'background-color-disabled');
					
					toggleDrawOrder = 0;
					document.getElementById('indicator-order').setAttribute('class', 'red');
					document.getElementById('indicator-order-first').setAttribute('class', 'red');
					document.getElementById('indicator-order-last').setAttribute('class', 'red');
				}
				else { 
					if (toggleDrawSolid == 2) {
						toggleDrawSolid += 1;
						document.getElementById('indicator-texture-textured').setAttribute('class', 'red');
						document.getElementById('indicator-texture-textured-interpolated').setAttribute('class', 'green');
					}
					else {
						if (toggleDrawSolid == 3) {
							toggleDrawSolid = 0;
							document.getElementById('indicator-texture-textured-interpolated').setAttribute('class', 'red');
							document.getElementById('indicator-texture-solid').setAttribute('class', 'green');
							document.getElementById('interval-container').setAttribute('class', 'background-color-enabled');
						}
					}
				}
			}
			canToggleDrawSolid = false;
		}
		if (!canToggleDrawSolid && input_list.indexOf(90) == -1) { canToggleDrawSolid = true; }

		if (canToggleDrawOrder && (toggleDrawSolid == 0 || toggleDrawSolid == 1) && input_list.indexOf(88) != -1) {
			if (toggleDrawOrder == 0) {
				toggleDrawOrder += 1;
				document.getElementById('indicator-order').setAttribute('class', 'green');
				document.getElementById('indicator-order-first').setAttribute('class', 'green');
			}
			else {
				if (toggleDrawOrder == 1) {
					toggleDrawOrder += 1;
					document.getElementById('indicator-order-first').setAttribute('class', 'red');
					document.getElementById('indicator-order-last').setAttribute('class', 'green');
				}
				else { 
					if (toggleDrawOrder == 2) {
						toggleDrawOrder = 0;
						document.getElementById('indicator-order').setAttribute('class', 'red');
						document.getElementById('indicator-order-last').setAttribute('class', 'red');
					}
				}
			}
			canToggleDrawOrder = false;
		}
		if (!canToggleDrawOrder && input_list.indexOf(88) == -1) { canToggleDrawOrder = true; }

		this.thirdPerson.update();
	}

	this.draw = () => {
		if (toggleDrawMethod == 0) { this.firstPerson.drawUsingBSP(this.tree); }
		if (toggleDrawMethod == 1) { this.firstPerson.drawFirstToLast(this.wallArray); }
		if (toggleDrawMethod == 2) { this.firstPerson.drawLastToFirst(this.wallArray); }

		if (toggleMinimap) {
			if (toggleDrawMethod == 0) { this.thirdPerson.drawUsingBSP(this.tree); }
			if (toggleDrawMethod == 1) { this.thirdPerson.drawFirstToLast(this.wallArray); }
			if (toggleDrawMethod == 2) { this.thirdPerson.drawLastToFirst(this.wallArray); }
		}
	}
}

function getRandomTextureIndex() {
	return Math.floor(Math.random()*(textureCount));
}

function Wall(pointA, pointB, color = [], textureIndex = -1) {
	this.pointA = pointA;
	this.pointB = pointB;

	this.color = color;
	if (textureIndex == -1) { this.textureIndex = getRandomTextureIndex(); }
	else { this.textureIndex = textureIndex; }

	Wall.prototype.toString = function wallToString() {
		return this.pointA[0] + "," + this.pointA[1] + "|" + this.pointB[0] + "," + this.pointB[1];
	}
}

function WallNode(id = undefined, splitter = undefined, left = null, right = null) {
	this.id = id;
	this.splitter = splitter;

	this.left = left;
	this.right = right;
}