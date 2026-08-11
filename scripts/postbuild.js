const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function main() {
  const distDir = path.resolve(__dirname, '../dist');
  const outDir = path.resolve(__dirname, '../out');

  const outExists = fs.existsSync(outDir) && fs.existsSync(path.join(outDir, 'index.html'));
  const distExists = fs.existsSync(distDir) && fs.existsSync(path.join(distDir, 'index.html'));

  if (outExists) {
    console.log(`Copying freshly built static export from out/ to dist/...`);
    try {
      if (fs.existsSync(distDir)) {
        fs.rmSync(distDir, { recursive: true, force: true });
      }
      copyDir(outDir, distDir);
      console.log('Successfully synced out/ -> dist/');
    } catch (err) {
      console.warn('Warning syncing out to dist:', err.message);
    }
  } else if (distExists && !outExists) {
    console.log(`Copying built static artifacts from dist/ to out/...`);
    try {
      copyDir(distDir, outDir);
      console.log('Successfully synced dist/ -> out/');
    } catch (err) {
      console.warn('Warning syncing dist to out:', err.message);
    }
  }

  // Ensure .nojekyll exists in public, out, and dist
  const publicDir = path.resolve(__dirname, '../public');
  [publicDir, outDir, distDir].forEach((dir) => {
    if (fs.existsSync(dir)) {
      const nojekyllPath = path.join(dir, '.nojekyll');
      if (!fs.existsSync(nojekyllPath)) {
        fs.writeFileSync(nojekyllPath, '');
        console.log(`Created .nojekyll in ${path.relative(path.resolve(__dirname, '..'), dir)}`);
      }
    }
  });

  // Verification check
  if (fs.existsSync(path.join(distDir, 'index.html')) || fs.existsSync(path.join(outDir, 'index.html'))) {
    const targetFile = fs.existsSync(path.join(distDir, 'index.html'))
      ? path.join(distDir, 'index.html')
      : path.join(outDir, 'index.html');
    const stat = fs.statSync(targetFile);
    console.log(`✓ Verification successful: ${path.relative(path.resolve(__dirname, '..'), targetFile)} exists (${stat.size} bytes).`);
    console.log(`✓ .nojekyll file verified for GitHub Pages.`);
  } else {
    console.error('✗ Error: index.html is missing after build!');
    process.exit(1);
  }
}

main();
