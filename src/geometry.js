function denormalizeColor(color) {
	return [color[0] / 255.0, color[1] / 255.0, color[2] / 255.0, color[3] / 255.0];
}

function crossProduct(x1, y1, x2, y2) {
	return (x1 * y2) - (y1 * x2);
}

function calculateHomogeneousCoordinate(x1, y1, x2, y2, x3, y3, x4, y4) {
	var q = [];

	var ax = x3 - x1, ay = y3 - y1;
	var bx = x4 - x2, by = y4 - y2;

	var cross = crossProduct(ax, ay, bx, by);

	if (cross != 0) {
		var cy = y1 - y2;
		var cx = x1 - x2;

		var s = crossProduct(ax, ay, cx, cy) / cross;

		if (s > 0 && s < 1) {
			var t = crossProduct(bx, by, cx, cy) / cross;

			if (t > 0 && t < 1) {
				q.push(1 / (1 - t), 1 / (1 - s), 1 / t, 1 / s);
			}
		}
	}

	return q;
}

function Line(pointA, pointB, color = [255,0,0,255]) {
	this.x1 = pointA[0];
	this.y1 = pointA[1];
	this.x2 = pointB[0];
	this.y2 = pointB[1];

	this.color = color;

	this.program = programList[0];

	this.positionAttributeLocation = gl.getAttribLocation(this.program, 'position');
	this.resolutionLocation = gl.getUniformLocation(this.program, 'resolution');
	this.colorLocation = gl.getUniformLocation(this.program, 'color');

	this.positionBuffer = gl.createBuffer();

	this.draw = () => {
		gl.useProgram(this.program);
		gl.enableVertexAttribArray(this.positionAttributeLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getPositionArray()), gl.STATIC_DRAW);
		gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
		gl.uniform2f(this.resolutionLocation, gl.canvas.width, gl.canvas.height);
		gl.uniform4fv(this.colorLocation, denormalizeColor(this.color));
		gl.drawArrays(gl.LINES, 0, 2);
	}

	this.getPositionArray = () => {
		return [
			this.x1, this.y1,
			this.x2, this.y2,
		];
	}
}

//10x5

function getTextureCoordinates(index) {
	var coordinates = [];

	var x = parseInt(index % 10);
	var y = parseInt(index / 10);

	coordinates.push(x * .1);
	coordinates.push((x * .1) + .1);
	coordinates.push(y * .2);
	coordinates.push((y * .2) + .2);

	return coordinates;
}

function QuadTexturedCorrected(pointA, pointB, pointC, pointD, index) {
	this.pointA = pointA;
	this.pointB = pointB;
	this.pointC = pointC;
	this.pointD = pointD;

	this.program = programList[2];

	this.positionAttributeLocation = gl.getAttribLocation(this.program, 'position');
	this.textureAttributeLocation = gl.getAttribLocation(this.program, 'a_texture');
	this.textureLocation = gl.getUniformLocation(this.program, "u_texture");

	this.resolutionLocation = gl.getUniformLocation(this.program, 'resolution');
	this.positionBuffer = gl.createBuffer();
	this.textureBuffer = gl.createBuffer();

	this.draw = () => {
		gl.useProgram(this.program);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.enableVertexAttribArray(this.positionAttributeLocation);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getPositionArray()), gl.STATIC_DRAW);
		gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
		gl.enableVertexAttribArray(this.textureAttributeLocation);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getTextureArray()), gl.STATIC_DRAW);
		gl.vertexAttribPointer(this.textureAttributeLocation, 3, gl.FLOAT, false, 0, 0);

		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.uniform2f(this.resolutionLocation, gl.canvas.width, gl.canvas.height);
		gl.uniform1i(this.textureLocation, 0);
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}

	this.getPositionArray = () => {
		return [
			this.pointA[0], this.pointA[1],
			this.pointD[0], this.pointD[1],
			this.pointB[0], this.pointB[1],
			this.pointB[0], this.pointB[1],
			this.pointD[0], this.pointD[1],
			this.pointC[0], this.pointC[1],
		];
	}

	this.getTextureArray = () => {
		var q = calculateHomogeneousCoordinate(this.pointA[0], this.pointA[1], this.pointB[0], this.pointB[1], this.pointC[0], this.pointC[1], this.pointD[0], this.pointD[1]);
		var coordinates = getTextureCoordinates(index);
		return [
            coordinates[0] * q[3], coordinates[2] * q[3], q[3],
	        coordinates[0] * q[0], coordinates[3] * q[0], q[0],
	        coordinates[1] * q[2], coordinates[2] * q[2], q[2],
	        coordinates[1] * q[2], coordinates[2] * q[2], q[2],
	        coordinates[0] * q[0], coordinates[3] * q[0], q[0],
	        coordinates[1] * q[1], coordinates[3] * q[1], q[1],
		];
	}
}

function QuadTextured(pointA, pointB, pointC, pointD, index) {
	this.pointA = pointA;
	this.pointB = pointB;
	this.pointC = pointC;
	this.pointD = pointD;

	this.program = programList[1];

	this.positionAttributeLocation = gl.getAttribLocation(this.program, 'position');
	this.textureAttributeLocation = gl.getAttribLocation(this.program, 'a_texture');
	this.textureLocation = gl.getUniformLocation(this.program, "u_texture");

	this.resolutionLocation = gl.getUniformLocation(this.program, 'resolution');
	this.positionBuffer = gl.createBuffer();
	this.textureBuffer = gl.createBuffer();

	this.draw = () => {
		gl.useProgram(this.program);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.enableVertexAttribArray(this.positionAttributeLocation);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getPositionArray()), gl.STATIC_DRAW);
		gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
		gl.enableVertexAttribArray(this.textureAttributeLocation);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getTextureArray()), gl.STATIC_DRAW);
		gl.vertexAttribPointer(this.textureAttributeLocation, 2, gl.FLOAT, false, 0, 0);

		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.uniform2f(this.resolutionLocation, gl.canvas.width, gl.canvas.height);
		gl.uniform1i(this.textureLocation, 0);
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}

	this.getPositionArray = () => {
		return [
			this.pointA[0], this.pointA[1],
			this.pointD[0], this.pointD[1],
			this.pointB[0], this.pointB[1],
			this.pointB[0], this.pointB[1],
			this.pointD[0], this.pointD[1],
			this.pointC[0], this.pointC[1],
		];
	}

	this.getTextureArray = () => {
		var coordinates = getTextureCoordinates(index);
		return [
            coordinates[0], coordinates[2],
	        coordinates[0], coordinates[3],
	        coordinates[1], coordinates[2],
	        coordinates[1], coordinates[2],
	        coordinates[0], coordinates[3],
	        coordinates[1], coordinates[3],
		];
	}
}

function Quad(pointA, pointB, pointC, pointD, color = [255,0,0,255]) {
	this.pointA = pointA;
	this.pointB = pointB;
	this.pointC = pointC;
	this.pointD = pointD;

	this.color = color;

	this.program = programList[0];

	this.positionAttributeLocation = gl.getAttribLocation(this.program, 'position');
	this.resolutionLocation = gl.getUniformLocation(this.program, 'resolution');
	this.colorLocation = gl.getUniformLocation(this.program, 'color');

	this.positionBuffer = gl.createBuffer();

	this.draw = () => {
		gl.useProgram(this.program);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.enableVertexAttribArray(this.positionAttributeLocation);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getPositionArray()), gl.STATIC_DRAW);
		gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
		gl.uniform2f(this.resolutionLocation, gl.canvas.width, gl.canvas.height);
		gl.uniform4fv(this.colorLocation, denormalizeColor(this.color));
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}

	this.getPositionArray = () => {
		return [
			this.pointA[0], this.pointA[1],
			this.pointB[0], this.pointB[1],
			this.pointC[0], this.pointC[1],
			this.pointC[0], this.pointC[1],
			this.pointA[0], this.pointA[1],
			this.pointD[0], this.pointD[1],
		];
	}

	this.drawWire = () => {
		gl.useProgram(this.program);
		gl.enableVertexAttribArray(this.positionAttributeLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getPositionArrayWire()), gl.STATIC_DRAW);
		gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
		gl.uniform2f(this.resolutionLocation, gl.canvas.width, gl.canvas.height);
		gl.uniform4fv(this.colorLocation, denormalizeColor(this.color));
		gl.drawArrays(gl.LINES, 0, 10);
	}

	this.getPositionArrayWire = () => {
		return [
			this.pointA[0], this.pointA[1],
			this.pointB[0], this.pointB[1],
			this.pointB[0], this.pointB[1],
			this.pointC[0], this.pointC[1],
			this.pointC[0], this.pointC[1],
			this.pointD[0], this.pointD[1],
			this.pointD[0], this.pointD[1],
			this.pointA[0], this.pointA[1],
			this.pointA[0], this.pointA[1],
			this.pointC[0], this.pointC[1],
		];
	}
}

function Rectangle(x, y, width, height, color = [255,0,0,255]) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.color = color;

	this.program = programList[0];

	this.positionAttributeLocation = gl.getAttribLocation(this.program, 'position');
	this.resolutionLocation = gl.getUniformLocation(this.program, 'resolution');
	this.colorLocation = gl.getUniformLocation(this.program, 'color');

	this.positionBuffer = gl.createBuffer();

	this.draw = () => {
		gl.useProgram(this.program);
		gl.enableVertexAttribArray(this.positionAttributeLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getPositionArray()), gl.STATIC_DRAW);
		gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
		gl.uniform2f(this.resolutionLocation, gl.canvas.width, gl.canvas.height);
		gl.uniform4fv(this.colorLocation, denormalizeColor(this.color));
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}

	this.getPositionArray = () => {
		return [
			this.x, this.y,
			this.x + this.width, this.y,
			this.x, this.y + this.height,
			this.x, this.y + this.height,
			this.x + this.width, this.y,
			this.x + this.width, this.y + this.height,
		];
	}
}