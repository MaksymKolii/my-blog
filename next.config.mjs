/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // domains:["images.unsplash.com"]
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        // pathname: '**', // разрешить все пути на этом хосте
        pathname: '/photo-*', 
      },
    ],
  },
  
};

export default nextConfig;
