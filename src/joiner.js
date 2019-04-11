var canPrintTree = true;

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

		if (input_list.indexOf(13) != -1 && canPrintTree) {
			printBinaryTree(this.tree);
			canPrintTree = false;
		}
		if (input_list.indexOf(13) == -1) { canPrintTree = true; }
	}

	this.draw = () => {
		if (input_list.indexOf(32) != -1) {
			this.firstPerson.draw(this.wallArray);
		}
		else {
			this.firstPerson.drawUsingBSP(this.tree);
		}
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