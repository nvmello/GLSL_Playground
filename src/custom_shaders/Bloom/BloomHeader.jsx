import { useEffect, useRef } from "react";
import {
  createShader,
  createProgram,
  createBuffer,
  cleanupWebGL,
} from "../../utils/webgl";
import vertexShaderSource from "./shaders/vertex.glsl";
import fragmentShaderSource from "./shaders/fragment.glsl";

/**
 * BloomHeader Component
 * Renders a header with an animated WebGL background inspired by Rufus Du Sol's Bloom album.
 * Creates a flowing, organic effect using layered noise and color mixing.
 *
 * @param {Object} props
 * @param {string} [props.title="vmello"] - Text to display in the header
 * @param {string} [props.height="16rem"] - Height of the header
 */
const BloomHeader = () => {
  // Ref for the canvas element
  const canvasRef = useRef(null);
  // Ref to store animation frame for cleanup
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    // Initialize WebGL2 context
    const gl = canvas.getContext("webgl2");

    // Create and compile shader programs
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );
    const program = createProgram(gl, vertexShader, fragmentShader);

    if (!program) return;

    // Create a full-screen quad using clip-space coordinates
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

    // Create and initialize vertex buffer
    const vertexBuffer = createBuffer(gl, positions, 2, "position", program);
    if (!vertexBuffer) {
      console.error("Failed to create buffer");
      return;
    }

    // Get shader variable locations
    const timeLocation = gl.getUniformLocation(program, "time");
    const resolutionLocation = gl.getUniformLocation(program, "resolution");

    /**
     * Main render loop
     * @param {number} time - Current timestamp from requestAnimationFrame
     */
    const render = (time) => {
      // Convert time to seconds
      time *= 0.001;

      // Update shader uniforms and draw
      gl.useProgram(program);
      gl.uniform1f(timeLocation, time);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      // Schedule next frame
      animationRef.current = requestAnimationFrame(render);
    };

    // Start animation loop
    animationRef.current = requestAnimationFrame(render);

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Clean up WebGL resources
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

export default BloomHeader;
