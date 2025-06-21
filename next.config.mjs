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
      "www.maggi.co.th",
      "www.coca-cola.com",
      "img.wongnai.com",
      "www.sgethai.com",
      "image.bangkokbiznews.com",
      "7elevenweb.s3.ap-southeast-1.amazonaws.com",
      "static.wixstatic.com",
      "www.sangdamrong.com",
      "www.k-bigc.com",
      "beer6.net",
      "www.thammculture.com",
      "s359.kapook.com",
      "media.lul.la",
      "i.ytimg.com",
      "image.makewebcdn.com",
      "www.falconforprofessional.com",
      "ufm.co.th",
      "www.pholfoodmafia.com",
      "agarmermaid.com",
      "api2.krua.co"
    ],
  },
};

export default withPWACfg(nextConfig);
