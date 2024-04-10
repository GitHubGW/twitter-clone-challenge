/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "firebasestorage.googleapis.com" }, { hostname: "avatars.githubusercontent.com" }],
  },
};

export default nextConfig;
