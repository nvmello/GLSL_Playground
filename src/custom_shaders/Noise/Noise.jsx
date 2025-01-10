import { useRef, useEffect } from "react";
import vertexShaderSource from "./shaders/vertex.glsl"; // GLSL code for vertex shader
import fragmentShaderSource from "./shaders/fragment.glsl"; // GLSL code for fragment shader
import {
  createShader,
  createProgram,
  createBuffer,
  cleanupWebGL,
} from "../../utils/webgl";

const Noise = () => {
  // ref to store the reference to the canvas element
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    /**
     * Context Setup
     */
    const canvas = canvasRef.current;

    // Initialize webgl context
    const gl = canvas.getContext("webgl");

    // if WebGL is not supported, log an error
    if (!gl) {
      console.log("WebGL Not supported");
      return;
    }

    /**
     * Vertex Shader Setup
     * Transforms 3D coordinates into screen coordinates.
     */
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);

    /**
     * Fragment Shader Setup
     * Colors the pixels based on some logic
     */
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    if (!vertexShader || !fragmentShader) {
      console.error("Failed to create shaders");
      return;
    }

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    const positions = new Float32Array([
      -1,
      -1, // bottom left
      1,
      -1, // bottom right
      -1,
      1, // top left
      1,
      1, // top right
    ]);

    const vertexBuffer = createBuffer(gl, positions, 2, "position", program);
    if (!vertexBuffer) {
      console.error("Failed to create buffer");
      return;
    }

    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    // Animation loop
    let startTime = performance.now();
    const render = () => {
      const currentTime = (performance.now() - startTime) * 0.001; // Convert to seconds

      gl.useProgram(program);

      // Update uniforms
      gl.uniform1f(timeLocation, currentTime);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      cleanupWebGL(gl, {
        buffers: [vertexBuffer],
        programs: [program],
        shaders: [vertexShader, fragmentShader],
      });
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
  );
};

export default Noise;
