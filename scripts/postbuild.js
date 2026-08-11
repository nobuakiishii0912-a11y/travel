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

function cleanDir(dir) {
  if (fs.existsSync(dir)) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);
      try {
        fs.rmSync(entryPath, { recursive: true, force: true });
      } catch (err) {
        console.warn(`Warning: Could not remove ${entryPath}: ${err.message}`);
      }
    }
  } else {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function main() {
  let src = path.resolve(__dirname, '../out');
  const dest = path.resolve(__dirname, '../dist');

  if (!fs.existsSync(src)) {
    // If output is generated under .next_build folder directly
    const altSrc = path.resolve(__dirname, '../.next_build');
    if (fs.existsSync(altSrc)) {
      src = altSrc;
    }
  }

  if (!fs.existsSync(src)) {
    const standaloneSrc = path.resolve(__dirname, '../.next/standalone');
    if (fs.existsSync(standaloneSrc)) {
      console.log('Standalone build detected. Creating empty dist directory for compatibility.');
      fs.mkdirSync(dest, { recursive: true });
      process.exit(0);
    }
    console.error(`Error: Source directories ("../out" or "../.next_build") do not exist. Next.js export might have failed.`);
    process.exit(1);
  }

  console.log(`Cleaning destination directory files in: ${dest}`);
  cleanDir(dest);

  console.log(`Copying built files from ${src} to ${dest}`);
  try {
    copyDir(src, dest);
    console.log('Copy complete.');
    
    // Do not clean up temporary build/out directory so both out/ and dist/ are available
    console.log(`Keeping temporary source directory: ${src} for deployment compatibility`);
  } catch (err) {
    console.error('Error during postbuild content copy:', err);
    process.exit(1);
  }
}

main();
