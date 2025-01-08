#version 300 es
in vec4 position;
out vec2 uv;

void main() {
    gl_Position = position;
    uv = position.xy;
}