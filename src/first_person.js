var currentAlpha = 0;

function FirstPerson(cameraProperties) {
	this.cameraProperties = cameraProperties;

	this.initialize = (wallArray, tree) => {
		this.wallBuffer = [];
		for (var x = 0; x < wallArray.length; x++) {
			this.wallBuffer.push(new Quad([-1,-1],[-1,-1],[-1,-1],[-1,-1],wallArray[x].color));
		}

		this.wallBufferTree = Array(currentID);
		this.linkNodeWithWall(tree);
	}

	this.linkNodeWithWall = (node) => {
		if (node == null) { return; }
		this.linkNodeWithWall(node.left);
		this.linkNodeWithWall(node.right);
		this.wallBufferTree[node.id] = new Quad([-1,-1],[-1,-1],[-1,-1],[-1,-1], node.splitter.color)
	}

	this.draw = (wallArray) => {
		if (toggleDrawOrder == 1) { currentAlpha = 255; }
		if (toggleDrawOrder == 2) { currentAlpha = 0; }
		for (var x = 0; x < wallArray.length; x++) {
			this.drawWall(wallArray[x], this.wallBuffer, x);
		}
	}

	this.drawWall = (wall, buffer, index) => {
		var tx1 = wall.pointA[0] - this.cameraProperties[0][0], ty1 = wall.pointA[1] - this.cameraProperties[0][1];
		var tx2 = wall.pointB[0] - this.cameraProperties[0][0], ty2 = wall.pointB[1] - this.cameraProperties[0][1];

		var s = Math.sin(degreeToRadians(-this.cameraProperties[1]));
		var c = Math.cos(degreeToRadians(-this.cameraProperties[1]));

		var tz1 = (tx1 * c) + (ty1 * s);
		var tz2 = (tx2 * c) + (ty2 * s);
		tx1 = (tx1 * s) - (ty1 * c);
		tx2 = (tx2 * s) - (ty2 * c);

		if (tz1 > 0 || tz2 > 0) {
			var i1 = getIntersection(tx1, tz1, tx2, tz2, -0.0001, 0.0001, -280.0, 5.0);
			var i2 = getIntersection(tx1, tz1, tx2, tz2,  0.0001, 0.0001,  280.0, 5.0);

			if (tz1 <= 0) {
				if (i1[1] > 0) {
					tx1 = i1[0];
					tz1 = i1[1];
				}
				else {
					tx1 = i2[0];
					tz1 = i2[1];
				}
			}

			if (tz2 <= 0) {
				if (i1[1] > 0) {
					tx2 = i1[0];
					tz2 = i1[1];
				}
				else {
					tx2 = i2[0];
					tz2 = i2[1];
				}
			}

			var x1 = -tx1 * 120.0 / tz1, y1a = -(120.0 * 25.0) / tz1, y1b = (120.0 * 25.0) / tz1;
			var x2 = -tx2 * 120.0 / tz2, y2a = -(120.0 * 25.0) / tz2, y2b = (120.0 * 25.0) / tz2;

			buffer[index].pointA = [x1,y1a];
			buffer[index].pointB = [x2,y2a];
			buffer[index].pointC = [x2,y2b];
			buffer[index].pointD = [x1,y1b];
			if (toggleDrawOrder == 0) { buffer[index].color[3] = 255; }
			if (toggleDrawOrder == 1) { buffer[index].color[3] = currentAlpha; currentAlpha -= 1; }
			if (toggleDrawOrder == 2) { buffer[index].color[3] = currentAlpha; currentAlpha += 1; }
			if (toggleDrawSolid) { buffer[index].draw(); }
			else { buffer[index].drawWire(); }
		}
	}

	this.drawUsingBSP = (root) => {
		if (toggleDrawOrder == 1) { currentAlpha = 255; }
		if (toggleDrawOrder == 2) { currentAlpha = 0; }
		this.iterateBSPTree(root);
	}

	this.iterateBSPTree = (node) => {
		if (node == null) { return; }
		if (getWallPosition(node.splitter, this.cameraProperties[0]) == 1) {
			this.iterateBSPTree(node.left);
			this.drawWall(node.splitter, this.wallBufferTree, node.id);
			this.iterateBSPTree(node.right);
		}
		else {
			this.iterateBSPTree(node.right);
			this.drawWall(node.splitter, this.wallBufferTree, node.id);
			this.iterateBSPTree(node.left);
		}
	}
}

function getWallPosition(parentWall, position) {
	var slope = (parentWall.pointB[1] - parentWall.pointA[1]) / (parentWall.pointB[0] - parentWall.pointA[0]);
	var yInt = parentWall.pointA[1] + (-slope * parentWall.pointA[0]);

	if (position[1] > (slope * position[0]) + yInt) {
		return 1;
	}

	return 0;
}

function degreeToRadians(degree) {
	return (degree * (Math.PI / 180.0));
}

function crossMultiply(x1, y1, x2, y2) {
	return (x1 * y2) - (y1 * x2);
}

function getIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
	var position = [0,0];
	position[0] = crossMultiply(x1, y1, x2, y2);
	position[1] = crossMultiply(x3, y3, x4, y4);
	var det		= crossMultiply(x1-x2, y1-y2, x3-x4, y3-y4);
	position[0] = crossMultiply(position[0], x1-x2, position[1], x3-x4) / det;
	position[1] = crossMultiply(position[0], y1-y2, position[1], y3-y4) / det;

	return position;
}