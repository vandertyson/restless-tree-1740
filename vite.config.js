import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), cloudflare()],
  server: {        
    allowedHosts: ["5173-vandertyson-restlesstre-xnr399i6hhz.ws-us118.gitpod.io", "*.060bc1d1f408.*"]
  }
  // server: {
  //   cors: true,
  //   port: 5173,
  //   // middlewareMode: 'ssr'  
  // }
});
