var THIRD_PERSON_SCALE_X = 0.3;
var THIRD_PERSON_SCALE_Y = 0.3;

function setThirdPersonScale(value) {
	THIRD_PERSON_SCALE_X = value;
	THIRD_PERSON_SCALE_Y = value;
}

function ThirdPerson(cameraProperties) {
	this.cameraProperties = cameraProperties;

	this.initialize = (wallArray, tree) => {
		this.background = new Rectangle(0, 0, 700, 700, [0,0,0,255]);
		this.cameraEntity = new Rectangle(this.cameraProperties[0][0] - 5, this.cameraProperties[0][1] - 5, 10, 10, [255, 255, 255, 255]);

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
		this.cameraEntity.x = this.cameraProperties[0][0] - 5;
		this.cameraEntity.y = this.cameraProperties[0][1] - 5;
	}

	this.draw = () => {
		this.background.draw();
		for (var x = 0; x < this.wallBuffer.length; x++) {
			this.wallBuffer[x].draw();
		}
		this.cameraEntity.draw();

	}

	this.drawUsingBSP = (tree) => {
		this.background.draw();
		this.iterateBSPTree(tree);
		this.cameraEntity.draw();
	}

	this.iterateBSPTree = (node) => {
		if (node == null) { return; }
		if (getWallPosition(node.splitter, this.cameraProperties[0]) == 1) {
			this.iterateBSPTree(node.left);
			this.wallBufferTree[node.id].draw();
			this.iterateBSPTree(node.right);
		}
		else {
			this.iterateBSPTree(node.right);
			this.wallBufferTree[node.id].draw();
			this.iterateBSPTree(node.left);
		}
	}
}