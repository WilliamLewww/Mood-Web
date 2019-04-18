var THIRD_PERSON_SCALE_X = 0.3;
var THIRD_PERSON_SCALE_Y = 0.3;

var currentAlphaThirdPerson = 0;

function setThirdPersonScale(value) {
	THIRD_PERSON_SCALE_X = value;
	THIRD_PERSON_SCALE_Y = value;
}

function ThirdPerson(cameraProperties) {
	this.cameraProperties = cameraProperties;

	this.initialize = (wallArray, tree) => {
		this.background = new Rectangle(0, 0, 700, 700, [0,0,0,255]);
		
		this.cameraEntitySize = 15;
		this.cameraEntity = new Rectangle(this.cameraProperties[0][0] - (this.cameraEntitySize / 2), this.cameraProperties[0][1] - (this.cameraEntitySize / 2), this.cameraEntitySize, this.cameraEntitySize, [255, 255, 255, 255]);

		this.wallBuffer = [];
		for (var x = 0; x < wallArray.length; x++) {
			this.wallBuffer.push(new Line(wallArray[x].pointA, wallArray[x].pointB, wallArray[x].color));
		}

		this.wallBufferTree = Array(currentID);
		this.linkNodeWithWall(tree);
	}

	this.linkNodeWithWall = (node) => {
		if (node == null) { return; }
		this.linkNodeWithWall(node.left);
		this.linkNodeWithWall(node.right);
		this.wallBufferTree[node.id] = new Line(node.splitter.pointA, node.splitter.pointB, node.splitter.color);
	}

	this.update = () => {
		this.cameraEntity.x = this.cameraProperties[0][0] - (this.cameraEntitySize / 2);
		this.cameraEntity.y = this.cameraProperties[0][1] - (this.cameraEntitySize / 2);
	}

	this.drawWall = (wall) => {
		if (toggleDrawOrder == 0) { wall.color[3] = 255; }
		if (toggleDrawOrder == 1) { wall.color[3] = currentAlphaThirdPerson; currentAlphaThirdPerson -= alphaInterval; }
		if (toggleDrawOrder == 2) { wall.color[3] = currentAlphaThirdPerson; currentAlphaThirdPerson += alphaInterval; }
		wall.draw();
	}

	this.drawFirstToLast = () => {
		if (toggleDrawOrder == 1) { currentAlphaThirdPerson = 255; }
		if (toggleDrawOrder == 2) { currentAlphaThirdPerson = 0; }
		this.background.draw();
		for (var x = 0; x < this.wallBuffer.length; x++) {
			this.drawWall(this.wallBuffer[x]);
		}
		this.cameraEntity.draw();

	}

	this.drawLastToFirst = () => {
		if (toggleDrawOrder == 1) { currentAlphaThirdPerson = 255; }
		if (toggleDrawOrder == 2) { currentAlphaThirdPerson = 0; }
		this.background.draw();
		for (var x = this.wallBuffer.length - 1; x >= 0; x--) {
			this.drawWall(this.wallBuffer[x]);
		}
		this.cameraEntity.draw();

	}

	this.drawUsingBSP = (tree) => {
		if (toggleDrawOrder == 1) { currentAlphaThirdPerson = 255; }
		if (toggleDrawOrder == 2) { currentAlphaThirdPerson = 0; }
		this.background.draw();
		this.iterateBSPTree(tree);
		this.cameraEntity.draw();
	}

	this.iterateBSPTree = (node) => {
		if (node == null) { return; }
		if (getWallPosition(node.splitter, this.cameraProperties[0]) == 1) {
			this.iterateBSPTree(node.left);
			this.drawWall(this.wallBufferTree[node.id]);
			this.iterateBSPTree(node.right);
		}
		else {
			this.iterateBSPTree(node.right);
			this.drawWall(this.wallBufferTree[node.id]);
			this.iterateBSPTree(node.left);
		}
	}
}