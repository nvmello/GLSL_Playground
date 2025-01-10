import { useRef, useEffect } from "react";
import vertexShaderSource from "./shaders/vertex.glsl"; // GLSL code for vertex shader
import fragmentShaderSource from "./shaders/fragment.glsl"; // GLSL code for fragment shader
import {
  createShader,
  createProgram,
  createBuffer,
  cleanupWebGL,
} from "../../../utils/webgl";

/**
 * https://thebookofshaders.com/03/
 */
const Uniform_Shader = () => {
  const canvasRef = useRef(null);
  const programRef = useRef(null);
  const timeLocationRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    const gl = canvas.getContext("webgl");

    if (!gl) {
      console.log("webgl not supported");
      return;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);

    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    if (!vertexShader || !fragmentShader) {
      return;
    }

    const shaderProgram = createProgram(gl, vertexShader, fragmentShader);
    if (!shaderProgram) {
      return;
    }
    programRef.current = shaderProgram;

    const vertices = new Float32Array([
      // Positions
      -1, 1, 0.0, -1, -1, 0.0, 1, -1, 0.0, 1, 1, 0.0,
    ]);

    const vertexBuffer = createBuffer(
      gl,
      vertices,
      3,
      "position",
      shaderProgram
    );

    timeLocationRef.current = gl.getUniformLocation(shaderProgram, "u_time");

    let startTime = performance.now();
    const render = () => {
      const currentTime = (performance.now() - startTime) * 0.001;
      gl.useProgram(programRef.current);
      gl.uniform1f(timeLocationRef.current, currentTime);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
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

export default Uniform_Shader;
