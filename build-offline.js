/**
 * Build script: creates a self-contained offline version in dist/
 * that works when opened directly from the filesystem (file:// protocol).
 *
 * Converts ES modules to regular scripts, inlines dependencies,
 * and embeds pre-recorded audio as base64 data URIs.
 *
 * Usage: node build-offline.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");
const SRC = path.join(ROOT, "src");

// Clean and create dist
if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true });
fs.mkdirSync(DIST, { recursive: true });
fs.mkdirSync(path.join(DIST, "screens"), { recursive: true });
fs.mkdirSync(path.join(DIST, "styles"), { recursive: true });

// 1. Read source files
const driverCSS = fs.readFileSync(path.join(ROOT, "node_modules/driver.js/dist/driver.css"), "utf-8");
const driverJS = fs.readFileSync(path.join(ROOT, "node_modules/driver.js/dist/driver.js.iife.js"), "utf-8");
const mainCSS = fs.readFileSync(path.join(SRC, "styles/main.css"), "utf-8");
const narrateJS = fs.readFileSync(path.join(SRC, "shared/narrate.js"), "utf-8");
const blurOverlayJS = fs.readFileSync(path.join(SRC, "shared/blur-overlay.js"), "utf-8");
const viewJS = fs.readFileSync(path.join(SRC, "shared/view.js"), "utf-8");

// 2. Build embedded audio map (base64 data URIs)
const audioDir = path.join(SRC, "audio");
const audioMap = {};
let audioCount = 0;

if (fs.existsSync(audioDir)) {
  const tourDirs = fs.readdirSync(audioDir).filter(d =>
    fs.statSync(path.join(audioDir, d)).isDirectory()
  );

  for (const tourName of tourDirs) {
    audioMap[tourName] = {};
    const tourAudioDir = path.join(audioDir, tourName);
    const mp3Files = fs.readdirSync(tourAudioDir).filter(f => f.endsWith(".mp3"));

    for (const mp3 of mp3Files) {
      const stepId = mp3.replace(".mp3", "");
      const mp3Data = fs.readFileSync(path.join(tourAudioDir, mp3));
      const base64 = mp3Data.toString("base64");
      audioMap[tourName][stepId] = `data:audio/mpeg;base64,${base64}`;
      audioCount++;
    }
  }
}

console.log(`Embedded ${audioCount} audio files as base64`);

// 3. Convert narrate.js and blur-overlay.js from ES modules to plain scripts
const narrateConverted = narrateJS
  .replace(/export\s+/g, "");
const blurOverlayConverted = blurOverlayJS
  .replace(/export\s+/g, "");

// 4. Process each tour JS file — convert from ES module to plain script
const toursDir = path.join(SRC, "tours");
const tourFiles = fs.readdirSync(toursDir).filter(f => f.endsWith(".js"));
const tourScripts = {};

for (const file of tourFiles) {
  let content = fs.readFileSync(path.join(toursDir, file), "utf-8");

  // Remove import lines
  content = content.replace(/^import\s+.*;\s*$/gm, "");

  // Replace driver import usage: driver({...}) -> window.driver.js.driver({...})
  content = content.replace(/\bdriver\(\{/g, "window.driver.js.driver({");

  // Remove "type=module" requirement by wrapping in IIFE
  content = `(function() {\n${content}\n})();`;

  tourScripts[file] = content;
}

// 5. Build the inline script block for tour pages
function buildInlineScripts(tourFileName) {
  const tourCode = tourScripts[tourFileName];
  if (!tourCode) return "";

  // Determine which tour this is to only embed its audio
  const tourName = tourFileName.replace("-tour.js", "-tour");
  const tourAudio = audioMap[tourName] || {};

  return `
<!-- Embedded Audio -->
<script>
window.__LTS_AUDIO = window.__LTS_AUDIO || {};
window.__LTS_AUDIO["${tourName}"] = ${JSON.stringify(tourAudio)};
</script>

<!-- Driver.js (IIFE) -->
<script>${driverJS}</script>

<!-- Narration Engine -->
<script>
${narrateConverted}
</script>

<!-- Blur Overlay -->
<script>
${blurOverlayConverted}
</script>

<!-- Tour -->
<script>
${tourCode}
</script>`;
}

// 6. Process HTML files
function processHTML(filePath, isScreen) {
  let html = fs.readFileSync(filePath, "utf-8");
  const fileName = path.basename(filePath);

  // Remove external CSS links and inline them
  // Replace driver.css link
  html = html.replace(
    /<link[^>]*driver\.css[^>]*>/,
    `<style>${driverCSS}</style>`
  );

  // Replace main.css link
  html = html.replace(
    /<link[^>]*main\.css[^>]*>/,
    `<style>${mainCSS}</style>`
  );

  // For screen pages with tours, replace the module script with inline scripts
  const tourMatch = html.match(/src="\.\.\/tours\/([^"]+)"/);
  if (tourMatch) {
    const tourFileName = tourMatch[1];

    // Remove the module script tag
    html = html.replace(/<script\s+type="module"\s+src="[^"]*"><\/script>/, "");

    // Insert inline scripts before </body>
    const inlineBlock = buildInlineScripts(tourFileName);
    html = html.replace("</body>", `${inlineBlock}\n</body>`);
  }

  // Inline the view switcher (plain script) so dist works without src/shared
  html = html.replace(
    /<script\s+src="\.\.\/shared\/view\.js"><\/script>/,
    `<script>${viewJS}</script>`
  );

  // Inline images from the "lts elements" folder as data URIs so the
  // dist build works standalone (zipped/emailed without the repo)
  html = html.replace(/src="\.\.\/\.\.\/lts elements\/([^"]+)"/g, (match, name) => {
    const imgPath = path.join(ROOT, "lts elements", name);
    if (!fs.existsSync(imgPath)) return match;
    const ext = path.extname(name).slice(1).toLowerCase();
    const mime = ext === "jpg" ? "image/jpeg" : `image/${ext}`;
    return `src="data:${mime};base64,${fs.readFileSync(imgPath).toString("base64")}"`;
  });

  // Fix relative links for screen-to-screen navigation
  if (isScreen) {
    // ../../index.html -> ../index.html
    html = html.replace(/\.\.\/\.\.\/index\.html/g, "../index.html");
  }

  return html;
}

// 7. Process and write index.html
let indexHTML = fs.readFileSync(path.join(ROOT, "index.html"), "utf-8");
indexHTML = indexHTML.replace(
  /<link[^>]*main\.css[^>]*>/,
  `<style>${mainCSS}</style>`
);
// Fix path: src/screens/ -> screens/ for dist
indexHTML = indexHTML.replace(/src\/screens\//g, "screens/");
fs.writeFileSync(path.join(DIST, "index.html"), indexHTML);

// 8. Process and write all screen HTML files
const screensDir = path.join(SRC, "screens");
const screenFiles = fs.readdirSync(screensDir).filter(f => f.endsWith(".html"));

for (const file of screenFiles) {
  const processed = processHTML(path.join(screensDir, file), true);
  fs.writeFileSync(path.join(DIST, "screens", file), processed);
}

// 9. Copy main.css (for any pages that might reference it directly)
fs.writeFileSync(path.join(DIST, "styles", "main.css"), mainCSS);

// 10. Summary
const distSize = fs.readdirSync(path.join(DIST, "screens"))
  .reduce((sum, f) => sum + fs.statSync(path.join(DIST, "screens", f)).size, 0);
const totalSizeMB = ((distSize + fs.statSync(path.join(DIST, "index.html")).size) / 1024 / 1024).toFixed(1);

console.log("=== Offline build complete! ===");
console.log(`Output: ${DIST}`);
console.log(`Total size: ~${totalSizeMB} MB (with embedded audio)`);
console.log(`Files:`);
console.log(`  - index.html`);
screenFiles.forEach(f => console.log(`  - screens/${f}`));
console.log("");
console.log("You can now ZIP the dist/ folder and email it.");
console.log("Recipients just unzip and double-click index.html.");
