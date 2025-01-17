#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

void main() {
	gl_FragColor = vec4(abs(sin(u_time*2.)),0.0,0.0,1.0);
}
