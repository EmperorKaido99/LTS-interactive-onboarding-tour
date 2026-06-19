/**
 * Build script: creates a self-contained offline version in dist/
 * that works when opened directly from the filesystem (file:// protocol).
 *
 * Converts ES modules to regular scripts, inlines dependencies,
 * and embeds narration scripts.
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
const scriptsJSON = fs.readFileSync(path.join(SRC, "narration/scripts.json"), "utf-8");

// 2. Convert narrate.js from ES module to plain script
//    - Remove export keywords
//    - Embed scripts.json as a variable instead of fetch()
const narrateConverted = narrateJS
  .replace(/export\s+/g, "")
  .replace(
    /async function loadScripts\(\)[\s\S]*?return narrationScripts;\s*\}/,
    `function loadScripts() {
  if (!narrationScripts) narrationScripts = window.__LTS_NARRATION_SCRIPTS;
  return narrationScripts;
}`
  )
  .replace(
    "const scripts = await loadScripts();",
    "const scripts = loadScripts();"
  )
  .replace("export async function narrate", "async function narrate")
  .replace("export function stopNarration", "function stopNarration");

// 3. Process each tour JS file — convert from ES module to plain script
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

// 4. Build the inline script block for tour pages
function buildInlineScripts(tourFileName) {
  const tourCode = tourScripts[tourFileName];
  if (!tourCode) return "";

  return `
<!-- Narration Scripts (embedded) -->
<script>
window.__LTS_NARRATION_SCRIPTS = ${scriptsJSON};
</script>

<!-- Driver.js (IIFE) -->
<script>${driverJS}</script>

<!-- Narration Engine -->
<script>
${narrateConverted}
</script>

<!-- Tour -->
<script>
${tourCode}
</script>`;
}

// 5. Process HTML files
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

  // Fix relative links for screen-to-screen navigation
  if (isScreen) {
    // ../../index.html -> ../index.html
    html = html.replace(/\.\.\/\.\.\/index\.html/g, "../index.html");
    // ../../node_modules/... links already replaced above
  }

  return html;
}

// 6. Process and write index.html
let indexHTML = fs.readFileSync(path.join(ROOT, "index.html"), "utf-8");
indexHTML = indexHTML.replace(
  /<link[^>]*main\.css[^>]*>/,
  `<style>${mainCSS}</style>`
);
// Fix path: src/screens/ -> screens/ for dist
indexHTML = indexHTML.replace(/src\/screens\//g, "screens/");
fs.writeFileSync(path.join(DIST, "index.html"), indexHTML);

// 7. Process and write all screen HTML files
const screensDir = path.join(SRC, "screens");
const screenFiles = fs.readdirSync(screensDir).filter(f => f.endsWith(".html"));

for (const file of screenFiles) {
  const processed = processHTML(path.join(screensDir, file), true);
  fs.writeFileSync(path.join(DIST, "screens", file), processed);
}

// 8. Copy main.css (for any pages that might reference it directly)
fs.writeFileSync(path.join(DIST, "styles", "main.css"), mainCSS);

console.log("=== Offline build complete! ===");
console.log(`Output: ${DIST}`);
console.log(`Files:`);
console.log(`  - index.html`);
screenFiles.forEach(f => console.log(`  - screens/${f}`));
console.log("");
console.log("You can now ZIP the dist/ folder and email it.");
console.log("Recipients just unzip and double-click index.html.");
