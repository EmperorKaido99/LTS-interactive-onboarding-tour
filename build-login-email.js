/**
 * Builds a SINGLE self-contained HTML file for the Login Tour.
 * Everything is inlined: CSS, JS (Driver.js, narration, blur, tour),
 * all images as base64 data URIs, and all audio as base64.
 *
 * The output file can be directly attached to an email —
 * the recipient just saves and double-clicks to open in their browser.
 *
 * Usage: node build-login-email.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const SRC = path.join(ROOT, "src");
const ELEMENTS = path.join(ROOT, "lts elements");
const OUTPUT = path.join(ELEMENTS, "LTS-Login-Tour.html");

// 1. Read all source files
const driverCSS = fs.readFileSync(path.join(ROOT, "node_modules/driver.js/dist/driver.css"), "utf-8");
const driverJS = fs.readFileSync(path.join(ROOT, "node_modules/driver.js/dist/driver.js.iife.js"), "utf-8");
const mainCSS = fs.readFileSync(path.join(SRC, "styles/main.css"), "utf-8");
const narrateJS = fs.readFileSync(path.join(SRC, "shared/narrate.js"), "utf-8");
const blurJS = fs.readFileSync(path.join(SRC, "shared/blur-overlay.js"), "utf-8");
const loginTourJS = fs.readFileSync(path.join(SRC, "tours/login-tour.js"), "utf-8");
const loginHTML = fs.readFileSync(path.join(SRC, "screens/login.html"), "utf-8");

// 2. Embed all images as base64 data URIs
function imgToBase64(filename) {
  const filePath = path.join(ELEMENTS, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`WARNING: Image not found: ${filePath}`);
    return "";
  }
  const ext = path.extname(filename).toLowerCase();
  const mime = (ext === ".jpg" || ext === ".jpeg") ? "image/jpeg" : `image/${ext.slice(1)}`;
  const data = fs.readFileSync(filePath);
  return `data:${mime};base64,${data.toString("base64")}`;
}

const images = {
  "logobg.png": imgToBase64("logobg.png"),
  "logotext.png": imgToBase64("logotext.png"),
  "topbar_tile.png": imgToBase64("topbar_tile.png"),
  "banner_bg.jpg": imgToBase64("banner_bg.jpg"),
  "button-bg.png": imgToBase64("button-bg.png"),
  "ipad.png": imgToBase64("ipad.png"),
  "accalogo-400x139.png": imgToBase64("accalogo-400x139.png"),
  "signup_bar.png": imgToBase64("signup_bar.png"),
};

console.log(`Embedded ${Object.keys(images).length} images as base64`);

// 3. Embed login-tour audio as base64
const audioDir = path.join(SRC, "audio/login-tour");
const audioMap = {};
let audioCount = 0;

if (fs.existsSync(audioDir)) {
  const mp3Files = fs.readdirSync(audioDir).filter(f => f.endsWith(".mp3"));
  for (const mp3 of mp3Files) {
    const stepId = mp3.replace(".mp3", "");
    const mp3Data = fs.readFileSync(path.join(audioDir, mp3));
    audioMap[stepId] = `data:audio/mpeg;base64,${mp3Data.toString("base64")}`;
    audioCount++;
  }
}

console.log(`Embedded ${audioCount} audio files as base64`);

// 4. Convert ES modules to plain scripts
const narrateConverted = narrateJS.replace(/export\s+/g, "");
const blurConverted = blurJS.replace(/export\s+/g, "");

let tourConverted = loginTourJS
  .replace(/^import\s+.*;\s*$/gm, "")
  .replace(/\bdriver\(\{/g, "window.driver.js.driver({");

tourConverted = `(function() {\n${tourConverted}\n})();`;

// 5. Extract the <body> content from login.html
const bodyMatch = loginHTML.match(/<body[^>]*>([\s\S]*)<\/body>/i);
let bodyContent = bodyMatch ? bodyMatch[1] : "";

// Remove the original module script tag
bodyContent = bodyContent.replace(/<script\s+type="module"\s+src="[^"]*"><\/script>\s*/, "");

// Replace all image src references with base64 data URIs
for (const [filename, dataUri] of Object.entries(images)) {
  // Match src attributes pointing to the image (various relative paths)
  const escaped = filename.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`src="[^"]*${escaped}"`, "g");
  bodyContent = bodyContent.replace(regex, `src="${dataUri}"`);
}

// 6. Build CSS with embedded background images
let finalCSS = mainCSS;
// Embed banner_bg.jpg into the hero section
finalCSS = finalCSS.replace(
  "background-color: #0044cc;",
  `background-color: #0044cc;\n  background-image: url('${images["banner_bg.jpg"]}');`
);

// 7. Build the single self-contained HTML file
const singleFileHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LTS Interactive Tour — Login</title>
  <style>
${driverCSS}
  </style>
  <style>
${finalCSS}

/* Override for standalone mode */
.screen-nav { display: none; }
  </style>
</head>
<body>

${bodyContent}

  <!-- Replay button -->
  <div style="text-align:center; padding: 20px; margin-bottom: 40px;">
    <button onclick="location.reload()" style="
      padding: 10px 28px;
      background: #1560d4;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
    ">Replay Tour</button>
  </div>

  <!-- Embedded Audio (base64) -->
  <script>
window.__LTS_AUDIO = window.__LTS_AUDIO || {};
window.__LTS_AUDIO["login-tour"] = ${JSON.stringify(audioMap)};
  </script>

  <!-- Driver.js (IIFE) -->
  <script>${driverJS}</script>

  <!-- Narration Engine -->
  <script>
${narrateConverted}
  </script>

  <!-- Blur Overlay -->
  <script>
${blurConverted}
  </script>

  <!-- Login Tour -->
  <script>
${tourConverted}
  </script>

  <!-- Override navigation for standalone mode -->
  <script>
    function goToUserDetails() {
      alert('This standalone tour only contains the Login module.\\nThe full tour continues with User Details, Home Page, and more.');
    }
  </script>
</body>
</html>`;

// 8. Write output
fs.writeFileSync(OUTPUT, singleFileHTML);

const sizeMB = (fs.statSync(OUTPUT).size / 1024 / 1024).toFixed(1);
console.log("");
console.log("=== Single-file login tour built! ===");
console.log(`Output: ${OUTPUT}`);
console.log(`Size:   ${sizeMB} MB`);
console.log("");
console.log("How to share via email:");
console.log("  1. Attach 'LTS-Login-Tour.html' to your email");
console.log("  2. Recipient saves the file and opens it in any browser");
console.log("  3. The interactive tour starts automatically — no internet needed!");
