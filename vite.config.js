import { defineConfig } from 'vite';
import ESLint from 'vite-plugin-eslint';
import checker from 'vite-plugin-checker';

export default defineConfig({
	plugins: [
		ESLint(),
		checker({typescript: true})
	]
});