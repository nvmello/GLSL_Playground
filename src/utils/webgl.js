/**
 * Creates and compiles a shader.
 * @param {WebGLRenderingContext} gl - The WebGL context
 * @param {number} type - The type of shader (VERTEX_SHADER or FRAGMENT_SHADER)
 * @param {string} source - The GLSL source code for the shader
 * @returns {WebGLShader|null} - The compiled shader, or null if compilation failed
 */
export function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader error: ", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Creates and links a shader program.
 * @param {WebGLRenderingContext} gl - The WebGL context
 * @param {WebGLShader} vertexShader - The vertex shader
 * @param {WebGLShader} fragmentShader - The fragment shader
 * @returns {WebGLProgram|null} - The linked program, or null if linking failed
 */
export function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    return null;
  }

  gl.useProgram(program);

  return program;
}

/**
 * Creates and sets up a WebGL buffer
 * @param {WebGLRenderingContext} gl - The WebGL context
 * @param {Float32Array} data - The data to store in the buffer
 * @param {number} numComponents - Number of components per vertex attribute (1-4)
 * @param {string} attributeName - Name of the attribute in the shader
 * @param {WebGLProgram} program - The shader program
 * @returns {WebGLBuffer|null} - The created buffer, or null if creation failed
 */
export function createBuffer(gl, data, numComponents, attributeName, program) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  const location = gl.getAttribLocation(program, attributeName);
  if (location === -1) {
    console.error(`Attribute ${attributeName} not found in shader`);
    return null;
  }

  gl.vertexAttribPointer(location, numComponents, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(location);

  return buffer;
}

/**
 * Cleans up WebGL resources
 * @param {WebGLRenderingContext} gl - The WebGL context
 * @param {Object} resources - Object containing WebGL resources to clean up
 * @param {WebGLBuffer[]} [resources.buffers] - Array of buffers to delete
 * @param {WebGLProgram[]} [resources.programs] - Array of programs to delete
 * @param {WebGLShader[]} [resources.shaders] - Array of shaders to delete
 */
export function cleanupWebGL(
  gl,
  { buffers = [], programs = [], shaders = [] }
) {
  buffers.forEach((buffer) => buffer && gl.deleteBuffer(buffer));
  programs.forEach((program) => program && gl.deleteProgram(program));
  shaders.forEach((shader) => shader && gl.deleteShader(shader));
}
