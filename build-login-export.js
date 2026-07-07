/**
 * Build script: creates a single self-contained HTML file containing just
 * the "How to Login" tour (login.html), with all four view perspectives
 * (ACCA / SAIT / SAIGA / Normal) selectable from a preview bar at the top.
 *
 * The result is one file — no zipping needed — safe to attach to an email.
 * Recipients just double-click it; no server or internet connection required.
 *
 * Usage: node build-login-export.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");
const SRC = path.join(ROOT, "src");
const OUT_FILE = path.join(DIST, "LTS-How-to-Login.html");

if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });

const driverCSS = fs.readFileSync(path.join(ROOT, "node_modules/driver.js/dist/driver.css"), "utf-8");
const driverJS = fs.readFileSync(path.join(ROOT, "node_modules/driver.js/dist/driver.js.iife.js"), "utf-8");
const mainCSS = fs.readFileSync(path.join(SRC, "styles/main.css"), "utf-8");
const narrateJS = fs.readFileSync(path.join(SRC, "shared/narrate.js"), "utf-8");
const blurOverlayJS = fs.readFileSync(path.join(SRC, "shared/blur-overlay.js"), "utf-8");
const viewJS = fs.readFileSync(path.join(SRC, "shared/view.js"), "utf-8");
const narrateConverted = narrateJS.replace(/export\s+/g, "");
const blurOverlayConverted = blurOverlayJS.replace(/export\s+/g, "");

// Embed only the login-tour audio
const audioDir = path.join(SRC, "audio/login-tour");
const tourAudio = {};
if (fs.existsSync(audioDir)) {
  for (const mp3 of fs.readdirSync(audioDir).filter((f) => f.endsWith(".mp3"))) {
    const stepId = mp3.replace(".mp3", "");
    const base64 = fs.readFileSync(path.join(audioDir, mp3)).toString("base64");
    tourAudio[stepId] = `data:audio/mpeg;base64,${base64}`;
  }
}
console.log(`Embedded ${Object.keys(tourAudio).length} login-tour audio files`);

let tourCode = fs.readFileSync(path.join(SRC, "tours/login-tour.js"), "utf-8");
tourCode = tourCode.replace(/^import\s+.*;\s*$/gm, "");
tourCode = tourCode.replace(/\bdriver\(\{/g, "window.driver.js.driver({");
tourCode = `(function() {\n${tourCode}\n})();`;

let html = fs.readFileSync(path.join(SRC, "screens/login.html"), "utf-8");

html = html.replace(/<link[^>]*driver\.css[^>]*>/, `<style>${driverCSS}</style>`);
html = html.replace(/<link[^>]*main\.css[^>]*>/, `<style>${mainCSS}</style>`);

html = html.replace(/<script\s+type="module"\s+src="[^"]*"><\/script>/, "");
const inlineBlock = `
<script>
window.__LTS_AUDIO = window.__LTS_AUDIO || {};
window.__LTS_AUDIO["login-tour"] = ${JSON.stringify(tourAudio)};
</script>
<script>${driverJS}</script>
<script>
${narrateConverted}
</script>
<script>
${blurOverlayConverted}
</script>
<script>
${tourCode}
</script>`;
html = html.replace("</body>", `${inlineBlock}\n</body>`);

html = html.replace(
  /<script\s+src="\.\.\/shared\/view\.js"><\/script>/,
  `<script>${viewJS}</script>`
);

// Inline "lts elements" images as data URIs
html = html.replace(/src="\.\.\/\.\.\/lts elements\/([^"]+)"/g, (match, name) => {
  const imgPath = path.join(ROOT, "lts elements", name);
  if (!fs.existsSync(imgPath)) return match;
  const ext = path.extname(name).slice(1).toLowerCase();
  const mime = ext === "jpg" ? "image/jpeg" : `image/${ext}`;
  return `src="data:${mime};base64,${fs.readFileSync(imgPath).toString("base64")}"`;
});

// The User Details screen isn't part of this export, so the bottom nav
// link and the tour's Continue/Save buttons would otherwise dead-end
html = html.replace(/<div class="screen-nav">[\s\S]*?<\/div>/, "");
html = html.replace(
  "function goToUserDetails() {\n      window.location.href = \"user-details.html\";\n    }",
  'function goToUserDetails() {\n      alert("This standalone export covers only the Login section of the tour. The rest of the walkthrough (User Details, Home, etc.) is in the full build.");\n    }'
);

// Preview bar: lets the recipient switch between the four views without
// needing the Select Training Module screen this was exported from
const previewBar = `
<div id="lts-export-preview-bar" style="background:#1c1c1c;color:#fff;padding:10px 20px;display:flex;align-items:center;gap:12px;font-family:Arial,Helvetica,sans-serif;font-size:13px;">
  <strong>LTS Onboarding Tour &mdash; How to Login (standalone preview)</strong>
  <span style="opacity:.5;">|</span>
  <label for="lts-preview-view">View:</label>
  <select id="lts-preview-view" style="font-size:13px;padding:3px 8px;">
    <option value="acca">ACCA</option>
    <option value="sait">SAIT</option>
    <option value="saiga">SAIGA</option>
    <option value="normal">Normal</option>
  </select>
  <span style="margin-left:auto;opacity:.55;font-size:11px;">Self-contained file &mdash; safe to email, no internet needed</span>
</div>
<script>
(function () {
  var sel = document.getElementById("lts-preview-view");
  var stored = localStorage.getItem("lts-view") || "acca";
  if (sel.querySelector('option[value="' + stored + '"]')) sel.value = stored;
  sel.addEventListener("change", function () {
    localStorage.setItem("lts-view", sel.value);
    location.reload();
  });
})();
</script>`;
html = html.replace("<body>", `<body>\n${previewBar}`);

fs.writeFileSync(OUT_FILE, html);

const sizeMB = (fs.statSync(OUT_FILE).size / 1024 / 1024).toFixed(1);
console.log("=== Login export build complete! ===");
console.log(`Output: ${OUT_FILE}`);
console.log(`Size: ~${sizeMB} MB`);
console.log("Attach this single file to an email — recipients just double-click it.");
