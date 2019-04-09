function Joiner() {
	this.initialize = () => {
		this.positionList = getVerticesFromID('map-data');
		this.colorList = getVerticesFromID('color-data');
		this.tree = getBinaryTreeFromID('tree-data');
	}

	this.update = () => {

	}

	this.draw = () => {
	
	}
}

function Wall(pointA, pointB, color) {
	this.pointA = pointA;
	this.pointB = pointB;

	this.color = color;

	Wall.prototype.toString = function wallToString() {
		return this.pointA[0] + "," + this.pointA[1] + "|" + this.pointB[0] + "," + this.pointB[1];
	}
}

function WallNode(splitter = undefined, left = null, right = null) {
	this.splitter = splitter;

	this.left = left;
	this.right = right;
}