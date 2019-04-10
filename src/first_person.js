function FirstPerson(cameraProperties) {
	this.cameraProperties = cameraProperties;

	this.initialize = (count) => {
		this.wallCount = count;
		this.wallBuffer = [];

		for (var x = 0; x < this.wallCount; x++) {
			this.wallBuffer.push(new Line([-1,-1],[-1,-1],[1,0,0,1]));
		}
	}

	this.draw = (wallArray) => {
		for (var x = 0; x < wallArray.length; x++) {
			this.drawWall(wallArray[x], x);
		}
	}

	this.drawWall = (wall, index) => {
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

			this.wallBuffer[index].x1 = x1 + (SCREEN_WIDTH / 2);
			this.wallBuffer[index].y1 = y1a + (SCREEN_HEIGHT / 2);
			this.wallBuffer[index].x2 = x2 + (SCREEN_WIDTH / 2);
			this.wallBuffer[index].y2 = y2a + (SCREEN_HEIGHT / 2);
			this.wallBuffer[index].draw();

			// std::vector<Vector2> polygonA = { Vector2(x1, y1a), Vector2(x2, y2a), Vector2(x2, y2b), Vector2(x1, y1b) };
			// drawing.drawPolygon(polygonA, wall.color);
		}
	}

	this.drawUsingBSP = (root) => {

	}

	this.iterateBSPTree = (node) => {

	}
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