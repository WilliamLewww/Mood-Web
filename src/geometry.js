function denormalizeColor(color) {
	return [color[0] / 255.0, color[1] / 255.0, color[2] / 255.0, color[3] / 255.0];
}

function crossMultiply(x1, y1, x2, y2) {
	return (x1 * y2) - (y1 * x2);
}

function calculateHomogeneousCoordinate(x1, y1, x2, y2, x3, y3, x4, y4) {
	var q = [];

	var ax = x3 - x1, ay = y3 - y1;
	var bx = x4 - x2, by = y4 - y2;

	var cross = crossMultiply(ax, ay, bx, by);

	if (cross != 0) {
		var cy = y1 - y2;
		var cx = x1 - x2;

		var s = crossMultiply(ax, ay, cx, cy) / cross;

		if (s > 0 && s < 1) {
			var t = crossMultiply(bx, by, cx, cy) / cross;

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

function QuadTexturedCorrected(pointA, pointB, pointC, pointD, img) {
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

  	var texture = gl.createTexture();
  	gl.bindTexture(gl.TEXTURE_2D, texture);
  	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

  	var image = new Image();
	image.src = img;
	image.addEventListener('load', function() {
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
		gl.generateMipmap(gl.TEXTURE_2D);
	});

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

		return [
            0 * q[3], 0 * q[3], q[3],
	        0 * q[0], 1 * q[0], q[0],
	        1 * q[2], 0 * q[2], q[2],
	        1 * q[2], 0 * q[2], q[2],
	        0 * q[0], 1 * q[0], q[0],
	        1 * q[1], 1 * q[1], q[1],
		];
	}
}

function QuadTextured(pointA, pointB, pointC, pointD, img) {
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

  	var texture = gl.createTexture();
  	gl.bindTexture(gl.TEXTURE_2D, texture);
  	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

  	var image = new Image();
	image.src = img;
	image.addEventListener('load', function() {
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
		gl.generateMipmap(gl.TEXTURE_2D);
	});

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
		return [
            0, 0,
	        0, 1,
	        1, 0,
	        1, 0,
	        0, 1,
	        1, 1,
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