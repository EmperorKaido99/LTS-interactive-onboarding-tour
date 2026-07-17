/**
 * Build script: creates a single self-contained HTML file containing the
 * full "Timesheets: Create & Sign Off Weekly Timesheets" tour (all 10
 * screens, generic LTS-only branding), with a step bar at the top to move
 * between screens. Each screen runs inside an embedded frame with its own
 * guided tour, exactly like the full build.
 *
 * The result is one file — no zipping needed — safe to attach to an email.
 * Recipients just double-click it; no server or internet connection required.
 *
 * Usage: node build-timesheet-export.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");
const SRC = path.join(ROOT, "src");
const OUT_FILE = path.join(DIST, "LTS-Weekly-Timesheets.html");

if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });

const driverCSS = fs.readFileSync(path.join(ROOT, "node_modules/driver.js/dist/driver.css"), "utf-8");
const driverJS = fs.readFileSync(path.join(ROOT, "node_modules/driver.js/dist/driver.js.iife.js"), "utf-8");
const mainCSS = fs.readFileSync(path.join(SRC, "styles/main.css"), "utf-8");
const narrateJS = fs.readFileSync(path.join(SRC, "shared/narrate.js"), "utf-8");
const narrateConverted = narrateJS.replace(/export\s+/g, "");
const narrationScripts = JSON.parse(
  fs.readFileSync(path.join(SRC, "narration/scripts.json"), "utf-8")
);

// Fallback narration: when a step has no pre-recorded edge-tts MP3, speak the
// narration script with the browser's built-in speech engine (Web Speech API),
// so the standalone file always has voice — offline, no downloads.
const speechFallbackJS = `
(function () {
  var baseNarrate = narrate;
  var baseStop = stopNarration;
  function speak(text) {
    if (!window.speechSynthesis) return;
    var u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    var voices = speechSynthesis.getVoices().filter(function (v) { return /^en([-_]|$)/i.test(v.lang); });
    var preferred = voices.filter(function (v) { return /female|zira|hazel|sonia|libby|susan|serena/i.test(v.name); })[0] || voices[0];
    if (preferred) u.voice = preferred;
    speechSynthesis.speak(u);
  }
  window.stopNarration = function () {
    if (window.speechSynthesis) speechSynthesis.cancel();
    baseStop();
  };
  window.narrate = function (tourName, stepId) {
    window.stopNarration();
    if (!stepId) return;
    var hasMp3 = window.__LTS_AUDIO && window.__LTS_AUDIO[tourName] && window.__LTS_AUDIO[tourName][stepId];
    if (hasMp3) return baseNarrate(tourName, stepId);
    var text = window.__LTS_NARRATION && window.__LTS_NARRATION[tourName] && window.__LTS_NARRATION[tourName][stepId];
    if (text) speak(text);
  };
  if (window.speechSynthesis && speechSynthesis.getVoices().length === 0) {
    speechSynthesis.onvoiceschanged = function () {};
  }
})();
`;

const SCREENS = [
  { file: "timesheet-home", label: "1. Timesheet User Home" },
  { file: "timesheet-setup", label: "2. Create a Timesheet" },
  { file: "timesheet-capture", label: "3. Update Weekly Timesheet" },
  { file: "timesheet-edit", label: "4. Edit Timesheet" },
  { file: "timesheet-reviewer-email", label: "5. Reviewer Email" },
  { file: "timesheet-reviewer-home", label: "6. Reviewer Home" },
  { file: "timesheet-review", label: "7. Review & Sign Off" },
  { file: "timesheet-reversal", label: "8. Reversal" },
  { file: "timesheet-closed-email", label: "9. Closed Notification" },
  { file: "timesheet-reports", label: "10. Reports" },
];

// Embed the tour's edge-tts narration as base64 data URIs (same mechanism
// as build-login-export.js) — narrate.js picks them up via window.__LTS_AUDIO
function loadTourAudio(tourName) {
  const audioDir = path.join(SRC, "audio", tourName);
  const tourAudio = {};
  if (fs.existsSync(audioDir)) {
    for (const mp3 of fs.readdirSync(audioDir).filter((f) => f.endsWith(".mp3"))) {
      const stepId = mp3.replace(".mp3", "");
      const base64 = fs.readFileSync(path.join(audioDir, mp3)).toString("base64");
      tourAudio[stepId] = `data:audio/mpeg;base64,${base64}`;
    }
  }
  return tourAudio;
}

function buildScreen(name) {
  let html = fs.readFileSync(path.join(SRC, "screens", `${name}.html`), "utf-8");

  html = html.replace(/<link[^>]*driver\.css[^>]*>/, `<style>${driverCSS}</style>`);
  html = html.replace(/<link[^>]*main\.css[^>]*>/, `<style>${mainCSS}</style>`);

  // Screen-to-screen navigation goes through the parent wrapper
  html = html.replace(/href="(timesheet-[a-z-]+)\.html"/g, `href="javascript:parent.LTSgo('$1')"`);
  html = html.replace(/window\.location\.href='(timesheet-[a-z-]+)\.html'/g, `parent.LTSgo('$1')`);
  // The Select Training Module screen isn't part of this export — restart instead
  html = html.replace(/href="select\.html"/g, `href="javascript:parent.LTSgo('timesheet-home')"`);

  // Inline the tour (module imports don't work from a srcdoc frame)
  let tourCode = fs.readFileSync(path.join(SRC, "tours", `${name}-tour.js`), "utf-8");
  tourCode = tourCode.replace(/^import\s+.*;\s*$/gm, "");
  tourCode = tourCode.replace(/\bdriver\(\{/g, "window.driver.js.driver({");
  tourCode = `(function() {\n${tourCode}\n})();`;

  const tourAudio = loadTourAudio(`${name}-tour`);
  const audioCount = Object.keys(tourAudio).length;
  console.log(`  ${name}: embedded ${audioCount} narration clip(s)${audioCount === 0 ? " — run 'python generate-audio.py' first for voice narration" : ""}`);

  html = html.replace(/<script\s+type="module"\s+src="[^"]*"><\/script>/, "");
  const inlineBlock = `
<script>
window.__LTS_AUDIO = window.__LTS_AUDIO || {};
window.__LTS_AUDIO[${JSON.stringify(`${name}-tour`)}] = ${JSON.stringify(tourAudio)};
window.__LTS_NARRATION = window.__LTS_NARRATION || {};
window.__LTS_NARRATION[${JSON.stringify(`${name}-tour`)}] = ${JSON.stringify(narrationScripts[`${name}-tour`] || {})};
</script>
<script>${driverJS}</script>
<script>
${narrateConverted}
</script>
<script>
${speechFallbackJS}
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
<title>LTS — Timesheets: Create &amp; Sign Off Weekly Timesheets</title>
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
  <strong>LTS &mdash; Weekly Timesheets</strong>
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

LTSgo("timesheet-home");
</script>
</body>
</html>
`;

fs.writeFileSync(OUT_FILE, wrapper);

const sizeMB = (fs.statSync(OUT_FILE).size / 1024 / 1024).toFixed(1);
console.log("=== Weekly Timesheets export build complete! ===");
console.log(`Output: ${OUT_FILE}`);
console.log(`Size: ~${sizeMB} MB`);
console.log("Attach this single file to an email — recipients just double-click it.");
