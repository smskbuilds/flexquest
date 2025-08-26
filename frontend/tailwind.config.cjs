module.exports = {
	content: [
		'./index.html',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		extend: {
			colors: {
				ghibli: {
					primary: '#7FB3D3',
					secondary: '#8FBC8F',
					accent: '#F4A460',
					background: '#FDF5E6',
					text: '#8B4513',
				},
			},
			boxShadow: {
				soft: '0 8px 24px rgba(0,0,0,0.08)',
			},
			borderRadius: {
				organic: '1.25rem',
			},
		},
	},
	plugins: [],
};