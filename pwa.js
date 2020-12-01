const fs = require("fs");
const path = require("path");
const { dest, manifest, workbox } = require("./pwa.config");
const pkg = JSON.parse(fs.readFileSync(path.resolve("package.json"), "utf-8"));

// index.html 增加js
let code = fs.readFileSync(path.resolve(`${dest}/index.html`), "utf-8");
code = code.replace(
  "</head>",
  `<link rel="manifest" href="/manifest.webmanifest">
<script>
  if('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { scope: './' })
    })
  }
</script>
</head>`
);
fs.writeFileSync(`${dest}/index.html`, code, "utf-8");

// 生成 配置文件

var _rolluppluginworkbox = require("rollup-plugin-workbox");
const defaultManifest = {
  name: pkg.name,
  short_name: pkg.name,
  start_url: "/",
  display: "standalone",
  background_color: "#ffffff",
  lang: "en",
};
const defaultWorkbox = {
  swDest: "dist/sw.js",
  globDirectory: "dist",
  offlineGoogleAnalytics: false,
  mode: "development",
};
const endWorkbox = Object.assign({}, defaultWorkbox, workbox || {});
const endManifest = Object.assign({}, defaultManifest, manifest || {});
fs.writeFileSync(
  `${dest}/manifest.webmanifest`,
  `${JSON.stringify(endManifest, null, 2)}
`,
  "utf-8"
);
_rolluppluginworkbox.generateSW.call(void 0, endWorkbox).writeBundle();
