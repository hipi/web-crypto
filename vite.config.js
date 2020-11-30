const path = require("path");
import { VitePWA } from "vite-plugin-pwa";
export default {
  plugins: [
    VitePWA({
      manifest: {
        name: "顽狗文件在线加密",
        short_name: "顽狗加密",
        lang: "zh-CN",
        background_color: "#fff",
        theme_color: "#fff",
        description: "一款免费、安全、支持所有文件格式的文件在线加密服务",
        icons: [
          {
            src: "/images/touch_72x72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "/images/touch_144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "/images/touch_192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/images/touch_512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        include: [
          path.resolve(__dirname, "public/favicon.ico"),
          path.resolve(__dirname, "public/images"),
        ],
      },
    }),
  ],
};
