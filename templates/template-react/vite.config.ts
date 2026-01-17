import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      nodePolyfills()
    ],
    define: {
      'process.env.VITE_API_PUBLIC_KEY': JSON.stringify(env.VITE_API_PUBLIC_KEY),
      'process.env.VITE_API_PRIVATE_KEY': JSON.stringify(env.VITE_API_PRIVATE_KEY),
    }
  };
})
