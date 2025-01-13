/**
 * Uniform Shader Component
 *
 * This component implements the uniform shader concepts from The Book of Shaders Chapter 3.
 * https://thebookofshaders.com/04/
 *
 * Features:
 * - Basic WebGL setup for shader rendering
 * - Time uniform implementation for animation
 * - Full-screen quad rendering
 *
 * Required Files:
 * - vertex.glsl: Basic vertex shader for position transformation
 * - fragment.glsl: Fragment shader implementing the uniform-based effects
 * - webgl.js: Utility functions for WebGL setup
 */

import { useRef, useEffect } from "react";
import vertexShaderSource from "./shaders/vertex.glsl";
import fragmentShaderSource from "./shaders/fragment.glsl";
import {
  createShader,
  createProgram,
  createBuffer,
  cleanupWebGL,
} from "../../../utils/webgl";

const Shaping = () => {
  // Refs to store WebGL objects and locations
  const canvasRef = useRef(null); // Canvas DOM element
  const programRef = useRef(null); // WebGL program
  const timeLocationRef = useRef(null); // Uniform location for time
  const resolutionLocationRef = useRef(null); // Uniform location for resolution

  useEffect(() => {
    // Get WebGL context
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");

    if (!gl) {
      console.log("webgl not available");
      return;
    }

    // Create and compile shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    if (!vertexShader || !fragmentShader) {
      return;
    }

    // Create and link shader program
    const shaderProgram = createProgram(gl, vertexShader, fragmentShader);

    if (!shaderProgram) {
      return;
    }

    programRef.current = shaderProgram;

    // Define vertices for a full-screen quad
    // Format: x, y, z coordinates for each vertex
    const vertices = new Float32Array([
      // Positions (x, y, z)
      -1,
      1,
      0.0, // top left
      -1,
      -1,
      0.0, // bottom left
      1,
      -1,
      0.0, // bottom right
      1,
      1,
      0.0, // top right
    ]);

    // Create and bind vertex buffer
    const vertexBuffer = createBuffer(
      gl,
      vertices,
      3, // 3 components per vertex (x, y, z)
      "position", // attribute name in vertex shader
      shaderProgram
    );

    // Get uniform locations
    timeLocationRef.current = gl.getUniformLocation(shaderProgram, "u_time");
    resolutionLocationRef.current = gl.getUniformLocation(
      shaderProgram,
      "u_resolution"
    );

    // Setup render loop
    let startTime = performance.now();

    const render = () => {
      const currentTime = (performance.now() - startTime) * 0.001; // Convert to seconds
      gl.useProgram(programRef.current);

      // Update uniforms
      gl.uniform1f(timeLocationRef.current, currentTime);
      gl.uniform2f(resolutionLocationRef.current, canvas.width, canvas.height);

      // Draw full-screen quad
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

      // Continue render loop
      requestAnimationFrame(render);
    };

    render();

    // Cleanup function
    return () => {
      cleanupWebGL(gl, {
        buffers: [vertexBuffer],
        programs: [shaderProgram],
        shaders: [vertexShader, fragmentShader],
      });
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
  );
};

export default Shaping;

/* Expected Shader Uniforms:
 * uniform float u_time;        // Time in seconds since start
 * uniform vec2 u_resolution;   // Canvas width and height
 *
 * Expected Vertex Attributes:
 * attribute vec3 position;     // Vertex position (x, y, z)
 */
