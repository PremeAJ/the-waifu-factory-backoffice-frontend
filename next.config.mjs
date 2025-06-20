import withPWA from 'next-pwa';

const withPWACfg = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: false,
    domains: [
      "images.unsplash.com",
      "yalamarketplace.com",
      "assets.tops.co.th",
      "www.maggi.co.th"
    ],
  },
};

export default withPWACfg(nextConfig);
