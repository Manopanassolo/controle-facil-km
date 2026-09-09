import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const src=path.join(root,'src');
const forbidden=[/mvNavigationV\d+/i,/mvWebLayoutV\d+/i,/mvShellV\d+/i,/v16\d{3,}\.js/i,/postprocess\.js/i,/querySelector(All)?\s*\(/i,/getElementById\s*\(/i,/\.style\.display\s*=/i,/\.style\.visibility\s*=/i,/addEventListener\s*\(\s*['"]click['"]/i,/setTimeout\s*\(/i,/setInterval\s*\(/i];
const requiredModules=['dashboard','pendencias','agenda','notificacoes','campo','roteiros','historico','custos','veiculos','equipe','documentos','sinistros','relatorios','perfil','configuracoes'];
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{const full=path.join(dir,entry.name);return entry.isDirectory()?walk(full):[full];});}
const files=walk(src).filter(file=>/\.(?:ts|tsx|js|jsx|css)$/.test(file));
const violations=[];
for(const file of files){
 const text=fs.readFileSync(file,'utf8');
 if(!file.endsWith('.css'))for(const pattern of forbidden){
  const accessibilityDialog=file.endsWith('PrototypeFormDialog.tsx')&&String(pattern).includes('querySelector');
  if(!accessibilityDialog&&pattern.test(text))violations.push(`${path.relative(root,file)}: forbidden legacy/runtime pattern ${pattern}`);
 }
 if(/from\s+['"]\.\.\/\.\.\/\.\.\//.test(text))violations.push(`${path.relative(root,file)}: import outside V2 boundary`);
 if(/from\s+['"]@supabase\//.test(text)||/require\s*\(\s*['"]@supabase\//.test(text))violations.push(`${path.relative(root,file)}: Supabase runtime import is forbidden while V2 is memory-only`);
 if(/NEXT_PUBLIC_SUPABASE_|SUPABASE_SERVICE_ROLE|service_role/i.test(text))violations.push(`${path.relative(root,file)}: backend credentials/config are forbidden in memory-only runtime source`);
}
const shellFiles=files.filter(file=>fs.readFileSync(file,'utf8').includes('function AppShell'));if(shellFiles.length!==1)violations.push(`Expected exactly one AppShell, found ${shellFiles.length}`);
const modulesText=fs.readFileSync(path.join(src,'lib','modules.ts'),'utf8');
for(const slug of requiredModules){if(!modulesText.includes(`slug: '${slug}'`))violations.push(`Missing canonical module route: ${slug}`);const page=path.join(src,'app',slug,'page.tsx');if(!fs.existsSync(page)){violations.push(`${slug} must have an independent physical route`);continue;}if(slug!=='dashboard'&&!fs.readFileSync(page,'utf8').includes('ModuleHeader'))violations.push(`${slug} must use the canonical ModuleHeader`);}
const requirements=[
 ['app/dashboard/page.tsx','DashboardByRole','Dashboard route must use role-aware dashboard'],
 ['app/agenda/page.tsx','AgendaSessionModule','Agenda must use shared session workflow'],
 ['app/pendencias/page.tsx','PendingSessionModule','Pending route must use live compliance workflow'],
 ['app/notificacoes/page.tsx','NotificationsSessionModule','Notifications must use live session center'],
 ['app/roteiros/page.tsx','RouteSessionModule','Routes must use local KM homologation'],
 ['app/campo/page.tsx','FieldJourneyModule','Field Mode must use guided homologation'],
 ['app/historico/page.tsx','HistorySessionModule','History must consume shared session activity'],
 ['app/custos/page.tsx','CostSessionModule','Costs must use shared fleet session module'],
 ['app/veiculos/page.tsx','VehicleSessionModule','Vehicles must use shared fleet module'],
 ['app/documentos/page.tsx','DocumentsSessionModule','Documents must use shared compliance module'],
 ['app/sinistros/page.tsx','IncidentsSessionModule','Incidents must use shared incident workflow'],
 ['app/relatorios/page.tsx','ReportsSessionModule','Reports must use functional session reports'],
 ['app/perfil/page.tsx','ProfileSessionModule','Profile must use shared editable session profile'],
 ['app/configuracoes/page.tsx','SettingsSessionModule','Settings must use functional session preferences'],
 ['app/layout.tsx','SessionActivityProvider','Root layout must provide shared session state'],
 ['app/layout.tsx','DriverSessionProvider','Root layout must provide shared driver state'],
 ['app/layout.tsx','IncidentSessionProvider','Root layout must provide shared incident state'],
 ['app/layout.tsx','PreferencesSessionProvider','Root layout must provide shared preference state'],
 ['app/layout.tsx','RouteDraftSessionProvider','Root layout must provide shared agenda-to-route draft state']
];
for(const[relative,needle,message]of requirements){const file=path.join(src,relative);if(!fs.readFileSync(file,'utf8').includes(needle))violations.push(message);}
const providerText=fs.readFileSync(path.join(src,'components','SessionActivityProvider.tsx'),'utf8');
for(const required of ['journeys','routes','expenses','appointments','vehicles','vehicleOptions','maintenanceAlerts','maintenancePendingCount','maintenanceRecords','documents','documentAlerts','documentPendingCount','blockedVehicleDocuments','blockedDrivers','activityCount'])if(!providerText.includes(required))violations.push(`Session activity provider must expose ${required}`);
if(!providerText.includes('Math.max(vehicle.currentKm,km)'))violations.push('Shared vehicle KM must never regress');
if(!providerText.includes("document.kind==='CNH'||document.kind==='CRLV'||document.kind==='Seguro'"))violations.push('Critical expired documents must define scoped operational blocking');
const driverText=fs.readFileSync(path.join(src,'components','DriverSessionProvider.tsx'),'utf8');for(const required of ['blockedDrivers','driverOptions','addDriver','isDriverEligible'])if(!driverText.includes(required))violations.push(`Driver session provider must expose ${required}`);
const incidentProviderText=fs.readFileSync(path.join(src,'components','IncidentSessionProvider.tsx'),'utf8');for(const required of ['vehicleOptions','driverOptions','pendingIncidents','addIncident','startIncidentReview','resolveIncident'])if(!incidentProviderText.includes(required))violations.push(`Incident provider must expose ${required}`);
const preferencesText=fs.readFileSync(path.join(src,'components','PreferencesSessionProvider.tsx'),'utf8');for(const required of ['notificationPreferences','updateProfile','setNotificationPreference','resetPreferences','enabledNotificationCount'])if(!preferencesText.includes(required))violations.push(`Preferences provider must expose ${required}`);
const routeDraftText=fs.readFileSync(path.join(src,'components','RouteDraftSessionProvider.tsx'),'utf8');for(const required of ['routeDraft','setRouteDraft','clearRouteDraft'])if(!routeDraftText.includes(required))violations.push(`Route draft provider must expose ${required}`);
const notificationText=fs.readFileSync(path.join(src,'components','NotificationsSessionModule.tsx'),'utf8');for(const required of ['maintenanceAlerts','documentAlerts','incidents','appointments','routes','journeys','expenses','notificationPreferences','Marcar todas como lidas','Notificação informa um evento'])if(!notificationText.includes(required))violations.push(`Notifications must expose ${required}`);if(notificationText.includes('setTimeout')||notificationText.includes('setInterval'))violations.push('Notifications must be derived from session state without timers');
const profileText=fs.readFileSync(path.join(src,'components','ProfileSessionModule.tsx'),'utf8');for(const required of ['usePreferencesSession','updateProfile','defaultValue:profile.name','Função','Perfil ativo'])if(!profileText.includes(required))violations.push(`Profile must expose ${required}`);
const settingsText=fs.readFileSync(path.join(src,'components','SettingsSessionModule.tsx'),'utf8');for(const required of ['notificationPreferences','setNotificationPreference','aria-pressed','Restaurar padrões'])if(!settingsText.includes(required))violations.push(`Settings must expose ${required}`);
const reportsText=fs.readFileSync(path.join(src,'components','ReportsSessionModule.tsx'),'utf8');for(const required of ['Exportar CSV','Blob','URL.createObjectURL','maintenanceAlerts','documents','documentAlerts','Documento','incidents','drivers','filteredKm','filteredAmount'])if(!reportsText.includes(required))violations.push(`Reports must expose ${required}`);
const agendaText=fs.readFileSync(path.join(src,'components','AgendaSessionModule.tsx'),'utf8');for(const required of ['selectedDate','setSelectedDate','filter(item=>item.date===selectedDate)','Selecionar data','setRouteDraft','Abrir rota'])if(!agendaText.includes(required))violations.push(`Agenda must expose ${required}`);
const routeText=fs.readFileSync(path.join(src,'components','RouteSessionModule.tsx'),'utf8');for(const required of ['routeDraft','clearRouteDraft','defaultValue:routeDraft?.destination','Rota preparada pela Agenda'])if(!routeText.includes(required))violations.push(`Routes must expose ${required}`);
const dialogText=fs.readFileSync(path.join(src,'components','PrototypeFormDialog.tsx'),'utf8');for(const required of ['aria-describedby','document.addEventListener','event.key===\'Escape\'','event.key!==\'Tab\'','requestAnimationFrame','defaultValue?:string'])if(!dialogText.includes(required))violations.push(`Prototype form dialog must expose ${required}`);
const pendingText=fs.readFileSync(path.join(src,'components','PendingSessionModule.tsx'),'utf8');for(const required of ['maintenanceAlerts','documentAlerts','pendingIncidents'])if(!pendingText.includes(required))violations.push(`Pending center must expose ${required}`);
const historyText=fs.readFileSync(path.join(src,'components','HistorySessionModule.tsx'),'utf8');if(!historyText.includes('incidents')||!historyText.includes("type:'Sinistro'"))violations.push('History must include incident lifecycle');
const backendContract=path.join(src,'services','backend-contract.ts');if(!fs.existsSync(backendContract))violations.push('Backend readiness contract is required');else{const text=fs.readFileSync(backendContract,'utf8');if(!text.includes("BACKEND_RUNTIME_MODE = 'memory-only'"))violations.push('Backend runtime must remain memory-only until isolated Supabase branch exists');if(!text.includes('requiresIsolatedSupabaseBranch: true'))violations.push('Backend contract must require an isolated Supabase branch');}
if(!fs.existsSync(path.join(root,'BACKEND_READINESS.md')))violations.push('Backend readiness documentation is required');
const packageText=fs.readFileSync(path.join(root,'package.json'),'utf8');if(packageText.includes('@supabase/'))violations.push('Supabase packages must not be installed before isolated backend activation');
if(fs.existsSync(path.join(src,'app','[module]','page.tsx')))violations.push('Dynamic [module] page is forbidden');
if(violations.length){console.error('Movvant V2 architecture guard failed:\n'+violations.join('\n'));process.exit(1);}
console.log(`Movvant V2 architecture guard passed: ${files.length} source files, one AppShell, ${requiredModules.length} canonical modules, memory-only backend readiness, functional reports/profile/settings, agenda route drafts and accessible prefills protected.`);
