const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const tailwind = require('@tailwindcss/postcss');

async function buildCss() {
  try {
    const cssPath = path.resolve(__dirname, '../app/globals.css');
    const outPath = path.resolve(__dirname, '../public/globals.compiled.css');
    const outDir = path.dirname(outPath);

    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const cssContent = fs.readFileSync(cssPath, 'utf8');
    const result = await postcss([tailwind()]).process(cssContent, { from: cssPath, to: outPath });

    fs.writeFileSync(outPath, result.css);
    console.log(`[build-css] Successfully generated public/globals.compiled.css (${(result.css.length / 1024).toFixed(1)} KB)`);

    // If 'out' or 'dist' directory exists (for export build), copy it there as well
    const exportOutPath = path.resolve(__dirname, '../out/globals.compiled.css');
    if (fs.existsSync(path.resolve(__dirname, '../out'))) {
      fs.writeFileSync(exportOutPath, result.css);
    }
  } catch (err) {
    console.error('[build-css] Failed to build compiled CSS:', err);
  }
}

buildCss();
