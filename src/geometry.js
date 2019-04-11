function denormalizeColor(color) {
	return [color[0] / 255.0, color[1] / 255.0, color[2] / 255.0, color[3] / 255.0];
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