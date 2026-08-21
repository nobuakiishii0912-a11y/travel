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

  // 1. Mirror out/ into dist/ so both environments (GitHub Pages and AI Studio static host) have identical files
  copyDir(outDir, distDir);

  // 2. Ensure public assets are synced
  copyDir(publicDir, distDir);
  copyDir(publicDir, outDir);

  // 3. Ensure .nojekyll exists for GitHub Pages
  [distDir, outDir].forEach((dir) => {
    const nojekyllPath = path.join(dir, '.nojekyll');
    if (!fs.existsSync(nojekyllPath)) {
      fs.writeFileSync(nojekyllPath, '');
    }
  });

  console.log('✓ Postbuild completed successfully with robust fallback synchronization.');
}

main();
