/**
 * Shared helpers for the build-*.js scripts: reading the vendored Driver.js,
 * embedding narration audio, and turning a tour module into a plain script
 * (the exports must work when opened from disk or inside a srcdoc frame).
 */
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf-8");
}

function loadCommon() {
  return {
    driverCSS: read("src/vendor/driver/driver.css"),
    driverJS: read("src/vendor/driver/driver.js.iife.js"),
    mainCSS: read("src/styles/main.css"),
    narrateJS: read("src/shared/narrate.js"),
  };
}

// "export function x" -> "function x"
function stripExports(js) {
  return js.replace(/export\s+/g, "");
}

// Tour module -> plain script: drop imports, use the global Driver.js, wrap in an IIFE.
function toPlainScript(js) {
  const body = js
    .replace(/^import\s+.*;\s*$/gm, "")
    .replace(/\bdriver\(\{/g, "window.driver.js.driver({");
  return `(function() {\n${body}\n})();`;
}

// One tour's MP3s as { stepId: "data:audio/mpeg;base64,..." }
function loadAudioDir(dir) {
  const out = {};
  if (!fs.existsSync(dir)) return out;
  for (const mp3 of fs.readdirSync(dir).filter((f) => f.endsWith(".mp3"))) {
    const base64 = fs.readFileSync(path.join(dir, mp3)).toString("base64");
    out[mp3.replace(".mp3", "")] = `data:audio/mpeg;base64,${base64}`;
  }
  return out;
}

// Fallback narration: when a step has no embedded MP3, speak the narration script with
// the browser's built-in speech engine (Web Speech API), so the file always has voice.
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

module.exports = { ROOT, loadCommon, stripExports, toPlainScript, loadAudioDir, speechFallbackJS };
