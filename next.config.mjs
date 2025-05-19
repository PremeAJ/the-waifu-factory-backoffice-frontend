import withPWA from 'next-pwa';

const withPWACfg = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "developer",
});

const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
};

export default withPWACfg(nextConfig);
