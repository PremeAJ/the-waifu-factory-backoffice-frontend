import withPWA from 'next-pwa';

const withPWACfg = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: false,
});

const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
};

export default withPWACfg(nextConfig);
