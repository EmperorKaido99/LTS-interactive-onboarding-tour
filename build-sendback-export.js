/**
 * Build script: creates a single self-contained HTML file containing the
 * full "Reviewer/Supervisor: Edit or Send Back SR" tour (all 8 screens,
 * generic LTS-only branding), with a step bar at the top to move between
 * screens. Each screen runs inside an embedded frame with its own guided
 * tour, exactly like the full build.
 *
 * The result is one file — no zipping needed — safe to attach to an email.
 * Recipients just double-click it; no server or internet connection required.
 *
 * Usage: node build-sendback-export.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");
const SRC = path.join(ROOT, "src");
const OUT_FILE = path.join(DIST, "LTS-Edit-or-Send-Back-SR.html");

if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });

const driverCSS = fs.readFileSync(path.join(ROOT, "node_modules/driver.js/dist/driver.css"), "utf-8");
const driverJS = fs.readFileSync(path.join(ROOT, "node_modules/driver.js/dist/driver.js.iife.js"), "utf-8");
const mainCSS = fs.readFileSync(path.join(SRC, "styles/main.css"), "utf-8");
const narrateJS = fs.readFileSync(path.join(SRC, "shared/narrate.js"), "utf-8");
const narrateConverted = narrateJS.replace(/export\s+/g, "");

const SCREENS = [
  { file: "sendback-email", label: "1. Reviewer Email" },
  { file: "sendback-home", label: "2. Supervisor Home" },
  { file: "sendback-review", label: "3. Skill Review Items" },
  { file: "sendback-reset", label: "4. Reset Skill Review" },
  { file: "sendback-reversal", label: "5. Reversal" },
  { file: "sendback-trainee-email", label: "6. Trainee Email" },
  { file: "sendback-trainee-home", label: "7. Trainee Home" },
  { file: "sendback-signoff", label: "8. Amend & Sign Off" },
];

function buildScreen(name) {
  let html = fs.readFileSync(path.join(SRC, "screens", `${name}.html`), "utf-8");

  html = html.replace(/<link[^>]*driver\.css[^>]*>/, `<style>${driverCSS}</style>`);
  html = html.replace(/<link[^>]*main\.css[^>]*>/, `<style>${mainCSS}</style>`);

  // Screen-to-screen navigation goes through the parent wrapper
  html = html.replace(/href="(sendback-[a-z-]+)\.html"/g, `href="javascript:parent.LTSgo('$1')"`);
  html = html.replace(/window\.location\.href='(sendback-[a-z-]+)\.html'/g, `parent.LTSgo('$1')`);
  // The Select Training Module screen isn't part of this export — restart instead
  html = html.replace(/href="select\.html"/g, `href="javascript:parent.LTSgo('sendback-email')"`);

  // Inline the tour (module imports don't work from a srcdoc frame)
  let tourCode = fs.readFileSync(path.join(SRC, "tours", `${name}-tour.js`), "utf-8");
  tourCode = tourCode.replace(/^import\s+.*;\s*$/gm, "");
  tourCode = tourCode.replace(/\bdriver\(\{/g, "window.driver.js.driver({");
  tourCode = `(function() {\n${tourCode}\n})();`;

  html = html.replace(/<script\s+type="module"\s+src="[^"]*"><\/script>/, "");
  const inlineBlock = `
<script>${driverJS}</script>
<script>
${narrateConverted}
</script>
<script>
${tourCode}
</script>`;
  html = html.replace("</body>", `${inlineBlock}\n</body>`);

  return html;
}

const screenDocs = {};
for (const s of SCREENS) {
  screenDocs[s.file] = buildScreen(s.file);
  console.log(`Bundled screen: ${s.file}`);
}

// <-escape so no "</script>" inside the JSON can break the wrapper page
const screensJSON = JSON.stringify(screenDocs).replace(/</g, "\\u003c");

const wrapper = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>LTS — Reviewer/Supervisor: Edit or Send Back SR</title>
<style>
  html, body { margin:0; padding:0; height:100%; font-family:Arial, Helvetica, sans-serif; }
  #lts-export-bar { background:#1c1c1c; color:#fff; padding:8px 16px; display:flex; align-items:center; gap:10px; flex-wrap:wrap; font-size:13px; }
  #lts-export-bar strong { white-space:nowrap; }
  #lts-export-steps { display:flex; gap:4px; flex-wrap:wrap; }
  #lts-export-steps button { font-size:11px; padding:4px 8px; border:1px solid #555; background:#2e2e2e; color:#ddd; cursor:pointer; border-radius:3px; }
  #lts-export-steps button.active { background:#2b6da3; border-color:#2b6da3; color:#fff; font-weight:700; }
  #lts-export-note { margin-left:auto; opacity:.55; font-size:11px; white-space:nowrap; }
  #lts-frame { border:none; width:100%; height:calc(100% - 42px); display:block; background:#fff; }
</style>
</head>
<body>
<div id="lts-export-bar">
  <strong>LTS &mdash; Edit or Send Back SR</strong>
  <div id="lts-export-steps"></div>
  <span id="lts-export-note">Self-contained file &mdash; safe to email, no internet needed</span>
</div>
<iframe id="lts-frame" title="LTS tour screen"></iframe>
<script>
var LTS_SCREENS = ${screensJSON};
var LTS_ORDER = ${JSON.stringify(SCREENS)};
var stepsBar = document.getElementById("lts-export-steps");
var frame = document.getElementById("lts-frame");

function LTSgo(name) {
  if (!LTS_SCREENS[name]) return;
  frame.srcdoc = LTS_SCREENS[name];
  Array.prototype.forEach.call(stepsBar.children, function (btn) {
    btn.classList.toggle("active", btn.dataset.screen === name);
  });
}
window.LTSgo = LTSgo;

LTS_ORDER.forEach(function (s) {
  var btn = document.createElement("button");
  btn.textContent = s.label;
  btn.dataset.screen = s.file;
  btn.addEventListener("click", function () { LTSgo(s.file); });
  stepsBar.appendChild(btn);
});

LTSgo("sendback-email");
</script>
</body>
</html>
`;

fs.writeFileSync(OUT_FILE, wrapper);

const sizeMB = (fs.statSync(OUT_FILE).size / 1024 / 1024).toFixed(1);
console.log("=== Send Back SR export build complete! ===");
console.log(`Output: ${OUT_FILE}`);
console.log(`Size: ~${sizeMB} MB`);
console.log("Attach this single file to an email — recipients just double-click it.");
