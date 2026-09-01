import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const src = path.join(root, 'src');
const forbidden = [
  /mvNavigationV\d+/i,
  /mvWebLayoutV\d+/i,
  /mvShellV\d+/i,
  /v16\d{3,}\.js/i,
  /postprocess\.js/i,
  /querySelectorAll\([^)]*\.page[^)]*\).*style\.display/si,
  /setTimeout\([^,]+,\s*(?:900|1200|1400|1800|2000|2400|2600|3200)\s*\)/i
];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const files = walk(src).filter((file) => /\.(?:ts|tsx|js|jsx|css)$/.test(file));
const violations = [];

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  for (const pattern of forbidden) {
    if (pattern.test(text)) violations.push(`${path.relative(root, file)}: ${pattern}`);
  }
  if (/from\s+['"]\.\.\/\.\.\/\.\.\//.test(text)) {
    violations.push(`${path.relative(root, file)}: import outside V2 boundary`);
  }
}

const shellFiles = files.filter((file) => fs.readFileSync(file, 'utf8').includes('function AppShell'));
if (shellFiles.length !== 1) violations.push(`Expected exactly one AppShell, found ${shellFiles.length}`);

if (violations.length) {
  console.error('Movvant V2 architecture guard failed:\n' + violations.join('\n'));
  process.exit(1);
}

console.log(`Movvant V2 architecture guard passed (${files.length} source files).`);
