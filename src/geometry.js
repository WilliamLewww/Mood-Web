function Line(pointA, pointB, color = [1,0,0,1]) {
	this.x1 = pointA[0];
	this.y1 = pointA[1];
	this.x2 = pointB[0];
	this.y2 = pointB[1];

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
		gl.uniform4fv(this.colorLocation, color);
		gl.drawArrays(gl.LINES, 0, 2);
	}

	this.getPositionArray = () => {
		return [
			this.x1, this.y1,
			this.x2, this.y2,
		];
	}
}

function Rectangle(x, y, width, height, color = [1,0,0,1]) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

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
		gl.uniform4fv(this.colorLocation, color);
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