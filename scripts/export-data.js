const fs = require('fs');
const path = require('path');

function main() {
  const timestamp = Date.now().toString();
  console.log(`Generating build artifacts with unique timestamp: ${timestamp}`);

  const filePath = path.resolve(__dirname, '../lib/defaultData.ts');
  if (!fs.existsSync(filePath)) {
    console.error('Error: lib/defaultData.ts does not exist');
    process.exit(1);
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Remove TS specific syntax so we can evaluate it in pure Node.js
  // 1. Remove imports
  content = content.replace(/import\s+[\s\S]*?;\s*/g, '');
  // 2. Remove Type annotations (e.g., ": ScheduleItem[]")
  content = content.replace(/:\s*ScheduleItem\[\s*\]/g, '');
  // 3. Convert export to regular declaration
  content = content.replace(/export\s+const\s+initialData/g, 'const initialData');

  try {
    const evalFn = new Function(content + '; return initialData;');
    const initialData = evalFn();
    
    // Clean up any old initial-data.*.json files in public directory to avoid bloating
    const publicDir = path.resolve(__dirname, '../public');
    if (fs.existsSync(publicDir)) {
      const files = fs.readdirSync(publicDir);
      for (const file of files) {
        if (file.startsWith('initial-data.') && file.endsWith('.json')) {
          try {
            fs.unlinkSync(path.join(publicDir, file));
            console.log(`Removed stale JSON: ${file}`);
          } catch (delErr) {
            console.warn(`Failed to remove stale file ${file}:`, delErr.message);
          }
        }
      }
    }

    // Write both timestamped and default fallback JSON
    const timestampedOutPath = path.resolve(publicDir, `initial-data.${timestamp}.json`);
    const defaultOutPath = path.resolve(publicDir, 'initial-data.json');
    
    const jsonString = JSON.stringify(initialData, null, 2);
    fs.writeFileSync(timestampedOutPath, jsonString, 'utf8');
    fs.writeFileSync(defaultOutPath, jsonString, 'utf8');
    console.log(`Generated:
  - public/initial-data.${timestamp}.json (cache-busting)
  - public/initial-data.json (fallback)`);

    // Write build timestamp to public directory so Next.js config can load it safely as an env variable
    const timestampPath = path.resolve(publicDir, 'build-timestamp.txt');
    fs.writeFileSync(timestampPath, timestamp, 'utf8');
    console.log(`Generated build timestamp text file: public/build-timestamp.txt`);

  } catch (err) {
    console.error('Error parsing and generating initial-data.json:', err);
    process.exit(1);
  }
}

main();

