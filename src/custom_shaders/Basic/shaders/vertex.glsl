// vertex.glsl
attribute vec4 a_position;  // The position of the vertex passed from the JS code

void main() {
    gl_Position = a_position;  // Pass the vertex position directly to the pipeline
}
