// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactCompiler: true,
//   serverExternalPackages: ['mongodb'],
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'images.unsplash.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'img.magnific.com',
//       },
//       {
//         protocol: 'https',
//         hostname: '*.googleusercontent.com', 
//       },
//       {
//         protocol: 'https',
//         hostname: 'avatars.githubusercontent.com', 
//       },
//          {
//         protocol: 'https',
//         hostname: 'i.ibb.co.com',
//         port: '',
//         pathname: '/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'www.google.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'plus.unsplash.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'unsplash.com',
//       },
//     ],
//   },
// };

// export default nextConfig;



/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  serverExternalPackages: ['mongodb'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.google.com',
      },
    ],
  },
};

export default nextConfig;