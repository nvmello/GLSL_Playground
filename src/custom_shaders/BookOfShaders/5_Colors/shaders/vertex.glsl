// vertex.glsl
attribute vec4 position;  // The position of the vertex passed from the JS code

void main() {
    gl_Position = position;  // Pass the vertex position directly to the pipeline
}
