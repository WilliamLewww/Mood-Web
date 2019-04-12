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
  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  		// Fill the texture with a 1x1 blue pixel.
  	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
	                new Uint8Array([0, 0, 255, 255]));
	  	// Asynchronously load an image
  	var image = new Image();
	image.src = img;
	image.addEventListener('load', function() {
	    // Now that the image has loaded make copy it to the texture.
		gl.bindTexture(gl.TEXTURE_2D, texture);
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