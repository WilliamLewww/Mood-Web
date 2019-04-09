const VERTEX_SHADER_SOURCE = [
'attribute vec2 position;								 	\n',
'														 	\n',
'uniform vec2 resolution;								 	\n',
'														 	\n',
'void main(void) {										 	\n',
'	vec2 zeroToOne = position / resolution;				 	\n',
'	vec2 zeroToTwo = zeroToOne * 2.0;					 	\n',
'	vec2 clipSpace = zeroToTwo - 1.0;					 	\n',
'														 	\n',
'	gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);	 	\n',
'}														 	\n',
].join('');

const FRAGMENT_SHADER_SOURCE = [
'precision mediump float;									\n',
'															\n',
'uniform vec4 color;										\n',
'															\n',
'void main(void) {											\n',
'	gl_FragColor = color;									\n',
'}															\n',
].join('');