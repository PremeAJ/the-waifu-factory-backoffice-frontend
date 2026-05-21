import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  reactStrictMode: false, // ปิดใน dev เพื่อความเร็ว (render 1 ครั้ง แทน 2 ครั้ง)

  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },

  images: {
    unoptimized: true, // ไม่ optimize รูปเลยใน dev
    remotePatterns: [
      {
        protocol: "https",
        hostname: "afsafklyxzzychxntdwu.supabase.co",
      },
    ],
  },

  // เพิ่ม compiler options
  compiler: {
    removeConsole: !isDev, // เอา console.log ออกใน production
  },

  // ปรับแต่ง Turbopack
  experimental: {
    ...(isDev && {
      turbo: {
        resolveAlias: {
          "@": "./src",
        },
      },
    }),
    // เพิ่ม optimizePackageImports สำหรับ MUI
    optimizePackageImports: [
      "@mui/material",
      "@mui/icons-material",
      "@tabler/icons-react",
    ],
  },

  // ลด webpack build time
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // ลด bundle size ใน dev
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      };
    }
    return config;
  },
};

// ใช้ PWA เฉพาะ production
const config = isDev
  ? nextConfig
  : withPWA({
      dest: "public",
      register: true,
      skipWaiting: true,
      disable: false,
    })(nextConfig);

export default config;
