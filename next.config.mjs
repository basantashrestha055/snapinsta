/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "i.pravatar.cc",
      },
      {
        hostname: "source.unsplash.com",
      },
      {
        hostname: "res.cloudinary.com",
      },
    ],
  },
}

export default nextConfig
