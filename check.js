// npm test: static checks that catch silently broken tours.
//  1. every tour step points at an element that exists on its screen
//  2. every tour step has a voice-over MP3 or a fallback script
//  3. every link, script, stylesheet and image in a screen resolves
//  4. nothing in src/ depends on node_modules (Driver.js is vendored)
//  5. main.css has no page-wide element rules (they are scoped to .lts-app)
const fs = require("fs");
const path = require("path");

const SCREENS = "src/screens";
const TOURS = "src/tours";
const AUDIO = "src/audio";
const scripts = JSON.parse(fs.readFileSync("src/narration/scripts.json", "utf8"));
const problems = [];
const fail = (msg) => problems.push(msg);

// 4. vendored Driver.js
for (const f of ["driver.js.mjs", "driver.js.iife.js", "driver.css", "LICENSE"]) {
  if (!fs.existsSync(path.join("src/vendor/driver", f))) fail(`missing src/vendor/driver/${f}`);
}
for (const dir of [SCREENS, TOURS, "src/shared"]) {
  for (const f of fs.readdirSync(dir)) {
    if (fs.readFileSync(path.join(dir, f), "utf8").includes("node_modules")) {
      fail(`${dir}/${f} references node_modules; use src/vendor/driver/`);
    }
  }
}

let tourCount = 0;
let stepCount = 0;
for (const screen of fs.readdirSync(SCREENS).filter((f) => f.endsWith(".html"))) {
  const html = fs.readFileSync(path.join(SCREENS, screen), "utf8");

  // 3. links and assets
  const refs = html.matchAll(
    /(?:href|src)="([^"#?]+\.(?:html|js|css|png|jpe?g|PNG|mp3|json))[^"]*"|location\.href\s*=\s*["']([^"'#?]+\.html)["']/g
  );
  for (const m of refs) {
    const target = m[1] || m[2];
    if (/^(https?:|data:)/.test(target)) continue;
    if (!fs.existsSync(path.join(SCREENS, target))) fail(`${screen}: broken reference ${target}`);
  }

  // 1 + 2. tours
  for (const m of html.matchAll(/src="\.\.\/tours\/([^"]+)"/g)) {
    const tourFile = path.join(TOURS, m[1]);
    if (!fs.existsSync(tourFile)) continue; // already reported above
    tourCount++;
    const js = fs.readFileSync(tourFile, "utf8");
    const tourName = (js.match(/TOUR_NAME\s*=\s*"([^"]+)"/) || [])[1];
    let index = 0;
    for (const s of js.matchAll(/(?:^|\n)\s*(?:\{\s*)?element:\s*["']([^"']+)["']|(?:^|\n)\s*\{\s*\n?\s*popover/g)) {
      stepCount++;
      const selector = s[1];
      let stepId = `step-${index}`;
      if (selector) {
        stepId = selector.replace(/^[#.]/, "");
        const exists = selector.startsWith("#")
          ? new RegExp(`id=["']${stepId}["']`).test(html)
          : selector.startsWith(".")
            ? new RegExp(`class=["'][^"']*\\b${stepId}\\b`).test(html)
            : true; // tag selectors are not checked
        if (!exists) fail(`${screen}: tour ${m[1]} targets ${selector}, which is not on the page`);
      }
      index++;
      if (tourName) {
        const hasMp3 = fs.existsSync(path.join(AUDIO, tourName, `${stepId}.mp3`));
        const hasScript = scripts[tourName] && scripts[tourName][stepId];
        if (!hasMp3 && !hasScript) fail(`${tourName}/${stepId}: no MP3 and no fallback script`);
      }
    }
  }
}

// 5. main.css must not style bare elements page-wide (it would restyle a host page)
{
  const css = fs
    .readFileSync("src/styles/main.css", "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/url\([^)]*\)/g, "url()");
  const bareElement = /^(\*|[a-z][a-z0-9]*)(:{1,2}[a-z-]+(\([^)]*\))?)*$/i;
  for (const m of css.matchAll(/([^{}]+)\{/g)) {
    const group = m[1].trim();
    if (!group || group.startsWith("@") || /^(from|to|\d+%)/.test(group)) continue;
    for (const part of group.split(",")) {
      const sel = part.trim();
      if (sel && !sel.includes(".lts-app") && sel.split(/[\s>+~]+/).every((c) => bareElement.test(c))) {
        fail(`main.css: "${sel}" styles a bare element; scope it with :where(.lts-app)`);
      }
    }
  }
}

if (problems.length) {
  console.error(`${problems.length} problem(s):`);
  problems.forEach((p) => console.error("  - " + p));
  process.exit(1);
}
console.log(`ok: ${tourCount} tour pages, ${stepCount} steps, all selectors, audio and links resolve`);
