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
  /querySelector(All)?\s*\(/i,
  /getElementById\s*\(/i,
  /\.style\.display\s*=/i,
  /\.style\.visibility\s*=/i,
  /addEventListener\s*\(\s*['"]click['"]/i,
  /setTimeout\s*\(/i,
  /setInterval\s*\(/i
];

const requiredModules = [
  'dashboard', 'pendencias', 'agenda', 'notificacoes', 'campo', 'roteiros', 'historico',
  'custos', 'veiculos', 'equipe', 'documentos', 'sinistros', 'relatorios', 'perfil', 'configuracoes'
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
  if (!file.endsWith('.css')) {
    for (const pattern of forbidden) {
      if (pattern.test(text)) violations.push(`${path.relative(root, file)}: forbidden legacy/runtime pattern ${pattern}`);
    }
  }
  if (/from\s+['"]\.\.\/\.\.\/\.\.\//.test(text)) {
    violations.push(`${path.relative(root, file)}: import outside V2 boundary`);
  }
}

const shellFiles = files.filter((file) => fs.readFileSync(file, 'utf8').includes('function AppShell'));
if (shellFiles.length !== 1) violations.push(`Expected exactly one AppShell, found ${shellFiles.length}`);

const modulesFile = path.join(src, 'lib', 'modules.ts');
const modulesText = fs.readFileSync(modulesFile, 'utf8');
for (const slug of requiredModules) {
  if (!modulesText.includes(`slug: '${slug}'`)) violations.push(`Missing canonical module route: ${slug}`);
}

const modulePage = fs.readFileSync(path.join(src, 'app', '[module]', 'page.tsx'), 'utf8');
if (!modulePage.includes("slug === 'agenda'")) violations.push('Agenda must render from canonical module route');
if (!modulePage.includes("slug === 'roteiros'")) violations.push('Routes must render from canonical module route');
if (!modulePage.includes("slug === 'pendencias'")) violations.push('Pending center must render from canonical module route');
if (!modulePage.includes("slug === 'campo'")) violations.push('Field mode must render from canonical module route');

const dashboardPage = path.join(src, 'app', 'dashboard', 'page.tsx');
if (!fs.existsSync(dashboardPage)) violations.push('Dashboard must have an independent canonical route');
else if (!fs.readFileSync(dashboardPage, 'utf8').includes('DashboardByRole')) violations.push('Dashboard route must use the role-aware dashboard');

if (violations.length) {
  console.error('Movvant V2 architecture guard failed:\n' + violations.join('\n'));
  process.exit(1);
}

console.log(`Movvant V2 architecture guard passed: ${files.length} source files, one AppShell, ${requiredModules.length} canonical routes.`);
