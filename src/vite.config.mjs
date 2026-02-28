import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                taget: `http://localhost:${process.env._PORT}`,
                changeOrigin: true,
            },
        },
    },
})