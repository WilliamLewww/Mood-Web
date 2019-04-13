const VERTEX_SHADER_1 = [
'attribute vec2 position;								 											\n',
'														 											\n',
'uniform vec2 resolution;								 											\n',
'														 											\n',
'void main(void) {										 											\n',
'	vec2 zeroToOne = (position + vec2(resolution.x, resolution.y) * vec2(0.5,0.5)) / resolution;	\n',
'	vec2 zeroToTwo = zeroToOne * 2.0;					 											\n',
'	vec2 clipSpace = zeroToTwo - 1.0;					 											\n',
'														 											\n',
'	gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);	 											\n',
'}														 											\n',
].join('');

const FRAGMENT_SHADER_1 = [
'precision mediump float;									\n',
'															\n',
'uniform vec4 color;										\n',
'															\n',
'void main(void) {											\n',
'	gl_FragColor = color;									\n',
'}															\n',
].join('');

const VERTEX_SHADER_2 = [
'attribute vec2 position;								 											\n',
'attribute vec2 a_texture;																			\n',
'														 											\n',
'uniform vec2 resolution;								 											\n',
'																									\n',
'varying vec2 v_texture;																			\n',
'														 											\n',
'void main(void) {										 											\n',
'	vec2 zeroToOne = (position + vec2(resolution.x, resolution.y) * vec2(0.5,0.5)) / resolution;	\n',
'	vec2 zeroToTwo = zeroToOne * 2.0;					 											\n',
'	vec2 clipSpace = zeroToTwo - 1.0;					 											\n',
'														 											\n',
'	gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);	 											\n',
'	v_texture = a_texture;																			\n',
'}														 											\n',
].join('');

const FRAGMENT_SHADER_2 = [
'precision mediump float;									\n',
'															\n',
'varying vec2 v_texture;									\n',
'															\n',
'uniform sampler2D u_texture;								\n',
'															\n',
'void main(void) {											\n',
'	gl_FragColor = texture2D(u_texture, v_texture);			\n',
'}															\n',
].join('');

const VERTEX_SHADER_3 = [
'attribute vec2 position;								 											\n',
'attribute vec3 a_texture;																			\n',
'														 											\n',
'uniform vec2 resolution;								 											\n',
'																									\n',
'varying vec3 v_texture;																			\n',
'														 											\n',
'void main(void) {										 											\n',
'	vec2 zeroToOne = (position + vec2(resolution.x, resolution.y) * vec2(0.5,0.5)) / resolution;	\n',
'	vec2 zeroToTwo = zeroToOne * 2.0;					 											\n',
'	vec2 clipSpace = zeroToTwo - 1.0;					 											\n',
'														 											\n',
'	gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);	 											\n',
'	v_texture = a_texture;																			\n',
'}														 											\n',
].join('');

const FRAGMENT_SHADER_3 = [
'precision mediump float;														\n',
'																				\n',
'varying vec3 v_texture;														\n',
'																				\n',
'uniform sampler2D u_texture;													\n',
'																				\n',
'void main(void) {																\n',
'	gl_FragColor = texture2D(u_texture, v_texture.xy / v_texture.z);			\n',
'}																				\n',
].join('');