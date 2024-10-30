/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,

	// experimental: {
	//   reactRefresh: false,  // Отключаем Fast Refresh
	// },
	images: {
		//* work but warning
		// domains: ['images.unsplash.com', 'res.cloudinary.com', 'images.pexels.com'],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
				port: '',
				pathname: '**', // разрешить все пути на этом хосте
			},
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
				port: '',
				pathname: '**', // разрешить все пути на этом хосте
			},
			{
				protocol: 'https',
				hostname: 'images.pexels.com',
				port: '',
				pathname: '**', // разрешить все пути на этом хосте
			},
		],
	},
}

export default nextConfig;
