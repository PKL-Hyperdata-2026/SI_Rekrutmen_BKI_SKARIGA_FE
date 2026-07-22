import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    base: env.VITE_BASE_URL || "/",
    server: {
      host: "0.0.0.0",
      port: Number.parseInt(env.VITE_PORT) || 5173,
      proxy: {
        "/storage": {
          target: env.VITE_API_URL || "http://localhost:9000",
          changeOrigin: true,
        },
      },
    },
    preview: {
      port: Number.parseInt(env.VITE_PORT) || 5173,
    },
  };
});
