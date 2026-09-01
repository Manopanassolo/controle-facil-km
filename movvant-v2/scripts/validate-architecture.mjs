import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const src = path.join(root, 'src');
const forbidden = [/mvNavigationV\d+/i,/mvWebLayoutV\d+/i,/mvShellV\d+/i,/v16\d{3,}\.js/i,/postprocess\.js/i,/querySelector(All)?\s*\(/i,/getElementById\s*\(/i,/\.style\.display\s*=/i,/\.style\.visibility\s*=/i,/addEventListener\s*\(\s*['"]click['"]/i,/setTimeout\s*\(/i,/setInterval\s*\(/i];
const requiredModules = ['dashboard','pendencias','agenda','notificacoes','campo','roteiros','historico','custos','veiculos','equipe','documentos','sinistros','relatorios','perfil','configuracoes'];

function walk(dir) { return fs.readdirSync(dir,{withFileTypes:true}).flatMap((entry)=>{ const full=path.join(dir,entry.name); return entry.isDirectory()?walk(full):[full]; }); }
const files=walk(src).filter((file)=>/\.(?:ts|tsx|js|jsx|css)$/.test(file));
const violations=[];
for(const file of files){ const text=fs.readFileSync(file,'utf8'); if(!file.endsWith('.css')) for(const pattern of forbidden) if(pattern.test(text)) violations.push(`${path.relative(root,file)}: forbidden legacy/runtime pattern ${pattern}`); if(/from\s+['"]\.\.\/\.\.\/\.\.\//.test(text)) violations.push(`${path.relative(root,file)}: import outside V2 boundary`); }
const shellFiles=files.filter((file)=>fs.readFileSync(file,'utf8').includes('function AppShell'));
if(shellFiles.length!==1) violations.push(`Expected exactly one AppShell, found ${shellFiles.length}`);
const modulesText=fs.readFileSync(path.join(src,'lib','modules.ts'),'utf8');
for(const slug of requiredModules){ if(!modulesText.includes(`slug: '${slug}'`)) violations.push(`Missing canonical module route: ${slug}`); const page=path.join(src,'app',slug,'page.tsx'); if(!fs.existsSync(page)){ violations.push(`${slug} must have an independent physical route`); continue; } if(slug!=='dashboard'&&!fs.readFileSync(page,'utf8').includes('ModuleHeader')) violations.push(`${slug} must use the canonical ModuleHeader`); }

const requirements = [
  ['app/dashboard/page.tsx','DashboardByRole','Dashboard route must use role-aware dashboard'],
  ['app/agenda/page.tsx','AgendaSessionModule','Agenda must use shared session workflow'],
  ['app/roteiros/page.tsx','RouteSessionModule','Routes must use local KM homologation'],
  ['app/campo/page.tsx','FieldJourneyModule','Field Mode must use guided homologation'],
  ['app/historico/page.tsx','HistorySessionModule','History must consume shared session activity'],
  ['app/custos/page.tsx','CostSessionModule','Costs must use shared fleet session module'],
  ['app/veiculos/page.tsx','VehicleSessionModule','Vehicles must use shared fleet module'],
  ['app/layout.tsx','SessionActivityProvider','Root layout must provide shared session state']
];
for(const [relative,needle,message] of requirements){ const file=path.join(src,relative); if(!fs.readFileSync(file,'utf8').includes(needle)) violations.push(message); }

const providerText=fs.readFileSync(path.join(src,'components','SessionActivityProvider.tsx'),'utf8');
for(const required of ['journeys','routes','expenses','appointments','vehicles','vehicleOptions','addVehicle','totalKm','totalExpenses','completedAppointments','activityCount']) if(!providerText.includes(required)) violations.push(`Session activity provider must expose ${required}`);
const routeText=fs.readFileSync(path.join(src,'components','RouteSessionModule.tsx'),'utf8');
if(!routeText.includes('vehicleOptions')||!routeText.includes('addRoute')) violations.push('Routes must consume shared fleet and activity state');
const fieldText=fs.readFileSync(path.join(src,'components','FieldJourneyModule.tsx'),'utf8');
if(!fieldText.includes('vehicleOptions')||!fieldText.includes('addJourney')) violations.push('Field Mode must consume shared fleet and activity state');
const costText=fs.readFileSync(path.join(src,'components','CostSessionModule.tsx'),'utf8');
if(!costText.includes('vehicleOptions')||!costText.includes('addExpense')) violations.push('Costs must consume shared fleet and activity state');
const vehicleText=fs.readFileSync(path.join(src,'components','VehicleSessionModule.tsx'),'utf8');
if(!vehicleText.includes('addVehicle')||!vehicleText.includes('vehicles')) violations.push('Vehicles must manage the shared fleet state');
const coreText=fs.readFileSync(path.join(src,'components','CoreModules.tsx'),'utf8');
if(!coreText.includes('session-report-summary')||!coreText.includes('activityCount')) violations.push('Reports must display consolidated shared activity');
const genericModulePage=path.join(src,'app','[module]','page.tsx');
if(fs.existsSync(genericModulePage)) violations.push('Dynamic [module] page is forbidden');

if(violations.length){ console.error('Movvant V2 architecture guard failed:\n'+violations.join('\n')); process.exit(1); }
console.log(`Movvant V2 architecture guard passed: ${files.length} source files, one AppShell, ${requiredModules.length} canonical modules, shared fleet enforced across Veículos, Rotas, Custos and Modo Campo.`);
