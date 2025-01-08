import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  plugins: [
    react(),
    glsl({
      include: ["**/*.glsl", "**/*.vert", "**/*.frag"],
      exclude: undefined,
      warnDuplicatedImports: true,
      defaultExtension: "glsl",
      compress: false,
      watch: true,
      root: "/",
    }),
  ],
  server: {
    host: "0.0.0.0", // Listen on all network interfaces
    port: 5173, // Optional: specify the port
  },
});
