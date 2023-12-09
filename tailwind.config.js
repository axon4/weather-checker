/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './templates/**/*.{html,njk,js,jsx,ts,tsx}'],
	theme: {
		extend: {}
	},
	plugins: [require('@tailwindcss/typography')]
};