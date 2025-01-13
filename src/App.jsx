/* eslint-disable no-unused-vars */
import "./App.css";
import Basic_Shader from "./custom_shaders/Basic/Basic_Shader";
import BloomHeader from "./custom_shaders/Bloom/BloomHeader";
import Uniform_Shader from "./custom_shaders/BookOfShaders/3_Uniforms/Uniform";
import Shaping from "./custom_shaders/BookOfShaders/4_Shaping/Shaping";
import Noise from "./custom_shaders/Noise/Noise";

function App() {
  return (
    <div className="content">
      {/* <Basic_Shader /> */}
      {/* <BloomHeader /> */}
      {/* <Noise /> */}
      {/* <Uniform_Shader /> */}
      <Shaping />
    </div>
  );
}

export default App;
