const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      try {
        fs.copyFileSync(srcPath, destPath);
      } catch (e) {
        console.warn(`[postbuild] Could not copy ${srcPath}:`, e.message);
      }
    }
  }
}

function main() {
  const rootDir = path.resolve(__dirname, '..');
  const distDir = path.resolve(rootDir, 'dist');
  const outDir = path.resolve(rootDir, 'out');
  const publicDir = path.resolve(rootDir, 'public');
  const nextStaticDir = path.resolve(rootDir, '.next/static');

  // Ensure directories exist
  fs.mkdirSync(distDir, { recursive: true });
  fs.mkdirSync(outDir, { recursive: true });

  // Copy public assets
  copyDir(publicDir, distDir);
  copyDir(publicDir, outDir);

  // Copy Next.js static assets if available (.next/static -> _next/static)
  if (fs.existsSync(nextStaticDir)) {
    copyDir(nextStaticDir, path.join(distDir, '_next/static'));
    copyDir(nextStaticDir, path.join(outDir, '_next/static'));
  }

  // Ensure index.html exists in both dist/ and out/
  const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Singapore Trip Planner</title>
  <meta http-equiv="refresh" content="0;url=./" />
</head>
<body>
  <p>Loading Singapore Trip Planner...</p>
</body>
</html>`;

  [distDir, outDir].forEach((dir) => {
    const indexPath = path.join(dir, 'index.html');
    if (!fs.existsSync(indexPath)) {
      // If there is an index.html from public, great. Otherwise write fallback.
      const pubIndex = path.join(publicDir, 'index.html');
      if (fs.existsSync(pubIndex)) {
        fs.copyFileSync(pubIndex, indexPath);
      } else {
        fs.writeFileSync(indexPath, fallbackHtml);
      }
    }

    // Ensure .nojekyll exists for GitHub Pages
    const nojekyllPath = path.join(dir, '.nojekyll');
    if (!fs.existsSync(nojekyllPath)) {
      fs.writeFileSync(nojekyllPath, '');
    }
  });

  console.log('✓ Postbuild completed successfully with robust fallback synchronization.');
}

main();
