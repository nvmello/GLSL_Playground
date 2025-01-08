import { useRef, useEffect } from "react";
import vertexShaderSource from "./shaders/vertex.glsl"; // GLSL code for vertex shader
import fragmentShaderSource from "./shaders/fragment.glsl"; // GLSL code for fragment shader
import {
  createShader,
  createProgram,
  createBuffer,
  cleanupWebGL,
} from "../../utils/webgl";

const Basic_Shader = () => {
  // ref to store the reference to the canvas element
  const canvasRef = useRef(null);

  /**
   * useEffect Hook
   * Sets up the webGL context and initializes shaders, buffers, and the animation loop.
   * Runs only once after the component mounts
   */
  useEffect(() => {
    /**
     * Context Setup
     */
    //get the canvas element from the ref
    const canvas = canvasRef.current;

    // Initialize the WebGL context for the canvas element
    const gl = canvas.getContext("webgl");

    // if WebGL is not supported, log an error
    if (!gl) {
      console.log("WebGL Not supported");
      return;
    }

    /***********************************************************************/

    /**
     * Vertex Shader Setup
     * Transforms 3D coordinates into screen coordinates.
     */
    // const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
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

    /**
     * Shader Program Setup
     */
    const shaderProgram = createProgram(gl, vertexShader, fragmentShader);

    //***************************************************** */
    /**
     * Set up Quad vertices and buffer
     */
    const vertices = new Float32Array([
      // Positions
      -1, 1, 0.0, -1, -1, 0.0, 1, -1, 0.0, 1, 1, 0.0,
    ]);

    const vertexBuffer = createBuffer(
      gl,
      vertices,
      3,
      "a_position",
      shaderProgram
    );

    /**
     * Render Loop
     */
    const render = () => {
      gl.clear(gl.COLOR_BUFFER_BIT); // Clear the canvas
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4); // Draw the quad
      requestAnimationFrame(render); // Request the next frame
    };

    render(); // Start the render loop

    return () => {
      // Cleanup on component unmount

      cleanupWebGL(gl, {
        buffers: [vertexBuffer],
        programs: [shaderProgram],
        shaders: [vertexShader, fragmentShader],
      });
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
  );
};

export default Basic_Shader;
