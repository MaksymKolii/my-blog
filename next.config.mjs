/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    //* work but warning
    //  domains:["images.unsplash.com", "res.cloudinary.com"],
    remotePatterns:[
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
    },]
    
  },
  
};

export default nextConfig;
