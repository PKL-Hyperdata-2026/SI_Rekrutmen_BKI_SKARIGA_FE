import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    define: {
      __BUNDLED_DEV__: "false",
      __SERVER_FORWARD_CONSOLE__: '{"enabled": false}',
    },
    base: env.VITE_BASE_URL || "/",
    server: {
      host: "0.0.0.0",
      port: Number.parseInt(env.VITE_PORT) || 5173,
      proxy: {
        "/storage": {
          target: env.VITE_API_URL || "http://localhost:8000",
          changeOrigin: true,
        },
      },
    },
    preview: {
      port: Number.parseInt(env.VITE_PORT) || 5173,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
