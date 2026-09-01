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

const requiredPhysicalRoutes = [...requiredModules];

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
  if (/from\s+['"]\.\.\/\.\.\/\.\.\//.test(text)) violations.push(`${path.relative(root, file)}: import outside V2 boundary`);
}

const shellFiles = files.filter((file) => fs.readFileSync(file, 'utf8').includes('function AppShell'));
if (shellFiles.length !== 1) violations.push(`Expected exactly one AppShell, found ${shellFiles.length}`);

const modulesText = fs.readFileSync(path.join(src, 'lib', 'modules.ts'), 'utf8');
for (const slug of requiredModules) {
  if (!modulesText.includes(`slug: '${slug}'`)) violations.push(`Missing canonical module route: ${slug}`);
}

for (const slug of requiredPhysicalRoutes) {
  const page = path.join(src, 'app', slug, 'page.tsx');
  if (!fs.existsSync(page)) {
    violations.push(`${slug} must have an independent physical route`);
    continue;
  }
  if (slug !== 'dashboard') {
    const pageText = fs.readFileSync(page, 'utf8');
    if (!pageText.includes('ModuleHeader')) violations.push(`${slug} must use the canonical ModuleHeader`);
  }
}

const dashboardPage = path.join(src, 'app', 'dashboard', 'page.tsx');
if (fs.existsSync(dashboardPage) && !fs.readFileSync(dashboardPage, 'utf8').includes('DashboardByRole')) violations.push('Dashboard route must use the role-aware dashboard');

const routePage = path.join(src, 'app', 'roteiros', 'page.tsx');
if (fs.existsSync(routePage) && !fs.readFileSync(routePage, 'utf8').includes('RouteSessionModule')) violations.push('Routes must use RouteSessionModule for local KM homologation');

const fieldPage = path.join(src, 'app', 'campo', 'page.tsx');
if (fs.existsSync(fieldPage) && !fs.readFileSync(fieldPage, 'utf8').includes('FieldJourneyModule')) violations.push('Field Mode must use FieldJourneyModule for guided local homologation');

const historyPage = path.join(src, 'app', 'historico', 'page.tsx');
if (fs.existsSync(historyPage) && !fs.readFileSync(historyPage, 'utf8').includes('HistorySessionModule')) violations.push('History must consume the shared session activity state');

const layoutPage = path.join(src, 'app', 'layout.tsx');
if (!fs.readFileSync(layoutPage, 'utf8').includes('SessionActivityProvider')) violations.push('Root layout must provide shared session activity state');

const dashboardComponent = path.join(src, 'components', 'DashboardByRole.tsx');
if (!fs.readFileSync(dashboardComponent, 'utf8').includes('useSessionActivity')) violations.push('Dashboard must reflect shared session activity during homologation');

const genericModulePage = path.join(src, 'app', '[module]', 'page.tsx');
if (fs.existsSync(genericModulePage)) violations.push('Dynamic [module] page is forbidden: all canonical modules must remain independent physical routes');

if (violations.length) {
  console.error('Movvant V2 architecture guard failed:\n' + violations.join('\n'));
  process.exit(1);
}

console.log(`Movvant V2 architecture guard passed: ${files.length} source files, one AppShell, ${requiredModules.length} canonical modules, physical routes protected, with shared session activity reflected across Campo, Dashboard and Histórico.`);
