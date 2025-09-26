import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		// outDir: '../instaCat-Render/public',
		outDir: 'dist',
		emptyOutDir: true,
	},
})
