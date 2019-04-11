var canPrintTree = true;
var toggleDrawSolid = true;
var canToggleDrawSolid = true;

var toggleDrawOrder = 0;
var canToggleDrawOrder = true;

var toggleDrawMethod = 0;
var canToggleDrawMethod = true;

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
	}

	this.update = () => {
		if (input_list.indexOf(37) != -1 || input_list.indexOf(38) != -1 || input_list.indexOf(39) != -1 || input_list.indexOf(40) != -1) {
			document.getElementById('indicator-move').setAttribute('class', 'green');
		}
		else { document.getElementById('indicator-move').setAttribute('class', 'red'); }

		if (input_list.indexOf(37) != -1 && input_list.indexOf(39) == -1) { this.cameraAngle[0] += 1; }
		if (input_list.indexOf(39) != -1 && input_list.indexOf(37) == -1) { this.cameraAngle[0] -= 1; }
		if (input_list.indexOf(38) != -1 && input_list.indexOf(40) == -1) {
			this.cameraPosition[0] += Math.cos(degreeToRadians(-this.cameraAngle[0]));
			this.cameraPosition[1] += Math.sin(degreeToRadians(-this.cameraAngle[0]));
		}
		if (input_list.indexOf(40) != -1 && input_list.indexOf(38) == -1) {
			this.cameraPosition[0] -= Math.cos(degreeToRadians(-this.cameraAngle[0]));
			this.cameraPosition[1] -= Math.sin(degreeToRadians(-this.cameraAngle[0]));
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
			toggleDrawSolid = !toggleDrawSolid;
			if (toggleDrawSolid == true) { document.getElementById('indicator-solid').setAttribute('class', 'green'); }
			else { document.getElementById('indicator-solid').setAttribute('class', 'red'); }
			canToggleDrawSolid = false;
		}
		if (!canToggleDrawSolid && input_list.indexOf(90) == -1) { canToggleDrawSolid = true; }

		if (canToggleDrawOrder && input_list.indexOf(88) != -1) {
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
	}

	this.draw = () => {
		if (toggleDrawMethod == 0) { this.firstPerson.drawUsingBSP(this.tree); }
		if (toggleDrawMethod == 1) { this.firstPerson.drawFirstToLast(this.wallArray); }
		if (toggleDrawMethod == 2) { this.firstPerson.drawLastToFirst(this.wallArray); }
	}
}

function Wall(pointA, pointB, color = []) {
	this.pointA = pointA;
	this.pointB = pointB;

	this.color = color;

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