/* eslint-disable no-unused-vars */
import "./App.css";
import Basic_Shader from "./custom_shaders/Basic/Basic_Shader";
import BloomHeader from "./custom_shaders/Bloom/BloomHeader";
import Noise from "./custom_shaders/Noise/Noise";

function App() {
  return (
    <div className="content">
      {/* <Basic_Shader /> */}
      {/* <BloomHeader /> */}
      <Noise />
    </div>
  );
}

export default App;